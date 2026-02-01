<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use App\Models\Otp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Login user (supports both email and phone)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'password' => 'required',
            'remember_me' => 'boolean'
        ]);

        // Determine if login is by email or phone
        $loginByEmail = $request->has('email') && !empty($request->email);
        $loginByPhone = $request->has('phone') && !empty($request->phone);

        if (!$loginByEmail && !$loginByPhone) {
            throw ValidationException::withMessages([
                'email' => ['Either email or phone number is required.'],
            ]);
        }

        $user = null;
        $client = null;

        // Try to find user by email (admin/barber)
        if ($loginByEmail) {
            $user = User::where('email', $request->email)->first();
        }

        // Try to find client by phone
        if ($loginByPhone) {
            $client = Client::where('phone', $request->phone)->first();
        }

        // Check password using MD5
        $passwordHash = md5($request->password);
        
        if ($user && $user->password === $passwordHash) {
            // User (admin/barber) login
            // Check if barber is active
            if ($user->role === 'barber' && $user->status !== 'active') {
                throw ValidationException::withMessages([
                    'email' => ['Your account is inactive. Please contact the administrator.'],
                ]);
            }

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Parse first_name and last_name from name
            $nameParts = explode(' ', $user->name, 2);
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? '';

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'job_title' => $user->job_title,
                    'profile_photo' => $user->profile_photo ? \Illuminate\Support\Facades\URL::asset('storage/' . $user->profile_photo) : null,
                    'avatar' => $user->profile_photo ? \Illuminate\Support\Facades\URL::asset('storage/' . $user->profile_photo) : null,
                ]
            ]);
        } elseif ($client && $client->password === $passwordHash) {
            // Client login
            if ($client->status !== 'active') {
                throw ValidationException::withMessages([
                    'phone' => ['Your account is inactive. Please contact the administrator.'],
                ]);
            }

            // Create token
            $token = $client->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $client->id,
                    'first_name' => $client->first_name,
                    'last_name' => $client->last_name,
                    'name' => $client->name,
                    'phone' => $client->phone,
                    'email' => $client->email,
                    'role' => 'client',
                    'avatar' => $client->avatar ? Storage::url($client->avatar) : null,
                    'profile_photo' => $client->avatar ? Storage::url($client->avatar) : null,
                ]
            ]);
        } else {
            // Invalid credentials
            throw ValidationException::withMessages([
                $loginByEmail ? 'email' : 'phone' => ['The provided credentials are incorrect.'],
            ]);
        }
    }

    /**
     * Register new client (requires OTP verification)
     */
    public function register(Request $request)
    {
        // Check if phone is already taken by an active (verified) client
        $existingActiveClient = Client::where('phone', $request->phone)
            ->where('status', 'active')
            ->first();

        if ($existingActiveClient) {
            return response()->json([
                'success' => false,
                'message' => 'The phone number has already been registered.',
                'errors' => [
                    'phone' => ['The phone number has already been registered.']
                ]
            ], 422);
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'date_of_birth' => 'required|date|before:today',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        // Check if there's an existing inactive client with this phone
        $existingInactiveClient = Client::where('phone', $request->phone)
            ->where('status', 'inactive')
            ->first();

        // Handle avatar upload
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarPath = $avatar->store('clients/avatars', 'public');
            
            // Delete old avatar if exists
            if ($existingInactiveClient && $existingInactiveClient->avatar) {
                Storage::disk('public')->delete($existingInactiveClient->avatar);
            }
        }

        // If inactive client exists, update it; otherwise create new
        if ($existingInactiveClient) {
            // Update existing inactive client
            $existingInactiveClient->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'date_of_birth' => $request->date_of_birth,
                'password' => md5($request->password), // Using MD5 as requested
                'avatar' => $avatarPath ?: $existingInactiveClient->avatar, // Keep existing if no new one
                'status' => 'inactive', // Will be activated after OTP verification
            ]);
            $client = $existingInactiveClient->fresh();
            
            // Invalidate old unverified OTPs for this phone
            Otp::forPhone($request->phone, 'registration')
                ->whereNull('verified_at')
                ->update(['verified_at' => now()]);
        } else {
            // Create new client with inactive status (will be activated after OTP verification)
            $client = Client::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone' => $request->phone,
                'date_of_birth' => $request->date_of_birth,
                'password' => md5($request->password), // Using MD5 as requested
                'avatar' => $avatarPath,
                'status' => 'inactive', // Will be activated after OTP verification
            ]);
        }

        // Generate random OTP code (4 digits)
        $otpCode = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
        
        // Set expiration time (1 minute from now)
        $expiresAt = now()->addMinutes(1);

        // Create new OTP record linked to client_id
        $otp = Otp::create([
            'phone' => $request->phone,
            'code' => $otpCode,
            'type' => 'registration',
            'reference_id' => (string) $client->id, // Link to client ID
            'attempts' => 0,
            'expires_at' => $expiresAt,
        ]);

        // Store registration data in cache for OTP verification
        Cache::put(
            'registration_' . $request->phone,
            [
                'client_id' => $client->id,
                'phone' => $request->phone,
            ],
            now()->addMinutes(10) // Cache expires in 10 minutes
        );

        // In production, send SMS here with the OTP code

        return response()->json([
            'success' => true,
            'message' => 'Registration successful. Please verify your phone number.',
            'phone' => $request->phone,
            'requires_verification' => true,
            'expires_at' => $expiresAt->toIso8601String(),
            'created_at' => $otp->created_at->toIso8601String(),
            'expires_in' => 60, // seconds (1 minute)
            // In development, we can return the code for testing
            'otp_code' => $otpCode, // Remove this in production
        ], 201);
    }

    /**
     * Send OTP for password reset or resend registration OTP
     * Limits: Maximum 4 resends per phone in the last 30 minutes
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:20',
            'type' => 'nullable|in:registration,password_reset',
            'reference_id' => 'nullable|string', // For password reset: user_id
        ]);

        $phone = $request->phone;
        $type = $request->type ?? 'password_reset';
        
        // Check resend limit: Count OTPs created for this phone in the last 30 minutes
        $thirtyMinutesAgo = now()->subMinutes(30);
        $recentOtpsCount = Otp::where('phone', $phone)
            ->where('type', $type)
            ->where('created_at', '>=', $thirtyMinutesAgo)
            ->count();
        
        // Maximum 4 resends in the last 30 minutes
        if ($recentOtpsCount >= 4) {
            // Find the oldest OTP in the last 30 minutes to calculate when next resend is allowed
            $oldestRecentOtp = Otp::where('phone', $phone)
                ->where('type', $type)
                ->where('created_at', '>=', $thirtyMinutesAgo)
                ->orderBy('created_at', 'asc')
                ->first();
            
            $nextResendAt = null;
            if ($oldestRecentOtp) {
                // Calculate when next resend is allowed (30 minutes from oldest OTP)
                $nextResendAt = $oldestRecentOtp->created_at->copy()->addMinutes(30);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Too many resend attempts. Please try again later.',
                'errors' => [
                    'phone' => ['You have reached the maximum number of resend attempts (4) in the last 30 minutes. Please try again later.']
                ],
                'resend_limit_reached' => true,
                'next_resend_at' => $nextResendAt ? $nextResendAt->toIso8601String() : null,
                'remaining_time_seconds' => $nextResendAt ? max(0, now()->diffInSeconds($nextResendAt, false)) : null,
            ], 429); // 429 Too Many Requests
        }
        
        // For registration type, check if OTP already exists (should be created during registration)
        if ($type === 'registration') {
            // Check for any unverified OTP (expired or not) for this phone
            $existingOtp = Otp::forPhone($phone, 'registration')
                ->whereNull('verified_at')
                ->orderBy('created_at', 'desc')
                ->first();
            
            // Get client_id from existing OTP or registration cache or find inactive client
            $referenceId = null;
            if ($existingOtp && $existingOtp->reference_id) {
                $referenceId = $existingOtp->reference_id;
            } else {
                $registrationData = Cache::get('registration_' . $phone);
                if ($registrationData && isset($registrationData['client_id'])) {
                    $referenceId = $registrationData['client_id'];
                } else {
                    // Try to find inactive client by phone
                    $inactiveClient = Client::where('phone', $phone)
                        ->where('status', 'inactive')
                        ->first();
                    if ($inactiveClient) {
                        $referenceId = (string) $inactiveClient->id;
                    }
                }
            }
            
            // If we have a reference_id (client exists), allow resending OTP
            if ($referenceId) {
                // Invalidate any existing unverified OTPs for this phone
                if ($existingOtp) {
                    $existingOtp->update(['verified_at' => now()]);
                }
                
                // Generate new random OTP code (4 digits)
                $otpCode = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
                
                // Set expiration time (1 minute from now)
                $expiresAt = now()->addMinutes(1);
                
                // Create new OTP record
                $newOtp = Otp::create([
                    'phone' => $phone,
                    'code' => $otpCode,
                    'type' => 'registration',
                    'reference_id' => $referenceId,
                    'attempts' => 0,
                    'expires_at' => $expiresAt,
                ]);
                
                // In production, send SMS here
                
                return response()->json([
                    'success' => true,
                    'message' => 'OTP resent successfully.',
                    'expires_at' => $expiresAt->toIso8601String(),
                    'expires_in' => 60, // seconds (1 minute)
                    'created_at' => $newOtp->created_at->toIso8601String(),
                    'resends_remaining' => max(0, 4 - ($recentOtpsCount + 1)),
                    'otp_code' => $otpCode, // Remove this in production
                ]);
            }
            
            // If no client found for registration, return error
            return response()->json([
                'success' => false,
                'message' => 'No OTP found. Please complete registration first.',
            ], 404);
        }
        
        // For password reset, check if phone exists first
        if ($type === 'password_reset') {
            // Check if client exists with this phone
            $client = Client::where('phone', $phone)->where('status', 'active')->first();
            
            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'No account found with this phone number.',
                    'errors' => [
                        'phone' => ['No account found with this phone number.']
                    ]
                ], 404);
            }
            
            // Store client ID in reference_id for password reset
            $referenceId = (string) $client->id;
        } else {
            $referenceId = $request->reference_id;
        }
        
        // Invalidate any existing unverified OTPs for this phone and type
        Otp::forPhone($phone, $type)
            ->valid()
            ->update(['verified_at' => now()]); // Mark as used
        
        // Generate random OTP code (4 digits)
        $otpCode = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
        
        // Set expiration time (1 minute from now)
        $expiresAt = now()->addMinutes(1);

        // Store OTP in database
        $otp = Otp::create([
            'phone' => $phone,
            'code' => $otpCode,
            'type' => $type,
            'reference_id' => $referenceId,
            'attempts' => 0,
            'expires_at' => $expiresAt,
        ]);

        // In production, send SMS here
        // For now, we'll just return success with expiration time

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully.',
            'expires_at' => $expiresAt->toIso8601String(), // ISO 8601 format for frontend
            'expires_in' => 60, // seconds (1 minute)
            'created_at' => $otp->created_at->toIso8601String(), // Created time for reference
            'resends_remaining' => max(0, 4 - ($recentOtpsCount + 1)),
            // In development, we can return the code for testing
            'otp_code' => $otpCode, // Remove this in production
        ]);
    }

    /**
     * Get OTP info (expiration time) without sending a new OTP
     */
    public function getOtpInfo(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:20',
            'type' => 'nullable|in:registration,password_reset',
        ]);

        $phone = $request->phone;
        $type = $request->type ?? 'registration';

        // Find the most recent valid OTP for this phone and type
        $otp = Otp::forPhone($phone, $type)
            ->valid()
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'No valid OTP found.',
                'has_otp' => false,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'has_otp' => true,
            'expires_at' => $otp->expires_at->toIso8601String(),
            'created_at' => $otp->created_at->toIso8601String(),
            'expires_in' => max(0, now()->diffInSeconds($otp->expires_at, false)),
        ]);
    }

    /**
     * Verify OTP for registration or password reset
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:20',
            'code' => 'required|string|size:4',
            'type' => 'nullable|in:registration,password_reset',
        ]);

        $phone = $request->phone;
        $code = $request->code;
        $type = $request->type ?? 'registration';

        // Find the most recent valid OTP for this phone and type
        $otp = Otp::forPhone($phone, $type)
            ->valid()
            ->orderBy('created_at', 'desc')
            ->first();

        // Check if OTP exists
        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'No valid OTP found. Please request a new code.',
                'errors' => [
                    'code' => ['No valid OTP found. Please request a new code.']
                ]
            ], 422);
        }

        // Check if OTP has exceeded max attempts
        if ($otp->hasExceededMaxAttempts(5)) {
            return response()->json([
                'success' => false,
                'message' => 'Too many verification attempts. Please request a new code.',
                'errors' => [
                    'code' => ['Too many verification attempts. Please request a new code.']
                ]
            ], 422);
        }

        // Verify OTP code
        // Allow "2000" as a test code OR match the actual stored code
        $isValidCode = ($code === '2000') || ($otp->code === $code);
        
        if (!$isValidCode) {
            // Increment attempts
            $otp->incrementAttempts();
            
            $remainingAttempts = 5 - $otp->fresh()->attempts;
            
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code.',
                'errors' => [
                    'code' => ['The verification code is invalid.']
                ],
                'remaining_attempts' => max(0, $remainingAttempts),
            ], 422);
        }

        // OTP is valid - mark as verified
        $otp->markAsVerified();

        // Handle registration verification
        if ($type === 'registration') {
            // Get client_id from OTP reference_id (more reliable than cache)
            $clientId = $otp->reference_id;
            
            if (!$clientId) {
                // Fallback to cache if reference_id is not set
                $registrationData = Cache::get('registration_' . $phone);
                $clientId = $registrationData['client_id'] ?? null;
            }
            
            if (!$clientId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration session expired. Please register again.',
                ], 422);
            }

            $client = Client::find($clientId);
            
            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration not found.',
                ], 422);
            }

            // Activate the client account
            $client->status = 'active';
            $client->email_verified_at = now();
            $client->save();

            // Clear registration cache (if exists)
            Cache::forget('registration_' . $phone);

            // Create token
            $token = $client->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Phone number verified successfully.',
                'token' => $token,
                'user' => [
                    'id' => $client->id,
                    'first_name' => $client->first_name,
                    'last_name' => $client->last_name,
                    'name' => $client->name,
                    'phone' => $client->phone,
                    'date_of_birth' => $client->date_of_birth?->format('Y-m-d'),
                    'avatar' => $client->avatar ? Storage::url($client->avatar) : null,
                    'profile_photo' => $client->avatar ? Storage::url($client->avatar) : null,
                    'role' => 'client',
                ],
                'type' => 'registration',
            ]);
        }

        // Handle password reset verification
        $resetToken = \Illuminate\Support\Str::random(64);
        Cache::put(
            'password_reset_' . $phone,
            [
                'token' => $resetToken,
                'phone' => $phone,
            ],
            now()->addMinutes(30)
        );

        return response()->json([
            'success' => true,
            'message' => 'Phone number verified successfully.',
            'reset_token' => $resetToken,
            'type' => 'password_reset',
        ]);
    }

    /**
     * Reset password with token (after OTP verification)
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
        ]);

        $phone = $request->phone;
        $token = $request->token;

        // Get reset token from cache
        $resetData = Cache::get('password_reset_' . $phone);

        if (!$resetData || $resetData['token'] !== $token) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token.',
                'errors' => [
                    'token' => ['Invalid or expired reset token. Please request a new password reset.']
                ]
            ], 422);
        }

        // Find client by phone
        $client = Client::where('phone', $phone)->where('status', 'active')->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'No account found with this phone number.',
                'errors' => [
                    'phone' => ['No account found with this phone number.']
                ]
            ], 404);
        }

        // Update password (using MD5 as requested)
        $client->password = md5($request->password);
        $client->save();

        // Clear reset token from cache
        Cache::forget('password_reset_' . $phone);

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully. You can now login with your new password.',
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        $authenticated = $request->user();
        
        // Check if it's a Client or User model
        if ($authenticated instanceof Client) {
            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $authenticated->id,
                    'first_name' => $authenticated->first_name,
                    'last_name' => $authenticated->last_name,
                    'name' => $authenticated->name,
                    'phone' => $authenticated->phone,
                    'email' => $authenticated->email,
                    'role' => 'client',
                    'avatar' => $authenticated->avatar ? Storage::url($authenticated->avatar) : null,
                    'profile_photo' => $authenticated->avatar ? Storage::url($authenticated->avatar) : null,
                ]
            ]);
        } else {
            // User (admin/barber)
            $user = $authenticated;
            // Parse first_name and last_name from name
            $nameParts = explode(' ', $user->name, 2);
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? '';

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'job_title' => $user->job_title,
                    'profile_photo' => $user->profile_photo ? \Illuminate\Support\Facades\URL::asset('storage/' . $user->profile_photo) : null,
                    'avatar' => $user->profile_photo ? \Illuminate\Support\Facades\URL::asset('storage/' . $user->profile_photo) : null,
                ]
            ]);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}


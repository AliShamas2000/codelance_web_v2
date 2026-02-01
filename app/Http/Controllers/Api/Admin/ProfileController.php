<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    /**
     * Get admin profile
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // Get first_name and last_name - if not in database, parse from name field
            $firstName = $user->first_name;
            $lastName = $user->last_name;
            
            // If first_name or last_name are empty/null, try to parse from name field
            if (empty($firstName) && empty($lastName) && !empty($user->name)) {
                $nameParts = explode(' ', trim($user->name), 2);
                $firstName = $nameParts[0] ?? '';
                $lastName = $nameParts[1] ?? '';
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'firstName' => $firstName ?: '',
                    'first_name' => $firstName ?: '',
                    'lastName' => $lastName ?: '',
                    'last_name' => $lastName ?: '',
                    'name' => $user->name,
                    'email' => $user->email,
                    'jobTitle' => $user->job_title,
                    'job_title' => $user->job_title,
                    'bio' => $user->bio,
                    'phone' => $user->phone,
                    'avatar' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
                    'profile_image' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
                    'profile_photo' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
                    'role' => $user->role,
                    'member_since' => $user->created_at ? $user->created_at->format('M Y') : null,
                    'memberSince' => $user->created_at ? $user->created_at->format('M Y') : null
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching admin profile: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update admin profile
     */
    public function update(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'firstName' => 'sometimes|string|max:255',
                'first_name' => 'sometimes|string|max:255',
                'lastName' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
                'jobTitle' => 'sometimes|string|max:255',
                'job_title' => 'sometimes|string|max:255',
                'bio' => 'nullable|string|max:1000',
                'phone' => 'nullable|string|max:20',
                'avatar' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
                'profile_photo' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
                'photo' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
                'remove_photo' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update user data
            $updateData = [];
            
            // Handle first name and last name - parse from name if needed
            $firstName = null;
            $lastName = null;
            
            if ($request->has('firstName') || $request->has('first_name')) {
                $firstName = $request->input('firstName') ?: $request->input('first_name');
            }
            
            if ($request->has('lastName') || $request->has('last_name')) {
                $lastName = $request->input('lastName') ?: $request->input('last_name');
            }
            
            // If first or last name provided, update the name field (database only has 'name' column)
            if ($firstName !== null || $lastName !== null) {
                // Get current name parts if not provided
                if ($firstName === null || $lastName === null) {
                    $currentNameParts = explode(' ', trim($user->name), 2);
                    $firstName = $firstName ?? ($currentNameParts[0] ?? '');
                    $lastName = $lastName ?? ($currentNameParts[1] ?? '');
                }
                $updateData['name'] = trim($firstName . ' ' . $lastName);
            }
            
            // Handle email
            if ($request->has('email')) {
                $updateData['email'] = $request->input('email');
            }
            
            // Handle job title
            if ($request->has('jobTitle') || $request->has('job_title')) {
                $updateData['job_title'] = $request->input('jobTitle') ?: $request->input('job_title');
            }
            
            // Handle bio
            if ($request->has('bio')) {
                $updateData['bio'] = $request->input('bio');
            }
            
            // Handle phone
            if ($request->has('phone')) {
                $updateData['phone'] = $request->input('phone');
            }

            // Handle profile photo upload
            if ($request->hasFile('avatar') || $request->hasFile('profile_photo') || $request->hasFile('photo')) {
                $file = $request->file('avatar') ?: $request->file('profile_photo') ?: $request->file('photo');
                
                // Delete old profile photo if exists
                if ($user->profile_photo) {
                    $oldPath = str_replace('storage/', '', $user->profile_photo);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                // Store new profile photo
                $path = $file->store('profile-photos', 'public');
                $updateData['profile_photo'] = $path;
            }

            // Handle photo removal
            if ($request->has('remove_photo') && $request->input('remove_photo')) {
                if ($user->profile_photo) {
                    $oldPath = str_replace('storage/', '', $user->profile_photo);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $updateData['profile_photo'] = null;
            }

            // Update user
            $user->update($updateData);
            
            // Refresh user data
            $user->refresh();
            
            // Parse first_name and last_name from name for response (database only has 'name' column)
            $nameParts = explode(' ', trim($user->name), 2);
            $responseFirstName = $nameParts[0] ?? '';
            $responseLastName = $nameParts[1] ?? '';

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'firstName' => $responseFirstName,
                    'first_name' => $responseFirstName,
                    'lastName' => $responseLastName,
                    'last_name' => $responseLastName,
                    'name' => $user->name,
                    'email' => $user->email,
                    'jobTitle' => $user->job_title,
                    'job_title' => $user->job_title,
                    'bio' => $user->bio,
                    'phone' => $user->phone,
                    'avatar' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
                    'profile_image' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
                    'profile_photo' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
                    'role' => $user->role,
                    'member_since' => $user->created_at ? $user->created_at->format('M Y') : null,
                    'memberSince' => $user->created_at ? $user->created_at->format('M Y') : null
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating admin profile: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update admin password
     */
    public function updatePassword(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8',
                'new_password_confirmation' => 'required|string|same:new_password',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verify current password (using MD5 as per system requirement)
            $currentPasswordHash = md5($request->current_password);
            if ($user->password !== $currentPasswordHash) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect',
                    'errors' => [
                        'current_password' => ['The current password is incorrect.']
                    ]
                ], 422);
            }

            // Hash new password using MD5
            $newPasswordHash = md5($request->new_password);
            
            // Update password
            $user->update([
                'password' => $newPasswordHash
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating admin password: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update password',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


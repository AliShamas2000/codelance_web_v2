<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /**
     * Get client profile
     */
    public function index(Request $request)
    {
        try {
            $client = $request->user();
            
            if (!$client instanceof Client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Client access only.',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'profile' => [
                    'id' => $client->id,
                    'first_name' => $client->first_name,
                    'last_name' => $client->last_name,
                    'name' => $client->name,
                    'phone' => $client->phone,
                    'email' => $client->email,
                    'date_of_birth' => $client->date_of_birth?->format('Y-m-d'),
                    'avatar' => $client->avatar ? Storage::url($client->avatar) : null,
                    'profile_photo' => $client->avatar ? Storage::url($client->avatar) : null,
                    'preferred_stylist' => $client->preferred_stylist ?? null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile.',
            ], 500);
        }
    }

    /**
     * Update client profile
     */
    public function update(Request $request)
    {
        try {
            $client = $request->user();
            
            if (!$client instanceof Client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Client access only.',
                ], 403);
            }

            $request->validate([
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:clients,email,' . $client->id,
                // Phone number is read-only and cannot be updated
                'date_of_birth' => 'nullable|date|before:today',
                'preferred_stylist' => 'nullable|integer|exists:users,id',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
                'remove_avatar' => 'nullable|boolean',
            ]);

            // Update basic fields
            if ($request->has('first_name')) {
                $client->first_name = $request->first_name;
            }
            if ($request->has('last_name')) {
                $client->last_name = $request->last_name;
            }
            if ($request->has('email')) {
                $client->email = $request->email;
            }
            // Phone number is read-only and cannot be updated
            if ($request->has('date_of_birth')) {
                $client->date_of_birth = $request->date_of_birth;
            }
            if ($request->has('preferred_stylist')) {
                $client->preferred_stylist = $request->preferred_stylist;
            }

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                // Delete old avatar if exists
                if ($client->avatar) {
                    Storage::disk('public')->delete($client->avatar);
                }
                
                $avatar = $request->file('avatar');
                $avatarPath = $avatar->store('clients/avatars', 'public');
                $client->avatar = $avatarPath;
            }

            // Handle avatar removal
            if ($request->has('remove_avatar') && $request->remove_avatar) {
                if ($client->avatar) {
                    Storage::disk('public')->delete($client->avatar);
                }
                $client->avatar = null;
            }

            $client->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully.',
                'profile' => [
                    'id' => $client->id,
                    'first_name' => $client->first_name,
                    'last_name' => $client->last_name,
                    'name' => $client->name,
                    'phone' => $client->phone,
                    'email' => $client->email,
                    'date_of_birth' => $client->date_of_birth?->format('Y-m-d'),
                    'avatar' => $client->avatar ? Storage::url($client->avatar) : null,
                    'profile_photo' => $client->avatar ? Storage::url($client->avatar) : null,
                    'preferred_stylist' => $client->preferred_stylist ?? null,
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile.',
            ], 500);
        }
    }

    /**
     * Update client password
     */
    public function updatePassword(Request $request)
    {
        try {
            $client = $request->user();
            
            if (!$client instanceof Client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Client access only.',
                ], 403);
            }

            // First, validate that current_password is provided
            $request->validate([
                'current_password' => 'required|string',
            ]);

            // Verify current password FIRST (before other validations)
            $currentPasswordHash = md5($request->current_password);
            if ($client->password !== $currentPasswordHash) {
                throw ValidationException::withMessages([
                    'current_password' => ['Current password is incorrect.'],
                ]);
            }

            // Then validate new password requirements
            $request->validate([
                'new_password' => 'required|string|min:8',
                'password_confirmation' => 'required|string|min:8|same:new_password',
            ]);

            // Update password (using MD5 as requested)
            $client->password = md5($request->new_password);
            $client->save();

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update password.',
            ], 500);
        }
    }

    /**
     * Delete/deactivate client account
     */
    public function destroy(Request $request)
    {
        try {
            $client = $request->user();
            
            if (!$client instanceof Client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Client access only.',
                ], 403);
            }

            // Deactivate account instead of deleting (soft delete)
            $client->status = 'inactive';
            $client->save();

            // Optionally delete avatar
            if ($client->avatar) {
                Storage::disk('public')->delete($client->avatar);
            }

            return response()->json([
                'success' => true,
                'message' => 'Account deactivated successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate account.',
            ], 500);
        }
    }
}


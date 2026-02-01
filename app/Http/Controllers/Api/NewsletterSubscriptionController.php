<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;

class NewsletterSubscriptionController extends Controller
{
    /**
     * Store a newly created newsletter subscription.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|max:255',
            ]);

            // Check if email already exists
            $existing = NewsletterSubscription::where('email', $validated['email'])->first();

            if ($existing) {
                // If already subscribed and active, return error
                if ($existing->status === 'active') {
                    return response()->json([
                        'success' => false,
                        'message' => 'This email is already subscribed to our newsletter.',
                        'error' => 'duplicate_email',
                    ], 422);
                }

                // If unsubscribed, reactivate
                $existing->update([
                    'status' => 'active',
                    'subscribed_at' => now(),
                    'unsubscribed_at' => null,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Thank you for resubscribing to our newsletter!',
                    'data' => [
                        'id' => $existing->id,
                        'email' => $existing->email,
                    ],
                ], 201);
            }

            // Create new subscription
            $subscription = NewsletterSubscription::create([
                'email' => $validated['email'],
                'status' => 'active',
                'subscribed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you for subscribing to our newsletter!',
                'data' => [
                    'id' => $subscription->id,
                    'email' => $subscription->email,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid email address.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to subscribe. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

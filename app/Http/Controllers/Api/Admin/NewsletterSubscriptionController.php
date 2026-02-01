<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;

class NewsletterSubscriptionController extends Controller
{
    /**
     * Display a listing of newsletter subscriptions.
     */
    public function index(Request $request)
    {
        $query = NewsletterSubscription::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Sort
        $sortBy = $request->get('sort', 'subscribed_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $subscriptions = $query->paginate($perPage);

        // Format subscriptions for API response
        $formattedSubscriptions = $subscriptions->map(function ($subscription) {
            return $this->formatSubscription($subscription);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedSubscriptions,
            'total' => $subscriptions->total(),
            'per_page' => $subscriptions->perPage(),
            'current_page' => $subscriptions->currentPage(),
            'total_pages' => $subscriptions->lastPage(),
        ]);
    }

    /**
     * Display the specified newsletter subscription.
     */
    public function show(NewsletterSubscription $newsletterSubscription)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatSubscription($newsletterSubscription),
        ]);
    }

    /**
     * Update the specified newsletter subscription.
     */
    public function update(Request $request, NewsletterSubscription $newsletterSubscription)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:active,unsubscribed',
            'admin_notes' => 'nullable|string',
        ]);

        // If unsubscribing, set unsubscribed_at
        if (isset($validated['status']) && $validated['status'] === 'unsubscribed' && $newsletterSubscription->status === 'active') {
            $validated['unsubscribed_at'] = now();
        }

        // If reactivating, clear unsubscribed_at
        if (isset($validated['status']) && $validated['status'] === 'active' && $newsletterSubscription->status === 'unsubscribed') {
            $validated['unsubscribed_at'] = null;
            $validated['subscribed_at'] = now();
        }

        $newsletterSubscription->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Newsletter subscription updated successfully',
            'data' => $this->formatSubscription($newsletterSubscription->fresh()),
        ]);
    }

    /**
     * Remove the specified newsletter subscription.
     */
    public function destroy(NewsletterSubscription $newsletterSubscription)
    {
        $newsletterSubscription->delete();

        return response()->json([
            'success' => true,
            'message' => 'Newsletter subscription deleted successfully',
        ]);
    }

    /**
     * Format newsletter subscription data for API response.
     */
    private function formatSubscription(NewsletterSubscription $subscription)
    {
        return [
            'id' => $subscription->id,
            'email' => $subscription->email,
            'status' => $subscription->status,
            'subscribedAt' => $subscription->subscribed_at,
            'subscribed_at' => $subscription->subscribed_at, // Keep for backward compatibility
            'unsubscribedAt' => $subscription->unsubscribed_at,
            'unsubscribed_at' => $subscription->unsubscribed_at, // Keep for backward compatibility
            'adminNotes' => $subscription->admin_notes,
            'admin_notes' => $subscription->admin_notes, // Keep for backward compatibility
            'createdAt' => $subscription->created_at,
            'updatedAt' => $subscription->updated_at,
            'created_at' => $subscription->created_at, // Keep for backward compatibility
            'updated_at' => $subscription->updated_at, // Keep for backward compatibility
        ];
    }
}

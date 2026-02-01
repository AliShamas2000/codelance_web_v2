<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index(Request $request)
    {
        $query = Review::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('quote', 'like', "%{$search}%")
                    ->orWhere('author_name', 'like', "%{$search}%")
                    ->orWhere('author_company', 'like', "%{$search}%")
                    ->orWhere('author_title', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by featured
        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        // Filter by rating
        if ($request->has('rating') && $request->rating !== 'all') {
            $query->where('rating', $request->rating);
        }

        // Sort
        $sortBy = $request->get('sort', 'order');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $reviews = $query->paginate($perPage);

        // Format reviews for API response
        $formattedReviews = $reviews->map(function ($review) {
            return $this->formatReview($review);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedReviews,
            'total' => $reviews->total(),
            'per_page' => $reviews->perPage(),
            'current_page' => $reviews->currentPage(),
            'total_pages' => $reviews->lastPage(),
        ]);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote' => 'required|string',
            'author_name' => 'required|string|max:255',
            'author_title' => 'nullable|string|max:255',
            'author_company' => 'nullable|string|max:255',
            'author_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $imagePath = null;
        if ($request->hasFile('author_image')) {
            $imagePath = $request->file('author_image')->store('reviews/images', 'public');
        }

        $review = Review::create([
            'quote' => $validated['quote'],
            'author_name' => $validated['author_name'],
            'author_title' => $validated['author_title'] ?? null,
            'author_company' => $validated['author_company'] ?? null,
            'author_image' => $imagePath,
            'rating' => $validated['rating'] ?? 5,
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review created successfully',
            'data' => $this->formatReview($review),
        ], 201);
    }

    /**
     * Display the specified review.
     */
    public function show(Review $review)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatReview($review),
        ]);
    }

    /**
     * Update the specified review.
     */
    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'quote' => 'sometimes|required|string',
            'author_name' => 'sometimes|required|string|max:255',
            'author_title' => 'nullable|string|max:255',
            'author_company' => 'nullable|string|max:255',
            'author_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'remove_image' => 'nullable|boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('author_image')) {
            // Delete old image if exists
            if ($review->author_image) {
                Storage::disk('public')->delete($review->author_image);
            }
            $validated['author_image'] = $request->file('author_image')->store('reviews/images', 'public');
        } elseif ($request->boolean('remove_image') && $review->author_image) {
            Storage::disk('public')->delete($review->author_image);
            $validated['author_image'] = null;
        } else {
            unset($validated['author_image']);
        }

        $review->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $this->formatReview($review->fresh()),
        ]);
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review)
    {
        // Delete image if exists
        if ($review->author_image) {
            Storage::disk('public')->delete($review->author_image);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully',
        ]);
    }

    /**
     * Update review order (for drag and drop reordering).
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'reviews' => 'required|array',
            'reviews.*.id' => 'required|exists:reviews,id',
            'reviews.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['reviews'] as $reviewData) {
            Review::where('id', $reviewData['id'])
                ->update(['order' => $reviewData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Review order updated successfully',
        ]);
    }

    /**
     * Format review data for API response.
     */
    private function formatReview(Review $review)
    {
        return [
            'id' => $review->id,
            'quote' => $review->quote,
            'authorName' => $review->author_name,
            'author_name' => $review->author_name, // Keep for backward compatibility
            'authorTitle' => $review->author_title,
            'author_title' => $review->author_title, // Keep for backward compatibility
            'authorCompany' => $review->author_company,
            'author_company' => $review->author_company, // Keep for backward compatibility
            'authorImage' => $review->author_image ? URL::asset('storage/' . $review->author_image) : null,
            'author_image' => $review->author_image ? URL::asset('storage/' . $review->author_image) : null, // Keep for backward compatibility
            'rating' => $review->rating,
            'isFeatured' => $review->is_featured,
            'is_featured' => $review->is_featured, // Keep for backward compatibility
            'isActive' => $review->is_active,
            'is_active' => $review->is_active, // Keep for backward compatibility
            'order' => $review->order,
            'createdAt' => $review->created_at,
            'updatedAt' => $review->updated_at,
            'created_at' => $review->created_at, // Keep for backward compatibility
            'updated_at' => $review->updated_at, // Keep for backward compatibility
        ];
    }
}

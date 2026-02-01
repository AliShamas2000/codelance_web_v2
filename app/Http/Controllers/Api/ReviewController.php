<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class ReviewController extends Controller
{
    /**
     * Get active reviews for public display.
     */
    public function index(Request $request)
    {
        $query = Review::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        // Optional: filter by featured
        if ($request->has('is_featured') && $request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        // Optional: limit
        $limit = $request->get('limit');
        if ($limit) {
            $reviews = $query->limit($limit)->get();
        } else {
            $reviews = $query->get();
        }

        // Format reviews for public API response
        $formattedReviews = $reviews->map(function ($review) {
            return $this->formatReview($review);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedReviews,
        ]);
    }

    /**
     * Display the specified review.
     */
    public function show(string $id)
    {
        $review = Review::where('is_active', true)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatReview($review),
        ]);
    }

    /**
     * Format review data for public API response.
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
        ];
    }
}

<?php

namespace App\Http\Controllers\Api\Barber;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReviewsController extends Controller
{
    /**
     * Get reviews for the authenticated barber
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || $user->role !== 'barber') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Get query parameters
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 10);
            $search = $request->get('search', '');
            $rating = $request->get('rating', 'all');
            $sortBy = $request->get('sort_by', 'newest');

            // Build query
            $query = Review::where('barber_id', $user->id)
                ->with(['appointment', 'services']);

            // Apply search filter
            if (!empty($search)) {
                $query->where(function($q) use ($search) {
                    $q->where('feedback', 'like', '%' . $search . '%')
                      ->orWhere('phone', 'like', '%' . $search . '%')
                      ->orWhereHas('appointment', function($q) use ($search) {
                          $q->where('full_name', 'like', '%' . $search . '%');
                      });
                });
            }

            // Apply rating filter
            if ($rating !== 'all' && in_array($rating, ['1', '2', '3', '4', '5'])) {
                $query->where('rating', (int)$rating);
            }

            // Apply sorting
            switch ($sortBy) {
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'highest':
                    $query->orderBy('rating', 'desc')->orderBy('created_at', 'desc');
                    break;
                case 'lowest':
                    $query->orderBy('rating', 'asc')->orderBy('created_at', 'desc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            // Get paginated results
            $reviews = $query->paginate($perPage, ['*'], 'page', $page);

            // Format reviews for response
            $formattedReviews = $reviews->map(function($review) {
                return $this->formatReview($review);
            });

            return response()->json([
                'success' => true,
                'data' => $formattedReviews,
                'pagination' => [
                    'current_page' => $reviews->currentPage(),
                    'total_pages' => $reviews->lastPage(),
                    'total' => $reviews->total(),
                    'per_page' => $reviews->perPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching reviews: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get review statistics for the authenticated barber
     */
    public function stats(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || $user->role !== 'barber') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Get all reviews for this barber
            $reviews = Review::where('barber_id', $user->id)->get();

            // Calculate statistics
            $totalReviews = $reviews->count();
            $averageRating = $totalReviews > 0 
                ? round($reviews->avg('rating'), 1) 
                : 0;
            
            // Calculate positive feedback (4+ stars)
            $positiveReviews = $reviews->where('rating', '>=', 4)->count();
            $positiveFeedback = $totalReviews > 0 
                ? round(($positiveReviews / $totalReviews) * 100) 
                : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'averageRating' => $averageRating,
                    'totalReviews' => $totalReviews,
                    'positiveFeedback' => $positiveFeedback
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching review stats: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export reviews to CSV
     */
    public function export(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || $user->role !== 'barber') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Get query parameters
            $search = $request->get('search', '');
            $rating = $request->get('rating', 'all');
            $sortBy = $request->get('sort_by', 'newest');

            // Build query (same as index)
            $query = Review::where('barber_id', $user->id)
                ->with(['appointment', 'services']);

            if (!empty($search)) {
                $query->where(function($q) use ($search) {
                    $q->where('feedback', 'like', '%' . $search . '%')
                      ->orWhere('phone', 'like', '%' . $search . '%')
                      ->orWhereHas('appointment', function($q) use ($search) {
                          $q->where('full_name', 'like', '%' . $search . '%');
                      });
                });
            }

            if ($rating !== 'all' && in_array($rating, ['1', '2', '3', '4', '5'])) {
                $query->where('rating', (int)$rating);
            }

            switch ($sortBy) {
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'highest':
                    $query->orderBy('rating', 'desc')->orderBy('created_at', 'desc');
                    break;
                case 'lowest':
                    $query->orderBy('rating', 'asc')->orderBy('created_at', 'desc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            $reviews = $query->get();

            // Generate CSV
            $filename = 'reviews_' . date('Y-m-d') . '.csv';
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ];

            // Add UTF-8 BOM for Excel compatibility
            $output = "\xEF\xBB\xBF";

            // CSV Headers
            $output .= "ID,Client Name,Phone,Rating,Feedback,Recommend,Services,Date\n";

            // CSV Data
            foreach ($reviews as $review) {
                $services = $review->services->pluck('name_en')->join('; ');
                $date = Carbon::parse($review->created_at)->format('Y-m-d H:i:s');
                $clientName = $review->appointment->full_name ?? 'N/A';
                $phone = $review->phone ?? 'N/A';
                $feedback = str_replace(["\r\n", "\n", "\r"], ' ', $review->feedback ?? '');
                $feedback = str_replace('"', '""', $feedback); // Escape quotes
                $recommend = $review->recommend ? 'Yes' : 'No';

                $output .= sprintf(
                    "%s,\"%s\",\"%s\",%d,\"%s\",%s,\"%s\",%s\n",
                    $review->id,
                    $clientName,
                    $phone,
                    $review->rating,
                    $feedback,
                    $recommend,
                    $services,
                    $date
                );
            }

            return response($output, 200, $headers);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error exporting reviews: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Format review for API response
     */
    private function formatReview($review)
    {
        $appointment = $review->appointment;
        $services = $review->services;
        
        // Get client name from appointment
        $clientName = $appointment->full_name ?? 'Unknown Client';
        
        // Get initials
        $initials = $this->getInitials($clientName);
        
        // Format services
        $serviceNames = $services->pluck('name_en')->join(', ');
        
        // Format date
        $date = Carbon::parse($review->created_at)->format('Y-m-d');
        
        return [
            'id' => $review->id,
            'clientName' => $clientName,
            'initials' => $initials,
            'clientAvatar' => null, // Can be enhanced later
            'rating' => $review->rating,
            'date' => $date,
            'text' => $review->feedback ?? '',
            'service' => $serviceNames,
            'services' => $services->map(function($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name_en ?? $service->name_ar ?? 'Service',
                ];
            })->toArray(),
            'isVerified' => true, // All reviews from completed appointments are verified
            'phone' => $review->phone ?? '',
            'recommend' => $review->recommend ?? false,
            'reply' => null, // Can be enhanced later to add reply functionality
        ];
    }

    /**
     * Delete a review
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if (!$user || $user->role !== 'barber') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Find the review
            $review = Review::where('id', $id)
                ->where('barber_id', $user->id)
                ->first();

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found'
                ], 404);
            }

            // Delete the review (cascade will handle related data)
            $review->delete();

            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get initials from name
     */
    private function getInitials($name)
    {
        if (empty($name)) {
            return '??';
        }
        
        $parts = explode(' ', trim($name));
        $initials = '';
        
        foreach ($parts as $part) {
            if (!empty($part)) {
                $initials .= strtoupper($part[0]);
            }
        }
        
        return substr($initials, 0, 2);
    }
}


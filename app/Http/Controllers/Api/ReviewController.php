<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ReviewController extends Controller
{
    /**
     * Get appointment data for review by hashed ID
     */
    public function getAppointmentForReview($hashedId)
    {
        try {
            // Log for debugging
            \Log::info('ReviewController: Looking for appointment with hash', ['hash' => $hashedId]);
            
            // Decode the hashed ID - try to find appointment by checking hash
            $appointment = $this->findAppointmentByHash($hashedId);
            
            if (!$appointment) {
                \Log::warning('ReviewController: Appointment not found for hash', ['hash' => $hashedId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment not found'
                ], 404);
            }
            
            \Log::info('ReviewController: Found appointment', ['appointment_id' => $appointment->id]);

            // Check if appointment is completed
            if ($appointment->status !== 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment must be completed before review'
                ], 400);
            }

            // Check if review already exists
            $existingReview = Review::where('appointment_id', $appointment->id)->first();
            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review already submitted for this appointment',
                    'alreadyReviewed' => true
                ], 400);
            }

            // Load relationships
            $appointment->load(['barber', 'services']);

            // Format date
            $date = Carbon::parse($appointment->appointment_date);
            $time = Carbon::parse($appointment->appointment_time);

            return response()->json([
                'success' => true,
                'data' => [
                    'appointmentId' => $appointment->id,
                    'barberId' => $appointment->barber_id,
                    'barberName' => $appointment->barber->name ?? 'Barber',
                    'barberAvatar' => $appointment->barber->profile_photo 
                        ? url('storage/' . $appointment->barber->profile_photo) 
                        : null,
                    'date' => $date->format('Y-m-d'),
                    'dateFormatted' => $date->format('M d, Y'),
                    'services' => $appointment->services->map(function($service) {
                        return [
                            'id' => $service->id,
                            'name' => $service->name_en ?? $service->name_ar ?? 'Service',
                            'name_en' => $service->name_en,
                            'name_ar' => $service->name_ar,
                        ];
                    })->toArray(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching appointment data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit a review
     */
    public function submitReview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|string', // Hashed appointment ID
            'rating' => 'required|integer|min:1|max:5',
            'services' => 'required|array|min:1',
            'services.*' => 'exists:services,id',
            'phone' => 'required|string|max:20',
            'feedback' => 'nullable|string|max:2000',
            'recommend' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Find appointment by hashed ID
            $appointment = $this->findAppointmentByHash($request->appointment_id);
            
            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment not found'
                ], 404);
            }

            // Check if appointment is completed
            if ($appointment->status !== 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment must be completed before review'
                ], 400);
            }

            // Check if review already exists (only if Review table exists)
            $existingReview = null;
            try {
                if (Schema::hasTable('reviews')) {
                    $existingReview = Review::where('appointment_id', $appointment->id)->first();
                }
            } catch (\Exception $e) {
                // Table doesn't exist yet, ignore
            }
            
            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already submitted a review for this appointment',
                    'alreadyReviewed' => true
                ], 400);
            }

            // Verify phone number matches appointment
            if ($appointment->phone !== $request->phone) {
                return response()->json([
                    'success' => false,
                    'message' => 'Phone number does not match the appointment'
                ], 400);
            }

            // Create review
            $review = Review::create([
                'appointment_id' => $appointment->id,
                'barber_id' => $appointment->barber_id,
                'rating' => $request->rating,
                'feedback' => $request->feedback,
                'recommend' => $request->recommend ?? true,
                'phone' => $request->phone,
            ]);

            // Attach services
            $review->services()->attach($request->services);

            // Load relationships for response
            $review->load(['barber', 'services']);

            return response()->json([
                'success' => true,
                'message' => 'Review submitted successfully',
                'data' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'feedback' => $review->feedback,
                    'recommend' => $review->recommend,
                    'barberName' => $review->barber->name ?? 'Barber',
                    'services' => $review->services->map(function($service) {
                        return [
                            'id' => $service->id,
                            'name' => $service->name_en ?? $service->name_ar ?? 'Service',
                        ];
                    })->toArray(),
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Find appointment by hashed ID
     * Uses a simple hash based on appointment ID and a secret
     */
    private function findAppointmentByHash($hashedId)
    {
        // Get all completed appointments and check their hashes
        $appointments = Appointment::where('status', 'completed')->get();
        
        foreach ($appointments as $appointment) {
            $hash = self::hashAppointmentId($appointment->id);
            if ($hash === $hashedId) {
                return $appointment;
            }
        }
        
        // If not found, try all appointments (in case status changed)
        $allAppointments = Appointment::all();
        foreach ($allAppointments as $appointment) {
            $hash = self::hashAppointmentId($appointment->id);
            if ($hash === $hashedId) {
                return $appointment;
            }
        }
        
        return null;
    }

    /**
     * Hash appointment ID for URL
     */
    public static function hashAppointmentId($appointmentId)
    {
        // Use SHA-256 hash - must match frontend
        // Use a consistent secret key that matches frontend
        // Frontend uses: import.meta.env.VITE_REVIEW_SECRET_KEY || 'default-secret-key'
        $secret = env('REVIEW_SECRET_KEY', 'default-secret-key');
        return hash('sha256', $appointmentId . $secret);
    }

    /**
     * Generate review link for an appointment
     */
    public static function generateReviewLink($appointmentId, $baseUrl = null)
    {
        $hash = self::hashAppointmentId($appointmentId);
        $baseUrl = $baseUrl ?? config('app.frontend_url', 'http://localhost:3000');
        return $baseUrl . '/review/' . $hash;
    }

    /**
     * Get public reviews for homepage (latest 3 five-star reviews)
     */
    public function getPublicReviews(Request $request)
    {
        try {
            // Check if reviews table exists
            if (!Schema::hasTable('reviews')) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }

            $limit = $request->get('limit', 3);
            $rating = $request->get('rating', 5); // Default to 5 stars

            // Get latest reviews with specified rating
            $reviews = Review::where('rating', $rating)
                ->with(['appointment', 'services', 'barber'])
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            // Format reviews for public display
            $formattedReviews = $reviews->map(function($review) {
                return $this->formatPublicReview($review);
            })->filter(function($review) {
                // Only return reviews that have valid appointment data
                return !empty($review['customerName']) && $review['customerName'] !== 'Anonymous';
            })->values(); // Re-index array

            return response()->json([
                'success' => true,
                'data' => $formattedReviews
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching public reviews: ' . $e->getMessage());
            return response()->json([
                'success' => true, // Return success with empty data instead of error
                'data' => []
            ]);
        }
    }

    /**
     * Format review for public display (homepage)
     */
    private function formatPublicReview($review)
    {
        $appointment = $review->appointment;
        $services = $review->services;
        
        // Get client name from appointment
        $clientName = $appointment->full_name ?? 'Anonymous';
        
        // Get initials
        $initials = $this->getInitials($clientName);
        
        // Format services
        $serviceNames = $services->pluck('name_en')->join(', ');
        
        return [
            'id' => $review->id,
            'rating' => $review->rating,
            'quote' => $review->feedback ?? '',
            'text' => $review->feedback ?? '',
            'customerName' => $clientName,
            'clientName' => $clientName,
            'customerInitials' => $initials,
            'initials' => $initials,
            'customerType' => 'Verified Client',
            'serviceType' => $serviceNames,
            'service' => $serviceNames,
            'date' => Carbon::parse($review->created_at)->format('Y-m-d'),
        ];
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


<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\BarberAvailability;
use App\Models\BlockedTime;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Get list of active barbers for selection
     */
    public function getBarbers()
    {
        $barbers = User::where('role', 'barber')
            ->where('status', 'active')
            ->select('id', 'name', 'profile_photo', 'job_title')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $barbers
        ]);
    }

    /**
     * Get list of active services for selection
     */
    public function getServices()
    {
        $services = Service::where('is_active', true)
            ->select('id', 'name_en', 'name_ar', 'price', 'duration', 'discount_percentage')
            ->orderBy('order', 'asc')
            ->orderBy('name_en', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    /**
     * Get available dates for a specific barber
     * Only returns dates where the barber has availability set up and the day is enabled
     */
    public function getAvailableDates(Request $request)
    {
        try {
            // Accept both barber_id and barberId for flexibility
            $barberId = $request->input('barber_id') ?: $request->input('barberId');
            $days = (int) $request->input('days', 30); // Ensure it's an integer
            
            $validator = Validator::make([
                'barber_id' => $barberId,
                'days' => $days
            ], [
                'barber_id' => 'required|exists:users,id',
                'days' => 'sometimes|integer|min:1|max:90'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Get barber availability - ONLY show dates if barber has availability set up
            $availability = BarberAvailability::where('user_id', $barberId)->first();
            
            if (!$availability) {
                // Barber has no availability set up - return empty
                return response()->json([
                    'success' => true,
                    'available' => [],
                    'unavailable' => [],
                    'message' => 'Barber has no availability configured'
                ]);
            }

            $availabilityData = $availability->availability_data ?? [];
            
            if (empty($availabilityData)) {
                return response()->json([
                    'success' => true,
                    'available' => [],
                    'unavailable' => [],
                    'message' => 'Barber has no availability data'
                ]);
            }
            
            $availableDates = [];
            $unavailableDates = [];
            
            $startDate = Carbon::today();
            $endDate = Carbon::today()->addDays($days);

            // Check each date
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $dayName = strtolower($date->format('l')); // Monday, Tuesday, etc.
                $dateString = $date->format('Y-m-d');
                
                // Find matching day in availability
                $dayAvailability = collect($availabilityData)->firstWhere('day', $dayName);
                
                // Check if day exists and is enabled (must be explicitly true, not just truthy)
                $isDayEnabled = $dayAvailability && 
                               isset($dayAvailability['enabled']) && 
                               ($dayAvailability['enabled'] === true || $dayAvailability['enabled'] === 1);
                
                // Check if day has valid slots
                $hasValidSlots = $dayAvailability && 
                                isset($dayAvailability['slots']) &&
                                is_array($dayAvailability['slots']) &&
                                count($dayAvailability['slots']) > 0;
                
                // ONLY show date if day is enabled AND has slots
                // Monday with enabled: false should NOT appear
                if ($isDayEnabled && $hasValidSlots) {
                    // Check if date is fully booked
                    // Exclude cancelled and rejected appointments - they should free up time slots
                    $appointmentsOnDate = Appointment::where('barber_id', $barberId)
                        ->where('appointment_date', $dateString)
                        ->whereNotIn('status', ['cancelled', 'rejected'])
                        ->count();
                    
                    // Get total available slots for this day
                    $totalSlots = $this->calculateTotalSlotsForDay($dayAvailability['slots']);
                    
                    if ($totalSlots > 0 && $appointmentsOnDate < $totalSlots) {
                        $availableDates[] = $dateString;
                    } else {
                        $unavailableDates[] = $dateString;
                    }
                } else {
                    // Day is disabled (enabled: false) or has no slots - mark as unavailable
                    // This ensures Monday with enabled: false will NOT appear in available dates
                    $unavailableDates[] = $dateString;
                }
            }

            return response()->json([
                'success' => true,
                'available' => $availableDates,
                'unavailable' => $unavailableDates
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getAvailableDates: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching available dates',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available time slots for a specific barber and date
     * Returns time slots EXACTLY as configured in barber_availability table
     */
    public function getAvailableTimeSlots(Request $request)
    {
        try {
            // Accept both barber_id and barberId for flexibility
            $barberId = $request->input('barber_id') ?: $request->input('barberId');
            $date = $request->input('date');
            
            $validator = Validator::make([
                'barber_id' => $barberId,
                'date' => $date
            ], [
                'barber_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'service_ids' => 'sometimes|array',
                'service_ids.*' => 'exists:services,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $dateObj = Carbon::parse($date);
            $dayName = strtolower($dateObj->format('l')); // Monday, Tuesday, etc.
            $dateString = $dateObj->format('Y-m-d');

            // Get barber availability - MUST exist in database
            $availability = BarberAvailability::where('user_id', $barberId)->first();
            
            if (!$availability) {
                // No availability set up for this barber
                return response()->json([
                    'success' => true,
                    'available' => [],
                    'unavailable' => [],
                    'message' => 'Barber has no availability configured'
                ]);
            }

            $availabilityData = $availability->availability_data ?? [];
            
            if (empty($availabilityData)) {
                return response()->json([
                    'success' => true,
                    'available' => [],
                    'unavailable' => [],
                    'message' => 'Barber has no availability data'
                ]);
            }
            
            // Find the specific day in availability
            $dayAvailability = collect($availabilityData)->firstWhere('day', $dayName);

            // Check if day exists and is enabled (must be explicitly true, not just truthy)
            $isDayEnabled = $dayAvailability && 
                           isset($dayAvailability['enabled']) && 
                           ($dayAvailability['enabled'] === true || $dayAvailability['enabled'] === 1);
            
            // Check if day has valid slots
            $hasValidSlots = $dayAvailability && 
                            isset($dayAvailability['slots']) &&
                            is_array($dayAvailability['slots']) &&
                            count($dayAvailability['slots']) > 0;

            // ONLY return slots if day is enabled AND has slots configured
            // Monday with enabled: false should return empty slots
            if (!$isDayEnabled || !$hasValidSlots) {
                // Day is disabled (enabled: false) or has no slots
                return response()->json([
                    'success' => true,
                    'available' => [],
                    'unavailable' => [],
                    'message' => 'Barber is not available on this day'
                ]);
            }

            // Generate time slots EXACTLY from the availability slots in database
            $allSlots = [];
            foreach ($dayAvailability['slots'] as $slotIndex => $slot) {
                if (isset($slot['start']) && isset($slot['end'])) {
                    $start = $slot['start'];
                    $end = $slot['end'];
                    
                    // Skip invalid slots
                    if (empty($start) || empty($end)) {
                        continue;
                    }
                    
                    // Generate slots for this time range
                    $slots = $this->generateTimeSlots($start, $end);
                    if (!empty($slots)) {
                        $allSlots = array_merge($allSlots, $slots);
                    }
                }
            }
            
            // Remove duplicates and sort slots chronologically
            $allSlots = array_unique($allSlots);
            usort($allSlots, function($a, $b) {
                // Convert to 24-hour format for proper sorting
                $timeA = $this->convertTo24Hour($a);
                $timeB = $this->convertTo24Hour($b);
                return strcmp($timeA, $timeB);
            });
            

            // Get booked appointments with their services to calculate actual end times
            // Exclude cancelled and rejected appointments - they should free up time slots
            $bookedAppointments = Appointment::where('barber_id', $barberId)
                ->where('appointment_date', $dateString)
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->with('services')
                ->get();

            // Get blocked times for this barber and date
            $blockedTimes = BlockedTime::where('user_id', $barberId)
                ->where('blocked_date', $dateString)
                ->get();

            // Calculate booked time ranges (start time + total service duration)
            $bookedTimeRanges = [];
            foreach ($bookedAppointments as $appointment) {
                // Calculate total duration of all services for this appointment
                $totalDuration = 0;
                if ($appointment->services && $appointment->services->count() > 0) {
                    foreach ($appointment->services as $service) {
                        $totalDuration += $service->duration ?? 30; // Default to 30 minutes if duration not set
                    }
                } else {
                    // Fallback: if no services, assume 30 minutes
                    $totalDuration = 30;
                }

                // Get appointment start time
                $appointmentTime = $appointment->appointment_time;
                if (is_string($appointmentTime)) {
                    $startTime = Carbon::parse($dateString . ' ' . $appointmentTime);
                } else {
                    $startTime = Carbon::parse($dateString . ' ' . $appointmentTime->format('H:i:s'));
                }

                // Calculate end time
                $endTime = $startTime->copy()->addMinutes($totalDuration);

                // Store the time range
                $bookedTimeRanges[] = [
                    'start' => $startTime,
                    'end' => $endTime,
                    'start_formatted' => $startTime->format('H:i'),
                    'end_formatted' => $endTime->format('H:i')
                ];
            }

            // Get selected services duration if provided (for checking if a slot would conflict)
            $selectedServicesDuration = 0;
            $serviceIds = $request->input('service_ids', []);
            if (!empty($serviceIds) && is_array($serviceIds)) {
                $services = Service::whereIn('id', $serviceIds)->get();
                foreach ($services as $service) {
                    $selectedServicesDuration += $service->duration ?? 30;
                }
            }

            // Separate available and unavailable slots
            $available = [];
            $unavailable = [];

            foreach ($allSlots as $slot) {
                $time24 = $this->convertTo24Hour($slot);
                $slotTime = Carbon::parse($dateString . ' ' . $time24);
                
                // Check if this slot is within any blocked time
                $isBlocked = false;
                foreach ($blockedTimes as $blockedTime) {
                    $blockedStart = Carbon::parse($dateString . ' ' . $blockedTime->start_time);
                    $blockedEnd = Carbon::parse($dateString . ' ' . $blockedTime->end_time);
                    
                    // Check if slot overlaps with blocked time
                    // Slot is blocked if it starts within the blocked time range
                    if ($slotTime->gte($blockedStart) && $slotTime->lt($blockedEnd)) {
                        $isBlocked = true;
                        break;
                    }
                }
                
                if ($isBlocked) {
                    $unavailable[] = $slot;
                    continue;
                }
                
                // Check if this slot would conflict with any existing appointment
                $isConflicting = false;
                
                foreach ($bookedTimeRanges as $range) {
                    // Calculate the end time of the appointment if booked at this slot
                    $slotEndTime = $slotTime->copy();
                    if ($selectedServicesDuration > 0) {
                        // Use selected services duration if provided
                        $slotEndTime->addMinutes($selectedServicesDuration);
                    } else {
                        // Default to 30 minutes if no services selected
                        $slotEndTime->addMinutes(30);
                    }

                    // Check for overlap: slot overlaps if:
                    // - Slot starts before existing appointment ends AND
                    // - Slot ends after existing appointment starts
                    if ($slotTime->lt($range['end']) && $slotEndTime->gt($range['start'])) {
                        $isConflicting = true;
                        break;
                    }
                }

                if ($isConflicting) {
                    $unavailable[] = $slot;
                } else {
                    $available[] = $slot;
                }
            }

            return response()->json([
                'success' => true,
                'available' => $available,
                'unavailable' => $unavailable
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getAvailableTimeSlots: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching available time slots',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new appointment
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'barber_id' => 'required|exists:users,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|string',
            'notes' => 'nullable|string|max:1000',
            'services' => 'required|array|min:1',
            'services.*' => 'exists:services,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Convert time to 24-hour format
        $time24 = $this->convertTo24Hour($request->appointment_time);
        $appointmentDateTime = Carbon::parse($request->appointment_date . ' ' . $time24);

        // Calculate total duration of selected services
        $totalDuration = 30; // Default duration
        if ($request->has('services') && is_array($request->services) && count($request->services) > 0) {
            $services = Service::whereIn('id', $request->services)->get();
            $totalDuration = 0;
            foreach ($services as $service) {
                $totalDuration += $service->duration ?? 30;
            }
        }

        // Calculate appointment end time
        $appointmentEndTime = $appointmentDateTime->copy()->addMinutes($totalDuration);

        // Check if slot conflicts with existing appointments (considering duration)
        $conflictingAppointments = Appointment::where('barber_id', $request->barber_id)
            ->where('appointment_date', $request->appointment_date)
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->with('services')
            ->get();

        foreach ($conflictingAppointments as $existingAppointment) {
            // Calculate existing appointment duration
            $existingDuration = 30; // Default
            if ($existingAppointment->services && $existingAppointment->services->count() > 0) {
                $existingDuration = 0;
                foreach ($existingAppointment->services as $service) {
                    $existingDuration += $service->duration ?? 30;
                }
            }

            // Get existing appointment start time
            $existingTime = $existingAppointment->appointment_time;
            if (is_string($existingTime)) {
                $existingStartTime = Carbon::parse($request->appointment_date . ' ' . $existingTime);
            } else {
                $existingStartTime = Carbon::parse($request->appointment_date . ' ' . $existingTime->format('H:i:s'));
            }
            $existingEndTime = $existingStartTime->copy()->addMinutes($existingDuration);

            // Check for overlap: appointments overlap if:
            // - New appointment starts before existing appointment ends AND
            // - New appointment ends after existing appointment starts
            if ($appointmentDateTime->lt($existingEndTime) && $appointmentEndTime->gt($existingStartTime)) {
                return response()->json([
                    'success' => false,
                    'message' => 'This time slot conflicts with an existing appointment. Please select another time.'
                ], 409);
            }
        }

        // Validate that the barber is available at this time
        $availability = BarberAvailability::where('user_id', $request->barber_id)->first();
        if ($availability) {
            $dayName = strtolower($appointmentDateTime->format('l'));
            $availabilityData = $availability->availability_data ?? [];
            $dayAvailability = collect($availabilityData)->firstWhere('day', $dayName);
            
            if (!$dayAvailability || !$dayAvailability['enabled'] || empty($dayAvailability['slots'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'The barber is not available on this day.'
                ], 409);
            }

            // Check if time falls within any available slot
            $isValidTime = false;
            foreach ($dayAvailability['slots'] as $slot) {
                $slotStart = Carbon::parse($request->appointment_date . ' ' . $slot['start']);
                $slotEnd = Carbon::parse($request->appointment_date . ' ' . $slot['end']);
                if ($appointmentDateTime->gte($slotStart) && $appointmentDateTime->lt($slotEnd)) {
                    $isValidTime = true;
                    break;
                }
            }

            if (!$isValidTime) {
                return response()->json([
                    'success' => false,
                    'message' => 'The selected time is not within the barber\'s available hours.'
                ], 409);
            }
        }

        DB::beginTransaction();
        try {
            // Create appointment
            $appointment = Appointment::create([
                'full_name' => $request->full_name,
                'phone' => $request->phone,
                'email' => $request->email,
                'barber_id' => $request->barber_id,
                'appointment_date' => $request->appointment_date,
                'appointment_time' => $time24,
                'notes' => $request->notes,
                'status' => 'pending'
            ]);

            // Attach services
            $appointment->services()->attach($request->services);

            DB::commit();

            // Load relationships for response
            $appointment->load(['barber', 'services']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully',
                'data' => $appointment
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate time slots between start and end time (30-minute intervals)
     * Handles edge cases like very short slots and ensures slots are practical
     */
    private function generateTimeSlots($start, $end)
    {
        $slots = [];
        
        // Parse times - handle 24-hour format
        $startTime = Carbon::parse($start);
        $endTime = Carbon::parse($end);
        
        // Ensure end time is after start time (handle day rollover)
        if ($endTime->lt($startTime)) {
            $endTime->addDay();
        }
        
        // Calculate duration in minutes
        $durationMinutes = $startTime->diffInMinutes($endTime);
        
        // Skip slots that are too short (less than 15 minutes) - not practical for appointments
        if ($durationMinutes < 15) {
            return $slots; // Return empty array for very short slots
        }
        
        // For slots between 15-30 minutes, round to nearest 30-minute interval
        if ($durationMinutes < 30) {
            // Round start time to nearest 30-minute mark (round down)
            $roundedMinutes = floor($startTime->minute / 30) * 30;
            $startTime->minute($roundedMinutes)->second(0);
            $slots[] = $startTime->format('h:i A');
            return $slots;
        }
        
        // Generate 30-minute interval slots for longer durations
        $currentTime = $startTime->copy();
        // Round start time to nearest 30-minute mark (round down)
        $roundedMinutes = floor($currentTime->minute / 30) * 30;
        $currentTime->minute($roundedMinutes)->second(0);
        
        while ($currentTime->lt($endTime)) {
            $slots[] = $currentTime->format('h:i A');
            $currentTime->addMinutes(30);
            
            // Stop if next slot would exceed end time
            if ($currentTime->gte($endTime)) {
                break;
            }
        }

        return $slots;
    }

    /**
     * Convert 12-hour time to 24-hour format
     */
    private function convertTo24Hour($time12)
    {
        // Handle both "09:00 AM" and "09:00" formats
        if (preg_match('/(\d{1,2}):(\d{2})\s*(AM|PM)/i', $time12, $matches)) {
            $hour = (int)$matches[1];
            $minute = (int)$matches[2];
            $ampm = strtoupper($matches[3]);
            
            if ($ampm === 'PM' && $hour !== 12) {
                $hour += 12;
            } elseif ($ampm === 'AM' && $hour === 12) {
                $hour = 0;
            }
            
            return sprintf('%02d:%02d', $hour, $minute);
        }
        
        // If already in 24-hour format, return as is
        return $time12;
    }

    /**
     * Calculate total available slots for a day
     */
    private function calculateTotalSlotsForDay($slots)
    {
        if (empty($slots) || !is_array($slots)) {
            return 0;
        }
        
        $total = 0;
        foreach ($slots as $slot) {
            if (!isset($slot['start']) || !isset($slot['end'])) {
                continue;
            }
            
            try {
                $start = Carbon::parse($slot['start']);
                $end = Carbon::parse($slot['end']);
                
                // Ensure end time is after start time
                if ($end->lte($start)) {
                    continue;
                }
                
                $diff = $start->diffInMinutes($end);
                $total += floor($diff / 30); // 30-minute slots
            } catch (\Exception $e) {
                // Skip invalid time slots
                Log::warning('Invalid time slot format', ['slot' => $slot, 'error' => $e->getMessage()]);
                continue;
            }
        }
        return $total;
    }
}

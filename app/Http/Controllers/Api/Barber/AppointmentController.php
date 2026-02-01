<?php

namespace App\Http\Controllers\Api\Barber;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\BarberAvailability;
use App\Models\BlockedTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Get barber's appointments
     */
    public function index(Request $request)
    {
        $barber = $request->user();
        
        // Get appointments - we'll get raw time value in formatAppointment
        $query = Appointment::where('barber_id', $barber->id)
            ->with(['services', 'barber'])
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc');

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Date filter (only apply if date is provided)
        if ($request->has('date') && !empty($request->date)) {
            $query->where('appointment_date', $request->date);
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $appointments = $query->paginate($perPage);

        // Get raw time values from database for all appointments to avoid casting issues
        $appointmentIds = $appointments->pluck('id')->toArray();
        $rawTimes = DB::table('appointments')
            ->whereIn('id', $appointmentIds)
            ->pluck('appointment_time', 'id')
            ->toArray();

        // Format appointments with error handling
        $formattedAppointments = $appointments->map(function ($appointment) use ($rawTimes) {
            try {
                // Inject raw time value before formatting
                if (isset($rawTimes[$appointment->id])) {
                    $appointment->time_raw = $rawTimes[$appointment->id];
                }
                return $this->formatAppointment($appointment);
            } catch (\Exception $e) {
                Log::error('Error formatting appointment: ' . $e->getMessage(), [
                    'appointment_id' => $appointment->id ?? null,
                    'trace' => $e->getTraceAsString()
                ]);
                // Return minimal data if formatting fails
                return [
                    'id' => $appointment->id ?? 0,
                    'clientName' => $appointment->full_name ?? 'Unknown',
                    'clientInitials' => 'U',
                    'clientAvatar' => null,
                    'clientType' => 'Client',
                    'service' => 'Service',
                    'barberName' => $appointment->barber->name ?? 'Barber',
                    'dateTime' => 'Unknown',
                    'notes' => $appointment->notes ?? null,
                    'status' => $appointment->status ?? 'pending',
                    'isVIP' => false,
                    'isPast' => false,
                    'date' => $appointment->appointment_date ?? now()->format('Y-m-d'),
                    'time' => '00:00',
                    'phone' => $appointment->phone ?? '',
                    'email' => $appointment->email ?? '',
                ];
            }
        });

        return response()->json([
            'success' => true,
            'data' => $formattedAppointments,
            'total' => $appointments->total(),
            'per_page' => $appointments->perPage(),
            'current_page' => $appointments->currentPage(),
            'last_page' => $appointments->lastPage(),
            'total_pages' => $appointments->lastPage(),
        ]);
    }

    /**
     * Get single appointment
     */
    public function show(Request $request, $id)
    {
        $barber = $request->user();
        
        $appointment = Appointment::where('barber_id', $barber->id)
            ->with(['services', 'barber'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatAppointment($appointment)
        ]);
    }

    /**
     * Update appointment
     */
    public function update(Request $request, $id)
    {
        $barber = $request->user();
        
        $appointment = Appointment::where('barber_id', $barber->id)
            ->findOrFail($id);

        // Custom validation for time format
        $validator = Validator::make($request->all(), [
            'client_name' => 'sometimes|string|max:255',
            'clientName' => 'sometimes|string|max:255', // Also accept camelCase
            'phone' => 'sometimes|string|max:255', // Phone number
            'service' => 'sometimes', // Allow string or numeric (for backward compatibility)
            'services' => 'sometimes|array', // Array of service IDs (multi-select)
            'services.*' => 'sometimes|integer|exists:services,id', // Each service ID must exist
            'date' => 'sometimes|date',
            'time' => [
                'sometimes',
                'string',
                function ($attribute, $value, $fail) {
                    if (!empty($value) && !preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/', $value)) {
                        $fail('The ' . $attribute . ' must be in HH:MM or HH:MM:SS format.');
                    }
                },
            ],
            'status' => 'sometimes|in:pending,accepted,rejected,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Appointment update validation failed', [
                'appointment_id' => $id,
                'barber_id' => $barber->id,
                'request_data' => $request->all(),
                'validation_errors' => $validator->errors()->toArray()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update appointment
        // Handle both client_name and clientName (camelCase)
        $clientName = $request->input('client_name') ?: $request->input('clientName');
        if ($clientName && !empty($clientName)) {
            $appointment->full_name = $clientName;
        }
        
        // Update phone number
        if ($request->has('phone')) {
            $appointment->phone = $request->phone ?: null;
        }
        if ($request->has('date') && !empty($request->date)) {
            $appointment->appointment_date = $request->date;
        }
        if ($request->has('time') && !empty($request->time)) {
            // Ensure time is in HH:MM format
            $time = $request->time;
            // If time is in HH:MM:SS format, extract just HH:MM
            if (strlen($time) > 5) {
                $time = substr($time, 0, 5);
            }
            $appointment->appointment_time = $time;
        }
        if ($request->has('status') && !empty($request->status)) {
            $appointment->status = $request->status;
        }
        if ($request->has('notes')) {
            $appointment->notes = $request->notes;
        }

        // Handle service(s) update if provided
        // Support both single service (backward compatibility) and multiple services (multi-select)
        if ($request->has('services') && is_array($request->services)) {
            // Multi-select: array of service IDs
            $serviceIds = array_filter(array_map('intval', $request->services));
            if (!empty($serviceIds)) {
                $appointment->services()->sync($serviceIds);
            }
        } elseif ($request->has('service')) {
            // Single service (backward compatibility)
            $serviceId = $request->service;
            // If service is not numeric, try to find by name
            if (!is_numeric($serviceId)) {
                $service = Service::where('name_en', $serviceId)
                    ->orWhere('name_ar', $serviceId)
                    ->first();
                if ($service) {
                    $serviceId = $service->id;
                }
            }
            // Update the relationship if we have a valid service ID
            if (is_numeric($serviceId)) {
                $appointment->services()->sync([$serviceId]);
            }
        }

        $appointment->save();
        $appointment->load(['services', 'barber']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
            'data' => $this->formatAppointment($appointment)
        ]);
    }

    /**
     * Accept appointment
     */
    public function accept(Request $request, $id)
    {
        try {
            $barber = $request->user();
            
            $appointment = Appointment::where('barber_id', $barber->id)
                ->findOrFail($id);

            if ($appointment->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending appointments can be accepted'
                ], 400);
            }

            // First, ensure the enum includes 'accepted' - fix it if needed
            $this->ensureStatusEnumIncludesAccepted();
            
            // Update status to accepted using raw SQL to ensure proper quoting
            // Using raw SQL with proper parameter binding to avoid any quoting issues
            DB::statement("UPDATE `appointments` SET `status` = ? WHERE `id` = ?", ['accepted', $appointment->id]);
            
            // Reload to ensure we have the latest data
            $appointment->refresh();
            $appointment->load(['services', 'barber']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment accepted successfully',
                'data' => $this->formatAppointment($appointment)
            ]);
        } catch (\Exception $e) {
            Log::error('Error accepting appointment', [
                'appointment_id' => $id,
                'barber_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept appointment: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Ensure the status enum includes 'accepted' and 'rejected'
     * This is a safety check to fix the enum if it's missing these values
     */
    private function ensureStatusEnumIncludesAccepted()
    {
        try {
            $driver = DB::connection()->getDriverName();
            
            if ($driver === 'mysql') {
                // Check current enum values
                $result = DB::select("SHOW COLUMNS FROM appointments WHERE Field = 'status'");
                if (!empty($result)) {
                    $type = $result[0]->Type ?? '';
                    Log::debug('Current status enum type', ['type' => $type]);
                    
                    // If enum doesn't include 'accepted' or 'rejected', update it
                    if (strpos(strtolower($type), 'accepted') === false || strpos(strtolower($type), 'rejected') === false) {
                        Log::warning('Status enum missing accepted/rejected, attempting to fix...', ['current_type' => $type]);
                        try {
                            DB::statement("ALTER TABLE `appointments` MODIFY COLUMN `status` ENUM('pending', 'accepted', 'rejected', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending'");
                            Log::info('Status enum updated successfully');
                            
                            // Verify the update
                            $verifyResult = DB::select("SHOW COLUMNS FROM appointments WHERE Field = 'status'");
                            if (!empty($verifyResult)) {
                                Log::info('Verified status enum', ['new_type' => $verifyResult[0]->Type ?? '']);
                            }
                        } catch (\Exception $alterException) {
                            Log::error('Failed to alter status enum', [
                                'error' => $alterException->getMessage(),
                                'trace' => $alterException->getTraceAsString()
                            ]);
                            // Re-throw so the calling method knows the enum fix failed
                            throw $alterException;
                        }
                    } else {
                        Log::debug('Status enum already includes accepted/rejected');
                    }
                }
            }
        } catch (\Exception $e) {
            // Log the error but don't fail the request - let the update attempt proceed
            // If the enum is wrong, the update will fail with a clear error message
            Log::error('Could not verify/fix status enum', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Reject appointment
     */
    public function reject(Request $request, $id)
    {
        try {
            $barber = $request->user();
            
            $appointment = Appointment::where('barber_id', $barber->id)
                ->findOrFail($id);

            if ($appointment->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending appointments can be rejected'
                ], 400);
            }

            // First, ensure the enum includes 'rejected'
            $this->ensureStatusEnumIncludesAccepted();
            
            // Update status to rejected using raw SQL with proper parameter binding
            if ($request->has('reason')) {
                $notes = ($appointment->notes ? $appointment->notes . "\n\nRejection reason: " : 'Rejection reason: ') . $request->reason;
                DB::statement("UPDATE `appointments` SET `status` = ?, `notes` = ? WHERE `id` = ?", ['rejected', $notes, $appointment->id]);
            } else {
                DB::statement("UPDATE `appointments` SET `status` = ? WHERE `id` = ?", ['rejected', $appointment->id]);
            }
            
            // Reload to ensure we have the latest data
            $appointment->refresh();
            $appointment->load(['services', 'barber']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment rejected successfully',
                'data' => $this->formatAppointment($appointment)
            ]);
        } catch (\Exception $e) {
            Log::error('Error rejecting appointment', [
                'appointment_id' => $id,
                'barber_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete appointment
     */
    public function complete(Request $request, $id)
    {
        try {
            $barber = $request->user();
            
            $appointment = Appointment::where('barber_id', $barber->id)
                ->findOrFail($id);

            if (!in_array($appointment->status, ['accepted', 'pending'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only accepted or pending appointments can be completed'
                ], 400);
            }

            // Update status to completed using raw SQL with proper parameter binding
            DB::statement("UPDATE `appointments` SET `status` = ? WHERE `id` = ?", ['completed', $appointment->id]);
            
            // Reload to ensure we have the latest data
            $appointment->refresh();
            $appointment->load(['services', 'barber']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment completed successfully',
                'data' => $this->formatAppointment($appointment)
            ]);
        } catch (\Exception $e) {
            Log::error('Error completing appointment', [
                'appointment_id' => $id,
                'barber_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available time slots for the barber
     */
    public function getAvailableSlots(Request $request)
    {
        $barber = $request->user();
        $date = $request->get('date', Carbon::today()->format('Y-m-d'));

        // Get barber availability
        $availability = BarberAvailability::where('user_id', $barber->id)->first();
        
        if (!$availability || !$availability->availability_data) {
            return response()->json([
                'success' => true,
                'data' => [
                    'barber' => [
                        'id' => $barber->id,
                        'name' => $barber->name,
                        'avatar' => $barber->profile_photo ? asset('storage/' . $barber->profile_photo) : null,
                        'availableSlots' => [],
                        'isFull' => false
                    ]
                ]
            ]);
        }

        $availabilityData = $availability->availability_data;
        $dayName = Carbon::parse($date)->format('l'); // Monday, Tuesday, etc.
        
        // Find day availability - check both full day name and lowercase
        $dayAvailability = collect($availabilityData)->first(function ($day) use ($dayName) {
            $dayKey = strtolower($day['day'] ?? '');
            $dayNameLower = strtolower($dayName);
            return $dayKey === $dayNameLower;
        });
        
        if (!$dayAvailability || !($dayAvailability['enabled'] ?? false)) {
            return response()->json([
                'success' => true,
                'data' => [
                    'barber' => [
                        'id' => $barber->id,
                        'name' => $barber->name,
                        'avatar' => $barber->profile_photo ? asset('storage/' . $barber->profile_photo) : null,
                        'availableSlots' => [],
                        'isFull' => false
                    ]
                ]
            ]);
        }

        // Generate time slots
        $allSlots = [];
        foreach ($dayAvailability['slots'] ?? [] as $slot) {
            if (isset($slot['start']) && isset($slot['end'])) {
                $slots = $this->generateTimeSlots($slot['start'], $slot['end']);
                $allSlots = array_merge($allSlots, $slots);
            }
        }

        // Remove duplicates and sort
        $allSlots = array_unique($allSlots);
        usort($allSlots, function($a, $b) {
            return strcmp($this->convertTo24Hour($a), $this->convertTo24Hour($b));
        });

        // Get booked appointments with their services to calculate actual end times
        // Exclude cancelled and rejected appointments - they should free up time slots
        $bookedAppointments = Appointment::where('barber_id', $barber->id)
            ->where('appointment_date', $date)
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->with('services')
            ->get();

        // Get blocked times for this barber and date
        $blockedTimes = BlockedTime::where('user_id', $barber->id)
            ->where('blocked_date', $date)
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
                $startTime = Carbon::parse($date . ' ' . $appointmentTime);
            } else {
                $startTime = Carbon::parse($date . ' ' . $appointmentTime->format('H:i:s'));
            }

            // Calculate end time
            $endTime = $startTime->copy()->addMinutes($totalDuration);

            // Store the time range
            $bookedTimeRanges[] = [
                'start' => $startTime,
                'end' => $endTime
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

        // Filter out conflicting slots
        $availableSlots = [];
        foreach ($allSlots as $slot) {
            $time24 = $this->convertTo24Hour($slot);
            $slotTime = Carbon::parse($date . ' ' . $time24);
            
            // Check if this slot is within any blocked time
            $isBlocked = false;
            foreach ($blockedTimes as $blockedTime) {
                $blockedStart = Carbon::parse($date . ' ' . $blockedTime->start_time);
                $blockedEnd = Carbon::parse($date . ' ' . $blockedTime->end_time);
                
                // Check if slot overlaps with blocked time
                // Slot is blocked if it starts within the blocked time range
                if ($slotTime->gte($blockedStart) && $slotTime->lt($blockedEnd)) {
                    $isBlocked = true;
                    break;
                }
            }
            
            if ($isBlocked) {
                continue; // Skip blocked slots
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

            if (!$isConflicting) {
                $availableSlots[] = $slot;
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'barber' => [
                    'id' => $barber->id,
                    'name' => $barber->name,
                    'avatar' => $barber->profile_photo ? asset('storage/' . $barber->profile_photo) : null,
                    'availableSlots' => $availableSlots,
                    'isFull' => empty($availableSlots)
                ]
            ]
        ]);
    }

    /**
     * Format appointment for API response
     */
    private function formatAppointment($appointment)
    {
        $date = Carbon::parse($appointment->appointment_date);
        
        // Parse appointment_time correctly - it's stored as TIME (HH:MM:SS)
        // Get raw time value from database (bypassing model casts)
        $timeString = null;
        
        // First, try to get from the raw time value we injected (direct from DB)
        if (isset($appointment->time_raw) && !empty($appointment->time_raw)) {
            $timeString = $appointment->time_raw;
            Log::debug('Using time_raw for appointment', [
                'appointment_id' => $appointment->id,
                'time_raw' => $timeString
            ]);
        }
        
        // If not available, get from raw attributes
        if (empty($timeString)) {
            $attributes = $appointment->getAttributes();
            $timeString = $attributes['appointment_time'] ?? null;
            if ($timeString) {
                Log::debug('Using attributes for appointment', [
                    'appointment_id' => $appointment->id,
                    'time_from_attributes' => $timeString
                ]);
            }
        }
        
        // If still empty, try getRawOriginal
        if (empty($timeString) && method_exists($appointment, 'getRawOriginal')) {
            try {
                $timeString = $appointment->getRawOriginal('appointment_time');
                if ($timeString) {
                    Log::debug('Using getRawOriginal for appointment', [
                        'appointment_id' => $appointment->id,
                        'time_from_raw_original' => $timeString
                    ]);
                }
            } catch (\Exception $e) {
                // Continue
            }
        }
        
        // Last resort: use the attribute (might be cast)
        if (empty($timeString)) {
            $timeObj = $appointment->appointment_time;
            if (is_string($timeObj)) {
                $timeString = $timeObj;
            } elseif ($timeObj instanceof \DateTime || $timeObj instanceof \Carbon\Carbon) {
                $timeString = $timeObj->format('H:i:s');
            }
            if ($timeString) {
                Log::debug('Using attribute for appointment', [
                    'appointment_id' => $appointment->id,
                    'time_from_attribute' => $timeString
                ]);
            }
        }
        
        // Ensure it's a string and clean it up
        if (empty($timeString)) {
            $timeString = '00:00:00';
            Log::warning('No time found for appointment, using default', [
                'appointment_id' => $appointment->id
            ]);
        } else {
            $timeString = trim((string)$timeString);
            // Remove any date part if present
            if (strpos($timeString, ' ') !== false) {
                $parts = explode(' ', $timeString);
                $timeString = end($parts);
            }
            
            // Ensure format is HH:MM:SS
            $parts = explode(':', $timeString);
            if (count($parts) === 2) {
                $timeString = $timeString . ':00';
            } elseif (count($parts) === 1 && strlen($parts[0]) > 0) {
                $timeString = str_pad($parts[0], 2, '0', STR_PAD_LEFT) . ':00:00';
            }
        }
        
        // Parse time correctly by combining with date
        // IMPORTANT: Format date as Y-m-d only (no time) to avoid "Double time specification" error
        try {
            // Get date as Y-m-d string (no time component)
            if ($appointment->appointment_date instanceof \Carbon\Carbon) {
                $dateString = $appointment->appointment_date->format('Y-m-d');
            } elseif (is_string($appointment->appointment_date)) {
                // If it's already a string, extract just the date part
                $dateString = explode(' ', $appointment->appointment_date)[0];
            } else {
                $dateString = (string)$appointment->appointment_date;
            }
            
            // Parse the combined date and time
            $dateTime = Carbon::createFromFormat('Y-m-d H:i:s', $dateString . ' ' . $timeString);
            $time = $dateTime;
        } catch (\Exception $e) {
            // Fallback: try alternative parsing method
            try {
                $dateString = $appointment->appointment_date instanceof \Carbon\Carbon 
                    ? $appointment->appointment_date->format('Y-m-d')
                    : (string)$appointment->appointment_date;
                $dateTime = Carbon::parse($dateString . ' ' . $timeString);
                $time = $dateTime;
            } catch (\Exception $e2) {
                // Final fallback to current time
                $time = Carbon::now();
                Log::error('Failed to parse appointment time', [
                    'appointment_id' => $appointment->id,
                    'time_string' => $timeString,
                    'date_string' => $dateString ?? 'unknown',
                    'error' => $e2->getMessage()
                ]);
            }
        }
        
        $isPast = $date->isPast() || ($date->isToday() && $time->isPast());

        // Get service names
        $serviceNames = $appointment->services->pluck('name_en')->join(', ') ?: 'Service';
        
        // Get initials
        $nameParts = explode(' ', $appointment->full_name);
        $initials = '';
        foreach ($nameParts as $part) {
            if (!empty($part)) {
                $initials .= strtoupper(substr($part, 0, 1));
            }
        }
        if (strlen($initials) > 2) {
            $initials = substr($initials, 0, 2);
        }

        // Get service IDs for multi-select
        $serviceIds = $appointment->services->pluck('id')->toArray();
        
        return [
            'id' => $appointment->id,
            'clientName' => $appointment->full_name,
            'clientInitials' => $initials,
            'clientAvatar' => null,
            'clientType' => 'Client', // Could be enhanced with client history
            'service' => $serviceNames,
            'serviceIds' => $serviceIds, // Array of service IDs for multi-select
            'services' => $appointment->services->map(function($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name_en,
                    'name_en' => $service->name_en,
                    'name_ar' => $service->name_ar,
                    'price' => $service->price,
                    'discount_percentage' => $service->discount_percentage ?? 0,
                    'duration' => $service->duration ?? 30
                ];
            })->toArray(), // Array of service objects
            'barberName' => $appointment->barber->name ?? 'Barber',
            'dateTime' => $date->format('M d') . ', ' . $time->format('h:i A'),
            'notes' => $appointment->notes,
            'status' => $appointment->status,
            'isVIP' => false, // Could be enhanced
            'isPast' => $isPast,
            'date' => $appointment->appointment_date->format('Y-m-d'),
            'time' => $time->format('H:i'),
            'phone' => $appointment->phone,
            'email' => $appointment->email,
        ];
    }

    /**
     * Generate time slots from start to end time
     */
    private function generateTimeSlots($start, $end)
    {
        $slots = [];
        
        $startTime = Carbon::parse($start);
        $endTime = Carbon::parse($end);
        
        if ($endTime->lt($startTime)) {
            $endTime->addDay();
        }
        
        $durationMinutes = $startTime->diffInMinutes($endTime);
        
        if ($durationMinutes < 15) {
            return $slots;
        }
        
        if ($durationMinutes < 30) {
            $roundedStartTime = $startTime->copy()->minute(round($startTime->minute / 30) * 30);
            if ($roundedStartTime->gte($startTime) && $roundedStartTime->lt($endTime)) {
                $slots[] = $roundedStartTime->format('h:i A');
            }
            return $slots;
        }
        
        $startMinute = floor($startTime->minute / 30) * 30;
        $currentTime = $startTime->copy()->minute($startMinute)->second(0);

        if ($currentTime->lt($startTime) && $currentTime->addMinutes(30)->lte($endTime)) {
            $currentTime = $startTime->copy()->minute(ceil($startTime->minute / 30) * 30)->second(0);
        } else if ($currentTime->lt($startTime)) {
            $currentTime = $startTime->copy();
        }
        
        while ($currentTime->lt($endTime)) {
            $slots[] = $currentTime->format('h:i A');
            $currentTime->addMinutes(30);
        }

        return $slots;
    }

    /**
     * Convert 12-hour time to 24-hour format
     */
    private function convertTo24Hour($time12)
    {
        return Carbon::createFromFormat('h:i A', $time12)->format('H:i');
    }
}


<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\BarberAvailability;
use App\Models\BlockedTime;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Get all appointments (admin)
     */
    public function index(Request $request)
    {
        $query = Appointment::with(['services', 'barber'])
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

        // Barber filter
        if ($request->has('barber') && $request->barber) {
            $query->where('barber_id', $request->barber);
        }

        // Date filter
        if ($request->has('date') && !empty($request->date)) {
            $query->where('appointment_date', $request->date);
        }

        // Status filter
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $appointments = $query->paginate($perPage);

        // Format appointments
        $formattedAppointments = $appointments->map(function ($appointment) {
            return $this->formatAppointment($appointment);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedAppointments,
            'current_page' => $appointments->currentPage(),
            'last_page' => $appointments->lastPage(),
            'total' => $appointments->total(),
            'per_page' => $appointments->perPage(),
            'total_pages' => $appointments->lastPage(),
            'total_items' => $appointments->total()
        ]);
    }

    /**
     * Format appointment for response
     */
    private function formatAppointment($appointment)
    {
        $time = $appointment->getRawOriginal('appointment_time');
        $timeFormatted = $time ? Carbon::parse($time)->format('h:i A') : '';
        $dateTime = $appointment->appointment_date 
            ? Carbon::parse($appointment->appointment_date)->format('M d, Y') . ', ' . $timeFormatted
            : '';

        $serviceNames = $appointment->services->pluck('name_en')->toArray();
        $serviceName = implode(', ', $serviceNames) ?: 'Service';

        return [
            'id' => $appointment->id,
            'clientName' => $appointment->full_name,
            'clientInitials' => $this->getInitials($appointment->full_name),
            'clientAvatar' => null,
            'clientType' => 'Client',
            'service' => $serviceName,
            'barberName' => $appointment->barber ? $appointment->barber->name : 'Any Barber',
            'barberId' => $appointment->barber_id, // Added barber ID for edit modal
            'dateTime' => $dateTime,
            'notes' => $appointment->notes ?? '',
            'status' => $appointment->status,
            'isPast' => $appointment->appointment_date && Carbon::parse($appointment->appointment_date)->isPast(),
            'phone' => $appointment->phone,
            'email' => $appointment->email,
            'serviceIds' => $appointment->services->pluck('id')->toArray(),
            'services' => $appointment->services->map(function($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name_en,
                    'price' => $service->price,
                    'duration' => $service->duration,
                    'discount_percentage' => $service->discount_percentage
                ];
            })->toArray(),
            'date' => $appointment->appointment_date,
            'time' => $time ? Carbon::parse($time)->format('H:i') : ''
        ];
    }

    /**
     * Get initials from name
     */
    private function getInitials($name)
    {
        $parts = explode(' ', trim($name));
        if (count($parts) >= 2) {
            return strtoupper(substr($parts[0], 0, 1) . substr($parts[count($parts) - 1], 0, 1));
        }
        return strtoupper(substr($name, 0, 2));
    }

    /**
     * Get today's available time slots for all barbers
     */
    public function getTodayAvailableSlots(Request $request)
    {
        $today = Carbon::today()->format('Y-m-d');
        $dayName = strtolower(Carbon::today()->format('l')); // monday, tuesday, etc.

        // Get all active barbers
        $barbers = User::where('role', 'barber')
            ->where('status', 'active')
            ->get();

        $barbersData = [];

        foreach ($barbers as $barber) {
            // Get barber availability
            $availability = BarberAvailability::where('user_id', $barber->id)->first();

            if (!$availability || !$availability->availability_data) {
                // Barber has no availability configured
                continue;
            }

            $availabilityData = $availability->availability_data ?? [];

            // Find the specific day in availability
            $dayAvailability = collect($availabilityData)->firstWhere('day', $dayName);

            // Check if day exists and is enabled
            $isDayEnabled = $dayAvailability && 
                           isset($dayAvailability['enabled']) && 
                           ($dayAvailability['enabled'] === true || $dayAvailability['enabled'] === 1);

            // Check if day has valid slots
            $hasValidSlots = $dayAvailability && 
                            isset($dayAvailability['slots']) &&
                            is_array($dayAvailability['slots']) &&
                            count($dayAvailability['slots']) > 0;

            if (!$isDayEnabled || !$hasValidSlots) {
                // Barber is not available today
                continue;
            }

            // Generate time slots from availability
            $allSlots = [];
            foreach ($dayAvailability['slots'] as $slot) {
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

            // Get booked appointments for today
            $bookedAppointments = Appointment::where('barber_id', $barber->id)
                ->where('appointment_date', $today)
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->with('services')
                ->get();

            // Get blocked times
            $blockedTimes = BlockedTime::where('user_id', $barber->id)
                ->where('blocked_date', $today)
                ->get();

            // Calculate booked time ranges
            $bookedTimeRanges = [];
            foreach ($bookedAppointments as $appointment) {
                $totalDuration = 0;
                if ($appointment->services && $appointment->services->count() > 0) {
                    foreach ($appointment->services as $service) {
                        $totalDuration += $service->duration ?? 30;
                    }
                } else {
                    $totalDuration = 30;
                }

                $appointmentTime = $appointment->getRawOriginal('appointment_time');
                $startTime = Carbon::parse($today . ' ' . $appointmentTime);
                $endTime = $startTime->copy()->addMinutes($totalDuration);

                $bookedTimeRanges[] = [
                    'start' => $startTime,
                    'end' => $endTime
                ];
            }

            // Filter available slots
            $availableSlots = [];
            foreach ($allSlots as $slot) {
                $time24 = $this->convertTo24Hour($slot);
                $slotTime = Carbon::parse($today . ' ' . $time24);

                // Check if blocked
                $isBlocked = false;
                foreach ($blockedTimes as $blockedTime) {
                    $blockedStart = Carbon::parse($today . ' ' . $blockedTime->start_time);
                    $blockedEnd = Carbon::parse($today . ' ' . $blockedTime->end_time);
                    if ($slotTime->gte($blockedStart) && $slotTime->lt($blockedEnd)) {
                        $isBlocked = true;
                        break;
                    }
                }

                if ($isBlocked) {
                    continue;
                }

                // Check if conflicts with existing appointments (using 30 min default duration)
                $isConflicting = false;
                $slotEndTime = $slotTime->copy()->addMinutes(30); // Default 30 min duration

                foreach ($bookedTimeRanges as $range) {
                    if ($slotTime->lt($range['end']) && $slotEndTime->gt($range['start'])) {
                        $isConflicting = true;
                        break;
                    }
                }

                if (!$isConflicting) {
                    $availableSlots[] = $slot;
                }
            }

            // Only include barbers with available slots
            if (!empty($availableSlots)) {
                $barbersData[] = [
                    'id' => $barber->id,
                    'name' => $barber->name,
                    'avatar' => $barber->profile_photo ? asset('storage/' . $barber->profile_photo) : null,
                    'availableSlots' => $availableSlots,
                    'isFull' => empty($availableSlots)
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => $barbersData
        ]);
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
            return $slots;
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

    /**
     * Accept appointment (admin)
     */
    public function accept(Request $request, $id)
    {
        try {
            $appointment = Appointment::findOrFail($id);

            if ($appointment->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending appointments can be accepted'
                ], 400);
            }

            // Ensure the enum includes 'accepted'
            $this->ensureStatusEnumIncludesAccepted();
            
            // Update status to accepted using raw SQL to ensure proper quoting
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
            \Log::error('Error accepting appointment (admin)', [
                'appointment_id' => $id,
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
     * Reject appointment (admin)
     */
    public function reject(Request $request, $id)
    {
        try {
            $appointment = Appointment::findOrFail($id);

            if ($appointment->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending appointments can be rejected'
                ], 400);
            }

            // Ensure the enum includes 'rejected'
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
            \Log::error('Error rejecting appointment (admin)', [
                'appointment_id' => $id,
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
     * Complete appointment (admin)
     */
    public function complete(Request $request, $id)
    {
        try {
            $appointment = Appointment::findOrFail($id);

            if (!in_array($appointment->status, ['pending', 'accepted', 'confirmed'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending, accepted, or confirmed appointments can be completed'
                ], 400);
            }

            // Update status to completed
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
            \Log::error('Error completing appointment (admin)', [
                'appointment_id' => $id,
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
     * Update appointment (admin)
     */
    public function update(Request $request, $id)
    {
        try {
            $appointment = Appointment::findOrFail($id);

            // Custom validation for time format
            $validator = Validator::make($request->all(), [
                'client_name' => 'sometimes|string|max:255',
                'clientName' => 'sometimes|string|max:255', // Also accept camelCase
                'phone' => 'sometimes|string|max:255',
                'services' => 'sometimes|array', // Array of service IDs
                'services.*' => 'sometimes|integer|exists:services,id',
                'barber_id' => 'sometimes|integer|exists:users,id',
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
                \Log::error('Appointment update validation failed (admin)', [
                    'appointment_id' => $id,
                    'request_data' => $request->all(),
                    'validation_errors' => $validator->errors()->toArray()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update appointment fields
            $clientName = $request->input('client_name') ?: $request->input('clientName');
            if ($clientName && !empty($clientName)) {
                $appointment->full_name = $clientName;
            }
            
            if ($request->has('phone')) {
                $appointment->phone = $request->phone ?: null;
            }
            
            if ($request->has('barber_id')) {
                $appointment->barber_id = $request->barber_id;
            }
            
            if ($request->has('date') && !empty($request->date)) {
                $appointment->appointment_date = $request->date;
            }
            
            if ($request->has('time') && !empty($request->time)) {
                $time = $request->time;
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

            // Handle services update
            if ($request->has('services') && is_array($request->services)) {
                $serviceIds = array_filter(array_map('intval', $request->services));
                if (!empty($serviceIds)) {
                    $appointment->services()->sync($serviceIds);
                }
            }

            $appointment->save();
            $appointment->load(['services', 'barber']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment updated successfully',
                'data' => $this->formatAppointment($appointment)
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating appointment (admin)', [
                'appointment_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update appointment: ' . $e->getMessage()
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
                    
                    // If enum doesn't include 'accepted' or 'rejected', update it
                    if (strpos(strtolower($type), 'accepted') === false || strpos(strtolower($type), 'rejected') === false) {
                        try {
                            DB::statement("ALTER TABLE `appointments` MODIFY COLUMN `status` ENUM('pending', 'accepted', 'rejected', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending'");
                        } catch (\Exception $alterException) {
                            \Log::error('Failed to alter status enum (admin)', [
                                'error' => $alterException->getMessage()
                            ]);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Could not verify/fix status enum (admin)', [
                'error' => $e->getMessage()
            ]);
        }
    }
}


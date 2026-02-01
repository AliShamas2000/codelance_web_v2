<?php

namespace App\Http\Controllers\Api\Barber;

use App\Http\Controllers\Controller;
use App\Models\BarberAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvailabilityController extends Controller
{
    /**
     * Get the authenticated barber's availability.
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'barber') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // Get or create availability for this barber
        $availability = BarberAvailability::firstOrCreate(
            ['user_id' => $user->id],
            [
                'timezone' => 'Asia/Beirut',
                'timezone_label' => 'Lebanon (Beirut)',
                'availability_data' => $this->getDefaultAvailabilityData()
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $this->formatAvailability($availability)
        ]);
    }

    /**
     * Update the authenticated barber's availability.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'barber') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // Get raw input data
        $inputData = $request->all();
        
        // LOG RAW INPUT
        \Log::info('=== AVAILABILITY UPDATE - RAW INPUT ===');
        \Log::info('Raw input data', ['data' => $inputData]);
        \Log::info('Days count', ['count' => isset($inputData['days']) ? count($inputData['days']) : 0]);
        
        if (isset($inputData['days']) && is_array($inputData['days'])) {
            foreach ($inputData['days'] as $index => $day) {
                \Log::info("RAW Day {$index}", [
                    'day' => $day['day'] ?? 'MISSING',
                    'label' => $day['label'] ?? 'MISSING',
                    'enabled' => $day['enabled'] ?? 'MISSING',
                    'has_slots' => isset($day['slots']),
                    'slots_type' => isset($day['slots']) ? gettype($day['slots']) : 'NOT SET',
                    'slots_value' => $day['slots'] ?? 'NOT SET',
                    'slots_is_array' => isset($day['slots']) ? is_array($day['slots']) : false,
                ]);
            }
        }
        
        // COMPLETELY NORMALIZE DATA BEFORE ANY VALIDATION
        $normalizedData = [
            'timezone' => $inputData['timezone'] ?? null,
            'timezoneLabel' => $inputData['timezoneLabel'] ?? $inputData['timezone_label'] ?? null,
            'days' => []
        ];
        
        // Process and normalize each day
        if (isset($inputData['days']) && is_array($inputData['days'])) {
            foreach ($inputData['days'] as $index => $day) {
                // Ensure slots is ALWAYS an array - handle all possible cases
                $slots = [];
                if (isset($day['slots'])) {
                    if (is_array($day['slots'])) {
                        $slots = $day['slots'];
                    } else {
                        $slots = [];
                    }
                }
                
                // If day is disabled, force empty slots
                $enabled = isset($day['enabled']) ? (bool)$day['enabled'] : true;
                if (!$enabled) {
                    $slots = [];
                }
                
                // Build normalized day
                $normalizedDay = [
                    'day' => $day['day'] ?? '',
                    'label' => $day['label'] ?? '',
                    'enabled' => $enabled,
                    'slots' => $slots // ALWAYS an array, never null or missing
                ];
                
                \Log::info("NORMALIZED Day {$index}", [
                    'day' => $normalizedDay['day'],
                    'label' => $normalizedDay['label'],
                    'enabled' => $normalizedDay['enabled'],
                    'slots' => $normalizedDay['slots'],
                    'slots_is_array' => is_array($normalizedDay['slots']),
                    'slots_count' => count($normalizedDay['slots']),
                ]);
                
                $normalizedData['days'][] = $normalizedDay;
            }
        }
        
        \Log::info('=== NORMALIZED DATA BEFORE VALIDATION ===');
        \Log::info('Normalized data', ['data' => $normalizedData]);
        
        // MANUAL VALIDATION - Don't rely on request->replace() which might not work with nested arrays
        \Log::info('=== MANUAL VALIDATION ===');
        
        // Validate structure manually
        $errors = [];
        
        if (empty($normalizedData['days']) || !is_array($normalizedData['days'])) {
            $errors['days'] = ['The days field is required.'];
        } else {
            foreach ($normalizedData['days'] as $index => $day) {
                if (empty($day['day'])) {
                    $errors["days.{$index}.day"] = ['The day field is required.'];
                }
                if (empty($day['label'])) {
                    $errors["days.{$index}.label"] = ['The label field is required.'];
                }
                if (!isset($day['enabled']) || !is_bool($day['enabled'])) {
                    $errors["days.{$index}.enabled"] = ['The enabled field must be a boolean.'];
                }
                
                // CRITICAL: Check slots
                if (!isset($day['slots'])) {
                    \Log::error("Day {$index} ({$day['day']}) MISSING slots property!");
                    $errors["days.{$index}.slots"] = ['The slots field is required.'];
                } elseif (!is_array($day['slots'])) {
                    \Log::error("Day {$index} ({$day['day']}) slots is NOT an array", ['type' => gettype($day['slots'])]);
                    $errors["days.{$index}.slots"] = ['The slots field must be an array.'];
                } else {
                    // Validate slots content if array is not empty
                    foreach ($day['slots'] as $slotIndex => $slot) {
                        if (empty($slot['start'])) {
                            $errors["days.{$index}.slots.{$slotIndex}.start"] = ['The start field is required.'];
                        }
                        if (empty($slot['end'])) {
                            $errors["days.{$index}.slots.{$slotIndex}.end"] = ['The end field is required.'];
                        }
                    }
                }
            }
        }
        
        if (!empty($errors)) {
            \Log::error('=== VALIDATION FAILED (MANUAL) ===');
            \Log::error('Errors', ['errors' => $errors]);
            \Log::error('Normalized data', ['data' => $normalizedData]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors
            ], 422);
        }
        
        \Log::info('=== VALIDATION PASSED (MANUAL) ===');
        
        // Use normalized data as validated data
        $validated = $normalizedData;

        // Get or create availability
        $availability = BarberAvailability::firstOrCreate(
            ['user_id' => $user->id],
            [
                'timezone' => 'Asia/Beirut',
                'timezone_label' => 'Lebanon (Beirut)',
                'availability_data' => $this->getDefaultAvailabilityData()
            ]
        );

        // Always force timezone to Beirut
        $availability->timezone = 'Asia/Beirut';
        $availability->timezone_label = 'Lebanon (Beirut)';
        
        // Store days array in availability_data
        $availability->availability_data = $validated['days'];
        $availability->save();

        return response()->json([
            'success' => true,
            'message' => 'Availability updated successfully',
            'data' => $this->formatAvailability($availability)
        ]);
    }

    /**
     * Format availability data for API response.
     */
    private function formatAvailability(BarberAvailability $availability)
    {
        // Always return Beirut timezone, regardless of what's stored
        return [
            'timezone' => 'Asia/Beirut',
            'timezoneLabel' => 'Lebanon (Beirut)',
            'timezone_label' => 'Lebanon (Beirut)',
            'days' => $availability->availability_data ?? [],
        ];
    }

    /**
     * Block time for the authenticated barber.
     */
    public function blockTime(Request $request)
    {
        $user = $request->user();
        
        if (!$user || $user->role !== 'barber') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $validator = \Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today',
            'startTime' => 'required|date_format:H:i',
            'endTime' => 'required|date_format:H:i|after:startTime',
            'reason' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $blockedTime = \App\Models\BlockedTime::create([
                'user_id' => $user->id,
                'blocked_date' => $request->date,
                'start_time' => $request->startTime,
                'end_time' => $request->endTime,
                'reason' => $request->reason
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Time blocked successfully',
                'data' => [
                    'id' => $blockedTime->id,
                    'date' => $blockedTime->blocked_date->format('Y-m-d'),
                    'startTime' => $blockedTime->start_time,
                    'endTime' => $blockedTime->end_time,
                    'reason' => $blockedTime->reason
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error blocking time: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to block time',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get default availability data structure.
     */
    private function getDefaultAvailabilityData()
    {
        return [
            [
                'day' => 'monday',
                'label' => 'Monday',
                'enabled' => true,
                'slots' => [['start' => '09:00', 'end' => '17:00']]
            ],
            [
                'day' => 'tuesday',
                'label' => 'Tuesday',
                'enabled' => true,
                'slots' => [
                    ['start' => '09:00', 'end' => '13:00'],
                    ['start' => '14:00', 'end' => '18:00']
                ]
            ],
            [
                'day' => 'wednesday',
                'label' => 'Wednesday',
                'enabled' => true,
                'slots' => [['start' => '09:00', 'end' => '17:00']]
            ],
            [
                'day' => 'thursday',
                'label' => 'Thursday',
                'enabled' => true,
                'slots' => [['start' => '10:00', 'end' => '19:00']]
            ],
            [
                'day' => 'friday',
                'label' => 'Friday',
                'enabled' => true,
                'slots' => [['start' => '10:00', 'end' => '19:00']]
            ],
            [
                'day' => 'saturday',
                'label' => 'Saturday',
                'enabled' => true,
                'slots' => [['start' => '09:00', 'end' => '14:00']]
            ],
            [
                'day' => 'sunday',
                'label' => 'Sunday',
                'enabled' => false,
                'slots' => []
            ]
        ];
    }
}

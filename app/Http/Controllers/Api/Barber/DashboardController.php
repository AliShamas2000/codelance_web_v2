<?php

namespace App\Http\Controllers\Api\Barber;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\BarberAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard data for barber
     */
    public function index(Request $request)
    {
        try {
            $barber = $request->user();
            
            // Get current week start and end
            $now = Carbon::now();
            $weekStart = $now->copy()->startOfWeek();
            $weekEnd = $now->copy()->endOfWeek();
            
            // Get today's date
            $today = $now->copy()->startOfDay();
            $tomorrow = $today->copy()->addDay();
            
            // Stats: Appointments this week
            $appointmentsThisWeek = Appointment::where('barber_id', $barber->id)
                ->whereBetween('appointment_date', [$weekStart->format('Y-m-d'), $weekEnd->format('Y-m-d')])
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->count();
            
            // Stats: Estimated Earnings (sum of completed appointments this week with discounts)
            $estimatedEarnings = 0;
            $completedAppointmentsThisWeek = Appointment::where('barber_id', $barber->id)
                ->whereBetween('appointment_date', [$weekStart->format('Y-m-d'), $weekEnd->format('Y-m-d')])
                ->where('status', 'completed')
                ->with('services')
                ->get();
            
            foreach ($completedAppointmentsThisWeek as $appointment) {
                if ($appointment->services && $appointment->services->count() > 0) {
                    foreach ($appointment->services as $service) {
                        $price = (float)($service->price ?? 0);
                        $discount = (float)($service->discount_percentage ?? 0);
                        $discountedPrice = $price * (1 - $discount / 100);
                        $estimatedEarnings += $discountedPrice;
                    }
                }
            }
            
            // Stats: New Clients (clients who had their first appointment in the last 7 days)
            $sevenDaysAgo = $now->copy()->subDays(7);
            $allClientNames = Appointment::where('barber_id', $barber->id)
                ->where('appointment_date', '>=', $sevenDaysAgo->format('Y-m-d'))
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->distinct()
                ->pluck('full_name')
                ->toArray();
            
            $newClients = 0;
            foreach ($allClientNames as $clientName) {
                // Check if this is their first appointment ever
                $firstAppointment = Appointment::where('barber_id', $barber->id)
                    ->where('full_name', $clientName)
                    ->whereNotIn('status', ['cancelled', 'rejected'])
                    ->orderBy('appointment_date', 'asc')
                    ->orderBy('appointment_time', 'asc')
                    ->first();
                
                if ($firstAppointment && $firstAppointment->appointment_date >= $sevenDaysAgo->format('Y-m-d')) {
                    $newClients++;
                }
            }
            
            // Get raw time values from database for upcoming appointments
            $upcomingAppointmentsQuery = Appointment::where('barber_id', $barber->id)
                ->where(function($query) use ($today, $tomorrow) {
                    $query->where('appointment_date', '>=', $today->format('Y-m-d'))
                        ->where(function($q) use ($today) {
                            $q->where('appointment_date', '>', $today->format('Y-m-d'))
                              ->orWhere(function($subQ) use ($today) {
                                  $subQ->where('appointment_date', '=', $today->format('Y-m-d'))
                                       ->whereRaw('TIME(appointment_time) >= TIME(?)', [Carbon::now()->format('H:i:s')]);
                              });
                        });
                })
                ->whereIn('status', ['pending', 'accepted', 'confirmed'])
                ->with('services')
                ->orderBy('appointment_date', 'asc')
                ->orderBy('appointment_time', 'asc')
                ->limit(10);
            
            $upcomingAppointments = $upcomingAppointmentsQuery->get();
            $upcomingAppointmentIds = $upcomingAppointments->pluck('id')->toArray();
            $rawTimes = DB::table('appointments')
                ->whereIn('id', $upcomingAppointmentIds)
                ->pluck('appointment_time', 'id')
                ->toArray();
            
            // Format upcoming appointments
            $formattedUpcoming = [];
            foreach ($upcomingAppointments as $appointment) {
                if (isset($rawTimes[$appointment->id])) {
                    $appointment->time_raw = $rawTimes[$appointment->id];
                }
                
                $date = Carbon::parse($appointment->appointment_date);
                $timeString = $appointment->time_raw ?? $appointment->appointment_time ?? '00:00:00';
                $timeParts = explode(':', $timeString);
                $hours = isset($timeParts[0]) ? (int)$timeParts[0] : 0;
                $minutes = isset($timeParts[1]) ? (int)$timeParts[1] : 0;
                $time = Carbon::createFromTime($hours, $minutes);
                
                // Determine date label
                $dateLabel = 'Today';
                if ($date->isTomorrow()) {
                    $dateLabel = 'Tomorrow';
                } elseif ($date->gt($tomorrow)) {
                    $dateLabel = $date->format('M d');
                }
                
                // Get service names
                $serviceNames = [];
                if ($appointment->services && $appointment->services->count() > 0) {
                    foreach ($appointment->services as $service) {
                        $serviceNames[] = $service->name_en ?? $service->name ?? 'Service';
                    }
                }
                $serviceName = implode(', ', $serviceNames) ?: 'Service';
                
                // Calculate time until appointment
                $appointmentDateTime = $date->copy()->setTime($hours, $minutes);
                $timeUntil = '';
                if ($appointmentDateTime->isToday()) {
                    $diff = $now->diffInMinutes($appointmentDateTime);
                    if ($diff < 60) {
                        // Round down to whole minutes (no decimals)
                        $timeUntil = floor($diff) . ' mins';
                    } else {
                        // Calculate hours and remaining minutes (both whole numbers)
                        $hoursUntil = floor($diff / 60);
                        $minsUntil = floor($diff % 60);
                        if ($minsUntil > 0) {
                            $timeUntil = $hoursUntil . 'h ' . $minsUntil . 'm';
                        } else {
                            // If exactly on the hour, show only hours
                            $timeUntil = $hoursUntil . 'h';
                        }
                    }
                }
                
                // Get visit count for this client
                $visitCount = Appointment::where('barber_id', $barber->id)
                    ->where('full_name', $appointment->full_name)
                    ->whereNotIn('status', ['cancelled', 'rejected'])
                    ->count();
                
                $formattedUpcoming[] = [
                    'id' => $appointment->id,
                    'clientName' => $appointment->full_name,
                    'clientAvatar' => null, // Can be enhanced later
                    'visitCount' => $visitCount,
                    'service' => $serviceName,
                    'serviceName' => $serviceName, // Alias for compatibility
                    'duration' => $this->calculateTotalDuration($appointment->services),
                    'timeUntil' => $timeUntil,
                    'date' => $dateLabel,
                    'time' => $time->format('h:i A'),
                    'status' => $appointment->status,
                    'appointmentDate' => $date->format('Y-m-d'),
                    'appointmentTime' => $time->format('H:i')
                ];
            }
            
            // Get next appointment (first upcoming)
            $upNext = !empty($formattedUpcoming) ? $formattedUpcoming[0] : null;
            
            // Get activity history (last 10 completed/cancelled appointments)
            $activityHistoryQuery = Appointment::where('barber_id', $barber->id)
                ->whereIn('status', ['completed', 'cancelled'])
                ->with('services')
                ->orderBy('appointment_date', 'desc')
                ->orderBy('appointment_time', 'desc')
                ->limit(10);
            
            $activityHistory = $activityHistoryQuery->get();
            $activityIds = $activityHistory->pluck('id')->toArray();
            $activityRawTimes = DB::table('appointments')
                ->whereIn('id', $activityIds)
                ->pluck('appointment_time', 'id')
                ->toArray();
            
            // Format activity history
            $formattedActivity = [];
            foreach ($activityHistory as $appointment) {
                if (isset($activityRawTimes[$appointment->id])) {
                    $appointment->time_raw = $activityRawTimes[$appointment->id];
                }
                
                $date = Carbon::parse($appointment->appointment_date);
                $timeString = $appointment->time_raw ?? $appointment->appointment_time ?? '00:00:00';
                $timeParts = explode(':', $timeString);
                $hours = isset($timeParts[0]) ? (int)$timeParts[0] : 0;
                $minutes = isset($timeParts[1]) ? (int)$timeParts[1] : 0;
                $time = Carbon::createFromTime($hours, $minutes);
                
                // Get service names
                $serviceNames = [];
                $totalAmount = 0;
                if ($appointment->services && $appointment->services->count() > 0) {
                    foreach ($appointment->services as $service) {
                        $serviceNames[] = $service->name_en ?? $service->name ?? 'Service';
                        $price = (float)($service->price ?? 0);
                        $discount = (float)($service->discount_percentage ?? 0);
                        $discountedPrice = $price * (1 - $discount / 100);
                        $totalAmount += $discountedPrice;
                    }
                }
                $serviceName = implode(', ', $serviceNames) ?: 'Service';
                $totalDuration = $this->calculateTotalDuration($appointment->services);
                
                $formattedActivity[] = [
                    'id' => 'ACT-' . $appointment->id,
                    'type' => $appointment->status === 'completed' ? 'completed' : 'cancelled',
                    'title' => $appointment->status === 'completed' 
                        ? 'Finished appointment with ' . $appointment->full_name
                        : 'Cancellation by ' . $appointment->full_name,
                    'description' => $serviceName . ' • ' . $totalDuration,
                    'amount' => $appointment->status === 'completed' ? round($totalAmount, 2) : null,
                    'date' => $date->format('M d, h:i A'),
                    'status' => $appointment->status
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => [
                        'appointmentsThisWeek' => $appointmentsThisWeek,
                        'estimatedEarnings' => round($estimatedEarnings, 2),
                        'averageRating' => 4.9, // Can be calculated from reviews later
                        'totalReviews' => 0, // Can be calculated from reviews later
                        'newClients' => $newClients
                    ],
                    'upNext' => $upNext,
                    'upcomingAppointments' => array_slice($formattedUpcoming, 1), // Skip first one (it's in upNext)
                    'activityHistory' => $formattedActivity,
                    'todaySchedule' => $this->getTodaySchedule($barber->id, $now)
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching barber dashboard: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Calculate total duration from services
     */
    private function calculateTotalDuration($services)
    {
        if (!$services || $services->count() === 0) {
            return '30m';
        }
        
        $totalMinutes = 0;
        foreach ($services as $service) {
            $totalMinutes += $service->duration ?? 30;
        }
        
        if ($totalMinutes < 60) {
            return $totalMinutes . 'm';
        } else {
            $hours = floor($totalMinutes / 60);
            $minutes = $totalMinutes % 60;
            return $hours . 'h' . ($minutes > 0 ? ' ' . $minutes . 'm' : '');
        }
    }
    
    /**
     * Get today's schedule with time slots and their status
     */
    private function getTodaySchedule($barberId, $now)
    {
        $today = $now->copy()->startOfDay();
        $todayString = $today->format('Y-m-d');
        $dayName = strtolower($now->format('l')); // monday, tuesday, etc.
        
        // Get barber availability
        $availability = BarberAvailability::where('user_id', $barberId)->first();
        
        if (!$availability || !$availability->availability_data) {
            return [
                'date' => $now->format('M d, Y'),
                'openSlots' => 0,
                'slots' => []
            ];
        }
        
        $availabilityData = $availability->availability_data;
        $dayAvailability = collect($availabilityData)->firstWhere('day', $dayName);
        
        if (!$dayAvailability || !($dayAvailability['enabled'] ?? false) || empty($dayAvailability['slots'] ?? [])) {
            return [
                'date' => $now->format('M d, Y'),
                'openSlots' => 0,
                'slots' => []
            ];
        }
        
        // Generate all time slots for today
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
        $bookedAppointments = Appointment::where('barber_id', $barberId)
            ->where('appointment_date', $todayString)
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->with('services')
            ->get();
        
        // Get raw time values
        $appointmentIds = $bookedAppointments->pluck('id')->toArray();
        $rawTimes = DB::table('appointments')
            ->whereIn('id', $appointmentIds)
            ->pluck('appointment_time', 'id')
            ->toArray();
        
        // Calculate booked time ranges
        $bookedTimeRanges = [];
        foreach ($bookedAppointments as $appointment) {
            if (isset($rawTimes[$appointment->id])) {
                $appointment->time_raw = $rawTimes[$appointment->id];
            }
            
            $totalDuration = 0;
            if ($appointment->services && $appointment->services->count() > 0) {
                foreach ($appointment->services as $service) {
                    $totalDuration += $service->duration ?? 30;
                }
            } else {
                $totalDuration = 30;
            }
            
            $timeString = $appointment->time_raw ?? $appointment->appointment_time ?? '00:00:00';
            $timeParts = explode(':', $timeString);
            $hours = isset($timeParts[0]) ? (int)$timeParts[0] : 0;
            $minutes = isset($timeParts[1]) ? (int)$timeParts[1] : 0;
            
            $startTime = $today->copy()->setTime($hours, $minutes);
            $endTime = $startTime->copy()->addMinutes($totalDuration);
            
            $bookedTimeRanges[] = [
                'start' => $startTime,
                'end' => $endTime,
                'client' => $appointment->full_name
            ];
        }
        
        // Format slots with status
        $formattedSlots = [];
        $openSlotsCount = 0;
        
        foreach ($allSlots as $slot) {
            $time24 = $this->convertTo24Hour($slot);
            $timeParts = explode(':', $time24);
            $hours = isset($timeParts[0]) ? (int)$timeParts[0] : 0;
            $minutes = isset($timeParts[1]) ? (int)$timeParts[1] : 0;
            $slotTime = $today->copy()->setTime($hours, $minutes);
            
            // Check if this slot is booked
            $isBooked = false;
            $clientName = null;
            
            foreach ($bookedTimeRanges as $range) {
                if ($slotTime->gte($range['start']) && $slotTime->lt($range['end'])) {
                    $isBooked = true;
                    $clientName = $range['client'];
                    break;
                }
            }
            
            // Check if slot is in the past
            $isPast = $slotTime->lt($now);
            
            $status = 'available';
            if ($isPast) {
                $status = 'occupied';
            } elseif ($isBooked) {
                $status = 'booked';
            } else {
                $openSlotsCount++;
            }
            
            $formattedSlots[] = [
                'time' => $slotTime->format('h:i A'),
                'status' => $status,
                'client' => $clientName
            ];
        }
        
        return [
            'date' => $now->format('M d, Y'),
            'openSlots' => $openSlotsCount,
            'slots' => $formattedSlots
        ];
    }
    
    /**
     * Generate time slots between start and end time (30-minute intervals)
     */
    private function generateTimeSlots($start, $end)
    {
        $slots = [];
        
        $startTime = Carbon::parse($start);
        $endTime = Carbon::parse($end);
        
        if ($endTime->lt($startTime)) {
            $endTime->addDay();
        }
        
        $current = $startTime->copy();
        
        while ($current->lt($endTime)) {
            $slots[] = $current->format('h:i A');
            $current->addMinutes(30);
        }
        
        return $slots;
    }
    
    /**
     * Convert 12-hour time to 24-hour format
     */
    private function convertTo24Hour($time12)
    {
        $time12 = trim($time12);
        
        // If already in 24-hour format, return as is
        if (preg_match('/^(\d{1,2}):(\d{2})$/', $time12, $matches)) {
            $hours = (int)$matches[1];
            if ($hours >= 0 && $hours <= 23) {
                return sprintf('%02d:%02d', $hours, (int)$matches[2]);
            }
        }
        
        // Parse 12-hour format
        if (preg_match('/(\d{1,2}):(\d{2})\s*(AM|PM)/i', $time12, $matches)) {
            $hours = (int)$matches[1];
            $minutes = (int)$matches[2];
            $period = strtoupper($matches[3]);
            
            if ($period === 'PM' && $hours !== 12) {
                $hours += 12;
            } elseif ($period === 'AM' && $hours === 12) {
                $hours = 0;
            }
            
            return sprintf('%02d:%02d', $hours, $minutes);
        }
        
        return '00:00';
    }
}


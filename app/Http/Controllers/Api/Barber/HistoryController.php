<?php

namespace App\Http\Controllers\Api\Barber;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HistoryController extends Controller
{
    /**
     * Export activity history as Excel (CSV format)
     */
    public function export(Request $request)
    {
        try {
            $barber = $request->user();
            
            // Get all completed and cancelled appointments for this barber
            $query = Appointment::where('barber_id', $barber->id)
                ->whereIn('status', ['completed', 'cancelled'])
                ->with(['services', 'barber'])
                ->orderBy('appointment_date', 'desc')
                ->orderBy('appointment_time', 'desc');

            // Apply filters if provided
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by activity type
            if ($request->has('activity_type') && $request->activity_type !== 'all') {
                if ($request->activity_type === 'appointments') {
                    $query->where('status', 'completed');
                } elseif ($request->activity_type === 'cancellations') {
                    $query->where('status', 'cancelled');
                }
            }

            // Filter by time period
            if ($request->has('time_period') && $request->time_period !== 'all_time') {
                $today = Carbon::today();
                
                if ($request->time_period === 'last_30_days') {
                    $startDate = $today->copy()->subDays(30);
                    $endDate = $today->copy()->addDays(30); // Include future dates
                    $query->whereBetween('appointment_date', [$startDate, $endDate]);
                }
            }

            $appointments = $query->get();

            // Get raw time values from database
            $appointmentIds = $appointments->pluck('id')->toArray();
            $rawTimes = DB::table('appointments')
                ->whereIn('id', $appointmentIds)
                ->pluck('appointment_time', 'id')
                ->toArray();

            // Prepare CSV data
            $csvData = [];
            
            // CSV Headers
            $csvData[] = [
                'ID',
                'Client Name',
                'Phone',
                'Services',
                'Date',
                'Time',
                'Duration (Minutes)',
                'Amount ($)',
                'Status',
                'Notes'
            ];

            // Add appointment rows
            foreach ($appointments as $appointment) {
                // Inject raw time value
                if (isset($rawTimes[$appointment->id])) {
                    $appointment->time_raw = $rawTimes[$appointment->id];
                }

                // Parse date
                $date = Carbon::parse($appointment->appointment_date);
                $dateFormatted = $date->format('Y-m-d');

                // Parse time
                $timeString = $appointment->time_raw ?? $appointment->appointment_time ?? '00:00:00';
                $timeParts = explode(':', $timeString);
                $hours = isset($timeParts[0]) ? (int)$timeParts[0] : 0;
                $minutes = isset($timeParts[1]) ? (int)$timeParts[1] : 0;
                
                $timeFormatted = sprintf('%02d:%02d', $hours, $minutes);
                $time12Hour = Carbon::createFromTime($hours, $minutes)->format('h:i A');

                // Get service names and calculate total duration and amount
                $serviceNames = [];
                $totalDuration = 0;
                $totalAmount = 0;
                
                if ($appointment->services && $appointment->services->count() > 0) {
                    foreach ($appointment->services as $service) {
                        $serviceNames[] = $service->name_en ?? $service->name ?? 'Service';
                        $totalDuration += $service->duration ?? 30;
                        
                        $price = (float)($service->price ?? 0);
                        $discount = (float)($service->discount_percentage ?? 0);
                        $discountedPrice = $price * (1 - $discount / 100);
                        $totalAmount += $discountedPrice;
                    }
                } else {
                    $totalDuration = 30;
                }

                $servicesString = implode(', ', $serviceNames) ?: 'Service';
                $amountFormatted = number_format($totalAmount, 2, '.', '');

                // Add row to CSV
                $csvData[] = [
                    $appointment->id,
                    $appointment->full_name,
                    $appointment->phone ?? '',
                    $servicesString,
                    $dateFormatted,
                    $time12Hour,
                    $totalDuration,
                    $amountFormatted,
                    ucfirst($appointment->status),
                    $appointment->notes ?? ''
                ];
            }

            // Generate CSV content
            $filename = 'activity_history_' . Carbon::now()->format('Y-m-d_His') . '.csv';
            
            // Build CSV content
            $csvContent = '';
            
            // Add BOM for Excel UTF-8 support
            $csvContent .= chr(0xEF).chr(0xBB).chr(0xBF);
            
            // Write CSV data
            foreach ($csvData as $row) {
                // Escape and quote fields that contain commas, quotes, or newlines
                $escapedRow = array_map(function($field) {
                    $field = (string)$field;
                    if (strpos($field, ',') !== false || strpos($field, '"') !== false || strpos($field, "\n") !== false) {
                        $field = '"' . str_replace('"', '""', $field) . '"';
                    }
                    return $field;
                }, $row);
                $csvContent .= implode(',', $escapedRow) . "\n";
            }

            // Return CSV file download
            return response($csvContent, 200)
                ->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"')
                ->header('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                ->header('Pragma', 'public');

        } catch (\Exception $e) {
            \Log::error('Error exporting history: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to export history: ' . $e->getMessage()
            ], 500);
        }
    }
}


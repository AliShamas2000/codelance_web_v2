<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard data
     */
    public function index(Request $request)
    {
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

        // Build date range query
        $query = Appointment::query();
        
        if ($fromDate) {
            // Handle both YYYY-MM-DD and d/m/Y formats
            try {
                if (strpos($fromDate, '/') !== false) {
                    $fromDateObj = Carbon::createFromFormat('d/m/Y', $fromDate);
                } else {
                    $fromDateObj = Carbon::createFromFormat('Y-m-d', $fromDate);
                }
                $query->where('appointment_date', '>=', $fromDateObj->format('Y-m-d'));
            } catch (\Exception $e) {
                // If parsing fails, try to use the date as-is
                $query->where('appointment_date', '>=', $fromDate);
            }
        }
        
        if ($toDate) {
            // Handle both YYYY-MM-DD and d/m/Y formats
            try {
                if (strpos($toDate, '/') !== false) {
                    $toDateObj = Carbon::createFromFormat('d/m/Y', $toDate);
                } else {
                    $toDateObj = Carbon::createFromFormat('Y-m-d', $toDate);
                }
                $query->where('appointment_date', '<=', $toDateObj->format('Y-m-d'));
            } catch (\Exception $e) {
                // If parsing fails, try to use the date as-is
                $query->where('appointment_date', '<=', $toDate);
            }
        }

        // Calculate stats
        $totalCount = (clone $query)->count();
        $stats = [
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'accepted' => (clone $query)->where('status', 'accepted')->count(),
            'rejected' => (clone $query)->where('status', 'rejected')->count(),
            'completed' => (clone $query)->where('status', 'completed')->count(),
            'total' => $totalCount
        ];

        // Get today's appointments (all appointments for today)
        $today = Carbon::today()->format('Y-m-d');
        $todayAppointments = Appointment::with(['services', 'barber'])
            ->where('appointment_date', $today)
            ->orderBy('appointment_time', 'asc') // Order by time ascending (earliest first)
            ->get()
            ->map(function ($appointment) {
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
                    'dateTime' => $dateTime,
                    'service' => $serviceName,
                    'status' => $appointment->status,
                ];
            });

        // Get activity log (last 10 completed/cancelled appointments)
        $activities = Appointment::with(['services', 'barber'])
            ->whereIn('status', ['completed', 'cancelled'])
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($appointment) {
                $time = $appointment->getRawOriginal('appointment_time');
                $timeFormatted = $time ? Carbon::parse($time)->format('h:i A') : '';
                $dateTime = $appointment->appointment_date 
                    ? Carbon::parse($appointment->appointment_date)->format('M d, Y') . ', ' . $timeFormatted
                    : '';

                return [
                    'id' => $appointment->id,
                    'title' => 'Appointment ' . ($appointment->status === 'completed' ? 'Completed' : 'Cancelled'),
                    'description' => $appointment->full_name . ' - ' . $dateTime,
                    'timestamp' => $appointment->updated_at->diffForHumans(),
                    'type' => $appointment->status === 'completed' ? 'success' : 'cancel'
                ];
            });

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'appointments' => $todayAppointments,
            'activities' => $activities
        ]);
    }
}


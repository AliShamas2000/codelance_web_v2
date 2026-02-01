<?php

namespace App\Http\Controllers\Api\Barber;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Get barber settings
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'dashboardPreferences' => [
                        'defaultCalendarView' => $user->default_calendar_view ?? 'daily',
                        'language' => $user->language ?? 'en',
                        'timezone' => $user->timezone ?? 'Asia/Beirut',
                        'startOfWeek' => $user->start_of_week ?? 'monday'
                    ],
                    'bookingConfig' => [
                        'autoConfirm' => (bool)($user->auto_confirm_appointments ?? false),
                        'appointmentBuffer' => (string)($user->appointment_buffer ?? 5),
                        'minimumNotice' => (string)($user->minimum_notice ?? 1)
                    ],
                    'notifications' => [
                        'newAppointmentAlerts' => (bool)($user->new_appointment_alerts ?? true)
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching barber settings: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update barber settings
     */
    public function update(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'dashboardPreferences.defaultCalendarView' => 'sometimes|in:daily,weekly,list',
                'dashboardPreferences.language' => 'sometimes|in:en',
                'dashboardPreferences.timezone' => 'sometimes|in:Asia/Beirut',
                'dashboardPreferences.startOfWeek' => 'sometimes|in:monday,sunday',
                'bookingConfig.autoConfirm' => 'sometimes|boolean',
                'bookingConfig.appointmentBuffer' => 'sometimes|integer|min:0|max:60',
                'bookingConfig.minimumNotice' => 'sometimes|integer|min:0|max:168',
                'notifications.newAppointmentAlerts' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            // Update dashboard preferences
            if (isset($data['dashboardPreferences'])) {
                if (isset($data['dashboardPreferences']['defaultCalendarView'])) {
                    $user->default_calendar_view = $data['dashboardPreferences']['defaultCalendarView'];
                }
                if (isset($data['dashboardPreferences']['language'])) {
                    $user->language = $data['dashboardPreferences']['language'];
                }
                if (isset($data['dashboardPreferences']['timezone'])) {
                    $user->timezone = $data['dashboardPreferences']['timezone'];
                }
                if (isset($data['dashboardPreferences']['startOfWeek'])) {
                    $user->start_of_week = $data['dashboardPreferences']['startOfWeek'];
                }
            }

            // Update booking config
            if (isset($data['bookingConfig'])) {
                if (isset($data['bookingConfig']['autoConfirm'])) {
                    $user->auto_confirm_appointments = $data['bookingConfig']['autoConfirm'];
                }
                if (isset($data['bookingConfig']['appointmentBuffer'])) {
                    $user->appointment_buffer = (int)$data['bookingConfig']['appointmentBuffer'];
                }
                if (isset($data['bookingConfig']['minimumNotice'])) {
                    $user->minimum_notice = (int)$data['bookingConfig']['minimumNotice'];
                }
            }

            // Update notifications
            if (isset($data['notifications'])) {
                if (isset($data['notifications']['newAppointmentAlerts'])) {
                    $user->new_appointment_alerts = $data['notifications']['newAppointmentAlerts'];
                }
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
                'data' => [
                    'dashboardPreferences' => [
                        'defaultCalendarView' => $user->default_calendar_view,
                        'language' => $user->language,
                        'timezone' => $user->timezone,
                        'startOfWeek' => $user->start_of_week
                    ],
                    'bookingConfig' => [
                        'autoConfirm' => (bool)$user->auto_confirm_appointments,
                        'appointmentBuffer' => (string)$user->appointment_buffer,
                        'minimumNotice' => (string)$user->minimum_notice
                    ],
                    'notifications' => [
                        'newAppointmentAlerts' => (bool)$user->new_appointment_alerts
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating barber settings: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

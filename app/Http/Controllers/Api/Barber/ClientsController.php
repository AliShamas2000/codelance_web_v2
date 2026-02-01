<?php

namespace App\Http\Controllers\Api\Barber;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ClientsController extends Controller
{
    /**
     * Get barber's clients
     */
    public function index(Request $request)
    {
        try {
            $barber = $request->user();
            
            // Get all appointments for this barber
            $appointmentsQuery = Appointment::where('barber_id', $barber->id)
                ->with('services');
            
            // Apply search filter
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $appointmentsQuery->where(function($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }
            
            // Get all appointments
            $allAppointments = $appointmentsQuery->get();
            
            // Group appointments by phone number (unique identifier for clients)
            $clientsMap = [];
            foreach ($allAppointments as $appointment) {
                $phone = $appointment->phone;
                if (!isset($clientsMap[$phone])) {
                    $clientsMap[$phone] = [
                        'phone' => $phone,
                        'name' => $appointment->full_name,
                        'appointments' => []
                    ];
                }
                $clientsMap[$phone]['appointments'][] = $appointment;
            }
            
            // Format clients with statistics
            $clients = [];
            foreach ($clientsMap as $phone => $clientData) {
                $appointments = collect($clientData['appointments']);
                
                // Calculate statistics
                $totalVisits = $appointments->count();
                $lastAppointment = $appointments->sortByDesc(function($apt) {
                    return $apt->appointment_date->format('Y-m-d') . ' ' . $apt->appointment_time;
                })->first();
                
                // Determine status
                $status = 'new';
                if ($totalVisits >= 10) {
                    $status = 'active';
                } elseif ($totalVisits >= 3) {
                    $status = 'active';
                }
                
                // Check if inactive (no appointment in last 90 days)
                if ($lastAppointment) {
                    $daysSinceLastVisit = Carbon::parse($lastAppointment->appointment_date)->diffInDays(Carbon::now());
                    if ($daysSinceLastVisit > 90) {
                        $status = 'inactive';
                    }
                }
                
                // Apply status filter
                if ($request->has('status') && $request->status !== 'all') {
                    if ($request->status === 'active' && $status !== 'active') {
                        continue;
                    }
                    if ($request->status === 'new' && $status !== 'new') {
                        continue;
                    }
                    if ($request->status === 'inactive' && $status !== 'inactive') {
                        continue;
                    }
                }
                
                // Get last visit service
                $lastVisitService = 'N/A';
                if ($lastAppointment) {
                    $services = $lastAppointment->services;
                    if ($services->count() > 0) {
                        $lastVisitService = $services->pluck('name_en')->join(', ');
                    }
                }
                
                // Format last visit date
                $lastVisit = 'N/A';
                if ($lastAppointment) {
                    $lastVisitDate = Carbon::parse($lastAppointment->appointment_date);
                    $daysDiff = $lastVisitDate->diffInDays(Carbon::now());
                    
                    if ($daysDiff === 0) {
                        $lastVisit = 'Today, ' . Carbon::parse($lastAppointment->appointment_time)->format('g:i A');
                    } elseif ($daysDiff === 1) {
                        $lastVisit = 'Yesterday, ' . Carbon::parse($lastAppointment->appointment_time)->format('g:i A');
                    } elseif ($daysDiff < 7) {
                        $lastVisit = $lastVisitDate->format('M d') . ', ' . Carbon::parse($lastAppointment->appointment_time)->format('g:i A');
                    } else {
                        $lastVisit = $lastVisitDate->format('M d, Y');
                    }
                }
                
                // Get first appointment date for "since"
                $firstAppointment = $appointments->sortBy('appointment_date')->first();
                $sinceDate = $firstAppointment ? Carbon::parse($firstAppointment->appointment_date)->format('M Y') : 'N/A';
                
                // Generate initials
                $nameParts = explode(' ', $clientData['name']);
                $initials = '';
                foreach ($nameParts as $part) {
                    if (!empty($part)) {
                        $initials .= strtoupper(substr($part, 0, 1));
                    }
                }
                if (strlen($initials) > 2) {
                    $initials = substr($initials, 0, 2);
                }
                
                $clients[] = [
                    'id' => 'CLI-' . str_pad(count($clients) + 1, 3, '0', STR_PAD_LEFT), // Generate ID based on phone
                    'phone' => $phone,
                    'name' => $clientData['name'],
                    'initials' => $initials,
                    'totalVisits' => $totalVisits,
                    'lastVisit' => $lastVisit,
                    'lastVisitService' => $lastVisitService,
                    'status' => $status,
                    'sinceDate' => $sinceDate,
                    'avatar' => null
                ];
            }
            
            // Apply sorting
            $sortBy = $request->get('sort_by', 'recent_visit');
            if ($sortBy === 'recent_visit') {
                usort($clients, function($a, $b) {
                    // Sort by last visit date (most recent first)
                    $dateA = $a['lastVisit'] === 'N/A' ? '1970-01-01' : $a['lastVisit'];
                    $dateB = $b['lastVisit'] === 'N/A' ? '1970-01-01' : $b['lastVisit'];
                    return strtotime($dateB) - strtotime($dateA);
                });
            } elseif ($sortBy === 'name') {
                usort($clients, function($a, $b) {
                    return strcmp($a['name'], $b['name']);
                });
            } elseif ($sortBy === 'total_visits') {
                usort($clients, function($a, $b) {
                    return $b['totalVisits'] - $a['totalVisits'];
                });
            }
            
            // Pagination
            $perPage = $request->get('per_page', 10);
            $currentPage = $request->get('page', 1);
            $totalItems = count($clients);
            $totalPages = ceil($totalItems / $perPage);
            $offset = ($currentPage - 1) * $perPage;
            $paginatedClients = array_slice($clients, $offset, $perPage);
            
            return response()->json([
                'success' => true,
                'clients' => $paginatedClients,
                'pagination' => [
                    'current_page' => (int)$currentPage,
                    'total_pages' => $totalPages,
                    'total' => $totalItems,
                    'per_page' => $perPage
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching clients: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch clients',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get client statistics
     */
    public function stats(Request $request)
    {
        try {
            $barber = $request->user();
            
            // Get all appointments for this barber
            $allAppointments = Appointment::where('barber_id', $barber->id)->get();
            
            // Group by phone to get unique clients
            $uniqueClients = $allAppointments->groupBy('phone')->keys()->count();
            
            // Calculate active regulars (clients with 3+ visits)
            $clientsMap = [];
            foreach ($allAppointments as $appointment) {
                $phone = $appointment->phone;
                if (!isset($clientsMap[$phone])) {
                    $clientsMap[$phone] = 0;
                }
                $clientsMap[$phone]++;
            }
            
            $activeRegulars = 0;
            foreach ($clientsMap as $phone => $visitCount) {
                if ($visitCount >= 3) {
                    $activeRegulars++;
                }
            }
            
            // Calculate retention rate (clients who visited in last 90 days / total clients)
            $recentClients = 0;
            $ninetyDaysAgo = Carbon::now()->subDays(90);
            foreach ($clientsMap as $phone => $visitCount) {
                $lastAppointment = $allAppointments->where('phone', $phone)
                    ->sortByDesc(function($apt) {
                        return $apt->appointment_date->format('Y-m-d') . ' ' . $apt->appointment_time;
                    })
                    ->first();
                
                if ($lastAppointment && Carbon::parse($lastAppointment->appointment_date)->gte($ninetyDaysAgo)) {
                    $recentClients++;
                }
            }
            
            $retentionRate = $uniqueClients > 0 ? round(($recentClients / $uniqueClients) * 100) : 0;
            
            // Calculate change (compare with previous period)
            // For simplicity, we'll use a placeholder. In production, you'd compare with previous period
            $totalClientsChange = 0; // Placeholder
            $retentionRateChange = 0; // Placeholder
            
            return response()->json([
                'success' => true,
                'data' => [
                    'totalClients' => $uniqueClients,
                    'totalClientsChange' => $totalClientsChange,
                    'activeRegulars' => $activeRegulars,
                    'retentionRate' => $retentionRate,
                    'retentionRateChange' => $retentionRateChange
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching client stats: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch client stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a new client (creates a placeholder appointment)
     */
    public function store(Request $request)
    {
        try {
            $barber = $request->user();
            
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'email' => 'nullable|email|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create a placeholder appointment for the client
            // This allows the client to appear in the clients list
            $appointment = Appointment::create([
                'full_name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'barber_id' => $barber->id,
                'appointment_date' => Carbon::now()->toDateString(),
                'appointment_time' => '00:00:00',
                'status' => 'pending',
                'notes' => 'Client added manually'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Client added successfully',
                'data' => [
                    'id' => $appointment->id,
                    'name' => $appointment->full_name,
                    'phone' => $appointment->phone
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error adding client: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to add client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a client (delete all their appointments)
     */
    public function destroy(Request $request, $clientId)
    {
        try {
            $barber = $request->user();
            
            // Get phone from query parameter
            $phone = $request->query('phone');
            
            if (!$phone) {
                return response()->json([
                    'success' => false,
                    'message' => 'Phone number is required to delete client'
                ], 422);
            }
            
            // Delete all appointments for this client (phone)
            $deleted = Appointment::where('barber_id', $barber->id)
                ->where('phone', $phone)
                ->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Client deleted successfully',
                'deleted_count' => $deleted
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting client: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export clients to CSV
     */
    public function export(Request $request)
    {
        try {
            $barber = $request->user();
            
            // Get all appointments
            $allAppointments = Appointment::where('barber_id', $barber->id)->get();
            
            // Group by phone
            $clientsMap = [];
            foreach ($allAppointments as $appointment) {
                $phone = $appointment->phone;
                if (!isset($clientsMap[$phone])) {
                    $clientsMap[$phone] = [
                        'phone' => $phone,
                        'name' => $appointment->full_name,
                        'appointments' => []
                    ];
                }
                $clientsMap[$phone]['appointments'][] = $appointment;
            }
            
            // Generate CSV
            $csv = "\xEF\xBB\xBF"; // UTF-8 BOM for Excel
            $csv .= "Name,Phone,Total Visits,Last Visit,Status\n";
            
            foreach ($clientsMap as $phone => $clientData) {
                $appointments = collect($clientData['appointments']);
                $totalVisits = $appointments->count();
                $lastAppointment = $appointments->sortByDesc(function($apt) {
                    return $apt->appointment_date->format('Y-m-d') . ' ' . $apt->appointment_time;
                })->first();
                
                $lastVisit = $lastAppointment ? $lastAppointment->appointment_date->format('Y-m-d') : 'N/A';
                
                // Determine status
                $status = 'new';
                if ($totalVisits >= 3) {
                    $status = 'active';
                }
                if ($lastAppointment) {
                    $daysSinceLastVisit = Carbon::parse($lastAppointment->appointment_date)->diffInDays(Carbon::now());
                    if ($daysSinceLastVisit > 90) {
                        $status = 'inactive';
                    }
                }
                
                $csv .= sprintf(
                    '"%s","%s",%d,"%s","%s"' . "\n",
                    $clientData['name'],
                    $phone,
                    $totalVisits,
                    $lastVisit,
                    $status
                );
            }
            
            return response($csv)
                ->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', 'attachment; filename="clients_' . date('Y-m-d') . '.csv"');
        } catch (\Exception $e) {
            \Log::error('Error exporting clients: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to export clients',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get client history
     */
    public function history(Request $request, $clientId)
    {
        try {
            $barber = $request->user();
            $phone = $request->query('phone');
            
            if (!$phone) {
                return response()->json([
                    'success' => false,
                    'message' => 'Phone number is required'
                ], 422);
            }
            
            // Get latest 5 appointments for this client
            $limit = $request->query('limit', 5);
            $appointments = Appointment::where('barber_id', $barber->id)
                ->where('phone', $phone)
                ->with('services')
                ->orderBy('appointment_date', 'desc')
                ->orderBy('appointment_time', 'desc')
                ->limit((int)$limit)
                ->get();
            
            // Format appointments with price calculations
            $history = $appointments->map(function($appointment) {
                $services = $appointment->services;
                $serviceNames = $services->pluck('name_en')->join(', ');
                
                // Calculate total amount (sum of service prices with discounts)
                $totalAmount = 0;
                $totalDuration = 0;
                foreach ($services as $service) {
                    $price = (float)($service->price ?? 0);
                    $discount = (float)($service->discount_percentage ?? 0);
                    $discountedPrice = $price * (1 - $discount / 100);
                    $totalAmount += $discountedPrice;
                    $totalDuration += (int)($service->duration ?? 30);
                }
                
                $date = Carbon::parse($appointment->appointment_date);
                $time = Carbon::parse($appointment->appointment_time);
                
                return [
                    'id' => $appointment->id,
                    'date' => $date->format('M d, Y'),
                    'time' => $time->format('g:i A'),
                    'service' => $serviceNames ?: 'Service',
                    'serviceName' => $serviceNames ?: 'Service',
                    'services' => $serviceNames,
                    'status' => $appointment->status,
                    'notes' => $appointment->notes,
                    'price' => round($totalAmount, 2),
                    'amount' => round($totalAmount, 2),
                    'duration' => $totalDuration
                ];
            });
            
            // Get total count of all appointments (not limited) for stats
            $totalAppointmentsCount = Appointment::where('barber_id', $barber->id)
                ->where('phone', $phone)
                ->count();
            
            // Calculate total spent from all completed appointments (not just the 5 shown)
            $allCompletedAppointments = Appointment::where('barber_id', $barber->id)
                ->where('phone', $phone)
                ->where('status', 'completed')
                ->with('services')
                ->get();
            
            $totalSpent = $allCompletedAppointments->reduce(function($sum, $appointment) {
                $amount = 0;
                foreach ($appointment->services as $service) {
                    $price = (float)($service->price ?? 0);
                    $discount = (float)($service->discount_percentage ?? 0);
                    $discountedPrice = $price * (1 - $discount / 100);
                    $amount += $discountedPrice;
                }
                return $sum + $amount;
            }, 0);
            
            return response()->json([
                'success' => true,
                'data' => $history,
                'totalSpent' => round($totalSpent, 2),
                'totalVisits' => $totalAppointmentsCount
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching client history: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch client history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update client notes
     */
    public function updateNotes(Request $request, $clientId)
    {
        try {
            $barber = $request->user();
            $phone = $request->query('phone');
            
            if (!$phone) {
                return response()->json([
                    'success' => false,
                    'message' => 'Phone number is required'
                ], 422);
            }
            
            $validator = Validator::make($request->all(), [
                'notes' => 'required|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Update notes in the most recent appointment
            $appointment = Appointment::where('barber_id', $barber->id)
                ->where('phone', $phone)
                ->orderBy('appointment_date', 'desc')
                ->orderBy('appointment_time', 'desc')
                ->first();
            
            if ($appointment) {
                $appointment->notes = $request->notes;
                $appointment->save();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Notes updated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating client notes: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update notes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get client notes
     */
    public function getNotes(Request $request, $clientId)
    {
        try {
            $barber = $request->user();
            $phone = $request->query('phone');
            
            if (!$phone) {
                return response()->json([
                    'success' => false,
                    'message' => 'Phone number is required'
                ], 422);
            }
            
            // Get notes from the most recent appointment
            $appointment = Appointment::where('barber_id', $barber->id)
                ->where('phone', $phone)
                ->orderBy('appointment_date', 'desc')
                ->orderBy('appointment_time', 'desc')
                ->first();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'notes' => $appointment ? $appointment->notes : ''
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching client notes: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'barber_id' => $request->user()->id ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notes',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


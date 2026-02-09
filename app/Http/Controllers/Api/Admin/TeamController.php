<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SocialMediaLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rule;

class TeamController extends Controller
{
    /**
     * Display a listing of team members (barbers).
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'barber')
            ->with('socialMediaLinks');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('job_title', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 12);
        $teamMembers = $query->paginate($perPage);

        // Format team members
        $formattedMembers = $teamMembers->map(function ($user) {
            return $this->formatTeamMember($user);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedMembers,
            'total' => $teamMembers->total(),
            'per_page' => $teamMembers->perPage(),
            'current_page' => $teamMembers->currentPage(),
            'total_pages' => $teamMembers->lastPage(),
        ]);
    }

    /**
     * Store a newly created team member.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'job_title' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
            'profile_photo' => 'nullable|image|max:2048',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required|string',
            'social_links.*.url' => 'required|url',
        ]);

        // Create user with role barber
        $user = User::create([
            'name' => trim($validated['first_name'] . ' ' . $validated['last_name']),
            'email' => $validated['email'],
            'password' => md5($validated['password']), // MD5 as requested
            'role' => 'barber', // Default role for team members
            'phone' => $validated['phone'] ?? null,
            'job_title' => $validated['job_title'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('team/photos', 'public');
            $user->profile_photo = $path;
            $user->save();
        }

        // Handle social media links
        if ($request->has('social_links') && is_array($request->social_links)) {
            foreach ($request->social_links as $link) {
                SocialMediaLink::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'platform' => $link['platform'],
                    ],
                    [
                        'url' => $link['url'],
                    ]
                );
            }
        }

        $user->load('socialMediaLinks');

        return response()->json([
            'success' => true,
            'message' => 'Team member created successfully',
            'member' => $this->formatTeamMember($user),
        ], 201);
    }

    /**
     * Display the specified team member.
     */
    public function show(string $id)
    {
        $member = User::where('role', 'barber')
            ->with('socialMediaLinks')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'member' => $this->formatTeamMember($member),
        ]);
    }

    /**
     * Update the specified team member.
     */
    public function update(Request $request, string $id)
    {
        $member = User::where('role', 'barber')->findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($id)],
            'password' => 'sometimes|string|min:8',
            'phone' => 'nullable|string|max:20',
            'job_title' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
            'profile_photo' => 'nullable|image|max:2048',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required|string',
            'social_links.*.url' => 'required|url',
        ]);

        // Update name if provided
        if (isset($validated['first_name']) || isset($validated['last_name'])) {
            $firstName = $validated['first_name'] ?? explode(' ', $member->name)[0];
            $lastName = $validated['last_name'] ?? (count(explode(' ', $member->name)) > 1 ? implode(' ', array_slice(explode(' ', $member->name), 1)) : '');
            $member->name = trim($firstName . ' ' . $lastName);
        }

        // Update other fields
        if (isset($validated['email'])) {
            $member->email = $validated['email'];
        }
        if (isset($validated['password'])) {
            $member->password = md5($validated['password']); // MD5 as requested
        }
        if (isset($validated['phone'])) {
            $member->phone = $validated['phone'];
        }
        if (isset($validated['job_title'])) {
            $member->job_title = $validated['job_title'];
        }
        if (isset($validated['bio'])) {
            $member->bio = $validated['bio'];
        }
        if (isset($validated['status'])) {
            $member->status = $validated['status'];
        }

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            // Delete old photo if exists
            if ($member->profile_photo) {
                Storage::disk('public')->delete($member->profile_photo);
            }
            $path = $request->file('profile_photo')->store('team/photos', 'public');
            $member->profile_photo = $path;
        }

        $member->save();

        // Handle social media links: always sync from request
        // Delete existing links
        $member->socialMediaLinks()->delete();

        // Re-create links if provided
        if ($request->has('social_links') && is_array($request->social_links)) {
            foreach ($request->social_links as $link) {
                SocialMediaLink::create([
                    'user_id' => $member->id,
                    'platform' => $link['platform'],
                    'url' => $link['url'],
                ]);
            }
        }

        $member->load('socialMediaLinks');

        return response()->json([
            'success' => true,
            'message' => 'Team member updated successfully',
            'member' => $this->formatTeamMember($member),
        ]);
    }

    /**
     * Remove the specified team member.
     */
    public function destroy(string $id)
    {
        $member = User::where('role', 'barber')->findOrFail($id);

        // Delete profile photo if exists
        if ($member->profile_photo) {
            Storage::disk('public')->delete($member->profile_photo);
        }

        // Delete social media links
        $member->socialMediaLinks()->delete();

        // Delete user
        $member->delete();

        return response()->json([
            'success' => true,
            'message' => 'Team member deleted successfully',
        ]);
    }

    /**
     * Get team member details with stats and appointments.
     */
    public function details(string $id)
    {
        $member = User::where('role', 'barber')
            ->with('socialMediaLinks')
            ->findOrFail($id);

        // TODO: Add stats and appointments when those features are implemented
        $stats = [
            'total_appointments' => 0,
            'satisfaction_rate' => 0,
            'average_rating' => 0,
        ];

        $appointments = [];

        return response()->json([
            'success' => true,
            'member' => $this->formatTeamMember($member),
            'stats' => $stats,
            'appointments' => $appointments,
        ]);
    }

    /**
     * Get team member stats.
     */
    public function stats(string $id)
    {
        $member = User::where('role', 'barber')->findOrFail($id);

        // TODO: Calculate actual stats when appointments are implemented
        $stats = [
            'total_appointments' => 0,
            'satisfaction_rate' => 0,
            'average_rating' => 0,
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
        ]);
    }

    /**
     * Get team member appointments.
     */
    public function appointments(string $id, Request $request)
    {
        $member = User::where('role', 'barber')->findOrFail($id);

        // TODO: Fetch actual appointments when appointments are implemented
        $appointments = [];

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    /**
     * Get team member availability.
     */
    public function availability(string $id)
    {
        $member = User::where('role', 'barber')->findOrFail($id);

        // TODO: Fetch actual availability when schedule is implemented
        $availability = null;

        return response()->json([
            'success' => true,
            'availability' => $availability,
        ]);
    }

    /**
     * Format team member data for API response.
     */
    private function formatTeamMember(User $user)
    {
        $nameParts = explode(' ', $user->name, 2);
        
        return [
            'id' => $user->id,
            'firstName' => $nameParts[0] ?? '',
            'lastName' => $nameParts[1] ?? '',
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'jobTitle' => $user->job_title,
            'job_title' => $user->job_title,
            'bio' => $user->bio,
            'status' => $user->status,
            'profilePhoto' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
            'avatar' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
            'socialLinks' => $user->socialMediaLinks->map(function ($link) {
                return [
                    'platform' => $link->platform,
                    'url' => $link->url,
                ];
            })->toArray(),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class BarberController extends Controller
{
    /**
     * Display a listing of barbers (public endpoint).
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'barber')
            ->where('status', 'active') // Only show active barbers
            ->with('socialMediaLinks');

        // Optional: Filter by role/job_title
        if ($request->has('role') && $request->role) {
            $query->where('job_title', 'like', "%{$request->role}%");
        }

        // Optional: Limit results
        $limit = $request->get('limit');
        if ($limit) {
            $barbers = $query->limit($limit)->get();
        } else {
            $barbers = $query->get();
        }

        // Format barbers for public display
        $formattedBarbers = $barbers->map(function ($barber) {
            return $this->formatBarber($barber);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedBarbers,
        ]);
    }

    /**
     * Display the specified barber (public endpoint).
     */
    public function show(string $id)
    {
        $barber = User::where('role', 'barber')
            ->where('status', 'active')
            ->with('socialMediaLinks')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatBarber($barber),
        ]);
    }

    /**
     * Format barber data for public API response.
     */
    private function formatBarber(User $user)
    {
        // Format social links for frontend
        $socialLinks = $user->socialMediaLinks->map(function ($link) {
            $iconMap = [
                'instagram' => 'instagram',
                'facebook' => 'facebook',
                'twitter' => 'twitter',
                'linkedin' => 'linkedin',
                'youtube' => 'youtube',
                'tiktok' => 'tiktok',
            ];

            // Map platform to icon (use platform name as icon if not in map)
            $icon = $iconMap[strtolower($link->platform)] ?? strtolower($link->platform);

            return [
                'icon' => $icon,
                'href' => $link->url,
                'label' => ucfirst($link->platform),
                'platform' => strtolower($link->platform),
                'target' => '_blank',
                'rel' => 'noopener noreferrer',
            ];
        })->toArray();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->job_title || 'Barber',
            'imageUrl' => $user->profile_photo ? URL::asset('storage/' . $user->profile_photo) : null,
            'imageAlt' => "{$user->name} - {$user->job_title}",
            'socialLinks' => $socialLinks,
            'bio' => $user->bio,
            'phone' => $user->phone,
        ];
    }
}


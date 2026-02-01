<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutUs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class AboutUsController extends Controller
{
    /**
     * Get active About Us section for public display.
     */
    public function index(Request $request)
    {
        // Get the first active About Us section, ordered by order field
        $aboutUs = AboutUs::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$aboutUs) {
            return response()->json([
                'success' => false,
                'message' => 'No active About Us section found',
                'data' => null,
            ], 404);
        }

        // Format features as stats
        // Features are stored as array of {textEn, textAr} objects
        // We'll convert them to stats format: {value, label}
        $stats = [];
        if ($aboutUs->features && is_array($aboutUs->features)) {
            foreach ($aboutUs->features as $feature) {
                $textEn = $feature['textEn'] ?? $feature['text_en'] ?? '';
                if ($textEn) {
                    // Try to extract value and label from text
                    // Pattern: "15k+ Clients Served" -> value: "15k+", label: "Clients Served"
                    // Pattern: "9 Master Barbers" -> value: "9", label: "Master Barbers"
                    if (preg_match('/^([\d\w\+\-\.]+)\s+(.+)$/', trim($textEn), $matches)) {
                        $stats[] = [
                            'value' => $matches[1],
                            'label' => $matches[2],
                        ];
                    } else {
                        // If pattern doesn't match, try to split by common separators
                        // or use the whole text as label with empty value
                        $stats[] = [
                            'value' => '',
                            'label' => $textEn,
                        ];
                    }
                }
            }
        }
        
        // If no stats from features, provide default empty array
        if (empty($stats)) {
            $stats = [];
        }

        // Format data for public API response
        $formattedData = [
            'establishedYear' => '2015', // Can be made configurable later
            'title' => $aboutUs->title_en ?: $aboutUs->title_ar,
            'titleEn' => $aboutUs->title_en,
            'titleAr' => $aboutUs->title_ar,
            'description' => $aboutUs->description_en ?: $aboutUs->description_ar,
            'descriptionEn' => $aboutUs->description_en,
            'descriptionAr' => $aboutUs->description_ar,
            'secondaryDescription' => null, // Can be added as a separate field if needed
            'primaryButtonText' => 'Meet the Team', // Can be made configurable
            'secondaryButtonText' => 'View Services', // Can be made configurable
            'stats' => $stats,
            'imageUrl' => $aboutUs->image ? URL::asset('storage/' . $aboutUs->image) : null,
            'imageAlt' => ($aboutUs->title_en ?: $aboutUs->title_ar) . ' - About Us',
            'badgeProps' => [
                'title' => 'Join our community',
                'subtitle' => 'Rated Top Barber in City',
                'customerAvatars' => [], // Can be populated from reviews or other sources
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $formattedData,
        ]);
    }
}


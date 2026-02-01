<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class BannerController extends Controller
{
    /**
     * Get active banners for public display (homepage).
     */
    public function index(Request $request)
    {
        $query = Banner::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        // Optional limit
        $limit = $request->get('limit');
        if ($limit) {
            $banners = $query->limit($limit)->get();
        } else {
            $banners = $query->get();
        }

        // Format banners for public API response
        $formattedBanners = $banners->map(function ($banner) {
            return $this->formatBanner($banner);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedBanners,
        ]);
    }

    /**
     * Format banner data for public API response.
     */
    private function formatBanner(Banner $banner)
    {
        return [
            'id' => $banner->id,
            'title' => $banner->title,
            'desktopImage' => $banner->desktop_image ? URL::asset('storage/' . $banner->desktop_image) : null,
            'mobileImage' => $banner->mobile_image ? URL::asset('storage/' . $banner->mobile_image) : null,
            'buttonTextEn' => $banner->button_text_en,
            'buttonTextAr' => $banner->button_text_ar,
            'buttonUrl' => $banner->button_url,
            'order' => $banner->order,
        ];
    }
}


<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rule;

class BannerController extends Controller
{
    /**
     * Display a listing of banners.
     */
    public function index(Request $request)
    {
        $query = Banner::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $banners = $query->paginate($perPage);

        // Format banners for API response
        $formattedBanners = $banners->map(function ($banner) {
            return $this->formatBanner($banner);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedBanners,
            'total' => $banners->total(),
            'per_page' => $banners->perPage(),
            'current_page' => $banners->currentPage(),
            'total_pages' => $banners->lastPage(),
        ]);
    }

    /**
     * Store a newly created banner.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'desktop_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'mobile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'button_text_en' => 'nullable|string|max:255',
            'button_text_ar' => 'nullable|string|max:255',
            'button_url' => 'nullable|url|max:500',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $desktopImagePath = null;
        $mobileImagePath = null;

        // Handle desktop image upload
        if ($request->hasFile('desktop_image')) {
            $desktopImagePath = $request->file('desktop_image')->store('banners/desktop', 'public');
        }

        // Handle mobile image upload
        if ($request->hasFile('mobile_image')) {
            $mobileImagePath = $request->file('mobile_image')->store('banners/mobile', 'public');
        }

        $banner = Banner::create([
            'title' => $validated['title'],
            'desktop_image' => $desktopImagePath,
            'mobile_image' => $mobileImagePath,
            'button_text_en' => $validated['button_text_en'] ?? null,
            'button_text_ar' => $validated['button_text_ar'] ?? null,
            'button_url' => $validated['button_url'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Banner created successfully',
            'data' => $this->formatBanner($banner),
        ], 201);
    }

    /**
     * Display the specified banner.
     */
    public function show(string $id)
    {
        $banner = Banner::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatBanner($banner),
        ]);
    }

    /**
     * Update the specified banner.
     */
    public function update(Request $request, string $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'desktop_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'mobile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'button_text_en' => 'nullable|string|max:255',
            'button_text_ar' => 'nullable|string|max:255',
            'button_url' => 'nullable|url|max:500',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'remove_desktop_image' => 'nullable|boolean',
            'remove_mobile_image' => 'nullable|boolean',
        ]);

        // Handle desktop image update/removal
        if ($request->boolean('remove_desktop_image') && $banner->desktop_image) {
            Storage::disk('public')->delete($banner->desktop_image);
            $banner->desktop_image = null;
        } elseif ($request->hasFile('desktop_image')) {
            // Delete old image if exists
            if ($banner->desktop_image) {
                Storage::disk('public')->delete($banner->desktop_image);
            }
            $banner->desktop_image = $request->file('desktop_image')->store('banners/desktop', 'public');
        }

        // Handle mobile image update/removal
        if ($request->boolean('remove_mobile_image') && $banner->mobile_image) {
            Storage::disk('public')->delete($banner->mobile_image);
            $banner->mobile_image = null;
        } elseif ($request->hasFile('mobile_image')) {
            // Delete old image if exists
            if ($banner->mobile_image) {
                Storage::disk('public')->delete($banner->mobile_image);
            }
            $banner->mobile_image = $request->file('mobile_image')->store('banners/mobile', 'public');
        }

        // Update other fields
        if (isset($validated['title'])) {
            $banner->title = $validated['title'];
        }
        if (isset($validated['button_text_en'])) {
            $banner->button_text_en = $validated['button_text_en'];
        }
        if (isset($validated['button_text_ar'])) {
            $banner->button_text_ar = $validated['button_text_ar'];
        }
        if (isset($validated['button_url'])) {
            $banner->button_url = $validated['button_url'];
        }
        if (isset($validated['is_active'])) {
            $banner->is_active = $validated['is_active'];
        }
        if (isset($validated['order'])) {
            $banner->order = $validated['order'];
        }

        $banner->save();

        return response()->json([
            'success' => true,
            'message' => 'Banner updated successfully',
            'data' => $this->formatBanner($banner),
        ]);
    }

    /**
     * Remove the specified banner.
     */
    public function destroy(string $id)
    {
        $banner = Banner::findOrFail($id);

        // Delete images
        if ($banner->desktop_image) {
            Storage::disk('public')->delete($banner->desktop_image);
        }
        if ($banner->mobile_image) {
            Storage::disk('public')->delete($banner->mobile_image);
        }

        $banner->delete();

        return response()->json([
            'success' => true,
            'message' => 'Banner deleted successfully',
        ]);
    }

    /**
     * Format banner data for API response.
     */
    private function formatBanner(Banner $banner)
    {
        return [
            'id' => $banner->id,
            'title' => $banner->title,
            'desktopImage' => $banner->desktop_image ? URL::asset('storage/' . $banner->desktop_image) : null,
            'desktop_image' => $banner->desktop_image ? URL::asset('storage/' . $banner->desktop_image) : null,
            'mobileImage' => $banner->mobile_image ? URL::asset('storage/' . $banner->mobile_image) : null,
            'mobile_image' => $banner->mobile_image ? URL::asset('storage/' . $banner->mobile_image) : null,
            'buttonTextEn' => $banner->button_text_en,
            'button_text_en' => $banner->button_text_en,
            'buttonTextAr' => $banner->button_text_ar,
            'button_text_ar' => $banner->button_text_ar,
            'buttonUrl' => $banner->button_url,
            'button_url' => $banner->button_url,
            'isActive' => $banner->is_active,
            'is_active' => $banner->is_active,
            'order' => $banner->order,
            'created_at' => $banner->created_at,
            'updated_at' => $banner->updated_at,
        ];
    }
}

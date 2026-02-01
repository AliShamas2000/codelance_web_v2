<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class GalleryController extends Controller
{
    /**
     * Get active gallery items for public display.
     */
    public function index(Request $request)
    {
        $query = Gallery::where('is_active', true)
            ->with('service')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        // Optional: filter by service
        if ($request->has('service') && $request->service !== 'all') {
            $query->where('service_id', $request->service);
        }

        // Pagination
        $perPage = $request->get('per_page', 8);
        $galleryItems = $query->paginate($perPage);

        // Format gallery items for public API response
        $formattedItems = $galleryItems->map(function ($item) {
            return $this->formatGalleryItem($item);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedItems,
            'has_more' => $galleryItems->hasMorePages(),
            'current_page' => $galleryItems->currentPage(),
            'total' => $galleryItems->total(),
        ]);
    }

    /**
     * Get services for filter chips (only services that have gallery items).
     */
    public function getServicesWithGallery()
    {
        // Get services that have at least one active gallery item
        $services = Service::where('is_active', true)
            ->whereHas('gallery', function ($query) {
                $query->where('is_active', true);
            })
            ->orderBy('name_en')
            ->get();

        // Format services for filter chips
        $formattedServices = $services->map(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name_en ?: $service->name_ar,
                'nameEn' => $service->name_en,
                'nameAr' => $service->name_ar,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedServices,
        ]);
    }

    /**
     * Format gallery item data for public API response.
     */
    private function formatGalleryItem(Gallery $item)
    {
        $serviceName = $item->service ? ($item->service->name_en ?: $item->service->name_ar) : null;

        return [
            'id' => $item->id,
            'imageUrl' => $item->image ? URL::asset('storage/' . $item->image) : null,
            'imageAlt' => $item->title . ($serviceName ? ' - ' . $serviceName : ''),
            'title' => $item->title,
            'description' => $item->description,
            'category' => $serviceName ?: 'Gallery',
            'filterId' => $item->service_id ? (string) $item->service_id : 'all',
            'service_id' => $item->service_id,
            'service' => $item->service ? [
                'id' => $item->service->id,
                'name' => $item->service->name_en ?: $item->service->name_ar,
                'nameEn' => $item->service->name_en,
                'nameAr' => $item->service->name_ar,
            ] : null,
        ];
    }
}


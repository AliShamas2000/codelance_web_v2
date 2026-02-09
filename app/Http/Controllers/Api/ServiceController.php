<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class ServiceController extends Controller
{
    /**
     * Get active services for public display.
     */
    public function index(Request $request)
    {
        $query = Service::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        // Optional: filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Optional: limit
        $limit = $request->get('limit');
        if ($limit) {
            $services = $query->limit($limit)->get();
        } else {
            $services = $query->get();
        }

        // Format services for public API response
        $formattedServices = $services->map(function ($service) {
            return $this->formatService($service);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedServices,
        ]);
    }

    /**
     * Display the specified service.
     */
    public function show(string $id)
    {
        $service = Service::where('is_active', true)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatService($service),
        ]);
    }

    /**
     * Format service data for public API response.
     */
    private function formatService(Service $service)
    {
        // Use English name as title, fallback to Arabic if English is empty
        $title = $service->name_en ?: $service->name_ar;
        
        // Use English description, fallback to Arabic if English is empty
        $description = $service->description_en ?: $service->description_ar;

        return [
            'id' => $service->id,
            'title' => $title,
            'nameEn' => $service->name_en,
            'nameAr' => $service->name_ar,
            'description' => $description,
            'descriptionEn' => $service->description_en,
            'descriptionAr' => $service->description_ar,
            'price' => '$' . number_format((float) $service->price, 2),
            'priceRaw' => (float) $service->price,
            'discountPercentage' => $service->discount_percentage ? (float) $service->discount_percentage : null,
            'discount_percentage' => $service->discount_percentage ? (float) $service->discount_percentage : null,
            'duration' => $service->duration,
            'category' => $service->category,
            'icon' => $service->icon,
            'svg' => $service->svg,
            'imageUrl' => $service->icon ? URL::asset('storage/' . $service->icon) : null,
            'imageAlt' => $title . ' - Premium Grooming Service',
        ];
    }
}


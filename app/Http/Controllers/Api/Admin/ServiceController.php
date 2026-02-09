<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class ServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index(Request $request)
    {
        $query = Service::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%")
                    ->orWhere('description_en', 'like', "%{$search}%")
                    ->orWhere('description_ar', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $services = $query->paginate($perPage);

        // Format services for API response
        $formattedServices = $services->map(function ($service) {
            return $this->formatService($service);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedServices,
            'total' => $services->total(),
            'per_page' => $services->perPage(),
            'current_page' => $services->currentPage(),
            'total_pages' => $services->lastPage(),
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'duration' => 'nullable|integer|min:1',
            'category' => 'nullable|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $iconPath = null;

        // Handle icon upload
        if ($request->hasFile('icon')) {
            $iconPath = $request->file('icon')->store('services/icons', 'public');
        }

        $service = Service::create([
            'name_en' => $validated['name_en'],
            'name_ar' => $validated['name_ar'] ?? null,
            'description_en' => $validated['description_en'] ?? null,
            'description_ar' => $validated['description_ar'] ?? null,
            'price' => $validated['price'],
            'discount_percentage' => $validated['discount_percentage'] ?? null,
            'duration' => $validated['duration'] ?? 30,
            'category' => $validated['category'] ?? 'haircut',
            'icon' => $iconPath,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $this->formatService($service),
        ], 201);
    }

    /**
     * Display the specified service.
     */
    public function show(string $id)
    {
        $service = Service::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatService($service),
        ]);
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, string $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'name_en' => 'sometimes|required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'duration' => 'nullable|integer|min:1',
            'category' => 'nullable|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'remove_icon' => 'nullable|boolean',
        ]);

        // Handle icon update/removal
        if ($request->boolean('remove_icon') && $service->icon) {
            Storage::disk('public')->delete($service->icon);
            $service->icon = null;
        } elseif ($request->hasFile('icon')) {
            // Delete old icon if exists
            if ($service->icon) {
                Storage::disk('public')->delete($service->icon);
            }
            $service->icon = $request->file('icon')->store('services/icons', 'public');
        }

        // Update other fields
        if (isset($validated['name_en'])) {
            $service->name_en = $validated['name_en'];
        }
        if (isset($validated['name_ar'])) {
            $service->name_ar = $validated['name_ar'];
        }
        if (isset($validated['description_en'])) {
            $service->description_en = $validated['description_en'];
        }
        if (isset($validated['description_ar'])) {
            $service->description_ar = $validated['description_ar'];
        }
        if (isset($validated['price'])) {
            $service->price = $validated['price'];
        }
        if (isset($validated['discount_percentage'])) {
            $service->discount_percentage = $validated['discount_percentage'] ?: null;
        } elseif ($request->has('discount_percentage') && $request->discount_percentage === '') {
            // Handle empty string to clear discount
            $service->discount_percentage = null;
        }
        if (isset($validated['duration'])) {
            $service->duration = $validated['duration'];
        }
        if (isset($validated['category'])) {
            $service->category = $validated['category'];
        }
        if (isset($validated['is_active'])) {
            $service->is_active = $validated['is_active'];
        }
        if (isset($validated['order'])) {
            $service->order = $validated['order'];
        }

        $service->save();

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully',
            'data' => $this->formatService($service),
        ]);
    }

    /**
     * Remove the specified service.
     */
    public function destroy(string $id)
    {
        $service = Service::findOrFail($id);

        // Delete icon if exists
        if ($service->icon) {
            Storage::disk('public')->delete($service->icon);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully',
        ]);
    }

    /**
     * Format service data for API response.
     */
    private function formatService(Service $service)
    {
        return [
            'id' => $service->id,
            'nameEn' => $service->name_en,
            'name_en' => $service->name_en,
            'nameAr' => $service->name_ar,
            'name_ar' => $service->name_ar,
            'descriptionEn' => $service->description_en,
            'description_en' => $service->description_en,
            'descriptionAr' => $service->description_ar,
            'description_ar' => $service->description_ar,
            'price' => (float) $service->price,
            'discountPercentage' => $service->discount_percentage ? (float) $service->discount_percentage : null,
            'discount_percentage' => $service->discount_percentage ? (float) $service->discount_percentage : null,
            'duration' => $service->duration,
            'category' => $service->category,
            'icon' => $service->icon ? URL::asset('storage/' . $service->icon) : null,
            'icon_url' => $service->icon ? URL::asset('storage/' . $service->icon) : null,
            'svg' => $service->svg,
            'isActive' => $service->is_active,
            'is_active' => $service->is_active,
            'order' => $service->order,
            'created_at' => $service->created_at,
            'updated_at' => $service->updated_at,
        ];
    }
}

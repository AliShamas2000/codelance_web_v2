<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class GalleryController extends Controller
{
    /**
     * Display a listing of gallery items.
     */
    public function index(Request $request)
    {
        $query = Gallery::with('service');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by service
        if ($request->has('service') && $request->service !== 'all') {
            $query->where('service_id', $request->service);
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 12);
        $galleryItems = $query->paginate($perPage);

        // Format gallery items for API response
        $formattedItems = $galleryItems->map(function ($item) {
            return $this->formatGalleryItem($item);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedItems,
            'total' => $galleryItems->total(),
            'per_page' => $galleryItems->perPage(),
            'current_page' => $galleryItems->currentPage(),
            'total_pages' => $galleryItems->lastPage(),
        ]);
    }

    /**
     * Store a newly created gallery item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120', // 5MB max
            'service_id' => 'nullable|exists:services,id',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $imagePath = null;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('gallery', 'public');
        }

        $galleryItem = Gallery::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'service_id' => $validated['service_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gallery item created successfully',
            'data' => $this->formatGalleryItem($galleryItem->load('service')),
        ], 201);
    }

    /**
     * Display the specified gallery item.
     */
    public function show(string $id)
    {
        $galleryItem = Gallery::with('service')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatGalleryItem($galleryItem),
        ]);
    }

    /**
     * Update the specified gallery item.
     */
    public function update(Request $request, string $id)
    {
        $galleryItem = Gallery::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'service_id' => 'nullable|exists:services,id',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'remove_image' => 'nullable|boolean',
        ]);

        // Handle image update/removal
        if ($request->boolean('remove_image') && $galleryItem->image) {
            Storage::disk('public')->delete($galleryItem->image);
            $galleryItem->image = null;
        } elseif ($request->hasFile('image')) {
            // Delete old image if exists
            if ($galleryItem->image) {
                Storage::disk('public')->delete($galleryItem->image);
            }
            $galleryItem->image = $request->file('image')->store('gallery', 'public');
        }

        // Update other fields
        if (isset($validated['title'])) {
            $galleryItem->title = $validated['title'];
        }
        if (isset($validated['description'])) {
            $galleryItem->description = $validated['description'];
        }
        if (isset($validated['service_id'])) {
            $galleryItem->service_id = $validated['service_id'];
        }
        if (isset($validated['is_active'])) {
            $galleryItem->is_active = $validated['is_active'];
        }
        if (isset($validated['order'])) {
            $galleryItem->order = $validated['order'];
        }

        $galleryItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Gallery item updated successfully',
            'data' => $this->formatGalleryItem($galleryItem->load('service')),
        ]);
    }

    /**
     * Remove the specified gallery item.
     */
    public function destroy(string $id)
    {
        $galleryItem = Gallery::findOrFail($id);

        // Delete image if exists
        if ($galleryItem->image) {
            Storage::disk('public')->delete($galleryItem->image);
        }

        $galleryItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery item deleted successfully',
        ]);
    }

    /**
     * Format gallery item data for API response.
     */
    private function formatGalleryItem(Gallery $item)
    {
        return [
            'id' => $item->id,
            'title' => $item->title,
            'description' => $item->description,
            'image' => $item->image ? URL::asset('storage/' . $item->image) : null,
            'image_url' => $item->image ? URL::asset('storage/' . $item->image) : null,
            'url' => $item->image ? URL::asset('storage/' . $item->image) : null,
            'service_id' => $item->service_id,
            'service' => $item->service ? [
                'id' => $item->service->id,
                'nameEn' => $item->service->name_en,
                'nameAr' => $item->service->name_ar,
                'name' => $item->service->name_en,
            ] : null,
            'category' => $item->service ? $item->service->name_en : null, // For backward compatibility
            'isActive' => $item->is_active,
            'is_active' => $item->is_active,
            'order' => $item->order,
            'created_at' => $item->created_at,
            'updated_at' => $item->updated_at,
        ];
    }
}

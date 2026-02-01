<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutUs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class AboutUsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AboutUs::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', "%{$search}%")
                    ->orWhere('title_ar', 'like', "%{$search}%")
                    ->orWhere('description_en', 'like', "%{$search}%")
                    ->orWhere('description_ar', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('is_active', $request->boolean('status'));
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $limit = $request->get('limit', null);
        
        if ($limit) {
            $sections = $query->limit($limit)->get();
            $formattedSections = $sections->map(function ($section) {
                return $this->formatAboutUsSection($section);
            });
            
            return response()->json([
                'success' => true,
                'data' => $formattedSections,
            ]);
        }

        $sections = $query->paginate($perPage);
        $formattedSections = $sections->map(function ($section) {
            return $this->formatAboutUsSection($section);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedSections,
            'pagination' => [
                'current_page' => $sections->currentPage(),
                'last_page' => $sections->lastPage(),
                'per_page' => $sections->perPage(),
                'total' => $sections->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120', // 5MB max
            'features' => 'nullable|string', // JSON string from frontend
            'type' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $imagePath = null;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('about-us', 'public');
        }

        // Parse features JSON if provided
        $features = null;
        if ($request->has('features') && $request->features) {
            $features = json_decode($request->features, true);
        }

        $aboutUs = AboutUs::create([
            'title_en' => $validated['title_en'],
            'title_ar' => $validated['title_ar'] ?? null,
            'description_en' => $validated['description_en'] ?? null,
            'description_ar' => $validated['description_ar'] ?? null,
            'image' => $imagePath,
            'features' => $features,
            'type' => $validated['type'] ?? 'Content Block',
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'About Us section created successfully',
            'data' => $this->formatAboutUsSection($aboutUs),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $aboutUs = AboutUs::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatAboutUsSection($aboutUs),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $aboutUs = AboutUs::findOrFail($id);

        $validated = $request->validate([
            'title_en' => 'sometimes|required|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'features' => 'nullable|string', // JSON string from frontend
            'type' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'remove_image' => 'nullable|boolean',
        ]);

        // Handle image update/removal
        if ($request->boolean('remove_image') && $aboutUs->image) {
            Storage::disk('public')->delete($aboutUs->image);
            $aboutUs->image = null;
        } elseif ($request->hasFile('image')) {
            // Delete old image if exists
            if ($aboutUs->image) {
                Storage::disk('public')->delete($aboutUs->image);
            }
            $aboutUs->image = $request->file('image')->store('about-us', 'public');
        }

        // Update other fields
        if (isset($validated['title_en'])) {
            $aboutUs->title_en = $validated['title_en'];
        }
        if (isset($validated['title_ar'])) {
            $aboutUs->title_ar = $validated['title_ar'];
        }
        if (isset($validated['description_en'])) {
            $aboutUs->description_en = $validated['description_en'];
        }
        if (isset($validated['description_ar'])) {
            $aboutUs->description_ar = $validated['description_ar'];
        }
        if (isset($validated['type'])) {
            $aboutUs->type = $validated['type'];
        }
        if (isset($validated['is_active'])) {
            $aboutUs->is_active = $validated['is_active'];
        }
        if (isset($validated['order'])) {
            $aboutUs->order = $validated['order'];
        }

        // Parse and update features if provided
        if ($request->has('features')) {
            if ($request->features) {
                $features = json_decode($request->features, true);
                $aboutUs->features = $features;
            } else {
                $aboutUs->features = null;
            }
        }

        $aboutUs->save();

        return response()->json([
            'success' => true,
            'message' => 'About Us section updated successfully',
            'data' => $this->formatAboutUsSection($aboutUs),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $aboutUs = AboutUs::findOrFail($id);

        // Delete image if exists
        if ($aboutUs->image) {
            Storage::disk('public')->delete($aboutUs->image);
        }

        $aboutUs->delete();

        return response()->json([
            'success' => true,
            'message' => 'About Us section deleted successfully',
        ]);
    }

    /**
     * Format About Us section data for API response.
     */
    private function formatAboutUsSection(AboutUs $section)
    {
        return [
            'id' => $section->id,
            'titleEn' => $section->title_en,
            'title_en' => $section->title_en,
            'title' => $section->title_en,
            'titleAr' => $section->title_ar,
            'title_ar' => $section->title_ar,
            'descriptionEn' => $section->description_en,
            'description_en' => $section->description_en,
            'description' => $section->description_en,
            'descriptionAr' => $section->description_ar,
            'description_ar' => $section->description_ar,
            'image' => $section->image ? URL::asset('storage/' . $section->image) : null,
            'imageUrl' => $section->image ? URL::asset('storage/' . $section->image) : null,
            'image_url' => $section->image ? URL::asset('storage/' . $section->image) : null,
            'features' => $section->features ?? [],
            'type' => $section->type,
            'status' => $section->is_active ? 'active' : 'inactive',
            'is_active' => $section->is_active,
            'order' => $section->order,
            'lastUpdated' => $section->updated_at ? $section->updated_at->diffForHumans() : null,
            'created_at' => $section->created_at,
            'updated_at' => $section->updated_at,
        ];
    }
}

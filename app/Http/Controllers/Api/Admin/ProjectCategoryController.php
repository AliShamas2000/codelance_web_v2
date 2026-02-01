<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectCategoryController extends Controller
{
    /**
     * Display a listing of project categories.
     */
    public function index(Request $request)
    {
        $query = ProjectCategory::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Sort
        $sortBy = $request->get('sort', 'order');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $categories = $query->paginate($perPage);

        // Format categories for API response
        $formattedCategories = $categories->map(function ($category) {
            return $this->formatCategory($category);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedCategories,
            'total' => $categories->total(),
            'per_page' => $categories->perPage(),
            'current_page' => $categories->currentPage(),
            'total_pages' => $categories->lastPage(),
        ]);
    }

    /**
     * Store a newly created project category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:project_categories,slug',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
            // Ensure uniqueness
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (ProjectCategory::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $category = ProjectCategory::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project category created successfully',
            'data' => $this->formatCategory($category),
        ], 201);
    }

    /**
     * Display the specified project category.
     */
    public function show(ProjectCategory $projectCategory)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatCategory($projectCategory),
        ]);
    }

    /**
     * Update the specified project category.
     */
    public function update(Request $request, ProjectCategory $projectCategory)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:project_categories,slug,' . $projectCategory->id,
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        if (isset($validated['name']) && !isset($validated['slug'])) {
            // Generate slug if name changed but slug not provided
            $newSlug = Str::slug($validated['name']);
            if ($newSlug !== $projectCategory->slug) {
                $originalSlug = $newSlug;
                $counter = 1;
                while (ProjectCategory::where('slug', $newSlug)->where('id', '!=', $projectCategory->id)->exists()) {
                    $newSlug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                $validated['slug'] = $newSlug;
            }
        }

        $projectCategory->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project category updated successfully',
            'data' => $this->formatCategory($projectCategory->fresh()),
        ]);
    }

    /**
     * Remove the specified project category.
     */
    public function destroy(ProjectCategory $projectCategory)
    {
        // Check if category has projects
        if ($projectCategory->projects()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with associated projects. Please reassign or delete projects first.',
            ], 422);
        }

        $projectCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project category deleted successfully',
        ]);
    }

    /**
     * Update project category order (for drag and drop reordering).
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:project_categories,id',
            'categories.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['categories'] as $categoryData) {
            ProjectCategory::where('id', $categoryData['id'])
                ->update(['order' => $categoryData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project category order updated successfully',
        ]);
    }

    /**
     * Format project category data for API response.
     */
    private function formatCategory(ProjectCategory $category)
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'isActive' => $category->is_active,
            'is_active' => $category->is_active, // Keep for backward compatibility
            'order' => $category->order,
            'projectsCount' => $category->projects()->count(),
            'createdAt' => $category->created_at,
            'updatedAt' => $category->updated_at,
            'created_at' => $category->created_at, // Keep for backward compatibility
            'updated_at' => $category->updated_at, // Keep for backward compatibility
        ];
    }
}

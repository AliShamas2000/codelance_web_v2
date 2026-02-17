<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        $query = Project::with('category');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('client_name', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id !== 'all') {
            $query->where('project_category_id', $request->category_id);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by featured
        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        // Sort
        $sortBy = $request->get('sort', 'order');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $projects = $query->paginate($perPage);

        // Format projects for API response
        $formattedProjects = $projects->map(function ($project) {
            return $this->formatProject($project);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedProjects,
            'total' => $projects->total(),
            'per_page' => $projects->perPage(),
            'current_page' => $projects->currentPage(),
            'total_pages' => $projects->lastPage(),
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        // Handle tags - can be JSON string or array
        $tags = [];
        if ($request->has('tags')) {
            if (is_string($request->tags)) {
                $decoded = json_decode($request->tags, true);
                $tags = is_array($decoded) ? $decoded : [];
            } elseif (is_array($request->tags)) {
                $tags = $request->tags;
            }
        }

        $validated = $request->validate([
            'project_category_id' => 'nullable|exists:project_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'tags' => 'nullable',
            'client_name' => 'nullable|string|max:255',
            'project_date' => 'nullable|date',
            'project_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $storedImages = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $storedImages[] = $imageFile->store('projects/images', 'public');
            }
        }

        if ($request->hasFile('image')) {
            $storedImages[] = $request->file('image')->store('projects/images', 'public');
        }

        $storedImages = array_values(array_unique($storedImages));
        $primaryImage = count($storedImages) > 0 ? $storedImages[0] : null;

        $project = Project::create([
            'project_category_id' => $validated['project_category_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image' => $primaryImage,
            'images' => count($storedImages) > 0 ? $storedImages : null,
            'tags' => $tags,
            'client_name' => $validated['client_name'] ?? null,
            'project_date' => $validated['project_date'] ?? null,
            'project_url' => $validated['project_url'] ?? null,
            'github_url' => $validated['github_url'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $this->formatProject($project->load('category')),
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatProject($project->load('category')),
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        // Handle tags - can be JSON string or array
        $tags = null;
        if ($request->has('tags')) {
            if (is_string($request->tags)) {
                $decoded = json_decode($request->tags, true);
                $tags = is_array($decoded) ? $decoded : [];
            } elseif (is_array($request->tags)) {
                $tags = $request->tags;
            }
        }

        $validated = $request->validate([
            'project_category_id' => 'nullable|exists:project_categories,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
            'tags' => 'nullable',
            'client_name' => 'nullable|string|max:255',
            'project_date' => 'nullable|date',
            'project_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'remove_image' => 'nullable|boolean',
        ]);

        $currentImages = is_array($project->images) ? $project->images : [];
        if (empty($currentImages) && $project->image) {
            $currentImages = [$project->image];
        }

        $incomingExistingImages = null;
        if ($request->has('existing_images')) {
            $incomingExistingImages = array_values(array_filter(
                $validated['existing_images'] ?? [],
                fn ($path) => is_string($path) && $path !== ''
            ));
            $incomingExistingImages = array_values(array_intersect($currentImages, $incomingExistingImages));
        }

        $nextImages = $incomingExistingImages ?? $currentImages;

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $nextImages[] = $imageFile->store('projects/images', 'public');
            }
        }

        if ($request->hasFile('image')) {
            $nextImages[] = $request->file('image')->store('projects/images', 'public');
        }

        $nextImages = array_values(array_unique($nextImages));

        if ($request->boolean('remove_image') && !$request->has('existing_images') && !$request->hasFile('images') && !$request->hasFile('image')) {
            $nextImages = [];
        }

        $removedImages = array_values(array_diff($currentImages, $nextImages));
        foreach ($removedImages as $removedImagePath) {
            Storage::disk('public')->delete($removedImagePath);
        }

        if (count($nextImages) > 0) {
            $validated['images'] = $nextImages;
            $validated['image'] = $nextImages[0];
        } else {
            $validated['images'] = null;
            $validated['image'] = null;
        }

        if (!$request->hasFile('image') && !$request->hasFile('images') && !$request->has('existing_images') && !$request->boolean('remove_image')) {
            unset($validated['image']);
            unset($validated['images']);
        }

        // Handle tags update
        if ($tags !== null) {
            $validated['tags'] = $tags;
        } else {
            unset($validated['tags']);
        }

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $this->formatProject($project->fresh()->load('category')),
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        // Delete image if exists
        $allImages = is_array($project->images) ? $project->images : [];
        if (empty($allImages) && $project->image) {
            $allImages = [$project->image];
        }

        foreach (array_values(array_unique($allImages)) as $imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
        ]);
    }

    /**
     * Update project order (for drag and drop reordering).
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'projects' => 'required|array',
            'projects.*.id' => 'required|exists:projects,id',
            'projects.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['projects'] as $projectData) {
            Project::where('id', $projectData['id'])
                ->update(['order' => $projectData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project order updated successfully',
        ]);
    }

    /**
     * Format project data for API response.
     */
    private function formatProject(Project $project)
    {
        $imagePaths = is_array($project->images) ? $project->images : [];
        if (empty($imagePaths) && $project->image) {
            $imagePaths = [$project->image];
        }
        $imagePaths = array_values(array_unique(array_filter($imagePaths)));

        $imageUrls = array_map(function ($path) {
            return URL::asset('storage/' . $path);
        }, $imagePaths);

        $imageUrl = count($imageUrls) > 0 ? $imageUrls[0] : null;
        
        return [
            'id' => $project->id,
            'title' => $project->title,
            'description' => $project->description,
            'image' => $imageUrl,
            'image_url' => $imageUrl, // Keep for backward compatibility
            'images' => $imageUrls,
            'image_paths' => $imagePaths,
            'tags' => $project->tags ?? [],
            'categoryId' => $project->project_category_id,
            'category_id' => $project->project_category_id, // Keep for backward compatibility
            'category' => $project->category ? [
                'id' => $project->category->id,
                'name' => $project->category->name,
                'slug' => $project->category->slug,
            ] : null,
            'clientName' => $project->client_name,
            'client_name' => $project->client_name, // Keep for backward compatibility
            'projectDate' => $project->project_date ? $project->project_date->format('Y-m-d') : null,
            'project_date' => $project->project_date ? $project->project_date->format('Y-m-d') : null, // Keep for backward compatibility
            'projectUrl' => $project->project_url,
            'project_url' => $project->project_url, // Keep for backward compatibility
            'githubUrl' => $project->github_url,
            'github_url' => $project->github_url, // Keep for backward compatibility
            'isFeatured' => $project->is_featured,
            'is_featured' => $project->is_featured, // Keep for backward compatibility
            'isActive' => $project->is_active,
            'is_active' => $project->is_active, // Keep for backward compatibility
            'order' => $project->order,
            'createdAt' => $project->created_at,
            'updatedAt' => $project->updated_at,
            'created_at' => $project->created_at, // Keep for backward compatibility
            'updated_at' => $project->updated_at, // Keep for backward compatibility
        ];
    }
}

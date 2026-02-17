<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class ProjectController extends Controller
{
    /**
     * Get active projects for public display.
     */
    public function index(Request $request)
    {
        $query = Project::with('category')
            ->where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        // Optional: filter by category slug
        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category)
                  ->orWhere('id', $request->category);
            });
        }

        // Optional: filter by featured
        if ($request->has('is_featured') && $request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        // Optional: limit
        $limit = $request->get('limit');
        if ($limit) {
            $projects = $query->limit($limit)->get();
        } else {
            $projects = $query->get();
        }

        // Format projects for public API response
        $formattedProjects = $projects->map(function ($project) {
            return $this->formatProject($project);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedProjects,
        ]);
    }

    /**
     * Display the specified project.
     */
    public function show(string $id)
    {
        $project = Project::with('category')
            ->where('is_active', true)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatProject($project),
        ]);
    }

    /**
     * Get project categories for filtering.
     */
    public function categories()
    {
        $categories = \App\Models\ProjectCategory::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name' => $category->name,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Format project data for public API response.
     */
    private function formatProject(Project $project)
    {
        // Format tags - ensure they're an array
        $tags = [];
        if (is_array($project->tags)) {
            $tags = $project->tags;
        } elseif (is_string($project->tags)) {
            $decoded = json_decode($project->tags, true);
            $tags = is_array($decoded) ? $decoded : [];
        }

        // Get category slug for filtering
        $categorySlug = null;
        if ($project->category) {
            $categorySlug = $project->category->slug;
        }

        $imagePaths = is_array($project->images) ? $project->images : [];
        if (empty($imagePaths) && $project->image) {
            $imagePaths = [$project->image];
        }
        $imagePaths = array_values(array_unique(array_filter($imagePaths)));
        $imageUrls = array_map(function ($path) {
            return URL::asset('storage/' . $path);
        }, $imagePaths);
        $coverImage = count($imageUrls) > 0 ? $imageUrls[0] : null;

        return [
            'id' => $project->id,
            'title' => $project->title,
            'description' => $project->description,
            'image' => $coverImage,
            'imageUrl' => $coverImage, // Keep for backward compatibility
            'image_url' => $coverImage, // Keep for backward compatibility
            'images' => $imageUrls,
            'tags' => $tags,
            'category' => $categorySlug,
            'categoryId' => $project->project_category_id,
            'category_id' => $project->project_category_id, // Keep for backward compatibility
            'categoryName' => $project->category ? $project->category->name : null,
            'clientName' => $project->client_name,
            'client_name' => $project->client_name, // Keep for backward compatibility
            'projectDate' => $project->project_date ? $project->project_date->format('Y-m-d') : null,
            'project_date' => $project->project_date ? $project->project_date->format('Y-m-d') : null, // Keep for backward compatibility
            'projectUrl' => $project->project_url,
            'project_url' => $project->project_url, // Keep for backward compatibility
            'githubUrl' => $project->github_url,
            'github_url' => $project->github_url, // Keep for backward compatibility
            'isFeatured' => (bool) $project->is_featured,
            'is_featured' => (bool) $project->is_featured, // Keep for backward compatibility
            'order' => $project->order,
        ];
    }
}

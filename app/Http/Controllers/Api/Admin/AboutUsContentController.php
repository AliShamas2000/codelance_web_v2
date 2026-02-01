<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutUsContent;
use Illuminate\Http\Request;

class AboutUsContentController extends Controller
{
    /**
     * Display a listing of about us content.
     */
    public function index(Request $request)
    {
        $query = AboutUsContent::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
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
        $contents = $query->paginate($perPage);

        // Format contents for API response
        $formattedContents = $contents->map(function ($content) {
            return $this->formatContent($content);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedContents,
            'total' => $contents->total(),
            'per_page' => $contents->perPage(),
            'current_page' => $contents->currentPage(),
            'total_pages' => $contents->lastPage(),
        ]);
    }

    /**
     * Store a newly created about us content.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'stats' => 'required|array|min:1',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.label' => 'required|string|max:255',
            'primary_button_text' => 'nullable|string|max:255',
            'secondary_button_text' => 'nullable|string|max:255',
            'code_snippet' => 'required|array',
            'code_snippet.mission' => 'required|string|max:255',
            'code_snippet.stack' => 'required|array',
            'code_snippet.stack.*' => 'string|max:255',
            'code_snippet.deliver' => 'required|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $content = AboutUsContent::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'stats' => $validated['stats'],
            'primary_button_text' => $validated['primary_button_text'] ?? null,
            'secondary_button_text' => $validated['secondary_button_text'] ?? null,
            'code_snippet' => $validated['code_snippet'],
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'About us content created successfully',
            'data' => $this->formatContent($content),
        ], 201);
    }

    /**
     * Display the specified about us content.
     */
    public function show(AboutUsContent $aboutUsContent)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatContent($aboutUsContent),
        ]);
    }

    /**
     * Update the specified about us content.
     */
    public function update(Request $request, AboutUsContent $aboutUsContent)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'stats' => 'sometimes|required|array|min:1',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.label' => 'required|string|max:255',
            'primary_button_text' => 'nullable|string|max:255',
            'secondary_button_text' => 'nullable|string|max:255',
            'code_snippet' => 'sometimes|required|array',
            'code_snippet.mission' => 'required|string|max:255',
            'code_snippet.stack' => 'required|array',
            'code_snippet.stack.*' => 'string|max:255',
            'code_snippet.deliver' => 'required|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $aboutUsContent->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'About us content updated successfully',
            'data' => $this->formatContent($aboutUsContent->fresh()),
        ]);
    }

    /**
     * Remove the specified about us content.
     */
    public function destroy(AboutUsContent $aboutUsContent)
    {
        $aboutUsContent->delete();

        return response()->json([
            'success' => true,
            'message' => 'About us content deleted successfully',
        ]);
    }

    /**
     * Format about us content data for API response.
     */
    private function formatContent(AboutUsContent $content)
    {
        return [
            'id' => $content->id,
            'title' => $content->title,
            'description' => $content->description,
            'stats' => $content->stats ?? [],
            'primaryButtonText' => $content->primary_button_text,
            'primary_button_text' => $content->primary_button_text, // Keep for backward compatibility
            'secondaryButtonText' => $content->secondary_button_text,
            'secondary_button_text' => $content->secondary_button_text, // Keep for backward compatibility
            'codeSnippet' => $content->code_snippet ?? [
                'mission' => 'Excellence',
                'stack' => ['AI', 'Cloud'],
                'deliver' => true
            ],
            'code_snippet' => $content->code_snippet ?? [
                'mission' => 'Excellence',
                'stack' => ['AI', 'Cloud'],
                'deliver' => true
            ], // Keep for backward compatibility
            'isActive' => $content->is_active,
            'is_active' => $content->is_active, // Keep for backward compatibility
            'order' => $content->order,
            'createdAt' => $content->created_at,
            'updatedAt' => $content->updated_at,
            'created_at' => $content->created_at, // Keep for backward compatibility
            'updated_at' => $content->updated_at, // Keep for backward compatibility
        ];
    }
}

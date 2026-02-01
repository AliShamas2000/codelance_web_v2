<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProcessStep;
use Illuminate\Http\Request;

class ProcessStepController extends Controller
{
    /**
     * Display a listing of process steps.
     */
    public function index(Request $request)
    {
        $query = ProcessStep::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('step_number', 'like', "%{$search}%");
            });
        }

        // Filter by position
        if ($request->has('position') && $request->position !== 'all') {
            $query->where('position', $request->position);
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
        $steps = $query->paginate($perPage);

        // Format steps for API response
        $formattedSteps = $steps->map(function ($step) {
            return $this->formatStep($step);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedSteps,
            'total' => $steps->total(),
            'per_page' => $steps->perPage(),
            'current_page' => $steps->currentPage(),
            'total_pages' => $steps->lastPage(),
        ]);
    }

    /**
     * Store a newly created process step.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'step_number' => 'required|string|max:10',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:255',
            'position' => 'nullable|string|in:left,right',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $step = ProcessStep::create([
            'step_number' => $validated['step_number'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'icon' => $validated['icon'] ?? 'code',
            'position' => $validated['position'] ?? 'left',
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Process step created successfully',
            'data' => $this->formatStep($step),
        ], 201);
    }

    /**
     * Display the specified process step.
     */
    public function show(ProcessStep $processStep)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatStep($processStep),
        ]);
    }

    /**
     * Update the specified process step.
     */
    public function update(Request $request, ProcessStep $processStep)
    {
        $validated = $request->validate([
            'step_number' => 'sometimes|required|string|max:10',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'icon' => 'nullable|string|max:255',
            'position' => 'nullable|string|in:left,right',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        if (isset($validated['step_number'])) {
            $processStep->step_number = $validated['step_number'];
        }
        if (isset($validated['title'])) {
            $processStep->title = $validated['title'];
        }
        if (isset($validated['description'])) {
            $processStep->description = $validated['description'];
        }
        if (isset($validated['icon'])) {
            $processStep->icon = $validated['icon'];
        }
        if (isset($validated['position'])) {
            $processStep->position = $validated['position'];
        }
        if (isset($validated['is_active'])) {
            $processStep->is_active = $validated['is_active'];
        }
        if (isset($validated['order'])) {
            $processStep->order = $validated['order'];
        }

        $processStep->save();

        return response()->json([
            'success' => true,
            'message' => 'Process step updated successfully',
            'data' => $this->formatStep($processStep),
        ]);
    }

    /**
     * Remove the specified process step.
     */
    public function destroy(ProcessStep $processStep)
    {
        $processStep->delete();

        return response()->json([
            'success' => true,
            'message' => 'Process step deleted successfully',
        ]);
    }

    /**
     * Update process step order (for drag and drop reordering).
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'steps' => 'required|array',
            'steps.*.id' => 'required|exists:process_steps,id',
            'steps.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['steps'] as $stepData) {
            ProcessStep::where('id', $stepData['id'])
                ->update(['order' => $stepData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Process step order updated successfully',
        ]);
    }

    /**
     * Format process step data for API response.
     */
    private function formatStep(ProcessStep $step)
    {
        return [
            'id' => $step->id,
            'stepNumber' => $step->step_number,
            'step_number' => $step->step_number, // Keep for backward compatibility
            'title' => $step->title,
            'description' => $step->description,
            'icon' => $step->icon,
            'position' => $step->position,
            'isActive' => $step->is_active,
            'is_active' => $step->is_active, // Keep for backward compatibility
            'order' => $step->order,
            'createdAt' => $step->created_at,
            'updatedAt' => $step->updated_at,
            'created_at' => $step->created_at, // Keep for backward compatibility
            'updated_at' => $step->updated_at, // Keep for backward compatibility
        ];
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProcessStep;
use Illuminate\Http\Request;

class ProcessStepController extends Controller
{
    /**
     * Get active process steps for public display.
     */
    public function index(Request $request)
    {
        $query = ProcessStep::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'asc');

        // Optional: limit
        $limit = $request->get('limit');
        if ($limit) {
            $steps = $query->limit($limit)->get();
        } else {
            $steps = $query->get();
        }

        // Format steps for public API response
        $formattedSteps = $steps->map(function ($step) {
            return $this->formatStep($step);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedSteps,
        ]);
    }

    /**
     * Display the specified process step.
     */
    public function show(string $id)
    {
        $step = ProcessStep::where('is_active', true)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatStep($step),
        ]);
    }

    /**
     * Format process step data for public API response.
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
            'order' => $step->order,
        ];
    }
}


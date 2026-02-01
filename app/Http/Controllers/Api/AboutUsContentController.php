<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutUsContent;
use Illuminate\Http\Request;

class AboutUsContentController extends Controller
{
    /**
     * Get active about us content for public display.
     */
    public function index(Request $request)
    {
        $content = AboutUsContent::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$content) {
            return response()->json([
                'success' => true,
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatContent($content),
        ]);
    }

    /**
     * Display the specified about us content.
     */
    public function show(string $id)
    {
        $content = AboutUsContent::where('is_active', true)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatContent($content),
        ]);
    }

    /**
     * Format about us content data for public API response.
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
        ];
    }
}

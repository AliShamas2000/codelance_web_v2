<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactSubmissionController extends Controller
{
    /**
     * Store a newly created contact submission.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'project_id' => 'nullable|exists:projects,id',
                'message' => 'required|string|max:5000',
            ]);

            $submission = ContactSubmission::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'project_id' => $validated['project_id'] ?? null,
                'message' => $validated['message'],
                'status' => 'new',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your message! We will get back to you soon.',
                'data' => [
                    'id' => $submission->id,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save your message. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}


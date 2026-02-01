<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactSubmissionController extends Controller
{
    /**
     * Display a listing of contact submissions.
     */
    public function index(Request $request)
    {
        $query = ContactSubmission::with('project');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by project
        if ($request->has('project_id') && $request->project_id !== 'all') {
            $query->where('project_id', $request->project_id);
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $submissions = $query->paginate($perPage);

        // Format submissions for API response
        $formattedSubmissions = $submissions->map(function ($submission) {
            return $this->formatSubmission($submission);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedSubmissions,
            'total' => $submissions->total(),
            'per_page' => $submissions->perPage(),
            'current_page' => $submissions->currentPage(),
            'total_pages' => $submissions->lastPage(),
        ]);
    }

    /**
     * Display the specified contact submission.
     */
    public function show(ContactSubmission $contactSubmission)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatSubmission($contactSubmission->load('project')),
        ]);
    }

    /**
     * Update the specified contact submission.
     */
    public function update(Request $request, ContactSubmission $contactSubmission)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:new,read,replied,archived',
            'admin_notes' => 'nullable|string',
        ]);

        $contactSubmission->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Contact submission updated successfully',
            'data' => $this->formatSubmission($contactSubmission->fresh()->load('project')),
        ]);
    }

    /**
     * Remove the specified contact submission.
     */
    public function destroy(ContactSubmission $contactSubmission)
    {
        $contactSubmission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact submission deleted successfully',
        ]);
    }

    /**
     * Format contact submission data for API response.
     */
    private function formatSubmission(ContactSubmission $submission)
    {
        return [
            'id' => $submission->id,
            'name' => $submission->name,
            'email' => $submission->email,
            'projectId' => $submission->project_id,
            'project_id' => $submission->project_id, // Keep for backward compatibility
            'project' => $submission->project ? [
                'id' => $submission->project->id,
                'title' => $submission->project->title,
            ] : null,
            'message' => $submission->message,
            'status' => $submission->status,
            'adminNotes' => $submission->admin_notes,
            'admin_notes' => $submission->admin_notes, // Keep for backward compatibility
            'createdAt' => $submission->created_at,
            'updatedAt' => $submission->updated_at,
            'created_at' => $submission->created_at, // Keep for backward compatibility
            'updated_at' => $submission->updated_at, // Keep for backward compatibility
        ];
    }
}


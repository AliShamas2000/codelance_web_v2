<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactSubmission extends Model
{
    protected $fillable = [
        'name',
        'email',
        'project_id',
        'message',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'project_id' => 'integer',
    ];

    /**
     * Get the project for this submission.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}

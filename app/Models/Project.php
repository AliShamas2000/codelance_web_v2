<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    protected $fillable = [
        'project_category_id',
        'title',
        'description',
        'image',
        'images',
        'tags',
        'client_name',
        'project_date',
        'project_url',
        'github_url',
        'is_featured',
        'is_active',
        'order',
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
        'project_date' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the category that owns the project.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutUsContent extends Model
{
    protected $table = 'about_us_content';

    protected $fillable = [
        'title',
        'description',
        'stats',
        'primary_button_text',
        'secondary_button_text',
        'code_snippet',
        'is_active',
        'order',
    ];

    protected $casts = [
        'stats' => 'array',
        'code_snippet' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}

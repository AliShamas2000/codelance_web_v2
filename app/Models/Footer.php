<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    protected $table = 'footer';

    protected $fillable = [
        'logo',
        'about_en',
        'about_ar',
        'social_links',
        'phone',
        'email',
        'address',
        'working_hours',
        'footer_links',
        'map_embed',
    ];

    protected $casts = [
        'social_links' => 'array',
        'working_hours' => 'array',
        'footer_links' => 'array',
    ];
}

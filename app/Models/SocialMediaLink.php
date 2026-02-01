<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialMediaLink extends Model
{
    protected $fillable = [
        'user_id',
        'platform',
        'url',
    ];

    /**
     * Get the user that owns the social media link.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

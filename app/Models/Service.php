<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
        'price',
        'discount_percentage',
        'duration',
        'category',
        'icon',
        'is_active',
        'order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'duration' => 'integer',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the gallery items for the service.
     */
    public function gallery()
    {
        return $this->hasMany(Gallery::class);
    }
}

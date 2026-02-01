<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BarberAvailability extends Model
{
    protected $table = 'barber_availability';

    protected $fillable = [
        'user_id',
        'timezone',
        'timezone_label',
        'availability_data',
    ];

    protected $casts = [
        'availability_data' => 'array',
    ];

    /**
     * Get the user (barber) that owns this availability.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

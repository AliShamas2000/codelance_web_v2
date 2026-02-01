<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Review extends Model
{
    protected $fillable = [
        'appointment_id',
        'barber_id',
        'rating',
        'feedback',
        'recommend',
        'phone',
    ];

    protected $casts = [
        'recommend' => 'boolean',
        'rating' => 'integer',
    ];

    /**
     * Get the appointment for this review.
     */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get the barber (user) for this review.
     */
    public function barber(): BelongsTo
    {
        return $this->belongsTo(User::class, 'barber_id');
    }

    /**
     * Get the services for this review.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'review_services')
            ->withTimestamps();
    }
}


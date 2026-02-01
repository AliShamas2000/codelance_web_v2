<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Appointment extends Model
{
    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'barber_id',
        'appointment_date',
        'appointment_time',
        'notes',
        'status',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        // Don't cast appointment_time - it's a TIME column, handle it as string
        // 'appointment_time' => 'datetime:H:i',
    ];

    /**
     * Get the barber (user) for this appointment.
     */
    public function barber(): BelongsTo
    {
        return $this->belongsTo(User::class, 'barber_id');
    }

    /**
     * Get the services for this appointment.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'appointment_services')
            ->withTimestamps();
    }
}

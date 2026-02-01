<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlockedTime extends Model
{
    protected $table = 'blocked_times';

    protected $fillable = [
        'user_id',
        'blocked_date',
        'start_time',
        'end_time',
        'reason',
    ];

    protected $casts = [
        'blocked_date' => 'date',
        'start_time' => 'string',
        'end_time' => 'string',
    ];

    /**
     * Get the user (barber) that owns this blocked time.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'job_title',
        'bio',
        'profile_photo',
        'status',
        'default_calendar_view',
        'language',
        'timezone',
        'start_of_week',
        'auto_confirm_appointments',
        'appointment_buffer',
        'minimum_notice',
        'new_appointment_alerts',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            // Password is stored as MD5, not hashed
        ];
    }

    /**
     * Get the social media links for the user.
     */
    public function socialMediaLinks()
    {
        return $this->hasMany(\App\Models\SocialMediaLink::class);
    }
}

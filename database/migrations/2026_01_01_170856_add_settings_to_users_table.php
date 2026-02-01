<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Dashboard Preferences
            if (!Schema::hasColumn('users', 'default_calendar_view')) {
                $table->string('default_calendar_view')->default('daily')->after('status');
            }
            if (!Schema::hasColumn('users', 'language')) {
                $table->string('language')->default('en')->after('default_calendar_view');
            }
            if (!Schema::hasColumn('users', 'timezone')) {
                $table->string('timezone')->default('Asia/Beirut')->after('language');
            }
            if (!Schema::hasColumn('users', 'start_of_week')) {
                $table->string('start_of_week')->default('monday')->after('timezone');
            }
            
            // Booking Configuration
            if (!Schema::hasColumn('users', 'auto_confirm_appointments')) {
                $table->boolean('auto_confirm_appointments')->default(false)->after('start_of_week');
            }
            if (!Schema::hasColumn('users', 'appointment_buffer')) {
                $table->integer('appointment_buffer')->default(5)->after('auto_confirm_appointments'); // in minutes
            }
            if (!Schema::hasColumn('users', 'minimum_notice')) {
                $table->integer('minimum_notice')->default(1)->after('appointment_buffer'); // in hours
            }
            
            // Notifications
            if (!Schema::hasColumn('users', 'new_appointment_alerts')) {
                $table->boolean('new_appointment_alerts')->default(true)->after('minimum_notice');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'default_calendar_view',
                'language',
                'timezone',
                'start_of_week',
                'auto_confirm_appointments',
                'appointment_buffer',
                'minimum_notice',
                'new_appointment_alerts'
            ]);
        });
    }
};

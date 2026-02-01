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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade');
            $table->foreignId('barber_id')->constrained('users')->onDelete('cascade');
            $table->integer('rating')->unsigned()->min(1)->max(5);
            $table->text('feedback')->nullable();
            $table->boolean('recommend')->default(true);
            $table->string('phone'); // Client phone number
            $table->timestamps();
            
            // Ensure one review per appointment
            $table->unique('appointment_id');
            
            // Index for faster queries
            $table->index('barber_id');
            $table->index('rating');
        });
        
        // Create pivot table for review_services (many-to-many relationship)
        Schema::create('review_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained('reviews')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->timestamps();
            
            // Prevent duplicate service assignments
            $table->unique(['review_id', 'service_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_services');
        Schema::dropIfExists('reviews');
    }
};


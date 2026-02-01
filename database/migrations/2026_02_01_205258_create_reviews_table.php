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
            $table->text('quote'); // Review/testimonial text
            $table->string('author_name'); // Client/author name
            $table->string('author_title')->nullable(); // Job title (e.g., CTO, Founder)
            $table->string('author_company')->nullable(); // Company name
            $table->string('author_image')->nullable(); // Profile image path
            $table->integer('rating')->default(5)->min(1)->max(5); // Star rating (1-5)
            $table->boolean('is_featured')->default(false); // Featured review
            $table->boolean('is_active')->default(true); // Active status
            $table->integer('order')->default(0); // Display order
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

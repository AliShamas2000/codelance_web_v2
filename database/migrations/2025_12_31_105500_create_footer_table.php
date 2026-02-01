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
        Schema::create('footer', function (Blueprint $table) {
            $table->id();
            $table->string('logo')->nullable();
            $table->text('about_en')->nullable();
            $table->text('about_ar')->nullable();
            $table->json('social_links')->nullable(); // Array of {platform, url} objects
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->json('working_hours')->nullable(); // Array of {day, label, enabled, startTime, endTime} objects
            $table->json('footer_links')->nullable(); // Array of {title, links: [{text, url}]} objects
            $table->text('map_embed')->nullable(); // Map embed code/URL
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footer');
    }
};

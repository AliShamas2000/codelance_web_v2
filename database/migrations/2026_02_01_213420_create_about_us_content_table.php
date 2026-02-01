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
        Schema::create('about_us_content', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Who We Are'); // Section title
            $table->text('description'); // Main description text
            $table->json('stats'); // Array of {value, label} objects
            $table->string('primary_button_text')->nullable(); // Primary button text
            $table->string('secondary_button_text')->nullable(); // Secondary button text
            $table->json('code_snippet'); // {mission, stack, deliver}
            $table->boolean('is_active')->default(true); // Active status
            $table->integer('order')->default(0); // Display order
            $table->timestamps();
            
            // Indexes
            $table->index('is_active');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_us_content');
    }
};

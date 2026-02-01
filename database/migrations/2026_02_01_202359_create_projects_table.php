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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_category_id')->nullable()->constrained('project_categories')->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image')->nullable(); // Project image/thumbnail
            $table->json('tags')->nullable(); // Array of technology tags
            $table->string('client_name')->nullable();
            $table->date('project_date')->nullable();
            $table->string('project_url')->nullable(); // Link to live project
            $table->string('github_url')->nullable(); // Link to GitHub repo
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

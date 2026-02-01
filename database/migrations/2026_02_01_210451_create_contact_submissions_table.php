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
        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Full name
            $table->string('email'); // Email address
            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('set null'); // Selected project/service
            $table->text('message'); // Message content
            $table->enum('status', ['new', 'read', 'replied', 'archived'])->default('new'); // Submission status
            $table->text('admin_notes')->nullable(); // Admin notes
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_submissions');
    }
};

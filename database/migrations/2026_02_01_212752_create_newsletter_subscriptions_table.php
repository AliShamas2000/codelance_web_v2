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
        Schema::create('newsletter_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique(); // Email address (unique)
            $table->string('status')->default('active'); // active, unsubscribed
            $table->timestamp('subscribed_at')->useCurrent(); // Subscription date
            $table->timestamp('unsubscribed_at')->nullable(); // Unsubscription date
            $table->text('admin_notes')->nullable(); // Admin notes
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index('email');
            $table->index('status');
            $table->index('subscribed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscriptions');
    }
};

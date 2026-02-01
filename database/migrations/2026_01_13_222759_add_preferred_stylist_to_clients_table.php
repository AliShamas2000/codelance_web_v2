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
        if (!Schema::hasTable('clients')) {
            return;
        }

        if (Schema::hasColumn('clients', 'preferred_stylist')) {
            return;
        }

        Schema::table('clients', function (Blueprint $table) {
            $table->unsignedBigInteger('preferred_stylist')->nullable()->after('email');
            $table->foreign('preferred_stylist')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('clients') && Schema::hasColumn('clients', 'preferred_stylist')) {
            Schema::table('clients', function (Blueprint $table) {
                $table->dropForeign(['preferred_stylist']);
                $table->dropColumn('preferred_stylist');
            });
        }
    }
};

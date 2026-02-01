<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();
        
        if ($driver === 'mysql') {
            // MySQL: Use ALTER TABLE MODIFY COLUMN
            DB::statement("ALTER TABLE `appointments` MODIFY COLUMN `status` ENUM('pending', 'accepted', 'rejected', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending'");
        } elseif ($driver === 'sqlite') {
            // SQLite: Recreate table with new schema
            // SQLite doesn't support ENUM, so we'll use a CHECK constraint
            DB::statement("
                CREATE TABLE `appointments_new` (
                    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    `full_name` TEXT NOT NULL,
                    `phone` TEXT NOT NULL,
                    `email` TEXT,
                    `barber_id` INTEGER NOT NULL,
                    `appointment_date` DATE NOT NULL,
                    `appointment_time` TIME NOT NULL,
                    `notes` TEXT,
                    `status` TEXT NOT NULL DEFAULT 'pending' CHECK(`status` IN ('pending', 'accepted', 'rejected', 'confirmed', 'completed', 'cancelled')),
                    `created_at` TIMESTAMP,
                    `updated_at` TIMESTAMP,
                    FOREIGN KEY(`barber_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
                )
            ");
            
            // Copy data
            DB::statement("
                INSERT INTO `appointments_new` 
                SELECT * FROM `appointments`
            ");
            
            // Drop old table
            DB::statement("DROP TABLE `appointments`");
            
            // Rename new table
            DB::statement("ALTER TABLE `appointments_new` RENAME TO `appointments`");
            
            // Recreate indexes
            DB::statement("CREATE INDEX `appointments_barber_id_appointment_date_appointment_time_index` ON `appointments`(`barber_id`, `appointment_date`, `appointment_time`)");
            DB::statement("CREATE INDEX `appointments_appointment_date_index` ON `appointments`(`appointment_date`)");
        } else {
            // PostgreSQL or other databases
            DB::statement("ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check");
            DB::statement("ALTER TABLE appointments ADD CONSTRAINT appointments_status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'confirmed', 'completed', 'cancelled'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();
        
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `appointments` MODIFY COLUMN `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending'");
        } elseif ($driver === 'sqlite') {
            // Revert SQLite table
            DB::statement("
                CREATE TABLE `appointments_old` (
                    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    `full_name` TEXT NOT NULL,
                    `phone` TEXT NOT NULL,
                    `email` TEXT,
                    `barber_id` INTEGER NOT NULL,
                    `appointment_date` DATE NOT NULL,
                    `appointment_time` TIME NOT NULL,
                    `notes` TEXT,
                    `status` TEXT NOT NULL DEFAULT 'pending' CHECK(`status` IN ('pending', 'confirmed', 'completed', 'cancelled')),
                    `created_at` TIMESTAMP,
                    `updated_at` TIMESTAMP,
                    FOREIGN KEY(`barber_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
                )
            ");
            
            DB::statement("
                INSERT INTO `appointments_old` 
                SELECT * FROM `appointments` WHERE `status` IN ('pending', 'confirmed', 'completed', 'cancelled')
            ");
            
            DB::statement("DROP TABLE `appointments`");
            DB::statement("ALTER TABLE `appointments_old` RENAME TO `appointments`");
            
            DB::statement("CREATE INDEX `appointments_barber_id_appointment_date_appointment_time_index` ON `appointments`(`barber_id`, `appointment_date`, `appointment_time`)");
            DB::statement("CREATE INDEX `appointments_appointment_date_index` ON `appointments`(`appointment_date`)");
        }
    }
};

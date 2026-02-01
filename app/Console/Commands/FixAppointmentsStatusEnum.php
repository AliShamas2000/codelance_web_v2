<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixAppointmentsStatusEnum extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:fix-status-enum';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix the appointments status enum to include accepted and rejected';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Fixing appointments status enum...');
        
        try {
            $driver = DB::connection()->getDriverName();
            $this->info("Database driver: {$driver}");
            
            if ($driver === 'mysql') {
                $this->info('Updating MySQL enum...');
                DB::statement("ALTER TABLE `appointments` MODIFY COLUMN `status` ENUM('pending', 'accepted', 'rejected', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending'");
                $this->info('✓ MySQL enum updated successfully!');
                
                // Verify
                $result = DB::select("SHOW COLUMNS FROM appointments WHERE Field = 'status'");
                if (!empty($result)) {
                    $this->info("\nCurrent status column definition:");
                    $this->line(json_encode($result[0], JSON_PRETTY_PRINT));
                }
            } elseif ($driver === 'sqlite') {
                $this->info('SQLite detected - enum update handled by migration');
            } else {
                $this->warn("Unknown driver: {$driver}");
            }
            
            $this->info("\n✓ Done!");
            return 0;
        } catch (\Exception $e) {
            $this->error("✗ Error: " . $e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }
    }
}

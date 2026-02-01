<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@barbershop.com'],
            [
                'name' => 'Admin User',
                'email' => 'admin@barbershop.com',
                'password' => md5('password123'), // Using MD5 as requested
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create Barber User
        User::updateOrCreate(
            ['email' => 'barber@barbershop.com'],
            [
                'name' => 'Barber User',
                'email' => 'barber@barbershop.com',
                'password' => md5('password123'), // Using MD5 as requested
                'role' => 'barber',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin: admin@barbershop.com / password123');
        $this->command->info('Barber: barber@barbershop.com / password123');
    }
}


<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public API routes
Route::prefix('v1')->group(function () {
    // Public endpoints (no authentication required)
    Route::get('/services', [App\Http\Controllers\Api\ServiceController::class, 'index']);
    Route::get('/packages', [App\Http\Controllers\Api\PackageController::class, 'index']);
    Route::get('/packages/{id}', [App\Http\Controllers\Api\PackageController::class, 'show']);
    Route::get('/process-steps', [App\Http\Controllers\Api\ProcessStepController::class, 'index']);
    Route::get('/process-steps/{id}', [App\Http\Controllers\Api\ProcessStepController::class, 'show']);
    Route::get('/projects', [App\Http\Controllers\Api\ProjectController::class, 'index']);
    Route::get('/projects/categories', [App\Http\Controllers\Api\ProjectController::class, 'categories']);
    Route::get('/projects/{id}', [App\Http\Controllers\Api\ProjectController::class, 'show']);
    Route::get('/reviews', [App\Http\Controllers\Api\ReviewController::class, 'index']);
    Route::get('/reviews/{id}', [App\Http\Controllers\Api\ReviewController::class, 'show']);
    Route::get('/barbers', [App\Http\Controllers\Api\BarberController::class, 'index']);
    Route::get('/barbers/{id}', [App\Http\Controllers\Api\BarberController::class, 'show']);
    Route::get('/available-slots', [App\Http\Controllers\Api\AppointmentController::class, 'getAvailableSlots']);
    
    // Appointment booking (public, but may require customer info)
    Route::post('/appointments', [App\Http\Controllers\Api\AppointmentController::class, 'store']);
    Route::get('/appointments/{appointment}', [App\Http\Controllers\Api\AppointmentController::class, 'show']);
});

// Protected API routes (require authentication)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Admin endpoints
    Route::prefix('admin')->group(function () {
        // Packages management - Define as apiResource to match services pattern exactly
        Route::apiResource('packages', \App\Http\Controllers\Api\Admin\PackageController::class);
        Route::post('packages/update-order', [\App\Http\Controllers\Api\Admin\PackageController::class, 'updateOrder']);
        
        // Process Steps management
        Route::apiResource('process-steps', \App\Http\Controllers\Api\Admin\ProcessStepController::class);
        Route::post('process-steps/update-order', [\App\Http\Controllers\Api\Admin\ProcessStepController::class, 'updateOrder']);
        
        // Project Categories management
        Route::apiResource('project-categories', \App\Http\Controllers\Api\Admin\ProjectCategoryController::class);
        Route::post('project-categories/update-order', [\App\Http\Controllers\Api\Admin\ProjectCategoryController::class, 'updateOrder']);
        
        // Projects management
        Route::apiResource('projects', \App\Http\Controllers\Api\Admin\ProjectController::class);
        Route::post('projects/update-order', [\App\Http\Controllers\Api\Admin\ProjectController::class, 'updateOrder']);
        
        // Reviews management
        Route::apiResource('reviews', \App\Http\Controllers\Api\Admin\ReviewController::class);
        Route::post('reviews/update-order', [\App\Http\Controllers\Api\Admin\ReviewController::class, 'updateOrder']);
        
        // Services management
        Route::apiResource('services', App\Http\Controllers\Api\Admin\ServiceController::class);
        
        // Barbers/Team management (uses TeamController)
        Route::apiResource('barbers', App\Http\Controllers\Api\Admin\TeamController::class);
        
        // Appointments management
        Route::get('appointments', [App\Http\Controllers\Api\Admin\AppointmentController::class, 'index']);
        Route::get('appointments/{appointment}', [App\Http\Controllers\Api\Admin\AppointmentController::class, 'show']);
        Route::put('appointments/{appointment}', [App\Http\Controllers\Api\Admin\AppointmentController::class, 'update']);
        Route::delete('appointments/{appointment}', [App\Http\Controllers\Api\Admin\AppointmentController::class, 'destroy']);
        Route::patch('appointments/{appointment}/status', [App\Http\Controllers\Api\Admin\AppointmentController::class, 'updateStatus']);
        
        // Dashboard stats
        Route::get('dashboard/stats', [App\Http\Controllers\Api\Admin\DashboardController::class, 'stats']);
    });
    
    // Customer endpoints
    Route::get('/user/appointments', [App\Http\Controllers\Api\AppointmentController::class, 'userAppointments']);
    Route::delete('/appointments/{appointment}', [App\Http\Controllers\Api\AppointmentController::class, 'destroy']);
    
    // Client profile endpoints
    Route::prefix('client')->group(function () {
        Route::get('/profile', [App\Http\Controllers\Api\Client\ProfileController::class, 'index']);
        Route::put('/profile', [App\Http\Controllers\Api\Client\ProfileController::class, 'update']);
        Route::put('/password', [App\Http\Controllers\Api\Client\ProfileController::class, 'updatePassword']);
        Route::delete('/profile', [App\Http\Controllers\Api\Client\ProfileController::class, 'destroy']);
    });
});

// Authentication routes
Route::prefix('v1/auth')->group(function () {
    Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [App\Http\Controllers\Api\AuthController::class, 'user'])->middleware('auth:sanctum');
    Route::post('/send-otp', [App\Http\Controllers\Api\AuthController::class, 'sendOtp']);
    Route::get('/otp-info', [App\Http\Controllers\Api\AuthController::class, 'getOtpInfo']);
    Route::post('/verify-otp', [App\Http\Controllers\Api\AuthController::class, 'verifyOtp']);
    Route::post('/reset-password', [App\Http\Controllers\Api\AuthController::class, 'resetPassword']);
});


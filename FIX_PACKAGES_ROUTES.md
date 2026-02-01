# Fix Packages Routes - Step by Step Instructions

## The Problem
The route `api/v1/admin/packages` is returning 404 because Laravel has cached the old routes (before we added packages).

## Solution

Run these commands **in order** in your terminal (from the project root):

```bash
# Step 1: Clear all caches
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Step 2: Run the migration to create the packages table
php artisan migrate

# Step 3: Verify routes are registered (should show packages routes)
php artisan route:list | grep packages

# Step 4: If you see packages routes, restart your Laravel server
# Stop the server (Ctrl+C) and restart:
php artisan serve
```

## Expected Output

After running `php artisan route:list | grep packages`, you should see:

```
GET|HEAD  api/v1/admin/packages ................ packages.index › Api\Admin\PackageController@index
POST      api/v1/admin/packages ................ packages.store › Api\Admin\PackageController@store
GET|HEAD  api/v1/admin/packages/{package} ...... packages.show › Api\Admin\PackageController@show
PUT|PATCH api/v1/admin/packages/{package} ...... packages.update › Api\Admin\PackageController@update
DELETE    api/v1/admin/packages/{package} ...... packages.destroy › Api\Admin\PackageController@destroy
```

## If Routes Still Don't Appear

If you still don't see the routes, check:

1. **Controller exists**: `app/Http/Controllers/Api/Admin/PackageController.php`
2. **Route is defined**: Line 38 in `routes/api.php` should have:
   ```php
   Route::apiResource('packages', App\Http\Controllers\Api\Admin\PackageController::class);
   ```
3. **No syntax errors**: Run `php -l routes/api.php` and `php -l app/Http/Controllers/Api/Admin/PackageController.php`

## After Fixing

Once the routes are registered:
1. Refresh your browser
2. Try adding a package again
3. The 404 error should be gone


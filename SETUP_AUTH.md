# Authentication Setup Guide

## Overview
This guide will help you set up authentication for the admin and barber login system with role-based access.

## Prerequisites
- PHP 8.2+
- Composer installed
- Laravel 12.x
- Database configured (SQLite, MySQL, or PostgreSQL)

## Step 1: Install Laravel Sanctum

**IMPORTANT:** You must install Laravel Sanctum first before running migrations or seeders.

```bash
composer require laravel/sanctum
```

After installation, update the User model to use HasApiTokens:

1. Open `app/Models/User.php`
2. Uncomment the line: `use Laravel\Sanctum\HasApiTokens;`
3. Add `HasApiTokens` to the use statement: `use HasFactory, Notifiable, HasApiTokens;`

## Step 2: Publish Sanctum Configuration (Optional)

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

## Step 3: Run Migrations

The migrations have been created. Run them:

```bash
php artisan migrate
```

This will:
- Create the users table with role field (if fresh install)
- Add the role column to existing users table (if updating)

## Step 4: Seed Test Users

Run the seeder to create test users:

```bash
php artisan db:seed --class=UserSeeder
```

## Test Users Created

After seeding, you'll have two test users:

### Admin User
- **Email:** `admin@barbershop.com`
- **Password:** `password123`
- **Role:** `admin`
- **Dashboard:** `/admin/dashboard`

### Barber User
- **Email:** `barber@barbershop.com`
- **Password:** `password123`
- **Role:** `barber`
- **Dashboard:** `/barber/dashboard`

## Step 5: Configure CORS (if needed)

If you're running the frontend on a different port (e.g., localhost:3000), make sure CORS is configured in `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

## Step 6: Test Login

1. Start your Laravel server:
   ```bash
   php artisan serve
   ```
   Server will run on `http://localhost:8000`

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000` (or your configured port)

3. Navigate to `http://localhost:3000/admin/login`

4. Try logging in with:
   - **Admin:** `admin@barbershop.com` / `password123`
   - **Barber:** `barber@barbershop.com` / `password123`

## API Endpoints

### Authentication Endpoints

#### Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Body:**
  ```json
  {
    "email": "admin@barbershop.com",
    "password": "password123",
    "remember_me": false
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@barbershop.com",
      "role": "admin"
    }
  }
  ```

#### Get Current User
- **Endpoint:** `GET /api/v1/auth/user`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@barbershop.com",
      "role": "admin"
    }
  }
  ```

#### Logout
- **Endpoint:** `POST /api/v1/auth/logout`
- **Headers:** `Authorization: Bearer {token}`

#### Backward Compatibility Endpoints
- `GET /api/v1/admin/auth/me` - Get admin user (same as `/auth/user`)
- `POST /api/v1/admin/auth/logout` - Admin logout (same as `/auth/logout`)

## Database Structure

### Users Table
- `id` - Primary key (bigint)
- `name` - User name (string)
- `email` - Unique email (string)
- `password` - Hashed password (string)
- `role` - Enum: 'admin' or 'barber' (default: 'barber')
- `email_verified_at` - Timestamp (nullable)
- `remember_token` - Remember me token (nullable)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Personal Access Tokens Table (Sanctum)
- Created automatically by Sanctum
- Stores API tokens for authentication

## Role-Based Routing

The login page automatically redirects users based on their role:

- **Admin users** → `/admin/dashboard`
- **Barber users** → `/barber/dashboard`

This is handled in `frontend/src/pages/Admin/Login/Login.jsx`:

```javascript
const userRole = response.user?.role || response.role || 'admin'
if (userRole === 'barber') {
  navigate('/barber/dashboard')
} else {
  navigate('/admin/dashboard')
}
```

## Troubleshooting

### Sanctum Not Found Error
**Error:** `Trait "Laravel\Sanctum\HasApiTokens" not found`

**Solution:**
1. Run `composer require laravel/sanctum`
2. Run `composer dump-autoload`
3. Uncomment `use Laravel\Sanctum\HasApiTokens;` in `app/Models/User.php`
4. Add `HasApiTokens` to the use statement in the User class

### Migration Errors
**Error:** Migration fails or table already exists

**Solution:**
1. Check your database connection in `.env`
2. Make sure the database exists
3. If starting fresh: `php artisan migrate:fresh --seed`
4. If updating: `php artisan migrate`

### Login Not Working
**Error:** Login fails or returns 401/500

**Checklist:**
1. ✅ Sanctum is installed: `composer show laravel/sanctum`
2. ✅ Users are seeded: Run `php artisan tinker` then `User::count()` (should be 2)
3. ✅ Passwords are hashed: Check database, passwords should be long hashed strings
4. ✅ API endpoint is correct: Check `VITE_API_BASE_URL` in frontend `.env`
5. ✅ CORS is configured: Check `config/cors.php`
6. ✅ Laravel server is running: `php artisan serve`
7. ✅ Token is stored: Check browser localStorage for `auth_token`

### CORS Errors
**Error:** CORS policy blocks requests

**Solution:**
1. Update `config/cors.php` to allow your frontend origin
2. Clear config cache: `php artisan config:clear`
3. Make sure `supports_credentials` is `true` if using cookies

### Token Not Working
**Error:** 401 Unauthorized after login

**Solution:**
1. Check token format: Should start with number and pipe (e.g., `1|...`)
2. Verify token is sent in headers: `Authorization: Bearer {token}`
3. Check token in database: `personal_access_tokens` table should have entries
4. Verify Sanctum middleware is applied to routes

## Quick Setup Commands

Run these commands in order:

```bash
# 1. Install Sanctum
composer require laravel/sanctum

# 2. Update User model (manually uncomment HasApiTokens)

# 3. Run migrations
php artisan migrate

# 4. Seed users
php artisan db:seed --class=UserSeeder

# 5. Start server
php artisan serve
```

## Security Notes

⚠️ **IMPORTANT:** Change the default passwords in production!

The test users have simple passwords for development. In production:

1. ✅ Use strong, unique passwords (min 12 characters, mixed case, numbers, symbols)
2. ✅ Implement password policies
3. ✅ Enable email verification
4. ✅ Use HTTPS only
5. ✅ Implement rate limiting on login endpoints
6. ✅ Use environment variables for sensitive data
7. ✅ Regularly rotate API tokens
8. ✅ Implement token expiration

## Next Steps

After authentication is working:

1. Add password reset functionality
2. Add email verification
3. Implement role-based middleware for API routes
4. Add activity logging
5. Implement session management
6. Add two-factor authentication (optional)

## Support

If you encounter issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Verify database connection
4. Test API endpoints with Postman/curl
5. Check Sanctum documentation: https://laravel.com/docs/sanctum

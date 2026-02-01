# Authentication Test Credentials

## Test Users

### Admin User
- **Email:** `admin@barbershop.com`
- **Password:** `password123`
- **Role:** `admin`
- **Redirects to:** `/admin/dashboard`

### Barber User
- **Email:** `barber@barbershop.com`
- **Password:** `password123`
- **Role:** `barber`
- **Redirects to:** `/barber/dashboard`

## Setup Instructions

### 1. Install Laravel Sanctum
```bash
composer require laravel/sanctum
```

### 2. Update User Model
Edit `app/Models/User.php` and:
1. Add: `use Laravel\Sanctum\HasApiTokens;`
2. Change: `use HasFactory, Notifiable;` to `use HasFactory, Notifiable, HasApiTokens;`

### 3. Run Migrations
```bash
php artisan migrate
```

### 4. Seed Users
```bash
php artisan db:seed --class=UserSeeder
```

### 5. Start Servers
```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 6. Test Login
Navigate to: `http://localhost:3000/admin/login`

Use the credentials above to test both admin and barber logins.

## API Testing

### Test Login with cURL

**Admin Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@barbershop.com",
    "password": "password123",
    "remember_me": false
  }'
```

**Barber Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "barber@barbershop.com",
    "password": "password123",
    "remember_me": false
  }'
```

**Expected Response:**
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

## Files Created/Modified

### Backend Files
- ✅ `database/migrations/2025_12_31_081346_add_role_to_users_table.php` - Adds role column
- ✅ `app/Models/User.php` - Updated with role field
- ✅ `app/Http/Controllers/Api/AuthController.php` - Login/logout controller
- ✅ `database/seeders/UserSeeder.php` - Creates test users
- ✅ `routes/api.php` - Updated with auth routes
- ✅ `composer.json` - Added laravel/sanctum dependency

### Frontend Files
- ✅ `frontend/src/api/auth.js` - Updated to handle role-based routing

## Next Steps

1. Install Sanctum: `composer require laravel/sanctum`
2. Update User model with HasApiTokens trait
3. Run migrations and seeders
4. Test login functionality
5. Verify role-based redirects work correctly

For detailed setup instructions, see `SETUP_AUTH.md`.


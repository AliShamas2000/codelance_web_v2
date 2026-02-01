#!/bin/bash

# Fix Packages Routes - Run this script to fix the packages route issue

echo "🔧 Fixing Packages Routes..."
echo ""

# Step 1: Clear all caches
echo "1. Clearing route cache..."
php artisan route:clear

echo "2. Clearing config cache..."
php artisan config:clear

echo "3. Clearing application cache..."
php artisan cache:clear

echo "4. Clearing view cache..."
php artisan view:clear

echo ""
echo "5. Running packages migration..."
php artisan migrate

echo ""
echo "6. Verifying routes..."
php artisan route:list | grep packages

echo ""
echo "✅ Done! Please restart your Laravel server if it's running."
echo "   Run: php artisan serve"


# Team Management API Testing Guide

## Overview
The team management system is now fully dynamic and integrated with the backend. Team members are users with role "barber" who can log in to the barber dashboard.

## Database Structure

### Users Table (Extended)
- `phone` - Phone number
- `job_title` - Job title/position
- `bio` - Biography
- `profile_photo` - Profile photo path
- `status` - active/inactive

### Social Media Links Table
- `user_id` - Foreign key to users
- `platform` - Platform name (instagram, facebook, twitter, linkedin, youtube, tiktok)
- `url` - Full URL to the social media profile

## API Endpoints

All endpoints require authentication with admin role:
- `GET /api/v1/admin/team` - List all team members (barbers)
- `POST /api/v1/admin/team` - Create new team member
- `GET /api/v1/admin/team/{id}` - Get team member details
- `POST /api/v1/admin/team/{id}` - Update team member
- `DELETE /api/v1/admin/team/{id}` - Delete team member
- `GET /api/v1/admin/team/{id}/details` - Get full details with stats
- `GET /api/v1/admin/team/{id}/stats` - Get stats
- `GET /api/v1/admin/team/{id}/appointments` - Get appointments
- `GET /api/v1/admin/team/{id}/availability` - Get availability

## Features

1. **Password Storage**: Passwords are stored as MD5 in the database
2. **Default Role**: All team members are created with role "barber"
3. **Dynamic Social Links**: Support for multiple platforms (Instagram, Facebook, Twitter, LinkedIn, YouTube, TikTok)
4. **Profile Photos**: Upload and manage profile photos
5. **Status Management**: Active/Inactive status toggle

## Testing

### 1. Create Team Member
```bash
curl -X POST http://localhost:8000/api/v1/admin/team \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "first_name=John" \
  -F "last_name=Doe" \
  -F "email=john.doe@barbershop.com" \
  -F "password=testpassword123" \
  -F "phone=+1234567890" \
  -F "job_title=Senior Barber" \
  -F "status=active" \
  -F "social_links[0][platform]=instagram" \
  -F "social_links[0][url]=https://instagram.com/johndoe" \
  -F "social_links[1][platform]=facebook" \
  -F "social_links[1][url]=https://facebook.com/johndoe"
```

### 2. List Team Members
```bash
curl -X GET "http://localhost:8000/api/v1/admin/team?page=1&per_page=12&status=all" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Update Team Member
```bash
curl -X POST http://localhost:8000/api/v1/admin/team/ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "first_name=John" \
  -F "last_name=Updated" \
  -F "job_title=Master Barber" \
  -F "social_links[0][platform]=twitter" \
  -F "social_links[0][url]=https://twitter.com/johndoe"
```

### 4. Delete Team Member
```bash
curl -X DELETE http://localhost:8000/api/v1/admin/team/ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Frontend Features

1. **Add/Edit Modal**: 
   - Dynamic social media links with platform selection
   - Add/remove social links
   - Profile photo upload
   - Password management (required for new, optional for edit)

2. **Team Member Cards**: 
   - Display social links with platform icons
   - Status badges
   - Quick edit/view actions

3. **View Details Modal**: 
   - Full member information
   - Social media links display
   - Stats and appointments (when implemented)

## Notes

- Team members can log in to `/barber/dashboard` using their email and password
- Passwords are stored as MD5 (not recommended for production, but as requested)
- Profile photos are stored in `storage/app/public/team/photos`
- Social media links are stored in a separate table for flexibility


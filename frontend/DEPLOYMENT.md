# Hostinger Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Build Your Project
```bash
cd frontend
npm install  # Make sure all dependencies are installed
npm run build
```

This creates a `dist` folder with all production files.

### 2. Upload to Hostinger

**Option A: Using File Manager (Recommended)**
1. Log into your Hostinger control panel (hPanel)
2. Go to **File Manager**
3. Navigate to `public_html` (or your domain's root folder)
4. **Delete all existing files** in public_html (or backup first)
5. Upload **ALL contents** from `frontend/dist/` folder:
   - `index.html`
   - `.htaccess` (important!)
   - `js/` folder (with all JS files)
   - `assets/` or `img/` folder (with images)
   - `favicon.png`
   - `logo.png`
   - Any other files/folders

**Option B: Using FTP**
1. Connect via FTP (FileZilla, etc.)
2. Navigate to `public_html`
3. Upload all files from `frontend/dist/` folder

### 3. Set Correct File Permissions

In Hostinger File Manager:
- **Folders**: Set to `755`
- **Files**: Set to `644`
- **.htaccess**: Set to `644`

To set permissions:
1. Right-click on file/folder → **Change Permissions**
2. Enter the permission number
3. Check "Recurse into subdirectories" for folders

### 4. Verify File Structure

Your `public_html` should look like this:
```
public_html/
├── .htaccess
├── index.html
├── favicon.png
├── logo.png
├── js/
│   ├── index-[hash].js
│   ├── react-vendor-[hash].js
│   └── ...
├── assets/ (or img/)
│   └── ...
└── ...
```

### 5. Common Issues & Fixes

**403 Forbidden Error:**
- ✅ Make sure `index.html` exists in root
- ✅ Check file permissions (644 for files, 755 for folders)
- ✅ Verify `.htaccess` is uploaded and has correct permissions
- ✅ Clear browser cache and try again

**404 Not Found on Routes:**
- ✅ Make sure `.htaccess` is uploaded (contains React Router rewrite rules)
- ✅ Verify `.htaccess` permissions are 644

**Blank Page:**
- ✅ Check browser console for errors
- ✅ Verify all JS files are uploaded
- ✅ Check if API base URL is correct in your code

**Assets Not Loading:**
- ✅ Verify all folders (js/, assets/, img/) are uploaded
- ✅ Check file paths in browser console

### 6. Update API Base URL (If Needed)

If your Laravel backend is on a different domain:
1. Create `.env.production` file in `frontend/` folder:
   ```
   VITE_API_BASE_URL=https://api.codelancelb.com/api/v1
   ```
2. Rebuild: `npm run build`
3. Re-upload the `dist` folder

### 7. Test Your Site

1. Visit `https://codelancelb.com`
2. Check browser console (F12) for any errors
3. Test navigation (clicking links)
4. Test API calls (contact form, etc.)

## Quick Checklist

- [ ] Built project with `npm run build`
- [ ] Uploaded ALL files from `dist/` folder
- [ ] `.htaccess` file is in root directory
- [ ] File permissions set correctly (644 for files, 755 for folders)
- [ ] `index.html` exists in root
- [ ] All JS and asset folders uploaded
- [ ] Cleared browser cache
- [ ] Tested the site

## Need Help?

If you still get 403 error:
1. Check Hostinger error logs in hPanel
2. Verify your domain is pointing to the correct directory
3. Contact Hostinger support if file permissions don't work


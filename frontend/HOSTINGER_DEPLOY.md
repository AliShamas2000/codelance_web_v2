# Hostinger Deployment - Correct Process

## ❌ Don't Build on Server
Hostinger shared hosting **does NOT have Node.js/npm** installed. You cannot run `npm run build` on the server.

## ✅ Correct Deployment Process

### Step 1: Build Locally (On Your Mac)

```bash
# On your local machine (Mac)
cd /Users/alishamas/Documents/Websites/codelance_web/frontend
npm run build
```

This creates a `dist` folder with all production files.

### Step 2: Upload Built Files to Hostinger

**Option A: Using File Manager (Easiest)**
1. Log into Hostinger hPanel
2. Go to **File Manager**
3. Navigate to `public_html` (or `domains/codelancelb.com/public_html`)
4. **Delete everything** in `public_html` (or backup first)
5. Upload **ALL contents** from `frontend/dist/` folder:
   - Select all files in `dist/` folder
   - Upload to `public_html/`

**Option B: Using FTP (FileZilla, etc.)**
1. Connect to Hostinger via FTP
2. Navigate to `public_html`
3. Upload all files from `frontend/dist/` folder

**Option C: Using SSH + SCP (Command Line)**
```bash
# From your local Mac terminal
cd /Users/alishamas/Documents/Websites/codelance_web/frontend
npm run build

# Upload dist folder to Hostinger
scp -r -P 65002 dist/* u335424066@de-fra-web2063:~/domains/codelancelb.com/public_html/
```

### Step 3: Set File Permissions

In Hostinger File Manager:
1. Select all files
2. Right-click → **Change Permissions**
3. Set:
   - **Files**: `644`
   - **Folders**: `755`
   - Check "Recurse into subdirectories"
4. Click **Change**

### Step 4: Verify Files Are Uploaded

Your `public_html` should contain:
```
public_html/
├── .htaccess          ← Important!
├── index.html         ← Important!
├── favicon.png
├── logo.png
├── js/
│   ├── index-[hash].js
│   └── ...
└── assets/ or img/
    └── ...
```

### Step 5: Test Your Site

Visit `https://codelancelb.com` - it should work now!

## Quick Commands Summary

**Local (Mac):**
```bash
cd frontend
npm run build
# Then upload dist/ folder contents to Hostinger
```

**On Hostinger (SSH):**
```bash
# Just verify files are there
cd ~/domains/codelancelb.com/public_html
ls -la
# Should see index.html, .htaccess, js/, etc.
```

## Important Notes

- ✅ Build on your **local machine** (Mac)
- ✅ Upload the **dist folder contents** to Hostinger
- ✅ Never run `npm` commands on Hostinger shared hosting
- ✅ The `.htaccess` file will be automatically in `dist/` folder after build


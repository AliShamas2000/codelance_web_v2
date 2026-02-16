# Deployment Guide (No Manual Copy)

## Goal
Use this flow every time:
1. Build locally
2. Push to GitHub
3. `git pull` on Hostinger

No manual copy from `frontend/dist` to root.

## Why This Works
Root `.htaccess` serves:
- `https://domain/js/*` from `frontend/dist/js/*`
- `https://domain/assets/*` from `frontend/dist/assets/*`
- SPA routes from `frontend/dist/index.html`
- API routes from Laravel `public/index.php`

## Release Steps

### 1. Local build
```bash
cd frontend
npm run build
```

### 2. Commit + push
```bash
git add frontend/dist frontend/src .htaccess
git commit -m "Release frontend update"
git push
```

### 3. Server pull
```bash
cd ~/domains/codelancelb.com/public_html
git pull
```

## Sanity Checks
```bash
cd ~/domains/codelancelb.com/public_html
ls -la frontend/dist/js | head
curl -I https://codelancelb.com/
curl -I https://codelancelb.com/api/v1/services
```

# Hostinger Deploy (Git Pull Only)

This project is configured so Hostinger serves:
- Frontend from `frontend/dist/*`
- API from Laravel `public/index.php`

After this setup, you do **not** copy `dist` files into root anymore.

## One-Time Server Setup

1. Make sure your domain document root is:
`~/domains/codelancelb.com/public_html`

2. Make sure this file exists at project root:
`~/domains/codelancelb.com/public_html/.htaccess`

3. Pull latest once:
```bash
cd ~/domains/codelancelb.com/public_html
git pull
```

## Normal Update Flow

1. Local machine:
```bash
cd frontend
npm run build
```

2. Commit and push:
```bash
git add frontend/dist frontend/src .htaccess
git commit -m "Update frontend"
git push
```

3. Server:
```bash
cd ~/domains/codelancelb.com/public_html
git pull
```

That is all. No `cp -r frontend/dist/* .` required.

## Quick Verification

```bash
cd ~/domains/codelancelb.com/public_html
grep -n 'script type="module"' frontend/dist/index.html
curl -I https://codelancelb.com/
curl -I https://codelancelb.com/api/v1/services
```

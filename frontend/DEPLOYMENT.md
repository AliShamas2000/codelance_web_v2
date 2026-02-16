# Deployment Guide (Auto Publish on git pull)

## Summary
You still build locally, but server deploy is automatic after `git pull`.

## One-time Server Setup
```bash
cd ~/domains/codelancelb.com/public_html
git pull
git config core.hooksPath .githooks
chmod +x .githooks/post-merge scripts/deploy_frontend.sh
./scripts/deploy_frontend.sh
```

## Release Steps

### 1. Local build + push
```bash
cd frontend
npm run build
git add frontend/dist frontend/src
git commit -m "Release frontend"
git push
```

### 2. Server deploy
```bash
cd ~/domains/codelancelb.com/public_html
git pull
```

The `post-merge` hook runs `scripts/deploy_frontend.sh` automatically.

## Manual Fallback
If hook was not installed yet:
```bash
cd ~/domains/codelancelb.com/public_html
./scripts/deploy_frontend.sh
```

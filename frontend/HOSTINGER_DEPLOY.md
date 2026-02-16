# Hostinger Deploy (Auto-Copy After git pull)

This project uses a git hook so every `git pull` auto-publishes `frontend/dist` to live root.

## One-Time Setup On Server

```bash
cd ~/domains/codelancelb.com/public_html
git pull

# enable repo hooks
git config core.hooksPath .githooks

# allow execution
chmod +x .githooks/post-merge scripts/deploy_frontend.sh

# run once now
./scripts/deploy_frontend.sh
```

## Normal Release Flow

1. Local machine:
```bash
cd frontend
npm run build
git add frontend/dist frontend/src
git commit -m "Update frontend"
git push
```

2. Server:
```bash
cd ~/domains/codelancelb.com/public_html
git pull
```

`post-merge` runs automatically and updates:
- `index.html`
- `js/`
- `assets/`
- optional `img/`, `fonts/`, `logo.png`, `favicon.png`

## Emergency Recovery (If White Screen)

```bash
cd ~/domains/codelancelb.com/public_html
./scripts/deploy_frontend.sh
grep -n "index-.*\\.js" index.html
```

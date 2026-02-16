#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/frontend/dist"

if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "[deploy_frontend] Missing $DIST_DIR/index.html"
  exit 1
fi

cd "$ROOT_DIR"

echo "[deploy_frontend] Deploying frontend/dist to live root..."

# Remove old hashed bundles to avoid stale file references.
rm -rf js assets img fonts

# Copy current build output.
[ -d "$DIST_DIR/js" ] && cp -r "$DIST_DIR/js" ./js
[ -d "$DIST_DIR/assets" ] && cp -r "$DIST_DIR/assets" ./assets
[ -d "$DIST_DIR/img" ] && cp -r "$DIST_DIR/img" ./img
[ -d "$DIST_DIR/fonts" ] && cp -r "$DIST_DIR/fonts" ./fonts

cp -f "$DIST_DIR/index.html" ./index.html

# Optional root files used by frontend.
[ -f "$DIST_DIR/favicon.png" ] && cp -f "$DIST_DIR/favicon.png" ./favicon.png
[ -f "$DIST_DIR/logo.png" ] && cp -f "$DIST_DIR/logo.png" ./logo.png
[ -f "$DIST_DIR/.htaccess" ] && cp -f "$DIST_DIR/.htaccess" ./.htaccess

ENTRY_JS="$(grep -o 'index-[^\"]*\.js' ./index.html | head -n 1 || true)"
if [ -n "$ENTRY_JS" ] && [ -f "./js/$ENTRY_JS" ]; then
  echo "[deploy_frontend] OK -> $ENTRY_JS"
else
  echo "[deploy_frontend] WARNING: entry bundle not found in ./js"
fi


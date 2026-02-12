#!/bin/bash
# Find frontend/dist and move files to public_html

cd ~/domains/codelancelb.com/

echo "🔍 Looking for frontend/dist folder..."
find . -type d -name "dist" 2>/dev/null | grep frontend

echo ""
echo "🔍 Looking for frontend folder..."
find . -type d -name "frontend" 2>/dev/null | head -5

echo ""
echo "🔍 Checking what's in the current directory..."
ls -la | head -10

echo ""
echo "🔍 Checking if frontend exists here..."
[ -d "frontend" ] && echo "✅ frontend/ exists here" || echo "❌ frontend/ not found here"

if [ -d "frontend" ]; then
  echo ""
  echo "📁 Contents of frontend/:"
  ls -la frontend/ | head -10
  
  if [ -d "frontend/dist" ]; then
    echo ""
    echo "✅ Found frontend/dist/!"
    echo "📦 Contents:"
    ls -la frontend/dist/ | head -10
  else
    echo ""
    echo "❌ frontend/dist/ not found"
    echo "🔍 Looking for dist folder anywhere..."
    find . -type d -name "dist" 2>/dev/null
  fi
fi


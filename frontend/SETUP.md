# Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Troubleshooting 502 Bad Gateway

If you're getting a 502 Bad Gateway error, it means nginx can't reach the backend service. Here are solutions:

### Option 1: Run React Dev Server Directly

```bash
cd frontend
npm install
npm run dev
```

Then access the app at `http://localhost:3000` (not through nginx)

### Option 2: Configure Nginx for Development

If you want to use nginx, you need to proxy to the Vite dev server:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: Build for Production

If you want to serve the built files through nginx:

```bash
cd frontend
npm install
npm run build
```

Then configure nginx to serve the `frontend/dist` directory:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Common Issues

1. **Port already in use**: Change the port in `vite.config.js`
2. **Dependencies not installed**: Run `npm install`
3. **Module not found**: Delete `node_modules` and `package-lock.json`, then run `npm install` again


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Copy .htaccess to dist folder after build (for Hostinger)
    {
      name: 'copy-htaccess',
      closeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, '.htaccess'),
            resolve(__dirname, 'dist/.htaccess')
          )
        } catch (err) {
          // Silently fail if .htaccess doesn't exist
        }
      },
    },
  ],
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    // Enable minification with aggressive settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better minification
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Optimize chunk splitting - more aggressive
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and React DOM
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor'
          }
          // Axios
          if (id.includes('node_modules/axios')) {
            return 'axios-vendor'
          }
          // Phone number input (if used)
          if (id.includes('node_modules/react-phone-number-input')) {
            return 'phone-vendor'
          }
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
    // Enable source maps only in development
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2015',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'axios',
      'react-phone-number-input',
      'prop-types' // Add prop-types to handle CommonJS module
    ],
    esbuildOptions: {
      // Handle CommonJS modules
      loader: {
        '.js': 'jsx',
      },
    },
  },
  // Resolve CommonJS modules
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - rarely changes, cache separately
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'vendor-ui': ['framer-motion', 'lucide-react', 'react-hot-toast'],
        },
      },
    },
    // Increase chunk size warning limit (default 500KB)
    chunkSizeWarningLimit: 800,
  },
})

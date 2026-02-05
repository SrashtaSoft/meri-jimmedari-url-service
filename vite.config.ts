import { defineConfig } from 'vite';

export default defineConfig({
  // Build config optimized for minimal bundle size
  build: {
    // Target modern browsers only
    target: 'es2020',
    // Minimize output
    minify: 'terser',
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Development server config
  server: {
    port: 3000,
    open: true,
  },
});

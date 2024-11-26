/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Allows access via LAN for mobile device testing
    port: 3000, // Default server port (optional, can be customized)
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    outDir: 'dist', // Ensure Capacitor knows where to find your built files
    sourcemap: true, // Helpful for debugging in mobile apps
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }) // This will open the visualization in the browser
  ],
  server: {
    host: '127.0.0.1',
  },
  build: {
    chunkSizeWarningLimit: 1000 // Set limit to 1000 kB or a value that suits you
  }
});

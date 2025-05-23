import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change the frontend port to 3000
    strictPort: true, // Ensure Vite fails if port 3000 is already in use
  },
});
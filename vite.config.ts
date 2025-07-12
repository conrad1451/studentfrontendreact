// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/myapi": {
        target: "http://127.0.0.1:5000", // Flask backend URL
        changeOrigin: true,
        // Make sure there is NO active rewrite line here
        // e.g., NO 'rewrite: (path) => path.replace(...),' line
      },
    },
  },
});

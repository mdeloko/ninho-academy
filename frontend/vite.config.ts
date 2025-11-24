import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    allowedHosts: ["ninho-academy.43464994.xyz"],
    host: true,
    port: 6001,
    fs: {
      allow: [".", ".."],
    },
    proxy: {
      "/users": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
      "/progress": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
      "/test": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

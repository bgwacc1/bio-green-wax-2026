import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { botPrerender } from "./plugins/bot-prerender";
import { staticFallback } from "./plugins/static-fallback";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-dialog', '@radix-ui/react-select'],
          query: ['@tanstack/react-query'],
          charts: ['recharts'],
        },
      },
    },
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/sitemap.xml': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/robot.txt': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: () => '/robots.txt',
      },
    },
  },
  plugins: [botPrerender(), staticFallback(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

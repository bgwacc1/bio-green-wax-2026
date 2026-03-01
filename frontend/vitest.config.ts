import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
      include: [
        "src/lib/api.ts",
        "src/lib/utils.ts",
        "src/contexts/AuthContext.tsx",
        "src/pages/admin/AdminLogin.tsx",
        "src/components/admin/AnalyticsManager.tsx",
        "src/components/admin/BotAnalyticsManager.tsx",
      ],
      thresholds: {
        statements: 98,
        branches: 85,
        functions: 98,
        lines: 98,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});

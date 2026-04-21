import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["sales01.test", "api.sales01.test"],
    hmr: {
      host: "sales01.test",
      protocol: "wss",
    },
    watch: {
      usePolling: true,
    },
  },
});

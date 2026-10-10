import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base harus sama dengan nama repository untuk GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: "/cryptoku/",
  server: { host: "0.0.0.0", allowedHosts: true },
  preview: { host: "0.0.0.0", allowedHosts: true },
});

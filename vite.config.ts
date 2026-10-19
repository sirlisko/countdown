import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

// Injected after the app's entry, which registers the before-send hook that
// strips countdowns from the payload: deferred scripts run in document order
const umami = (websiteId?: string): Plugin => ({
  name: "umami",
  apply: "build",
  transformIndexHtml: () =>
    websiteId
      ? [
          {
            tag: "script",
            attrs: {
              defer: true,
              src: "/stats/script.js",
              "data-website-id": websiteId,
              "data-before-send": "umamiBeforeSend",
            },
            injectTo: "body",
          },
        ]
      : [],
});

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    umami(loadEnv(mode, process.cwd()).VITE_UMAMI_WEBSITE_ID),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
  },
}));

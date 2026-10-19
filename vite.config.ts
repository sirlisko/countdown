import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

// Countdowns live in the URL, so analytics only ever sees "/" or "/hidden":
// the query is excluded and obfuscated paths are base64 of the same details
const umami = (websiteId?: string): Plugin => ({
  name: "umami",
  apply: "build",
  transformIndexHtml: () =>
    websiteId
      ? [
          {
            tag: "script",
            children:
              'window.umamiBeforeSend = (type, payload) => ({ ...payload, url: payload.url === "/" ? "/" : "/hidden" });',
            injectTo: "head",
          },
          {
            tag: "script",
            attrs: {
              defer: true,
              src: "/stats/script.js",
              "data-website-id": websiteId,
              "data-exclude-search": "true",
              "data-before-send": "umamiBeforeSend",
            },
            injectTo: "head",
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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallbackDenylist: [/^\/~oauth/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      manifest: {
        name: "Blacklabspotsshop",
        short_name: "Spot Shop",
        description: "Premium apparel featuring Spot, the beloved black Labrador.",
        theme_color: "#2cbbc3",
        background_color: "#0D1117",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "https://storage.googleapis.com/gpt-engineer-file-uploads/EKH4ckWMGFPUqduJagGR1UdcRuN2/uploads/1766502018179-Ontwerp zonder titel.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "https://storage.googleapis.com/gpt-engineer-file-uploads/EKH4ckWMGFPUqduJagGR1UdcRuN2/uploads/1766502018179-Ontwerp zonder titel.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  // Ensure Supabase env vars are always available even if .env loading fails
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || "https://xwtlinfnkeyskrfxikbf.supabase.co"),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dGxpbmZua2V5c2tyZnhpa2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NTY2ODMsImV4cCI6MjA4MzAzMjY4M30.wdmV8qvy9fhtw-6yePfnWL9x8WuhI1Lef_bWIopAaQk"),
  },
}));

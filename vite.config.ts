import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    proxy: {
      "/proxy": {
        target: "https://api-testing.early.app/",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/proxy/, ""),
        headers: {
          Origin: "https://product-testing.early.app",
        },
      },
    },
  },
});

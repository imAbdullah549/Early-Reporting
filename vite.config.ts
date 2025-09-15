import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [mkcert()],
    server: {
      // Proxy from https://127.0.0.1:<port>/proxy/... to https://api-testing.early.app/...
      proxy: {
        "/proxy": {
          target: "https://api-testing.early.app/",
          rewrite: (path) => path.replace(/^\/proxy/, ""),
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on("proxyReq", (proxyReq, _req, _res) => {
              proxyReq.setHeader("Origin", "https://product-testing.early.app");
            });
          },
        },
      },
    },
  };
});

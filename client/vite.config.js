import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "node:path";
import babelPlugin from "vite-plugin-babel";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@store": path.resolve(__dirname, "./src/redux/store"),
      // "@loginbkg": path.resolve(
      //   __filename,
      //   "url(./src/assets/Images/Loginbkg.webp)"
      // ),
    },
  },
  define: {
    "process.env": {
      REACT_APP_UAT_URL: "http://localhost:8080",
      // REACT_APP_UAT_URL: "http://192.46.210.31/",
      REACT_APP_ENCRYPTION: "WABBALABBA@3344$$1DUB43DUB",
    },
  },
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    port: 3000,
  },
  build: {
    minify: true,
    emptyOutDir: true,
    sourcemap: "inline", // Disable source maps
    rollupOptions: {
      external: "sweetalert2.all.min.js",
      output: {
        globals: {
          react: "React",
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor"; // Separate vendor chunks
            }
          },
        },
        vendor: ["react", "react-dom"], // Split out vendor libraries
        utils: ["./src/utils/index.js"], // Split out utility functions
      },
    },
  },
});

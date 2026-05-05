import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Navigate exactly one directory up, then into 'release'
    outDir: "../release",

    // Crucial: Forces Vite to empty the release folder before building,
    // even though it is outside the current Vite root.
    emptyOutDir: true,
  },
});

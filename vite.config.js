import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Root custom domain deployment (aboutchad.com) uses base "/"
export default defineConfig({
  plugins: [react()],
  base: "/",
});

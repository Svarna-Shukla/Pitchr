import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vite configuration - plugins only, no proxy needed since we call Groq directly
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

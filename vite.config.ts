//replaced Anthropic API key with Groq API key
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite configuration - plugins only, no proxy needed since we call Groq directly
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
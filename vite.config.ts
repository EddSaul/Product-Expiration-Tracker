import tailwindcss from "@tailwindcss/vite"
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import legacy from '@vitejs/plugin-legacy' 

export default defineConfig({
  plugins: [react(), tailwindcss(), 
      legacy({
        targets: ['defaults', 'not IE 11', 'Android >= 5'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'] 
    }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
  },
})
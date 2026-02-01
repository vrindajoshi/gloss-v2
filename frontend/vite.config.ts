import { defineConfig } from 'vite'
// @ts-ignore - path is available in Node.js runtime
import path from 'path'
// @ts-ignore - url is available in Node.js runtime
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Plugin to resolve figma:asset imports to actual asset files
function figmaAssetPlugin() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        // Extract the filename from figma:asset/filename
        const filename = id.replace('figma:asset/', '')
        // Resolve to the actual asset file in src/assets
        return path.resolve(__dirname, './src/assets', filename)
      }
      return null
    },
  }
}

export default defineConfig({
  // ✅ FIX: makes built index.html reference "./assets/..." instead of "/assets/..."
  base: './',

  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    outDir: '../extension/dist',
    emptyOutDir: true,
  },
})
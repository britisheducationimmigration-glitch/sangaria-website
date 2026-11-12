import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    allowedHosts: ['.manus.computer'],
  },
  build: {
    rollupOptions: {
      output: {
        // ✅ FIX: Har CSS aur Asset ke sath hash code aayega taaki Vercel par updates turant sabko milein
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  plugins: [tailwindcss(), tanstackStart(), nitro(), viteReact()],
})

export default config

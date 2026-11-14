import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { resolve } from 'node:path'

// Optional isolated output for preview verification without touching checked-in artifacts.
const verificationOutput = process.env.PREVIEW_BUILD_DIR

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    allowedHosts: ['.manus.computer'],
  },
  build: {
    rollupOptions: {
      output: {
        // ? FIX: Har CSS aur Asset ke sath hash code aayega taaki Vercel par updates turant sabko milein
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  plugins: [tailwindcss(), tanstackStart(), nitro(verificationOutput ? {
    output: {
      dir: resolve(verificationOutput),
      serverDir: resolve(verificationOutput, 'server'),
      publicDir: resolve(verificationOutput, 'public'),
    },
  } : {}), viteReact()],
})

export default config

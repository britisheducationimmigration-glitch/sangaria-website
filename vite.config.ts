import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => assetInfo.name?.endsWith('.css') ? 'assets/styles.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
  plugins: [tailwindcss(), tanstackStart(), nitro(), viteReact()],
})

export default config

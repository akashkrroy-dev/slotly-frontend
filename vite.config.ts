import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // GSAP + its plugins are registered eagerly in src/utils/gsap.ts, so they
        // land in the entry chunk without this. Keeping them in their own file
        // means the ~60kB gzipped animation runtime caches independently of app
        // code and stops bloating the first-load parse.
        advancedChunks: {
          groups: [
            {
              name: 'gsap',
              test: /[\\/]node_modules[\\/](gsap|@gsap)[\\/]/,
            },
          ],
        },
      },
    },
  },
  server: {
    watch: {
      // Static binary assets (fonts, images) are watched read-only by Vite's asset
      // pipeline and can never hot-reload. fs.watch() on a file that is still being
      // written fails on Windows with EBUSY, which surfaces as an unhandled error
      // and crashes the dev server. Resolution is fs.stat-based, so ignoring them
      // here does not affect serving.
      ignored: ['**/src/assets/**'],
      // Wait for a file to stop growing before emitting an event, so newly saved
      // files are never watched mid-write.
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 50,
      },
    },
  },
})
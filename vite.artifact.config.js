// Sonder-Build: alles (JS, CSS, Fonts) in eine einzige HTML-Datei geinlined –
// für die Artifact-Testversion. Ohne Service Worker / PWA.
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist-artifact',
    assetsInlineLimit: 100000000,
  },
  plugins: [preact(), viteSingleFile()],
})

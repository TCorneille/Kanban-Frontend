import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      // Force all imports of react-redux to resolve to your root node_modules instance
      'react-redux': path.resolve(__dirname, 'node_modules/react-redux'),
    },
    dedupe: ['react', 'react-dom', 'react-redux', '@hello-pangea/dnd'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-redux', '@hello-pangea/dnd'],
  },
})
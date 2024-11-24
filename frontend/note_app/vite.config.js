import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'frontend/note_app', // Specify the correct root directory
  plugins: [react()],
})

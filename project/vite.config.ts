import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 Add the "base" property here
export default defineConfig({
  base: '/Farmora/',  // Important: This must match your repo name
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})

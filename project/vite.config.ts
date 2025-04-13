import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 Add the "base" property here
export default defineConfig({

  base: '/Farmora/', // 👈 Add this line

  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})

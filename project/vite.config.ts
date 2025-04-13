import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 Add the "base" property here
export default defineConfig({
<<<<<<< HEAD
  base: '/Farmora/',  // Important: This must match your repo name
=======
  base: '/Farmora/', // 👈 Add this line
>>>>>>> ca220adc8a2e5b553cea409557932d69110b9e14
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})

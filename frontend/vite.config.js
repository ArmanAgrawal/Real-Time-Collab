import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['peplosed-decamerous-ngan.ngrok-free.dev']
  }
})
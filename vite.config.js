/* import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    //include: ['@ethereum-attestation-service/eas-sdk'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}) */


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ethsign/sp-sdk': '@ethsign/sp-sdk'
    }
  },
  optimizeDeps: {
    include: ['@ethsign/sp-sdk']
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remoteAppCIM",
      filename: "remoteEntry.js",
      exposes: {
        './App': './src/App.tsx'
      },
      shared: ['react','react-dom','mobx-react','mobx-react-lite',{
        // Явно указываем three и его версию
        'three': {
          version: '0.174.0', // Замените на нужную версию
        }
      }, '@thatopen/components',
      {
        'web-ifc': {
          version: '^0.0.66',
        }
      }
      ]
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 5001,  
    cors: true
  }
})
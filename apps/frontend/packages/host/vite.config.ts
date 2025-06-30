import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        remoteAppCIM: 'http://localhost:5001/assets/remoteEntry.js',
        remoteAppIssues: 'http://localhost:5002/assets/remoteEntry.js'
      },
      shared: ['react','react-dom','mobx-react','mobx-react-lite',{
        // Явно указываем three и его версию
        'three': {
          version: '0.174.0', // Замените на нужную версию
        }
      },'@thatopen/components',      {
        'web-ifc': {
          version: '^0.0.66',
        }
      }]
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
   
  },
  
})

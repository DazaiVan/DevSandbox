import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      remotes: {
        app1: 'http://localhost:5001/assets/remoteEntry.js',
        app2: 'http://localhost:5002/assets/remoteEntry.js',
      },
    })
  ],
  server: {
    port: 5000
  }
})

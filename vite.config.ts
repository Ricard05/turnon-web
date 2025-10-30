// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ⭐ NUEVA CONFIGURACIÓN PARA SOPORTE DE DOCKER EN WINDOWS ⭐
  server: {
    // 1. Asegura que Vite escuche en todas las interfaces de red dentro del contenedor
    host: '0.0.0.0', 

    // 2. Configuración clave para el Hot Reloading dentro de Docker en Windows
    watch: {
      usePolling: true, // Habilita el sondeo de archivos en lugar de las notificaciones nativas (más estable en Docker/Windows)
      interval: 100,    // Opcional: Sondea cada 100ms. Puedes ajustarlo si es necesario.
      // Opcional: Ignora los archivos en node_modules que no deberían activar el hot reload
      ignored: ['/node_modules/'] 
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
})
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// O build sai em ./dist e é publicado como artefato de release (ver
// .github/workflows/release.yml). O backend (feedlens) o extrai em
// app/static/spa e o serve na própria origem, então o cookie de sessão do
// login continua valendo e não há CORS com credenciais. `base` casa com a rota
// que serve os assets no Flask; não mude sem mudar o backend.
export default defineConfig(({ mode }) => {
  // Em dev, FEEDLENS_API_URL aponta para o Flask (padrão: http://127.0.0.1:5000).
  const env = loadEnv(mode, process.cwd(), 'FEEDLENS_')
  const api = env.FEEDLENS_API_URL || 'http://127.0.0.1:5000'

  return {
    plugins: [vue()],
    base: '/static/spa/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: fileURLToPath(new URL('./dist', import.meta.url)),
      emptyOutDir: true,
      sourcemap: true,
    },
    server: {
      port: 5173,
      // Em dev o Vite serve o front e encaminha a API/login para o Flask,
      // mantendo a mesma origem do ponto de vista do browser.
      proxy: {
        '/api': api,
        '/auth': api,
        '/login': api,
        '/logout': api,
        '/health': api,
      },
    },
  }
})

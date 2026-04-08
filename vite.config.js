import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.error('[proxy] 백엔드 서버에 연결할 수 없습니다:', err.message)
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: '백엔드 서버에 연결할 수 없습니다. npm run dev로 서버를 실행해주세요.' }))
            }
          })
        },
      },
    },
  },
})

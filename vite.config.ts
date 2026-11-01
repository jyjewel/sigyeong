import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`        → dist/ (일반 정적 배포용)
// `npm run build:single` → dist-single/index.html (파일 하나로 실행되는 버전)
// `npm run build:artifact` → dist-artifact/page.html (Claude 아티팩트 판, 自編詩畫帖 만들기 포함)
export default defineConfig(({ mode }) => {
  const single = mode === 'single' || mode === 'artifact'
  return {
    base: './',
    plugins: single ? [react(), viteSingleFile()] : [react()],
    build: single ? { outDir: mode === 'artifact' ? 'dist-artifact' : 'dist-single' } : {},
  }
})

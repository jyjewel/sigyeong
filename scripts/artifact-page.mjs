// dist-artifact/index.html → dist-artifact/page.html
// Claude 아티팩트는 게시할 때 문서 껍데기(doctype·head·body)를 직접 씌우므로
// 그 안에 들어갈 내용(제목·글꼴·스크립트·스타일·#root)만 남긴다.
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('dist-artifact/index.html', 'utf8')
const head = src.match(/<head>([\s\S]*)<\/head>/)[1]
  .replace(/<meta charset[^>]*>\s*/, '')
  .replace(/<meta name="viewport"[^>]*>\s*/, '')
  .replace(/<title>[\s\S]*?<\/title>/, '<title>詩景 시제품</title>')
const body = src.match(/<body>([\s\S]*)<\/body>/)[1]
writeFileSync('dist-artifact/page.html', head.trim() + '\n' + body.trim() + '\n')

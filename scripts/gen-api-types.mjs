// Gera src/types/api.generated.ts a partir do contrato OpenAPI do backend
// (feedlens), fixado a UM commit (veja api-spec.version na raiz do repo).
//
// Node puro, sem bash/curl: usa o fetch global do Node e a API Node de
// openapi-typescript. Rode com `npm run gen:api`. O resultado e deterministico
// (idempotente): rodar duas vezes gera exatamente o mesmo arquivo.
//
// Uso tipico: quando o backend mudar o contrato, suba o SHA em api-spec.version
// e rode `npm run gen:api`. O CI falha se o arquivo commitado divergir.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import openapiTS, { astToString } from 'openapi-typescript'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(scriptDir, '..')

// O SHA do backend vive em UM so lugar: api-spec.version na raiz.
const sha = readFileSync(join(repoRoot, 'api-spec.version'), 'utf8').trim()
if (!/^[0-9a-f]{40}$/.test(sha)) {
  console.error(`api-spec.version invalido: esperava um SHA de 40 hex, veio "${sha}".`)
  process.exit(1)
}

// URL pinada ao commit do backend (nunca um branch movel).
const specUrl = `https://raw.githubusercontent.com/IannCarvalho/feedlens/${sha}/openapi.yaml`
const outPath = join(repoRoot, 'src', 'types', 'api.generated.ts')

const header = [
  '/**',
  ' * ARQUIVO GERADO -- NAO EDITE A MAO.',
  ' *',
  ` * Gerado por scripts/gen-api-types.mjs a partir do contrato OpenAPI do`,
  ` * backend (feedlens), fixado ao commit ${sha}.`,
  ' * Para regenerar: suba o SHA em api-spec.version e rode `npm run gen:api`.',
  ' */',
  '',
  '',
].join('\n')

async function main() {
  const ast = await openapiTS(new URL(specUrl))
  // astToString ja usa \n; normalizamos mesmo assim e garantimos uma unica
  // quebra final, para o diff do CI nao acusar ruido de fim de linha.
  const body = astToString(ast).replace(/\r\n/g, '\n').replace(/\n*$/, '\n')
  writeFileSync(outPath, header + body, { encoding: 'utf8' })
  console.log(`Gerado src/types/api.generated.ts a partir de ${specUrl}`)
}

main().catch((err) => {
  console.error('Falha ao gerar os tipos da API:', err)
  process.exit(1)
})

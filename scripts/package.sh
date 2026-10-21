#!/usr/bin/env bash
# Empacota o build do painel (dist/) em um artefato versionado.
#
# Saída (em ./release/):
#   feedlens-panel-v<versão>.tgz         conteúdo de dist/ na raiz do tarball
#   feedlens-panel-v<versão>.tgz.sha256  checksum, no formato do `sha256sum -c`
#
# O backend (feedlens) extrai o tarball em app/static/spa. O empacotamento é
# determinístico (ordem, datas e dono fixos), então o mesmo build gera o mesmo
# checksum, e o backend pode fixá-lo.
#
# Uso: npm run build && scripts/package.sh
set -euo pipefail

cd "$(dirname "$0")/.."

version="$(node -p "require('./package.json').version")"
name="feedlens-panel-v${version}.tgz"

test -f dist/index.html || { echo "dist/index.html não existe: rode 'npm run build' antes." >&2; exit 1; }

# Sanidade: o index precisa apontar para os assets sob /static/spa/, que é a
# rota que o Flask serve. Se o `base` do Vite mudar, o painel quebraria em
# produção sem nenhum erro de build.
grep -q '<div id="app">' dist/index.html || { echo "index.html sem #app" >&2; exit 1; }
asset="$(grep -o '/static/spa/assets/[^"]*\.js' dist/index.html | head -n 1 || true)"
test -n "$asset" || { echo "index.html não referencia /static/spa/assets/*.js" >&2; exit 1; }
test -f "dist/${asset#/static/spa/}" || { echo "asset ${asset} não existe em dist/" >&2; exit 1; }

rm -rf release
mkdir -p release

tar --sort=name --mtime='UTC 1970-01-01' --owner=0 --group=0 --numeric-owner \
    -cf - -C dist . | gzip -n > "release/${name}"

(cd release && sha256sum "${name}" > "${name}.sha256")

echo "Gerado release/${name}"
cat "release/${name}.sha256"

# FeedLens · painel

Painel do [FeedLens](https://github.com/IannCarvalho/feedlens), a plataforma que analisa feedbacks de clientes com IA. É o front de quem **opera** o produto: visão geral com gráficos, lista e detalhe dos feedbacks (corrigir sentimento, marcar spam, reanalisar) e o cofre de chaves dos provedores de IA.

Vue 3 + Vite + PrimeVue + Pinia, em TypeScript. O formulário que o cliente final usa para enviar feedback é outro projeto: [feedlens-form](https://github.com/IannCarvalho/feedlens-form).

## Como se encaixa

```mermaid
flowchart LR
    Panel["feedlens-panel<br/>(este repositório)"] -- "release versionado<br/>(tarball + sha256)" --> Image["imagem Docker<br/>do backend"]
    Image --> Flask["Flask serve a API<br/>e o painel, na mesma origem"]
    Browser["Navegador do operador"] -- "/ , /api/*, /login" --> Flask
```

O painel **não tem servidor próprio em produção**. Cada release é um tarball do build que o backend ([feedlens](https://github.com/IannCarvalho/feedlens)) embute na imagem e serve em `/`. Isso mantém painel e API na mesma origem, de modo que o cookie de sessão e o CSRF funcionam sem CORS com credenciais.

Consequência importante: o `base` do Vite é `/static/spa/` e **precisa casar com a rota do Flask que serve os assets**. Não o altere sem alterar o backend. O script de empacotamento falha se o `index.html` não referenciar `/static/spa/assets/`.

## Rodando em desenvolvimento

Pré-requisitos: Node 24.15 ou superior (veja `.node-version`; com `fnm`, rode `fnm use`) e o backend rodando em `http://127.0.0.1:5000`. Para subir o backend, siga o [README do feedlens](https://github.com/IannCarvalho/feedlens/blob/main/README.md).

```powershell
npm ci
npm run dev        # http://localhost:5173
```

O Vite encaminha `/api`, `/auth`, `/login`, `/logout` e `/health` para o Flask, então o navegador enxerga uma origem só. Se o backend estiver em outro endereço:

```powershell
$env:FEEDLENS_API_URL = "http://127.0.0.1:5001"
npm run dev
```

Entre com a senha definida em `DASHBOARD_PASSWORD` no `.env` do backend.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com proxy para o Flask |
| `npm run typecheck` | Checagem de tipos (`vue-tsc`) |
| `npm run lint` | ESLint, sem tolerância a warnings |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Serve o `dist/` localmente (sem API) |
| `bash scripts/package.sh` | Empacota `dist/` em `release/` (tarball + checksum) |

## Variáveis de ambiente

| Variável | Onde | Padrão | Uso |
|---|---|---|---|
| `FEEDLENS_API_URL` | Só em `npm run dev` | `http://127.0.0.1:5000` | Para onde o proxy do Vite encaminha a API |

O build de produção **não lê variáveis de ambiente**: tudo é relativo à origem que serve o painel.

## Releases

O CI (`.github/workflows/ci.yml`) roda typecheck, lint e build a cada PR, e ainda empacota o tarball como ensaio, guardando-o como artefato do run.

Para publicar uma versão:

1. Ajuste `version` em `package.json` e faça merge.
2. Crie e envie a tag: `git tag v0.1.0` e `git push origin v0.1.0`.

O workflow `release.yml` confere que a tag bate com o `package.json`, compila e cria o release com dois arquivos:

- `feedlens-panel-v<versão>.tgz`: o conteúdo de `dist/` na raiz do tarball;
- `feedlens-panel-v<versão>.tgz.sha256`: checksum no formato do `sha256sum -c`.

O empacotamento é determinístico (ordem, datas e dono fixos): o mesmo build gera o mesmo checksum.

### Como o backend consome o release

Na imagem Docker do backend, o painel passa a ser baixado do release, com versão e checksum fixos:

```dockerfile
ARG PANEL_VERSION=0.1.0
ARG PANEL_SHA256=<conteúdo do .sha256 do release>
RUN curl -fsSL -o /tmp/panel.tgz \
      "https://github.com/IannCarvalho/feedlens-panel/releases/download/v${PANEL_VERSION}/feedlens-panel-v${PANEL_VERSION}.tgz" \
    && echo "${PANEL_SHA256}  /tmp/panel.tgz" | sha256sum -c - \
    && mkdir -p app/static/spa \
    && tar -xzf /tmp/panel.tgz -C app/static/spa
```

Esse trecho é a próxima etapa da migração e ainda não está no backend: hoje o `Dockerfile` do feedlens ainda compila a pasta `frontend/` dele.

## Estrutura

```
src/main.ts, App.vue     entrada e casca (menu, tema)
src/router/              rotas (Vue Router em history mode, base "/")
src/stores/              Pinia: sessão, estatísticas, feedbacks, provedores
src/views/               Dashboard, lista e detalhe, provedores, login
src/components/          gráficos e marca
src/theme/, assets/      tema do PrimeVue e CSS
src/lib/                 cliente HTTP, rótulos de sentimento e de análise
src/types/api.ts         tipos das respostas da API do backend
scripts/package.sh       empacota dist/ para o release
```

## Contrato com a API

`src/types/api.ts` espelha, **à mão**, as respostas do backend. Quando uma mudança do backend altera uma resposta, este arquivo precisa mudar junto, em um PR aqui. Gerar esses tipos a partir de um contrato OpenAPI é uma etapa futura da migração.

## Histórico

Este repositório nasceu da pasta `frontend/` do [feedlens](https://github.com/IannCarvalho/feedlens), com o histórico de git preservado (`git filter-repo`). Referências como `IannCarvalho/feedlens#54` nas mensagens de commit apontam para PRs do repositório original.

## Licença

[MIT](LICENSE)

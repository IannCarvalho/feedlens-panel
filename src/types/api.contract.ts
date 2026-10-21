/**
 * Checagem de contrato -- SO DE TIPOS, sem efeito em runtime.
 *
 * Este arquivo NAO e importado pelo app. Ele existe para o `vue-tsc`
 * (npm run typecheck) falhar se os tipos GERADOS do contrato OpenAPI do backend
 * (api.generated.ts) deixarem de ser compativeis com os tipos escritos A MAO que
 * o app usa (api.ts). Enquanto a migracao nao acontece, `api.ts` segue sendo a
 * fonte usada pelo app; esta checagem so garante que os dois nao divergem em
 * silencio.
 *
 * Direcao da afirmacao: a RESPOSTA gerada tem de ser ATRIBUIVEL ao tipo escrito
 * a mao. Ou seja, o que o backend devolve (segundo o contrato) cabe no que o app
 * espera ler. As afirmacoes usam ATRIBUICAO REAL (posicao de parametro de
 * funcao), e nao o truque `A extends B` em tipo condicional: com tipos que tem
 * index signature (additionalProperties: true), o `extends` condicional diverge
 * da atribuibilidade de verdade -- confirmado nesta base. A atribuicao real e o
 * que o app sofre, entao e nela que o teste se apoia.
 *
 * Divergencias conhecidas e aceitas estao documentadas e tratadas abaixo;
 * qualquer OUTRA divergencia quebra o typecheck.
 */
import type { components } from './api.generated'
import type {
  Feedback,
  FeedbackListResponse,
  DashboardStats,
  FeatureStat,
  ReanalyzePendingResponse,
  ProviderCredential,
  ProvidersResponse,
  SessionResponse,
} from './api'

type Schemas = components['schemas']

/**
 * `assignableTo<Target>()(source)` so compila se `source` for ATRIBUIVEL a
 * `Target`. E a mesma verificacao que o app faz ao consumir a resposta. Nao
 * executa nada: as chamadas abaixo vivem dentro de uma funcao nunca chamada, e
 * os valores sao `declare`dos (sem runtime).
 */
function assignableTo<Target>() {
  return (source: Target): Target => source
}

// Envolve tudo numa funcao nao exportada e nunca chamada: zero efeito em runtime.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function __contractChecks(): void {
  /* ---- Respostas geradas atribuiveis ao tipo manual ---- */

  // Feedback: identico nos dois lados (sentiment anulavel, todos obrigatorios).
  const feedback = null as unknown as Schemas['Feedback']
  assignableTo<Feedback>()(feedback)

  // Listagem + paginacao: items/pagination/sentiment/spam/analysis batem.
  const list = null as unknown as Schemas['FeedbackListResponse']
  assignableTo<FeedbackListResponse>()(list)

  // Reanalise em lote: stopped_reason e o mesmo union; demais campos iguais.
  const reanalyze = null as unknown as Schemas['ReanalyzePendingResponse']
  assignableTo<ReanalyzePendingResponse>()(reanalyze)

  // Sessao do painel: identico.
  const session = null as unknown as Schemas['SessionResponse']
  assignableTo<SessionResponse>()(session)

  /* ---- Divergencias de forma CONHECIDAS e aceitas ---- */

  // Estatisticas do painel: desde que a spec do backend marca como obrigatorios
  // o `percentage` de FeatureStat e as chaves POSITIVO/NEGATIVO/INCONCLUSIVO de
  // sentiment_counts e sentiment_percentages (os tres que a API sempre devolve
  // quando ha dados), os tipos gerados cabem direto nos manuais, sem ajuste.
  // DashboardStats.unanalyzed e opcional nos dois lados.
  const stats = null as unknown as Schemas['DashboardStats']
  assignableTo<DashboardStats>()(stats)

  const featureStat = null as unknown as Schemas['FeatureStat']
  assignableTo<FeatureStat>()(featureStat)

  // (3) ProviderCredential.created_at: a API inclui `created_at` (obrigatorio)
  // e o tipo manual do painel agora tambem o declara (obrigatorio). Os dois
  // lados batem, entao o gerado continua ATRIBUIVEL ao manual sem narrow.
  const credential = null as unknown as Schemas['ProviderCredential']
  assignableTo<ProviderCredential>()(credential)
  const providers = null as unknown as Schemas['ProvidersResponse']
  assignableTo<ProvidersResponse>()(providers)
}

// Este arquivo e so de tipos/checagem. O export vazio o mantem como modulo.
export {}

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

  // (1) DashboardStats.unanalyzed: opcional no painel, e tambem opcional na spec
  // (nao esta em `required`), embora a API SEMPRE devolva o campo. Opcional ->
  // opcional e atribuivel; esse campo nao exige tratamento especial.
  //
  // (4) DashboardStats.sentiment_counts: no painel SentimentCounts tem
  // POSITIVO/NEGATIVO/INCONCLUSIVO OBRIGATORIOS; na spec o schema SentimentCounts
  // nao lista nenhum em `required` (e ainda tem additionalProperties: true), ou
  // seja, sao OPCIONAIS. Entao o sentiment_counts gerado NAO e atribuivel direto
  // ao manual. Mesma natureza da divergencia (2) abaixo: a spec sub-restringe um
  // objeto que o painel trata como completo.
  //
  // (2)+(4)+(5) dentro de DashboardStats: top_features e FeatureStat[]
  // (percentage obrigatoria no painel, opcional na spec -- ver (2)),
  // sentiment_counts cai no caso (4), e sentiment_percentages no caso (5) --
  // o painel o tipa como Record<keyof SentimentCounts, number> (chaves
  // POSITIVO/NEGATIVO/INCONCLUSIVO obrigatorias), mas a spec usa
  // additionalProperties, que gera { [key: string]: number } (sem exigir essas
  // chaves). Afirmamos a forma NARROWED de DashboardStats, com esses tres campos
  // no formato do painel, para documentar as divergencias sem afrouxar o teste.
  // Se a spec passar a marcar esses campos/chaves como required, as narrows
  // somem.
  type DashboardStatsNarrowed = Omit<
    Schemas['DashboardStats'],
    'sentiment_counts' | 'sentiment_percentages' | 'top_features'
  > & {
    sentiment_counts?: DashboardStats['sentiment_counts']
    sentiment_percentages?: DashboardStats['sentiment_percentages']
    top_features?: (Schemas['FeatureStat'] & { percentage: number })[]
  }
  const stats = null as unknown as DashboardStatsNarrowed
  assignableTo<DashboardStats>()(stats)

  // (2) FeatureStat.percentage: OBRIGATORIO no painel, OPCIONAL na API (a spec
  // nao o lista em `required`). Logo o FeatureStat gerado NAO e atribuivel
  // direto ao manual -- um objeto que siga a spec pode omitir `percentage`, e o
  // painel o exige. Afirmamos a forma NARROWED: com `percentage` presente, o
  // gerado cabe no manual. Isto documenta a divergencia em vez de afrouxar o
  // teste. Se o painel passar a tratar `percentage` como opcional (ou a API a
  // tornar obrigatoria), esta narrow deixa de ser necessaria.
  const featureStat = null as unknown as Schemas['FeatureStat'] & { percentage: number }
  assignableTo<FeatureStat>()(featureStat)

  // (3) ProviderCredential.created_at: a API inclui `created_at` (obrigatorio),
  // mas o tipo manual do painel NAO declara esse campo. Como o gerado tem um
  // SUPERCONJUNTO das propriedades do manual, o gerado continua ATRIBUIVEL ao
  // manual (propriedades extras sao aceitas na atribuicao). Fica o registro de
  // que o painel ainda nao mapeia `created_at`.
  const credential = null as unknown as Schemas['ProviderCredential']
  assignableTo<ProviderCredential>()(credential)
  const providers = null as unknown as Schemas['ProvidersResponse']
  assignableTo<ProvidersResponse>()(providers)
}

// Este arquivo e so de tipos/checagem. O export vazio o mantem como modulo.
export {}

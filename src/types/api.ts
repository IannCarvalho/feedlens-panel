/*
 * Tipos do contrato da API do FeedLens.
 *
 * Desde o PR da migração do contrato, estes nomes são ALIASES derivados dos
 * tipos GERADOS a partir do OpenAPI do backend (`api.generated.ts`, produzido
 * por `npm run gen:api` a partir da spec fixada em `api-spec.version`). Os
 * nomes exportados aqui seguem os mesmos de antes, então views e stores não
 * mudam: elas continuam importando de `@/types/api`. A fonte da verdade passou
 * a ser o contrato OpenAPI; para atualizar, suba o SHA em `api-spec.version` e
 * rode `npm run gen:api`.
 *
 * Onde um tipo gerado NÃO reflete o que o app precisa, mantém-se o tipo à mão
 * SÓ naquele caso, com o porquê documentado ao lado (hoje: `SessionResponse`).
 */
import type { components } from './api.generated'

type Schemas = components['schemas']

export type Sentiment = Schemas['Sentiment']
/** Enum de provedores derivado do contrato (backend: app/llm/providers.py). */
export type ProviderId = Schemas['ProviderId']

export type RequestedFeature = Schemas['RequestedFeature']

export type Feedback = Schemas['Feedback']

export type AnalysisStatus = Schemas['AnalysisStatus']
/** Filtro da lista (`?analysis=`): tudo ou só os não analisados. */
export type FeedbackAnalysisFilter = Schemas['AnalysisFilter']

export type Pagination = Schemas['Pagination']

export type FeedbackListResponse = Schemas['FeedbackListResponse']

/** O que a lista faz com o que a IA marcou como spam (`?spam=`). */
export type FeedbackSpamFilter = Schemas['SpamMode']

/**
 * Por que a reanálise em lote parou antes de terminar (`null` = seguiu normal).
 * A spec modela isto inline em `ReanalyzePendingResponse.stopped_reason`
 * (`null | "provider_error"`); aqui extraímos só o valor não-nulo.
 */
export type ReanalyzeStoppedReason = NonNullable<
  Schemas['ReanalyzePendingResponse']['stopped_reason']
>

/**
 * Resposta de POST /api/feedbacks/reanalyze-pending: um lote de reanálise dos
 * feedbacks que a IA não tinha conseguido analisar.
 */
export type ReanalyzePendingResponse = Schemas['ReanalyzePendingResponse']

/* ---- Cofre de provedores (BYOK do operador) ---- */

export type ProviderCatalogEntry = Schemas['ProviderCatalogEntry']

export type ProviderCredential = Schemas['ProviderCredential']

export type ProvidersResponse = Schemas['ProvidersResponse']

export type ProviderTestResult = Schemas['ProviderTestResult']

export type ApiError = Schemas['Error']

/* ---- Sessão do painel (GET /auth/session, POST /login) ---- */

/*
 * MANTIDO À MÃO (diverge do gerado de propósito): a spec fixada marca
 * `analysis_configured` como OBRIGATÓRIO, mas o painel precisa tolerar um
 * backend mais antigo que ainda não envia o campo — nesse caso o app NÃO
 * mostra o aviso de "nenhum provedor" (sem falso alarme). Por isso o campo é
 * OPCIONAL aqui. A checagem em `api.contract.ts` garante que o gerado
 * (obrigatório) continua atribuível a este tipo (opcional); se o backend
 * mudar o tipo do campo, o typecheck quebra.
 */
export interface SessionResponse {
  /** Há DASHBOARD_PASSWORD no servidor (o painel exige login). */
  auth_enabled: boolean
  /** Pode usar o painel: logado, ou login desligado. */
  authenticated: boolean
  /**
   * Há ao menos um provedor de IA utilizável no servidor (chave de ambiente ou
   * salva no cofre). Opcional: um backend mais antigo não envia o campo, e
   * nesse caso o painel não mostra o aviso de "sem provedor" (sem falso alarme).
   */
  analysis_configured?: boolean
  csrf_token: string
}

export type LoginResponse = Schemas['LoginResponse']

/* ---- Estatísticas do dashboard (GET /api/stats) ---- */

export type SentimentCounts = Schemas['SentimentCounts']

export type FeatureStat = Schemas['FeatureStat']

export type DashboardStats = Schemas['DashboardStats']

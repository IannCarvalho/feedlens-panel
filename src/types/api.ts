/*
 * Tipos do contrato da API do FeedLens. Espelham o que o backend Flask
 * devolve hoje (app/routes/api.py e settings_api.py). Mantidos à mão por ora;
 * quando o backend expuser OpenAPI, dá para gerar isto automaticamente.
 */

export type Sentiment = 'POSITIVO' | 'NEGATIVO' | 'INCONCLUSIVO'
export type ProviderId = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'openrouter'

export interface RequestedFeature {
  code: string
  reason: string
}

export interface Feedback {
  id: string
  feedback: string
  sentiment: Sentiment | null
  is_spam: boolean
  /** 'unanalyzed' = a IA não respondeu; sentimento e spam são só o padrão. */
  analysis_status: AnalysisStatus
  /** Motivo da última falha da IA (rate_limit, timeout...). */
  analysis_error: string | null
  /** 'provedor/modelo' que analisou; null se não analisado. */
  analyzed_by: string | null
  created_at: string
  requested_features: RequestedFeature[]
}

export type AnalysisStatus = 'analyzed' | 'unanalyzed'
/** Filtro da lista (`?analysis=`): tudo ou só os não analisados. */
export type FeedbackAnalysisFilter = 'any' | 'unanalyzed'

export interface Pagination {
  page: number
  per_page: number
  total: number
  pages: number
  has_next: boolean
  has_prev: boolean
}

export interface FeedbackListResponse {
  items: Feedback[]
  pagination: Pagination
  sentiment: string | null
  spam: FeedbackSpamFilter
  analysis: FeedbackAnalysisFilter
}

/** O que a lista faz com o que a IA marcou como spam (`?spam=`). */
export type FeedbackSpamFilter = 'exclude' | 'include' | 'only'

/** Por que a reanálise em lote parou antes de terminar (`null` = seguiu normal). */
export type ReanalyzeStoppedReason = 'provider_error'

/**
 * Resposta de POST /api/feedbacks/reanalyze-pending: um lote de reanálise dos
 * feedbacks que a IA não tinha conseguido analisar.
 */
export interface ReanalyzePendingResponse {
  /** Quantos feedbacks este lote tentou reanalisar. */
  processed: number
  /** Quantos a IA conseguiu analisar neste lote. */
  analyzed: number
  /** Quantos continuaram sem análise neste lote. */
  failed: number
  /** Quantos ainda estão sem análise depois deste lote. */
  remaining: number
  /** Preenchido quando o lote parou por falha do provedor. */
  stopped_reason: ReanalyzeStoppedReason | null
}

/* ---- Cofre de provedores (BYOK do operador) ---- */

export interface ProviderCatalogEntry {
  id: ProviderId
  label: string
  default_model: string
  server_key_configured: boolean
}

export interface ProviderCredential {
  id: string
  provider: ProviderId
  model: string
  priority: number
  enabled: boolean
  key_hint: string
  last_verified_at: string | null
  last_error_kind: string | null
}

export interface ProvidersResponse {
  vault_enabled: boolean
  csrf_token: string
  catalog: ProviderCatalogEntry[]
  environment_chain: string[]
  providers: ProviderCredential[]
}

export interface ProviderTestResult {
  ok: boolean
  kind: string | null
  latency_ms: number | null
  checked_at: string
  provider: ProviderCredential
}

export interface ApiError {
  error: string
  code?: string
  detail?: string
}

/* ---- Sessão do painel (GET /auth/session, POST /login) ---- */

export interface SessionResponse {
  /** Há DASHBOARD_PASSWORD no servidor (o painel exige login). */
  auth_enabled: boolean
  /** Pode usar o painel: logado, ou login desligado. */
  authenticated: boolean
  csrf_token: string
}

export interface LoginResponse {
  ok: boolean
  /** Destino já filtrado pelo servidor (só caminhos locais). */
  next: string
}

/* ---- Estatísticas do dashboard (GET /api/stats) ---- */

export interface SentimentCounts {
  POSITIVO: number
  NEGATIVO: number
  INCONCLUSIVO: number
}

export interface FeatureStat {
  code: string
  count: number
  percentage: number
}

export interface DashboardStats {
  has_data: boolean
  /** Feedbacks que a IA não conseguiu analisar. */
  unanalyzed?: number
  total_feedbacks?: number
  sentiment_counts?: SentimentCounts
  sentiment_percentages?: Record<keyof SentimentCounts, number>
  top_features?: FeatureStat[]
  recent_feedbacks?: Feedback[]
}

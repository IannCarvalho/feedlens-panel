/*
 * Fonte única dos motivos de falha da IA/provedor, derivados do `kind` que o
 * backend devolve (`analysis_error` do feedback, ou `last_error_kind` da chave
 * salva). Cada motivo tem duas formas, usadas em telas diferentes:
 *
 *   - `long`  — frase explicativa, usada na lista/detalhe de feedbacks
 *               (`analysisErrorLabel`).
 *   - `short` — rótulo curto para o selo de uma chave salva na tela de
 *               provedores (`providerErrorLabel`).
 *
 * Nem todo `kind` tem as duas formas (o backend emite conjuntos ligeiramente
 * diferentes em cada contexto); quando falta, cada função cai no seu próprio
 * padrão, preservando exatamente o texto que cada tela mostrava antes.
 */

interface ErrorReason {
  /** Frase explicativa (lista/detalhe de feedbacks). */
  long?: string
  /** Rótulo curto (selo de chave na tela de provedores). */
  short?: string
}

const ERROR_REASONS: Record<string, ErrorReason> = {
  rate_limit: {
    long: 'a cota do provedor de IA foi excedida',
    short: 'cota excedida',
  },
  timeout: {
    long: 'o provedor de IA demorou demais para responder',
    short: 'tempo esgotado',
  },
  connection: {
    long: 'não foi possível falar com o provedor de IA',
    short: 'sem conexão',
  },
  auth: {
    long: 'o provedor de IA recusou a chave',
    short: 'chave recusada',
  },
  not_found: {
    long: 'o modelo configurado não foi encontrado no provedor',
    short: 'modelo indisponível',
  },
  bad_request: {
    long: 'o provedor de IA recusou o pedido',
    short: 'pedido inválido',
  },
  empty: {
    long: 'o provedor de IA devolveu uma resposta vazia',
    short: 'resposta vazia',
  },
  invalid_response: {
    long: 'a IA devolveu uma resposta que o sistema não conseguiu ler',
  },
  error: {
    short: 'falha na chamada',
  },
}

/**
 * Frase explicativa do motivo da falha da IA, para a lista/detalhe de
 * feedbacks. Padrão quando o `kind` é desconhecido/ausente, idêntico ao de
 * antes: "o provedor de IA falhou".
 */
export function analysisErrorLabel(kind: string | null | undefined): string {
  return (kind && ERROR_REASONS[kind]?.long) || 'o provedor de IA falhou'
}

/**
 * Rótulo curto do motivo da falha de uma chave salva, para o selo na tela de
 * provedores. Sem forma curta conhecida, mostra o próprio `kind`; sem `kind`,
 * string vazia — exatamente o comportamento de antes.
 */
export function providerErrorLabel(kind: string | null): string {
  return (kind && ERROR_REASONS[kind]?.short) || kind || ''
}

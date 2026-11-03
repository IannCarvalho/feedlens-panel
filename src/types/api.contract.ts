/**
 * Checagem de contrato -- SO DE TIPOS, sem efeito em runtime.
 *
 * Este arquivo NAO e importado pelo app. Ele existe para o `vue-tsc`
 * (npm run typecheck) falhar se os tipos GERADOS do contrato OpenAPI do backend
 * (api.generated.ts) deixarem de ser compativeis com o UNICO tipo que o painel
 * ainda escreve A MAO em `api.ts`.
 *
 * Desde a migracao, `api.ts` so re-exporta aliases dos tipos gerados -- exceto
 * `SessionResponse`, mantido a mao de proposito: a spec marca
 * `analysis_configured` como OBRIGATORIO, mas o painel precisa tolerar um
 * backend antigo que ainda nao envia o campo (por isso o declara OPCIONAL).
 * Para os aliases, gerado e manual sao o MESMO tipo, entao nao ha o que
 * divergir; a unica checagem que ainda protege algo e a de `SessionResponse`.
 *
 * Direcao da afirmacao: a RESPOSTA gerada tem de ser ATRIBUIVEL ao tipo escrito
 * a mao. Ou seja, o que o backend devolve (segundo o contrato, com o campo
 * obrigatorio) cabe no que o app espera ler (com o campo opcional). Se o
 * backend mudar o TIPO de `analysis_configured`, ou remover outro campo que o
 * painel le, esta checagem quebra o typecheck em vez de passar despercebido.
 * Usa ATRIBUICAO REAL (posicao de parametro de funcao), nao o truque
 * `A extends B`, para bater com a atribuibilidade que o app de fato sofre.
 */
import type { components } from './api.generated'
import type { SessionResponse } from './api'

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
  // Sessao do painel: o tipo gerado (com `analysis_configured` obrigatorio) tem
  // de ser atribuivel ao tipo manual (com o campo opcional, para tolerar
  // backend antigo). Esta e a unica divergencia conhecida e aceita.
  const session = null as unknown as Schemas['SessionResponse']
  assignableTo<SessionResponse>()(session)
}

// Este arquivo e so de tipos/checagem. O export vazio o mantem como modulo.
export {}

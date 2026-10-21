<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import ProgressBar from 'primevue/progressbar'

import { useFeedbacksStore } from '@/stores/feedbacks'
import { HttpError } from '@/lib/http'

/**
 * Botão "Reanalisar todos os não analisados" + a conversa de confirmação e o
 * acompanhamento do lote. Pede confirmação antes de gastar cota do provedor,
 * roda em lotes de 5 repetindo até não sobrar nenhum, deixa cancelar entre um
 * lote e outro e para no primeiro erro do provedor, sempre orientando o
 * próximo passo em linguagem comum.
 */
const props = defineProps<{
  /** Quantos feedbacks estão sem análise agora (vem do pai). */
  count: number
}>()

// Avisa o pai para recarregar lista/estatísticas. Só emitimos quando o usuário
// fecha o resultado: se recarregássemos no fim do lote, o pai poderia desmontar
// este componente (a contagem zera) e levar junto a janela de resultado.
const emit = defineEmits<{ finished: [] }>()

const BATCH_SIZE = 5

const store = useFeedbacksStore()

type Phase = 'idle' | 'confirm' | 'running' | 'cancelling' | 'result'

const phase = ref<Phase>('idle')
const total = ref(0) // feedbacks a reanalisar quando o lote começou
const analyzed = ref(0) // quantos a IA conseguiu analisar
const remaining = ref(0) // quantos ainda faltam
const cancelRequested = ref(false)
const resultKind = ref<'done' | 'cancelled' | 'provider' | 'error'>('done')
const resultMessage = ref('')

const done = computed(() => Math.max(0, total.value - remaining.value))
const progressPct = computed(() =>
  total.value > 0 ? Math.round((done.value / total.value) * 100) : 0,
)

/** Abre a confirmação (nada é enviado ainda). */
function askConfirm() {
  if (props.count <= 0) return
  phase.value = 'confirm'
}

function closeConfirm() {
  phase.value = 'idle'
}

/** Mensagem de erro de rede/sessão em linguagem comum, orientando o passo. */
function networkMessage(e: unknown): string {
  if (e instanceof HttpError) {
    if (e.status === 429) {
      return 'A cota do provedor de IA foi excedida. Tente de novo mais tarde, ou veja a tela Provedores de IA.'
    }
    if (e.status === 403) {
      return 'Sua sessão expirou ou o pedido não foi autorizado. Recarregue a página e entre de novo.'
    }
    return e.message
  }
  return 'Não foi possível falar com o servidor. Recarregue a página; se persistir, verifique se o servidor está no ar.'
}

/** Confirma e roda os lotes até terminar, parar por erro ou ser cancelado. */
async function start() {
  cancelRequested.value = false
  analyzed.value = 0
  total.value = props.count
  remaining.value = props.count
  phase.value = 'running'

  try {
    while (remaining.value > 0) {
      if (cancelRequested.value) {
        resultKind.value = 'cancelled'
        resultMessage.value =
          analyzed.value > 0
            ? `Parado a seu pedido. ${analyzed.value} ${
                analyzed.value === 1 ? 'feedback foi reanalisado' : 'feedbacks foram reanalisados'
              } e ${remaining.value} ainda ${remaining.value === 1 ? 'está' : 'estão'} sem análise.`
            : 'Parado a seu pedido. Nenhum feedback foi reanalisado.'
        phase.value = 'result'
        return
      }

      const batch = await store.reanalyzePending(BATCH_SIZE)
      analyzed.value += batch.analyzed
      remaining.value = batch.remaining

      if (batch.stopped_reason === 'provider_error') {
        resultKind.value = 'provider'
        resultMessage.value =
          'O provedor de IA não respondeu, então a reanálise parou. Veja a tela Provedores de IA ou tente de novo mais tarde. ' +
          `Até aqui, ${analyzed.value} ${
            analyzed.value === 1 ? 'feedback foi reanalisado' : 'feedbacks foram reanalisados'
          } e ${remaining.value} ainda ${remaining.value === 1 ? 'falta' : 'faltam'}.`
        phase.value = 'result'
        return
      }

      // Lote que não avançou nem sinalizou parada: evita repetir para sempre.
      if (batch.processed === 0 && batch.remaining > 0) {
        resultKind.value = 'error'
        resultMessage.value =
          'A reanálise não conseguiu avançar. Tente de novo mais tarde; se persistir, veja a tela Provedores de IA.'
        phase.value = 'result'
        return
      }
    }

    resultKind.value = 'done'
    resultMessage.value =
      analyzed.value > 0
        ? `Pronto. ${analyzed.value} ${
            analyzed.value === 1 ? 'feedback foi reanalisado' : 'feedbacks foram reanalisados'
          } pela IA.`
        : 'Pronto. Não havia mais nada para reanalisar.'
    phase.value = 'result'
  } catch (e) {
    resultKind.value = 'error'
    resultMessage.value = networkMessage(e)
    phase.value = 'result'
  }
}

/** Pede para parar depois do lote em andamento (não interrompe no meio). */
function requestCancel() {
  if (phase.value === 'running') {
    cancelRequested.value = true
    phase.value = 'cancelling'
  }
}

function closeResult() {
  phase.value = 'idle'
  // Agora sim recarrega o que mudou (sem interromper a janela de resultado).
  emit('finished')
}

const resultSeverity = computed(() => {
  switch (resultKind.value) {
    case 'done':
      return 'success'
    case 'cancelled':
      return 'info'
    default:
      return 'warn'
  }
})
</script>

<template>
  <span class="fl-reanalyze">
    <Button
      label="Reanalisar todos os não analisados"
      icon="pi pi-refresh"
      size="small"
      :disabled="count <= 0 || phase === 'running' || phase === 'cancelling'"
      @click="askConfirm"
    />

    <!-- Confirmação: diz quantos e avisa do custo, em linguagem comum. -->
    <Dialog
      :visible="phase === 'confirm'"
      modal
      header="Reanalisar os feedbacks não analisados?"
      :closable="true"
      :draggable="false"
      :style="{ width: '32rem' }"
      @update:visible="(v) => !v && closeConfirm()"
    >
      <p class="fl-reanalyze__text">
        Vamos pedir para a IA analisar de novo
        <strong>{{ count }}</strong>
        {{ count === 1 ? 'feedback' : 'feedbacks' }} que ainda não
        {{ count === 1 ? 'foi analisado' : 'foram analisados' }}.
      </p>
      <p class="fl-reanalyze__text">
        Cada um usa uma chamada ao provedor de IA e pode consumir sua cota ou gerar cobrança. O
        trabalho acontece em partes, e você pode parar entre uma parte e outra.
      </p>
      <template #footer>
        <Button label="Agora não" severity="secondary" text @click="closeConfirm" />
        <Button label="Reanalisar agora" icon="pi pi-refresh" @click="start" />
      </template>
    </Dialog>

    <!-- Progresso: X de Y, com a opção de parar entre os lotes. -->
    <Dialog
      :visible="phase === 'running' || phase === 'cancelling'"
      modal
      header="Reanalisando os feedbacks"
      :closable="false"
      :draggable="false"
      :style="{ width: '32rem' }"
    >
      <p class="fl-reanalyze__text">
        <strong>{{ done }}</strong> de <strong>{{ total }}</strong> reanalisados.
      </p>
      <ProgressBar :value="progressPct" />
      <p v-if="phase === 'cancelling'" class="fl-reanalyze__muted">
        Vamos parar assim que a parte atual terminar.
      </p>
      <p v-else class="fl-reanalyze__muted">
        Isso pode levar alguns segundos por parte. Deixe esta janela aberta.
      </p>
      <template #footer>
        <Button
          label="Parar"
          icon="pi pi-times"
          severity="secondary"
          :disabled="phase === 'cancelling'"
          @click="requestCancel"
        />
      </template>
    </Dialog>

    <!-- Resultado: terminou, parou por erro, ou foi cancelado. -->
    <Dialog
      :visible="phase === 'result'"
      modal
      header="Reanálise"
      :closable="true"
      :draggable="false"
      :style="{ width: '32rem' }"
      @update:visible="(v) => !v && closeResult()"
    >
      <Message :severity="resultSeverity" :closable="false">{{ resultMessage }}</Message>
      <template #footer>
        <Button label="Fechar" @click="closeResult" />
      </template>
    </Dialog>
  </span>
</template>

<style scoped>
.fl-reanalyze {
  display: inline-flex;
}
.fl-reanalyze__text {
  margin: 0 0 0.75rem;
  line-height: 1.6;
}
.fl-reanalyze__muted {
  margin: 0.75rem 0 0;
  font-size: 0.85rem;
  color: var(--fl-text-muted);
}
</style>

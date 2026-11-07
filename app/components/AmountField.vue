<script setup lang="ts">
const props = defineProps<{
  id: string
  label: string
  hint?: string
  placeholder?: string
  enterkeyhint?: 'next' | 'done'
}>()

const model = defineModel<string>({ required: true })

const parsed = computed(() => parseAmount(model.value))
const error = computed(() => (parsed.value && !parsed.value.ok ? AMOUNT_ERROR_MESSAGES[parsed.value.error] : null))

// Une erreur n'apparaît qu'en quittant le champ, jamais pendant la frappe ;
// elle disparaît en revanche dès que la saisie redevient valide (ou est effacée).
const errorVisible = ref(false)

watch(error, (message) => {
  if (!message) errorVisible.value = false
})

function onBlur(event: FocusEvent) {
  // On lit le champ lui-même : si la saisie et la sortie du champ arrivent dans la même
  // tâche (remplissage automatique), `model` n'a pas encore reçu la nouvelle valeur du parent.
  const result = parseAmount((event.target as HTMLInputElement).value)
  errorVisible.value = Boolean(result && !result.ok)
  if (result?.ok) model.value = formatAmountInput(result.value)
}

const hintId = computed(() => (props.hint ? `${props.id}-aide` : undefined))
const errorId = computed(() => `${props.id}-erreur`)
const describedBy = computed(() => [hintId.value, errorVisible.value ? errorId.value : undefined].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-1.5 flex flex-col gap-1">
      <label :for="id" class="font-semibold text-ink">{{ label }}</label>
      <p v-if="hint" :id="hintId" class="text-sm leading-snug text-ink-3">
        {{ hint }}
      </p>
    </div>
    <!-- mt-auto : côte à côte, les champs restent alignés même si les aides diffèrent. -->
    <div class="relative mt-auto">
      <input
        :id="id"
        v-model="model"
        :name="id"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        spellcheck="false"
        :enterkeyhint="enterkeyhint ?? 'next'"
        :placeholder="placeholder"
        :aria-describedby="describedBy"
        :aria-invalid="errorVisible || undefined"
        class="min-h-12 w-full rounded-xl border bg-surface py-2.5 pr-10 pl-4 text-lg font-medium text-ink tabular-nums transition-colors outline-none placeholder:font-normal placeholder:text-ink-3/70 hover:border-ink-3 focus-visible:border-brand focus-visible:outline-3 focus-visible:outline-brand/25 focus-visible:outline-offset-0"
        :class="errorVisible ? 'border-bad bg-bad-soft' : 'border-field'"
        @blur="onBlur"
      >
      <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-lg text-ink-3">€</span>
    </div>
    <div :id="errorId" aria-live="polite">
      <p v-if="errorVisible" class="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-bad">
        <AppIcon name="alert" class="mt-0.5 shrink-0" />
        {{ error }}
      </p>
    </div>
  </div>
</template>

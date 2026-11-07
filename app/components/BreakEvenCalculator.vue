<script setup lang="ts">
import type { IconName } from './AppIcon.vue'

const {
  fields,
  amounts,
  result,
  parsed,
  missingFields,
  hasInvalidField,
  isEmpty,
  loadExample,
  reset,
  shareUrl,
} = useBreakEvenSimulation()

type Tone = 'good' | 'warn' | 'bad'

interface Metric {
  label: string
  value: string
  detail: string
}

const monthOptions = Array.from({ length: 12 }, (_, month) => {
  const name = monthName(month)
  return { value: month, label: name.charAt(0).toUpperCase() + name.slice(1) }
})

const toneClasses: Record<Tone, string> = {
  good: 'border-good/30 bg-good-soft text-good',
  warn: 'border-warn/30 bg-warn-soft text-warn',
  bad: 'border-bad/30 bg-bad-soft text-bad',
}

/** Tout ce qu'affiche le panneau de résultats, prêt à l'emploi. */
const summary = computed(() => {
  const value = result.value
  const input = amounts.value
  if (!value || !input) return null

  if (value.kind === 'no-margin') {
    return {
      headline: 'Impossible à atteindre',
      headlineIsText: true,
      headlineDetail: 'Aucun volume de ventes ne permet de couvrir vos charges.',
      status: {
        tone: 'bad' as Tone,
        icon: 'x-circle' as IconName,
        title: 'Vos charges variables absorbent tout votre chiffre d’affaires',
        text: `Avec ${formatEuros(input.variableCosts)} de charges variables pour ${formatEuros(input.turnover)} de ventes, chaque vente coûte plus qu’elle ne rapporte. Revoyez d’abord vos prix de vente ou vos coûts d’achat.`,
      },
      metrics: [
        { label: 'Marge sur coûts variables', value: formatEuros(value.contributionMargin), detail: `soit ${formatPercent(value.contributionMarginRate)} du chiffre d’affaires` },
        { label: 'Résultat estimé', value: formatSignedEuros(value.operatingResult), detail: 'perte sur l’exercice' },
      ] satisfies Metric[],
    }
  }

  const margin = value.safetyMargin
  const status = Math.abs(margin) < 0.5
    ? { tone: 'warn' as Tone, icon: 'info' as IconName, title: 'Pile à l’équilibre', text: 'Votre chiffre d’affaires couvre exactement vos charges : ni bénéfice, ni perte.' }
    : margin > 0
      ? { tone: 'good' as Tone, icon: 'check' as IconName, title: 'Activité rentable', text: `Votre chiffre d’affaires dépasse le seuil de ${formatEuros(margin)}.` }
      : { tone: 'warn' as Tone, icon: 'alert' as IconName, title: 'Pas encore rentable', text: `Il vous manque ${formatEuros(-margin)} de chiffre d’affaires pour atteindre le seuil.` }

  const date = breakEvenDate(value.breakEvenMonths, fields.startMonth, new Date().getFullYear())
  const metrics: Metric[] = [
    {
      label: 'Point mort',
      value: date ? formatDay(date) : 'Non atteint',
      detail: !date
        ? `il faudrait ${formatDecimal(value.breakEvenMonths)} mois d’activité`
        : value.breakEvenMonths === 0
          ? 'dès le premier jour de l’exercice'
          : `après ${formatDecimal(value.breakEvenMonths)} mois d’activité`,
    },
    {
      label: 'Marge sur coûts variables',
      value: formatEuros(value.contributionMargin),
      detail: `taux de marge : ${formatPercent(value.contributionMarginRate)}`,
    },
    {
      label: 'Marge de sécurité',
      value: formatEuros(margin),
      detail: `indice de sécurité : ${formatPercent(value.safetyIndex)}`,
    },
    {
      label: 'Résultat estimé',
      value: formatSignedEuros(value.operatingResult),
      detail: value.operatingResult > 0.5 ? 'bénéfice sur l’exercice' : value.operatingResult < -0.5 ? 'perte sur l’exercice' : 'ni bénéfice, ni perte',
    },
  ]

  if (value.breakEvenUnits !== null && input.averagePrice) {
    metrics.push({
      label: 'Ventes à réaliser',
      value: `${formatInteger(value.breakEvenUnits)} ${value.breakEvenUnits > 1 ? 'ventes' : 'vente'}`,
      detail: `à ${formatEurosExact(input.averagePrice)} en moyenne`,
    })
  }

  return {
    headline: formatEuros(value.breakEvenPoint),
    headlineIsText: false,
    headlineDetail: 'de chiffre d’affaires HT à réaliser sur l’exercice pour couvrir toutes vos charges.',
    status,
    metrics,
  }
})

/** Message d'aide affiché tant que le calcul n'est pas possible. */
const guidance = computed(() => {
  if (isEmpty.value) return 'Renseignez vos trois montants : le calcul se fait automatiquement, au fil de la saisie.'
  if (hasInvalidField.value) return 'Corrigez le montant signalé pour lancer le calcul.'
  const missing = missingFields.value
  if (missing.length > 0) {
    const list = missing.length === 1 ? missing[0] : `${missing.slice(0, -1).join(', ')} et ${missing.at(-1)}`
    return `Il manque encore ${list}.`
  }
  if (parsed.value.turnover?.ok && parsed.value.turnover.value === 0) return 'Le chiffre d’affaires doit être supérieur à zéro.'
  return ''
})

// --- Annonce des résultats aux lecteurs d'écran, une fois la saisie stabilisée ---
const announcement = ref('')
let announceTimer: ReturnType<typeof setTimeout> | undefined
watch(summary, (value) => {
  clearTimeout(announceTimer)
  announceTimer = setTimeout(() => {
    announcement.value = value ? `Seuil de rentabilité : ${value.headline}. ${value.status.title}. ${value.status.text}` : ''
  }, 900)
})

// --- Actions ------------------------------------------------------------------
const resultsHeading = useTemplateRef<HTMLElement>('resultsHeading')
const firstField = useTemplateRef<{ $el: HTMLElement }>('firstField')
const feedback = ref('')
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

function showFeedback(message: string) {
  feedback.value = message
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => (feedback.value = ''), 4000)
}

function onSubmit() {
  // « Entrée » ou « Voir mes résultats » sur mobile : on amène les résultats à l'écran.
  resultsHeading.value?.focus({ preventScroll: true })
  resultsHeading.value?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

function onPrint() {
  window.print()
}

async function onShare() {
  const url = shareUrl()
  const canShareNatively = typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches
  try {
    if (canShareNatively) {
      await navigator.share({ title: 'Ma simulation de seuil de rentabilité', url })
      return
    }
    await navigator.clipboard.writeText(url)
    showFeedback('Lien copié : il contient vos chiffres et rouvre cette simulation.')
  }
  catch (error) {
    if ((error as DOMException).name === 'AbortError') return
    showFeedback('Copie impossible : copiez directement l’adresse de la page.')
  }
}

function onReset() {
  reset()
  feedback.value = ''
  firstField.value?.$el.querySelector('input')?.focus()
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// En-tête du rapport imprimé : l'adresse du site accompagne chaque PDF partagé.
const siteHost = new URL(useRuntimeConfig().public.siteUrl).host
// Date calculée côté navigateur pour éviter tout décalage d'hydratation.
const printedOn = ref('')
onMounted(() => {
  printedOn.value = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date())
})

onBeforeUnmount(() => {
  clearTimeout(announceTimer)
  clearTimeout(feedbackTimer)
})
</script>

<template>
  <section id="simulateur" aria-labelledby="simulateur-titre">
    <!-- En-tête du rapport, visible uniquement à l'impression -->
    <div class="mb-6 hidden border-b border-line pb-4 print:block">
      <p class="font-display text-2xl font-semibold">Simulation du seuil de rentabilité</p>
      <p class="text-sm text-ink-2">
        Réalisée le {{ printedOn }} sur {{ siteHost }}. Résultats indicatifs, à confirmer avec votre expert-comptable.
      </p>
    </div>

    <h2 id="simulateur-titre" class="sr-only">Simulateur de seuil de rentabilité</h2>

    <div class="card overflow-hidden lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] print:block print:border-0 print:shadow-none">
      <form class="p-5 sm:p-8 print:hidden" novalidate @submit.prevent="onSubmit">
        <fieldset>
          <legend class="font-display text-2xl font-semibold text-ink">
            Vos chiffres annuels
          </legend>
          <p class="mt-1 text-sm text-ink-3">
            Montants hors taxes, sur un exercice de 12&nbsp;mois.
          </p>

          <div class="mt-6 grid gap-5">
            <AmountField
              id="chiffre-affaires"
              ref="firstField"
              v-model="fields.turnover"
              label="Chiffre d’affaires"
              hint="Le total de vos ventes sur l’année."
              placeholder="ex. 180 000"
            />
            <AmountField
              id="charges-fixes"
              v-model="fields.fixedCosts"
              label="Charges fixes"
              hint="Elles ne bougent pas avec les ventes : loyer, assurances, salaires, abonnements…"
              placeholder="ex. 81 000"
            />
            <AmountField
              id="charges-variables"
              v-model="fields.variableCosts"
              label="Charges variables"
              hint="Elles suivent les ventes : achats de marchandises, matières premières, commissions…"
              placeholder="ex. 72 000"
            />
          </div>
        </fieldset>

        <fieldset class="mt-8 border-t border-line pt-6">
          <legend class="float-left w-full font-semibold text-ink">
            Pour aller plus loin
          </legend>
          <div class="clear-left grid gap-5 pt-4 sm:grid-cols-2">
            <AmountField
              id="prix-moyen"
              v-model="fields.averagePrice"
              label="Prix de vente moyen"
              hint="Facultatif : pour savoir combien de ventes réaliser."
              placeholder="ex. 6"
              enterkeyhint="done"
            />
            <div class="flex flex-col">
              <div class="mb-1.5 flex flex-col gap-1">
                <label for="debut-exercice" class="font-semibold text-ink">Début de l’exercice</label>
                <p id="debut-exercice-aide" class="text-sm leading-snug text-ink-3">
                  Pour dater votre point mort.
                </p>
              </div>
              <div class="relative mt-auto">
                <select
                  id="debut-exercice"
                  v-model.number="fields.startMonth"
                  name="debut-exercice"
                  aria-describedby="debut-exercice-aide"
                  class="min-h-12 w-full appearance-none rounded-xl border border-field bg-surface py-2.5 pr-10 pl-4 text-lg text-ink hover:border-ink-3 focus-visible:border-brand focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-brand/25"
                >
                  <option v-for="month in monthOptions" :key="month.value" :value="month.value">
                    {{ month.label }}
                  </option>
                </select>
                <AppIcon name="chevron-down" class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-3" />
              </div>
            </div>
          </div>
        </fieldset>

        <button type="submit" class="btn btn-primary mt-8 w-full lg:hidden">
          Voir mes résultats
          <AppIcon name="arrow-down" />
        </button>
      </form>

      <div class="border-t border-line bg-sunken p-5 sm:p-8 lg:border-t-0 lg:border-l print:border-0 print:bg-transparent print:p-0">
        <h3 ref="resultsHeading" tabindex="-1" class="scroll-mt-4 font-display text-2xl font-semibold text-ink outline-none print:hidden">
          Vos résultats
        </h3>

        <!-- Données saisies, visibles uniquement à l'impression -->
        <div v-if="amounts" class="hidden print:mb-6 print:block">
          <h3 class="font-display text-lg font-semibold">Données saisies</h3>
          <dl class="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <dt>Chiffre d’affaires HT</dt>
            <dd class="text-right font-medium tabular-nums">{{ formatEurosExact(amounts.turnover) }}</dd>
            <dt>Charges fixes</dt>
            <dd class="text-right font-medium tabular-nums">{{ formatEurosExact(amounts.fixedCosts) }}</dd>
            <dt>Charges variables</dt>
            <dd class="text-right font-medium tabular-nums">{{ formatEurosExact(amounts.variableCosts) }}</dd>
            <template v-if="amounts.averagePrice">
              <dt>Prix de vente moyen</dt>
              <dd class="text-right font-medium tabular-nums">{{ formatEurosExact(amounts.averagePrice) }}</dd>
            </template>
            <dt>Début de l’exercice</dt>
            <dd class="text-right font-medium">{{ monthOptions[fields.startMonth]?.label }}</dd>
          </dl>
        </div>

        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
          enter-from-class="translate-y-1 opacity-0"
          leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
          leave-to-class="opacity-0"
        >
          <div v-if="summary" key="resultats" class="mt-6 flex flex-col gap-6 print:mt-0">
            <div>
              <p class="font-medium text-ink-2">
                Seuil de rentabilité
              </p>
              <p
                class="mt-1 leading-none font-bold tracking-tight text-ink"
                :class="summary.headlineIsText ? 'text-3xl sm:text-4xl' : 'text-[clamp(2.5rem,10vw,3.75rem)]'"
              >
                {{ summary.headline }}
              </p>
              <p class="mt-3 text-ink-2">
                {{ summary.headlineDetail }}
              </p>
            </div>

            <div class="flex gap-3 rounded-xl border p-4" :class="toneClasses[summary.status.tone]">
              <AppIcon :name="summary.status.icon" class="mt-0.5 shrink-0 text-xl" />
              <div>
                <p class="font-semibold">
                  {{ summary.status.title }}
                </p>
                <p class="mt-0.5 text-ink-2">
                  {{ summary.status.text }}
                </p>
              </div>
            </div>

            <dl class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="(metric, index) in summary.metrics"
                :key="metric.label"
                class="rounded-xl border border-line bg-surface p-4 print:break-inside-avoid"
                :class="{ 'sm:col-span-2': summary.metrics.length % 2 === 1 && index === summary.metrics.length - 1 }"
              >
                <dt class="text-sm font-medium text-ink-2">
                  {{ metric.label }}
                </dt>
                <dd class="mt-1 text-2xl font-semibold tracking-tight text-ink">
                  {{ metric.value }}
                </dd>
                <dd class="mt-0.5 text-sm text-ink-3">
                  {{ metric.detail }}
                </dd>
              </div>
            </dl>

            <div class="flex flex-wrap gap-2 print:hidden">
              <button type="button" class="btn btn-primary" @click="onPrint">
                <AppIcon name="printer" />
                Exporter en PDF
              </button>
              <button type="button" class="btn btn-secondary" @click="onShare">
                <AppIcon name="link" />
                Partager la simulation
              </button>
              <button type="button" class="btn btn-ghost" @click="onReset">
                <AppIcon name="reset" />
                Effacer
              </button>
            </div>
          </div>

          <div v-else key="vide" class="mt-6 flex flex-col items-start gap-5 print:hidden">
            <ChalkFormula label="Seuil de rentabilité égale charges fixes divisées par le taux de marge sur coûts variables" class="w-full">
              <span class="text-chalk-mint">Seuil</span>
              <span>=</span>
              <ChalkFraction numerator="Charges fixes" denominator="Taux de marge" />
            </ChalkFormula>
            <p class="text-lg text-ink-2">
              {{ guidance }}
            </p>
            <button v-if="isEmpty" type="button" class="btn btn-secondary" @click="loadExample">
              <AppIcon name="sparkle" />
              Essayer avec un exemple
            </button>
          </div>
        </Transition>

        <p class="mt-3 min-h-6 text-sm font-medium text-ink-2 print:hidden" role="status">
          {{ feedback }}
        </p>
      </div>
    </div>

    <p class="sr-only" aria-live="polite">
      {{ announcement }}
    </p>

    <div v-if="result?.kind === 'ok' && amounts" class="mt-10 grid gap-10">
      <BreakEvenChart
        :turnover="amounts.turnover"
        :fixed-costs="amounts.fixedCosts"
        :variable-cost-rate="result.variableCostRate"
        :break-even-point="result.breakEvenPoint"
      />
      <CalculationSteps
        :amounts="amounts"
        :result="result"
        :start-month="fields.startMonth"
      />
    </div>
  </section>
</template>

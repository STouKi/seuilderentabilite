<script setup lang="ts">
import type { BreakEvenSuccess } from '~/utils/breakEven'

const props = defineProps<{
  amounts: { turnover: number, fixedCosts: number, variableCosts: number }
  result: BreakEvenSuccess
  startMonth: number
}>()

const euros = formatEurosExact

/** Le taux affiché est arrondi : on le signale quand le calcul utilise plus de décimales. */
const rateIsRounded = computed(() => {
  const percent = props.result.contributionMarginRate * 100
  return Math.abs(percent - Math.round(percent * 100) / 100) > 1e-9
})

const pointMort = computed(() => {
  const date = breakEvenDate(props.result.breakEvenMonths, props.startMonth, new Date().getFullYear())
  const months = formatDecimal(props.result.breakEvenMonths)
  return date
    ? `${months} mois, soit le ${formatDay(date)}`
    : `${months} mois : seuil non atteint sur l’exercice`
})
</script>

<template>
  <section aria-labelledby="detail-titre">
    <div class="max-w-[70ch]">
      <h2 id="detail-titre" class="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Le détail du calcul
      </h2>
      <p class="mt-2 text-ink-2">
        Les formules de la comptabilité de gestion, appliquées à vos chiffres. Pratique pour vérifier un exercice ou présenter votre prévisionnel.
      </p>
    </div>

    <ol class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-2">
      <li class="card flex flex-col gap-4 p-5 print:break-inside-avoid">
        <h3 class="flex items-center gap-3 font-sans text-lg font-semibold tracking-normal text-ink">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand" aria-hidden="true">1</span>
          Marge sur coûts variables
        </h3>
        <ChalkFormula :label="`Marge sur coûts variables égale chiffre d’affaires moins charges variables : ${euros(amounts.turnover)} moins ${euros(amounts.variableCosts)} égale ${euros(result.contributionMargin)}`">
          <span class="text-chalk-mint">MCV</span>
          <span>=</span>
          <span>CA - Charges variables</span>
          <template #application>
            {{ euros(amounts.turnover) }} - {{ euros(amounts.variableCosts) }} = {{ euros(result.contributionMargin) }}
          </template>
        </ChalkFormula>
        <p class="text-sm text-ink-2">
          Ce qu’il reste de vos ventes une fois payées les charges qui les accompagnent. C’est avec cette marge que vous couvrez vos charges fixes.
        </p>
      </li>

      <li class="card flex flex-col gap-4 p-5 print:break-inside-avoid">
        <h3 class="flex items-center gap-3 font-sans text-lg font-semibold tracking-normal text-ink">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand" aria-hidden="true">2</span>
          Taux de marge sur coûts variables
        </h3>
        <ChalkFormula :label="`Taux de marge égale marge sur coûts variables divisée par chiffre d’affaires : ${euros(result.contributionMargin)} divisé par ${euros(amounts.turnover)} égale ${formatPercent(result.contributionMarginRate)}`">
          <span class="text-chalk-mint">Taux</span>
          <span>=</span>
          <ChalkFraction numerator="MCV" denominator="CA" />
          <template #application>
            {{ euros(result.contributionMargin) }} ÷ {{ euros(amounts.turnover) }} = {{ formatPercent(result.contributionMarginRate) }}
          </template>
        </ChalkFormula>
        <p class="text-sm text-ink-2">
          Sur 100&nbsp;€ de ventes, {{ formatDecimal(result.contributionMarginRate * 100) }}&nbsp;€ servent à couvrir vos charges fixes, puis à dégager du bénéfice.
        </p>
      </li>

      <li class="card flex flex-col gap-4 p-5 print:break-inside-avoid">
        <h3 class="flex items-center gap-3 font-sans text-lg font-semibold tracking-normal text-ink">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand" aria-hidden="true">3</span>
          Seuil de rentabilité
        </h3>
        <ChalkFormula :label="`Seuil de rentabilité égale charges fixes divisées par le taux de marge : ${euros(amounts.fixedCosts)} divisé par ${formatPercent(result.contributionMarginRate)} égale ${euros(result.breakEvenPoint)}`">
          <span class="text-chalk-mint">Seuil</span>
          <span>=</span>
          <ChalkFraction numerator="Charges fixes" denominator="Taux" />
          <template #application>
            {{ euros(amounts.fixedCosts) }} ÷ {{ formatPercent(result.contributionMarginRate) }} = {{ euros(result.breakEvenPoint) }}
          </template>
        </ChalkFormula>
        <p class="text-sm text-ink-2">
          Le chiffre d’affaires à partir duquel toutes vos charges sont couvertes.
          <template v-if="rateIsRounded">
            Le calcul utilise le taux exact, non arrondi.
          </template>
        </p>
      </li>

      <li class="card flex flex-col gap-4 p-5 print:break-inside-avoid">
        <h3 class="flex items-center gap-3 font-sans text-lg font-semibold tracking-normal text-ink">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand" aria-hidden="true">4</span>
          Point mort
        </h3>
        <ChalkFormula :label="`Point mort égale seuil divisé par chiffre d’affaires, multiplié par 12 mois : ${pointMort}`">
          <span class="text-chalk-mint">Point mort</span>
          <span>=</span>
          <ChalkFraction numerator="Seuil" denominator="CA" />
          <span>× 12 mois</span>
          <template #application>
            {{ pointMort }}
          </template>
        </ChalkFormula>
        <p class="text-sm text-ink-2">
          La date à laquelle le seuil est atteint, si vos ventes sont régulières sur l’année.
        </p>
      </li>

      <li class="card flex flex-col gap-4 p-5 md:col-span-2 xl:col-span-2 print:col-span-2 print:break-inside-avoid">
        <h3 class="flex items-center gap-3 font-sans text-lg font-semibold tracking-normal text-ink">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand" aria-hidden="true">5</span>
          Marge et indice de sécurité
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <ChalkFormula :label="`Marge de sécurité égale chiffre d’affaires moins seuil : ${euros(amounts.turnover)} moins ${euros(result.breakEvenPoint)} égale ${euros(result.safetyMargin)}`">
            <span class="text-chalk-mint">Marge</span>
            <span>=</span>
            <span>CA - Seuil</span>
            <template #application>
              {{ euros(amounts.turnover) }} - {{ euros(result.breakEvenPoint) }} = {{ euros(result.safetyMargin) }}
            </template>
          </ChalkFormula>
          <ChalkFormula :label="`Indice de sécurité égale marge de sécurité divisée par chiffre d’affaires : ${formatPercent(result.safetyIndex)}`">
            <span class="text-chalk-mint">Indice</span>
            <span>=</span>
            <ChalkFraction numerator="Marge" denominator="CA" />
            <template #application>
              {{ euros(result.safetyMargin) }} ÷ {{ euros(amounts.turnover) }} = {{ formatPercent(result.safetyIndex) }}
            </template>
          </ChalkFormula>
        </div>
        <p class="text-sm text-ink-2">
          <template v-if="result.safetyMargin >= 0">
            Vos ventes peuvent baisser de {{ formatPercent(result.safetyIndex) }} avant que l’activité ne passe en perte.
          </template>
          <template v-else>
            Une marge négative indique le chiffre d’affaires qu’il vous reste à gagner pour couvrir vos charges.
          </template>
        </p>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
/**
 * Représentation graphique classique du seuil de rentabilité : la droite du chiffre
 * d'affaires (y = x) croise celle des coûts totaux (charges fixes + charges variables)
 * au seuil. Avant ce point, l'entreprise perd de l'argent ; après, elle en gagne.
 */
const props = defineProps<{
  turnover: number
  fixedCosts: number
  /** Charges variables / chiffre d'affaires. */
  variableCostRate: number
  breakEvenPoint: number
}>()

// --- Dimensions : le SVG est dessiné à la taille réelle de son conteneur, pour que
// les textes gardent leur taille quel que soit l'écran.
const frame = useTemplateRef<HTMLElement>('frame')
const width = ref(720)
const compact = computed(() => width.value < 520)
const height = computed(() => (compact.value ? 300 : 380))
const plot = computed(() => {
  const margin = { top: 28, right: compact.value ? 48 : 60, bottom: 44, left: compact.value ? 54 : 66 }
  return {
    left: margin.left,
    top: margin.top,
    right: width.value - margin.right,
    bottom: height.value - margin.bottom,
    width: width.value - margin.left - margin.right,
    height: height.value - margin.top - margin.bottom,
  }
})

let observer: ResizeObserver | undefined
onMounted(() => {
  if (!frame.value) return
  width.value = Math.max(280, Math.round(frame.value.clientWidth))
  observer = new ResizeObserver(([entry]) => {
    if (entry) width.value = Math.max(280, Math.round(entry.contentRect.width))
  })
  observer.observe(frame.value)
})
onBeforeUnmount(() => observer?.disconnect())

// --- Échelle commune aux deux axes (des euros dans les deux cas) ---
function niceScale(max: number, targetTicks: number) {
  const rough = max / targetTicks
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map(factor => factor * magnitude).find(candidate => candidate >= rough) ?? 10 * magnitude
  return { max: Math.ceil(max / step - 1e-9) * step, step }
}

const scale = computed(() => niceScale(Math.max(props.turnover, props.breakEvenPoint) * 1.2, compact.value ? 4 : 5))
const xMax = computed(() => scale.value.max)
const ticks = computed(() => {
  const values: number[] = []
  for (let value = 0; value <= xMax.value + scale.value.step / 2; value += scale.value.step) values.push(value)
  return values
})

const sx = (value: number) => plot.value.left + (value / xMax.value) * plot.value.width
const sy = (value: number) => plot.value.bottom - (value / xMax.value) * plot.value.height
const costsAt = (revenue: number) => props.fixedCosts + props.variableCostRate * revenue

const signedCompact = (value: number) => `${value < 0 ? '-' : ''}${formatCompactEuros(Math.abs(value))}`

// --- Géométrie et annotations ---
const shapes = computed(() => {
  const max = xMax.value
  const threshold = props.breakEvenPoint
  const end = { revenue: sy(max), costs: sy(costsAt(max)) }

  return {
    revenue: `M${sx(0)},${sy(0)}L${sx(max)},${end.revenue}`,
    costs: `M${sx(0)},${sy(props.fixedCosts)}L${sx(max)},${end.costs}`,
    loss: threshold > 0 ? `M${sx(0)},${sy(0)}L${sx(0)},${sy(props.fixedCosts)}L${sx(threshold)},${sy(threshold)}Z` : null,
    profit: `M${sx(threshold)},${sy(threshold)}L${sx(max)},${end.revenue}L${sx(max)},${end.costs}Z`,
    // Étiquettes directes en bout de droite, sauf si elles se chevaucheraient : la légende suffit alors.
    endLabels: end.costs - end.revenue >= 18 ? end : null,
  }
})

const thresholdLabel = computed(() => {
  const x = sx(props.breakEvenPoint)
  const y = sy(props.breakEvenPoint)
  const text = `Seuil : ${formatCompactEuros(props.breakEvenPoint)}`
  // Par défaut en haut à gauche du point (zone vide au-dessus des deux droites),
  // sinon en bas à droite (zone vide sous les deux droites).
  return x - plot.value.left > 130
    ? { x: x - 10, y: Math.max(plot.value.top + 14, y - 12), anchor: 'end', text }
    : { x: x + 12, y: Math.min(plot.value.bottom - 8, y + 22), anchor: 'start', text }
})

const turnoverMarker = computed(() => {
  const x = sx(props.turnover)
  const revenueY = sy(props.turnover)
  const costsY = sy(costsAt(props.turnover))
  const result = props.turnover - costsAt(props.turnover)
  const profitable = result >= 0
  const text = `${profitable ? 'Bénéfice' : 'Perte'} : ${formatCompactEuros(Math.abs(result))}`
  const textWidth = text.length * 6.6 + 4
  const roomRight = plot.value.right - x > textWidth + 14
  const roomLeft = x - plot.value.left > textWidth + 14

  // L'écart entre les deux droites s'ouvre vers la droite en cas de bénéfice, vers la
  // gauche en cas de perte. On y écrit le résultat si le texte tient sans toucher la
  // droite des coûts (sa pente en pixels réduit la place disponible sur la largeur du texte).
  const gap = Math.abs(revenueY - costsY)
  const costsSlope = (props.variableCostRate * plot.value.height) / plot.value.width
  const fitsBetween = gap / 2 >= 14 + costsSlope * textWidth && (profitable ? roomRight : roomLeft)

  let resultLabel: { x: number, y: number, anchor: 'start' | 'end', text: string } | null = null
  if (fitsBetween) {
    resultLabel = profitable
      ? { x: x + 9, y: (revenueY + costsY) / 2 + 4, anchor: 'start', text }
      : { x: x - 9, y: (revenueY + costsY) / 2 + 4, anchor: 'end', text }
  }
  else if (roomRight) {
    // Sinon, sous la droite la plus basse, côté droit : la zone y est toujours vide.
    resultLabel = { x: x + 9, y: Math.max(revenueY, costsY) + 18, anchor: 'start', text }
  }

  return {
    x,
    revenueY,
    costsY,
    label: { x: Math.min(Math.max(x, plot.value.left + 32), plot.value.right - 32), y: plot.value.top - 12 },
    result: resultLabel && resultLabel.y < plot.value.bottom - 6 ? resultLabel : null,
  }
})

const zoneLabels = computed(() => {
  const threshold = props.breakEvenPoint
  const max = xMax.value
  const labels: Array<{ x: number, y: number, text: string }> = []
  const clearOfMarker = (x: number) => Math.abs(x - sx(props.turnover)) > 70

  const lossWidth = sx(threshold) - sx(0)
  const lossHeight = sy(0) - sy(props.fixedCosts)
  if (threshold > 0 && lossWidth > 150 && lossHeight > 80 && clearOfMarker(sx(threshold / 3))) {
    labels.push({ x: sx(threshold / 3), y: sy((props.fixedCosts + threshold) / 3) + 4, text: 'Zone de perte' })
  }

  const profitWidth = sx(max) - sx(threshold)
  const profitHeight = sy(costsAt(max)) - sy(max)
  if (profitWidth > 170 && profitHeight > 80 && clearOfMarker(sx((threshold + 2 * max) / 3))) {
    labels.push({ x: sx((threshold + 2 * max) / 3), y: sy((threshold + max + costsAt(max)) / 3) + 4, text: 'Zone de bénéfice' })
  }
  return labels
})

// --- Survol et clavier : un réticule vertical suit le chiffre d'affaires pointé ---
const hoverRevenue = ref<number | null>(null)
const keyboardActive = ref(false)

const clampRevenue = (value: number) => Math.min(xMax.value, Math.max(0, value))

function onPointerMove(event: PointerEvent) {
  const svg = event.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  const px = ((event.clientX - rect.left) * width.value) / rect.width
  let revenue = clampRevenue(((px - plot.value.left) / plot.value.width) * xMax.value)
  // Aimantation sur les deux points remarquables.
  for (const anchor of [props.breakEvenPoint, props.turnover]) {
    if (Math.abs(sx(anchor) - px) <= 10) revenue = anchor
  }
  keyboardActive.value = false
  hoverRevenue.value = revenue
}

function onPointerLeave() {
  if (!keyboardActive.value) hoverRevenue.value = null
}

function onFocus() {
  keyboardActive.value = true
  hoverRevenue.value = props.turnover
}

function onBlur() {
  keyboardActive.value = false
  hoverRevenue.value = null
}

function onKeydown(event: KeyboardEvent) {
  const step = xMax.value / 50
  const current = hoverRevenue.value ?? props.turnover
  const moves: Record<string, number> = {
    ArrowRight: current + step,
    ArrowUp: current + step,
    ArrowLeft: current - step,
    ArrowDown: current - step,
    Home: 0,
    End: xMax.value,
  }
  if (event.key === 'Escape') {
    hoverRevenue.value = null
    return
  }
  const next = moves[event.key]
  if (next === undefined) return
  event.preventDefault()
  keyboardActive.value = true
  hoverRevenue.value = clampRevenue(next)
}

const tooltip = computed(() => {
  const revenue = hoverRevenue.value
  if (revenue === null) return null
  const costs = costsAt(revenue)
  const x = sx(revenue)
  return {
    x,
    alignRight: x > width.value - 230,
    revenue: formatEuros(revenue),
    costs: formatEuros(costs),
    result: formatSignedEuros(revenue - costs),
    resultLabel: Math.abs(revenue - costs) < 0.5 ? 'Équilibre' : revenue > costs ? 'Bénéfice' : 'Perte',
    points: { revenue: sy(revenue), costs: sy(costs) },
  }
})

const keyboardAnnouncement = computed(() => {
  const revenue = hoverRevenue.value
  if (!keyboardActive.value || revenue === null) return ''
  const result = revenue - costsAt(revenue)
  return `Pour ${formatEuros(revenue)} de chiffre d’affaires : coûts totaux ${formatEuros(costsAt(revenue))}, ${result >= 0 ? 'bénéfice' : 'perte'} de ${formatEuros(Math.abs(result))}.`
})

// --- Texte de lecture et tableau équivalent ---
const position = computed(() => {
  const gap = props.turnover - props.breakEvenPoint
  if (Math.abs(gap) < 0.5) return 'Votre chiffre d’affaires se situe exactement sur le seuil.'
  return gap > 0
    ? `Avec ${formatEuros(props.turnover)} de chiffre d’affaires, vous êtes dans la zone de bénéfice.`
    : `Avec ${formatEuros(props.turnover)} de chiffre d’affaires, vous êtes encore dans la zone de perte.`
})

const tableRows = computed(() => {
  const rows = [
    { label: 'Aucune vente', revenue: 0 },
    { label: 'Seuil de rentabilité', revenue: props.breakEvenPoint },
    { label: 'Votre chiffre d’affaires', revenue: props.turnover },
    { label: 'Limite droite du graphique', revenue: xMax.value },
  ]
  return rows
    .sort((a, b) => a.revenue - b.revenue)
    .map(row => ({
      label: row.label,
      revenue: formatEuros(row.revenue),
      costs: formatEuros(costsAt(row.revenue)),
      result: formatSignedEuros(row.revenue - costsAt(row.revenue)),
    }))
})
</script>

<template>
  <section class="card p-5 sm:p-8 print:break-inside-avoid" aria-labelledby="graphique-titre">
    <div class="flex flex-col gap-1">
      <h2 id="graphique-titre" class="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Votre seuil en un coup d’œil
      </h2>
      <p id="graphique-lecture" class="max-w-[70ch] text-ink-2">
        Votre chiffre d’affaires croise vos coûts totaux à {{ formatEuros(breakEvenPoint) }} : c’est le seuil de rentabilité.
        {{ position }}
      </p>
    </div>

    <ul class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2" aria-label="Légende">
      <li class="flex items-center gap-2">
        <span class="h-0.5 w-5 rounded-full bg-series-revenue" aria-hidden="true" />
        Chiffre d’affaires
      </li>
      <li class="flex items-center gap-2">
        <span class="h-0.5 w-5 rounded-full bg-series-costs" aria-hidden="true" />
        Coûts totaux (fixes + variables)
      </li>
      <li class="flex items-center gap-2">
        <span class="size-3 rounded-[3px] bg-zone-loss/15 ring-1 ring-zone-loss/40" aria-hidden="true" />
        Zone de perte
      </li>
      <li class="flex items-center gap-2">
        <span class="size-3 rounded-[3px] bg-zone-profit/15 ring-1 ring-zone-profit/40" aria-hidden="true" />
        Zone de bénéfice
      </li>
    </ul>

    <div
      ref="frame"
      class="relative mt-4 rounded-lg outline-offset-4"
      tabindex="0"
      role="group"
      aria-label="Graphique interactif du seuil de rentabilité"
      aria-describedby="graphique-lecture graphique-aide"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    >
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        class="block h-auto w-full touch-pan-y select-none"
        aria-hidden="true"
        @pointermove="onPointerMove"
        @pointerdown="onPointerMove"
        @pointerleave="onPointerLeave"
      >
        <!-- Quadrillage et graduations -->
        <g>
          <line
            v-for="tick in ticks"
            :key="`grid-${tick}`"
            :x1="plot.left"
            :x2="plot.right"
            :y1="sy(tick)"
            :y2="sy(tick)"
            class="grid-line"
          />
          <text
            v-for="tick in ticks"
            :key="`y-${tick}`"
            :x="plot.left - 10"
            :y="sy(tick) + 4"
            text-anchor="end"
            class="tick"
          >{{ formatCompactEuros(tick) }}</text>
          <text
            v-for="(tick, index) in ticks"
            :key="`x-${tick}`"
            :x="sx(tick)"
            :y="plot.bottom + 20"
            :text-anchor="index === 0 ? 'start' : index === ticks.length - 1 ? 'end' : 'middle'"
            class="tick"
          >{{ formatCompactEuros(tick) }}</text>
          <line :x1="plot.left" :x2="plot.right" :y1="plot.bottom" :y2="plot.bottom" class="axis" />
          <text :x="plot.right" :y="plot.bottom + 38" text-anchor="end" class="axis-title">Chiffre d’affaires HT</text>
        </g>

        <!-- Zones de perte et de bénéfice -->
        <path v-if="shapes.loss" :d="shapes.loss" class="zone zone-loss" />
        <path :d="shapes.profit" class="zone zone-profit" />
        <text v-for="zone in zoneLabels" :key="zone.text" :x="zone.x" :y="zone.y" text-anchor="middle" class="zone-label">{{ zone.text }}</text>

        <!-- Repère du chiffre d'affaires actuel -->
        <line :x1="turnoverMarker.x" :x2="turnoverMarker.x" :y1="plot.top" :y2="plot.bottom" class="reference" />
        <text :x="turnoverMarker.label.x" :y="turnoverMarker.label.y" text-anchor="middle" class="annotation">Votre CA</text>

        <!-- Les deux droites -->
        <path :d="shapes.costs" class="series series-costs" />
        <path :d="shapes.revenue" class="series series-revenue" />
        <template v-if="shapes.endLabels">
          <text :x="plot.right + 8" :y="shapes.endLabels.revenue + 4" class="end-label">CA</text>
          <text :x="plot.right + 8" :y="shapes.endLabels.costs + 4" class="end-label">Coûts</text>
        </template>

        <!-- Résultat au chiffre d'affaires actuel -->
        <circle :cx="turnoverMarker.x" :cy="turnoverMarker.costsY" r="4" class="dot dot-costs" />
        <circle :cx="turnoverMarker.x" :cy="turnoverMarker.revenueY" r="4" class="dot dot-revenue" />
        <text
          v-if="turnoverMarker.result"
          :x="turnoverMarker.result.x"
          :y="turnoverMarker.result.y"
          :text-anchor="turnoverMarker.result.anchor"
          class="annotation"
        >{{ turnoverMarker.result.text }}</text>

        <!-- Réticule -->
        <g v-if="tooltip">
          <line :x1="tooltip.x" :x2="tooltip.x" :y1="plot.top" :y2="plot.bottom" class="crosshair" />
          <circle :cx="tooltip.x" :cy="tooltip.points.costs" r="4.5" class="dot dot-costs" />
          <circle :cx="tooltip.x" :cy="tooltip.points.revenue" r="4.5" class="dot dot-revenue" />
        </g>

        <!-- Seuil de rentabilité, toujours au premier plan -->
        <circle :cx="sx(breakEvenPoint)" :cy="sy(breakEvenPoint)" r="6" class="threshold" />
        <text
          :x="thresholdLabel.x"
          :y="thresholdLabel.y"
          :text-anchor="thresholdLabel.anchor"
          class="annotation annotation-strong"
        >{{ thresholdLabel.text }}</text>

        <!-- Zone de capture du pointeur, plus large que les tracés -->
        <rect :x="plot.left" :y="plot.top" :width="plot.width" :height="plot.height" fill="transparent" />
      </svg>

      <div
        v-if="tooltip"
        class="pointer-events-none absolute top-6 z-10 w-52 rounded-xl border border-line bg-surface/95 p-3 text-sm shadow-lg backdrop-blur-sm print:hidden"
        :style="tooltip.alignRight ? { left: `${tooltip.x - 12}px`, transform: 'translateX(-100%)' } : { left: `${tooltip.x + 12}px` }"
        aria-hidden="true"
      >
        <p class="text-ink-3">
          Pour un CA de
        </p>
        <p class="text-base font-semibold text-ink tabular-nums">
          {{ tooltip.revenue }}
        </p>
        <div class="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1">
          <span class="h-0.5 w-3 rounded-full bg-series-costs" />
          <span class="text-ink-3">Coûts totaux</span>
          <span class="font-semibold text-ink tabular-nums">{{ tooltip.costs }}</span>
          <span class="col-span-3 border-t border-line" />
          <span />
          <span class="text-ink-3">{{ tooltip.resultLabel }}</span>
          <span class="font-semibold text-ink tabular-nums">{{ tooltip.result }}</span>
        </div>
      </div>
    </div>

    <p id="graphique-aide" class="mt-3 text-sm text-ink-3 print:hidden">
      Survolez le graphique, ou utilisez les flèches du clavier après l’avoir sélectionné, pour lire les montants à chaque niveau de chiffre d’affaires.
    </p>
    <p class="sr-only" aria-live="polite">
      {{ keyboardAnnouncement }}
    </p>

    <details class="group mt-4 print:hidden">
      <summary class="inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-brand">
        <AppIcon name="chevron-down" class="transition-transform group-open:rotate-180" />
        Afficher les données du graphique
      </summary>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-md text-left text-sm">
          <caption class="sr-only">
            Coûts totaux et résultat selon le chiffre d’affaires
          </caption>
          <thead class="border-b border-line text-ink-3">
            <tr>
              <th scope="col" class="py-2 pr-4 font-medium">
                Point
              </th>
              <th scope="col" class="py-2 pr-4 text-right font-medium">
                Chiffre d’affaires
              </th>
              <th scope="col" class="py-2 pr-4 text-right font-medium">
                Coûts totaux
              </th>
              <th scope="col" class="py-2 text-right font-medium">
                Résultat
              </th>
            </tr>
          </thead>
          <tbody class="tabular-nums">
            <tr v-for="row in tableRows" :key="row.label" class="border-b border-line/60 last:border-0">
              <th scope="row" class="py-2 pr-4 font-medium text-ink">
                {{ row.label }}
              </th>
              <td class="py-2 pr-4 text-right text-ink-2">
                {{ row.revenue }}
              </td>
              <td class="py-2 pr-4 text-right text-ink-2">
                {{ row.costs }}
              </td>
              <td class="py-2 text-right font-medium text-ink">
                {{ row.result }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </section>
</template>

<style scoped>
svg {
  font-family: var(--font-sans);
  overflow: visible;
}

.grid-line {
  stroke: var(--color-chart-grid);
  stroke-width: 1;
  shape-rendering: crispEdges;
}

.axis {
  stroke: var(--color-chart-axis);
  stroke-width: 1;
  shape-rendering: crispEdges;
}

.tick {
  fill: var(--color-ink-3);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.axis-title {
  fill: var(--color-ink-3);
  font-size: 12px;
  font-weight: 500;
}

.zone {
  fill-opacity: 0.1;
}

.zone-loss {
  fill: var(--color-zone-loss);
}

.zone-profit {
  fill: var(--color-zone-profit);
}

.zone-label {
  fill: var(--color-ink-2);
  font-size: 12px;
  font-weight: 500;
}

.reference {
  stroke: var(--color-ink-3);
  stroke-width: 1;
  stroke-opacity: 0.45;
  shape-rendering: crispEdges;
}

.series {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
}

.series-revenue {
  stroke: var(--color-series-revenue);
}

.series-costs {
  stroke: var(--color-series-costs);
}

.end-label {
  fill: var(--color-ink-2);
  font-size: 12px;
  font-weight: 600;
}

/* Anneau de la couleur du fond autour des points, pour les détacher des droites. */
.dot {
  stroke: var(--color-surface);
  stroke-width: 2;
}

.dot-revenue {
  fill: var(--color-series-revenue);
}

.dot-costs {
  fill: var(--color-series-costs);
}

.threshold {
  fill: var(--color-ink);
  stroke: var(--color-surface);
  stroke-width: 2.5;
}

/* Halo de la couleur du fond pour que les annotations restent lisibles sur les tracés. */
.annotation {
  fill: var(--color-ink-2);
  font-size: 12px;
  font-weight: 500;
  paint-order: stroke;
  stroke: var(--color-surface);
  stroke-width: 4px;
  stroke-linejoin: round;
}

.annotation-strong {
  fill: var(--color-ink);
  font-size: 13px;
  font-weight: 700;
}

.crosshair {
  stroke: var(--color-ink-3);
  stroke-width: 1;
  shape-rendering: crispEdges;
}

@media (forced-colors: active) {
  .series-revenue,
  .series-costs,
  .crosshair {
    stroke: CanvasText;
  }

  .series-costs {
    stroke-dasharray: 6 4;
  }
}
</style>

<script setup lang="ts">
/**
 * Le logo reprend le graphique du seuil : la droite du chiffre d'affaires croise
 * celle des coûts, et le point d'intersection marque le seuil de rentabilité.
 */
</script>

<template>
  <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false" class="logo">
    <rect x="1" y="1" width="30" height="30" rx="8" class="logo-tile" />
    <path d="M7 25L25 7" class="logo-line logo-revenue" pathLength="1" />
    <path d="M7 16.5L25 10.5" class="logo-line logo-costs" pathLength="1" />
    <circle cx="18.6" cy="13.4" r="2.6" class="logo-point" />
  </svg>
</template>

<style scoped>
.logo-tile {
  fill: var(--color-brand-soft);
  stroke: color-mix(in oklab, var(--color-brand) 30%, transparent);
  stroke-width: 1;
}

.logo-line {
  fill: none;
  stroke-width: 2.6;
  stroke-linecap: round;
}

.logo-revenue {
  stroke: var(--color-series-revenue);
}

.logo-costs {
  stroke: var(--color-series-costs);
}

.logo-point {
  fill: var(--color-ink);
  stroke: var(--color-brand-soft);
  stroke-width: 1.5;
}

@media (prefers-reduced-motion: no-preference) {
  .logo-line {
    stroke-dasharray: 1;
    animation: draw 900ms cubic-bezier(0.65, 0, 0.35, 1) both;
  }

  .logo-costs {
    animation-delay: 150ms;
  }

  .logo-point {
    transform-origin: 18.6px 13.4px;
    animation: pop 400ms 750ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
}

@keyframes draw {
  from {
    stroke-dashoffset: 1;
  }

  to {
    stroke-dashoffset: 0;
  }
}

@keyframes pop {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}
</style>

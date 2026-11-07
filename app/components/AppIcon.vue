<script setup lang="ts">
/** Petites icônes au trait, dessinées sur une grille de 24 px. Toujours décoratives. */
const paths = {
  'check': ['M5 12.5l4.5 4.5L19 7.5'],
  'x-circle': ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M9 9l6 6M15 9l-6 6'],
  'alert': ['M12 4L2.8 19.5h18.4L12 4z', 'M12 10v4', 'M12 16.8v.2'],
  'info': ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v5', 'M12 7.8v.2'],
  'printer': ['M7 9V3h10v6', 'M7 17H4.5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 4.5 9h15a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H17', 'M7 14h10v7H7z'],
  'link': ['M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1', 'M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1'],
  'reset': ['M3.5 12a8.5 8.5 0 1 0 2.6-6.1', 'M3.5 3.5v5h5'],
  'sparkle': ['M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z', 'M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z'],
  'lock': ['M6 11h12v10H6z', 'M8.5 11V8a3.5 3.5 0 0 1 7 0v3'],
  'gift': ['M4 11h16v10H4z', 'M3 7h18v4H3z', 'M12 7v14', 'M12 7S10.5 3 8 3a2 2 0 0 0 0 4', 'M12 7s1.5-4 4-4a2 2 0 0 1 0 4'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'arrow-down': ['M12 5v14', 'M6 13l6 6 6-6'],
  'external': ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
} as const

export type IconName = keyof typeof paths

defineProps<{ name: IconName }>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, index) in paths[name]" :key="index" :d="d" />
  </svg>
</template>

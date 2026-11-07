<script setup lang="ts">
/**
 * Formule écrite à la craie sur un tableau noir. Le rendu visuel (fractions, couleurs)
 * est masqué aux lecteurs d'écran, qui lisent `label`, une version linéaire en toutes lettres.
 */
withDefaults(defineProps<{
  /** Lecture de la formule en toutes lettres, pour les lecteurs d'écran. */
  label: string
  size?: 'md' | 'lg'
}>(), { size: 'md' })
</script>

<template>
  <div class="chalkboard" :class="size === 'lg' ? 'px-5 py-6 sm:px-8 sm:py-8' : 'px-4 py-4 sm:px-5'">
    <p class="sr-only">{{ label }}</p>
    <div
      aria-hidden="true"
      class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center leading-tight"
      :class="size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-[1.375rem]'"
    >
      <slot />
    </div>
    <div v-if="$slots.application" aria-hidden="true" class="mt-3 border-t border-dashed border-chalk/20 pt-3 text-center text-lg leading-snug text-chalk-yellow sm:text-xl">
      <slot name="application" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  eyebrow: string
  title: string
}>()
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-titre`" class="border-t border-line py-14 sm:py-20 lg:grid lg:grid-cols-12 lg:gap-12">
    <div class="lg:sticky lg:top-8 lg:col-span-4 lg:self-start">
      <p class="text-sm font-semibold text-brand">
        {{ eyebrow }}
      </p>
      <h2 :id="`${id}-titre`" class="mt-2 text-3xl text-ink sm:text-4xl">
        {{ title }}
      </h2>
    </div>
    <div class="mt-6 lg:col-span-8 lg:mt-0">
      <slot />
    </div>
  </section>
</template>

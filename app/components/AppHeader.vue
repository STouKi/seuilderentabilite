<script setup lang="ts">
const links = [
  { hash: '#simulateur', label: 'Simulateur' },
  { hash: '#methode', label: 'Méthode' },
  { hash: '#exemple', label: 'Exemple' },
  { hash: '#faq', label: 'FAQ' },
]
</script>

<template>
  <header class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 print:hidden">
    <NuxtLink to="/" class="flex items-center gap-2.5 rounded-lg font-display text-lg font-semibold text-ink sm:text-xl">
      <AppLogo class="size-8 shrink-0" />
      Seuil de rentabilité
    </NuxtLink>
    <nav aria-label="Navigation principale" class="hidden sm:block">
      <ul class="flex items-center gap-1 text-[0.9375rem] font-medium text-ink-2">
        <li v-for="link in links" :key="link.hash">
          <NuxtLink :to="{ path: '/', hash: link.hash }" class="rounded-lg px-3 py-2 transition-colors hover:bg-surface hover:text-ink">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

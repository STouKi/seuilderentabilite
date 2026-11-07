<script setup lang="ts">
// Année du build : le site est entièrement statique.
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 border-t border-line bg-surface print:hidden">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto]">
      <div class="max-w-xl">
        <p class="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
          <AppLogo class="size-7" />
          Seuil de rentabilité
        </p>
        <p class="mt-3 text-sm text-ink-3">
          Les résultats sont donnés à titre indicatif, à partir des montants saisis et en supposant des ventes régulières sur l’exercice. Ils ne remplacent pas l’avis d’un expert-comptable.
        </p>
      </div>
      <ul class="flex flex-col gap-2 text-sm font-medium text-ink-2">
        <li>
          <NuxtLink to="/mentions-legales" class="rounded hover:text-brand hover:underline">
            Mentions légales et confidentialité
          </NuxtLink>
        </li>
        <li>
          <a href="https://github.com/STouKi/seuilderentabilite" class="inline-flex items-center gap-1.5 rounded hover:text-brand hover:underline">
            Code source sur GitHub
            <AppIcon name="external" class="text-xs" />
          </a>
        </li>
        <li>
          <a href="https://quentin-sastourne.com" class="inline-flex items-center gap-1.5 rounded hover:text-brand hover:underline">
            Réalisé par Quentin Sastourné
            <AppIcon name="external" class="text-xs" />
          </a>
        </li>
      </ul>
    </div>
    <div class="border-t border-line">
      <p class="mx-auto max-w-6xl px-4 py-5 text-sm text-ink-3 sm:px-6">
        © 2022-{{ year }} Seuil de rentabilité
      </p>
    </div>
  </footer>
</template>

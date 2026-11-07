<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#contenu"
      class="sr-only rounded-lg bg-brand px-4 py-3 font-semibold text-on-brand focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      Aller au contenu
    </a>
    <AppHeader />
    <main id="contenu" tabindex="-1" class="flex-1 outline-none">
      <NuxtPage />
    </main>
    <AppFooter />
    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: 'Mentions légales et confidentialité | Seuil de rentabilité',
  description: 'Éditeur, hébergeur, données personnelles et mesure d’audience du simulateur de seuil de rentabilité.',
  robots: 'noindex, follow',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/mentions-legales` }],
})
</script>

<template>
  <article class="mx-auto max-w-3xl px-4 pt-8 pb-8 sm:px-6 sm:pt-14">
    <h1 class="text-4xl text-ink sm:text-5xl">
      Mentions légales et confidentialité
    </h1>

    <div class="prose-content mt-10">
      <h2 class="font-display text-2xl text-ink">
        Éditeur
      </h2>
      <p>
        Ce site est édité à titre personnel par Quentin Sastourné. Pour toute question, passez par le
        <a href="https://github.com/STouKi/seuilderentabilite/issues">dépôt GitHub du projet</a>
        ou par le site <a href="https://quentin-sastourne.com">quentin-sastourne.com</a>.
      </p>

      <h2 class="pt-6 font-display text-2xl text-ink">
        Hébergement
      </h2>
      <!-- Adresse déclarée par Vercel au registre ARIN (fiche mise à jour en mars 2026). -->
      <p>
        Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        Téléphone&nbsp;: +1&nbsp;415&nbsp;980&nbsp;8007
        (<a href="https://vercel.com">vercel.com</a>).
      </p>

      <h2 class="pt-6 font-display text-2xl text-ink">
        Vos données
      </h2>
      <p>
        Le simulateur fonctionne entièrement dans votre navigateur&nbsp;: les montants que vous saisissez ne sont ni transmis, ni enregistrés sur un serveur. Aucun compte n’est nécessaire et aucun cookie n’est déposé.
      </p>
      <p>
        Pour que vous puissiez recharger la page ou partager une simulation, vos chiffres sont recopiés dans l’adresse de la page, après le signe #. Cette partie de l’adresse n’est jamais envoyée au serveur par votre navigateur.
      </p>

      <h2 class="pt-6 font-display text-2xl text-ink">
        Mesure d’audience
      </h2>
      <p>
        Le site utilise Vercel Web Analytics pour compter les visites de façon anonyme et agrégée (pages vues, provenance, pays, type d’appareil). Cet outil ne dépose aucun cookie, n’utilise aucun identifiant persistant et ne permet pas de vous suivre d’un site à l’autre. La partie de l’adresse qui suit le signe # est retirée avant tout envoi&nbsp;: vos montants n’y figurent jamais.
      </p>

      <h2 class="pt-6 font-display text-2xl text-ink">
        Responsabilité
      </h2>
      <p>
        Les résultats sont fournis à titre indicatif, à partir des montants saisis et en supposant des ventes réparties régulièrement sur l’exercice. Ils ne constituent pas un conseil et ne remplacent pas l’analyse d’un expert-comptable.
      </p>

      <h2 class="pt-6 font-display text-2xl text-ink">
        Code source
      </h2>
      <p>
        Le code de ce site est public et consultable sur
        <a href="https://github.com/STouKi/seuilderentabilite">GitHub</a>.
      </p>
    </div>

    <NuxtLink to="/" class="btn btn-secondary mt-12">
      Retour au simulateur
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { faq } from '~/data/faq'

const { siteUrl } = useRuntimeConfig().public

const title = 'Calcul du seuil de rentabilité et du point mort (gratuit)'
const description = 'Simulateur gratuit : calculez votre seuil de rentabilité, votre point mort et votre marge de sécurité. Formules expliquées, exemple chiffré et export PDF.'

useSeoMeta({
  title,
  description,
  ogTitle: 'Calcul du seuil de rentabilité',
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${siteUrl}/`,
  ogLocale: 'fr_FR',
  ogSiteName: 'Seuil de rentabilité',
  ogImage: `${siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Seuil de rentabilité = charges fixes ÷ taux de marge sur coûts variables, écrit à la craie',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'Calcul du seuil de rentabilité',
          'url': `${siteUrl}/`,
          description,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'Tous (navigateur web)',
          'inLanguage': 'fr-FR',
          'isAccessibleForFree': true,
          'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR' },
          'author': { '@type': 'Person', 'name': 'Quentin Sastourné', 'url': 'https://quentin-sastourne.com' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faq.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': { '@type': 'Answer', 'text': item.answer.join(' ') },
          })),
        },
      ]),
    },
  ],
})

const promises = [
  { icon: 'gift', text: 'Gratuit et sans inscription' },
  { icon: 'lock', text: 'Vos chiffres restent sur votre appareil' },
  { icon: 'printer', text: 'Export PDF de votre simulation' },
] as const
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <div class="notebook-grid -mx-4 px-4 pt-6 pb-12 sm:-mx-6 sm:px-6 sm:pt-12 sm:pb-16 print:hidden">
      <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <h1 class="text-[clamp(2.5rem,1.6rem+4vw,4.25rem)] text-ink">
            Calcul du seuil de rentabilité
          </h1>
          <p class="mt-5 max-w-[58ch] text-lg text-ink-2 sm:text-xl">
            Indiquez votre chiffre d’affaires, vos charges fixes et vos charges variables&nbsp;: vous obtenez aussitôt votre seuil de rentabilité, votre point mort et votre marge de sécurité, avec le détail de chaque calcul.
          </p>
          <ul class="mt-7 flex flex-col gap-2.5 text-ink-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <li v-for="promise in promises" :key="promise.text" class="flex items-center gap-2 font-medium">
              <AppIcon :name="promise.icon" class="shrink-0 text-lg text-brand" />
              {{ promise.text }}
            </li>
          </ul>
        </div>

        <!-- Sur mobile, la formule figure déjà dans le panneau de résultats : on va droit au simulateur. -->
        <div class="hidden lg:block lg:-rotate-1">
          <ChalkFormula size="lg" label="Seuil de rentabilité égale charges fixes divisées par le taux de marge sur coûts variables">
            <span class="text-chalk-mint">Seuil de rentabilité</span>
            <span>=</span>
            <ChalkFraction numerator="Charges fixes" denominator="Taux de marge sur coûts variables" />
          </ChalkFormula>
          <p class="mt-3 text-center font-chalk text-lg text-ink-3 lg:text-right">
            La formule à retenir, appliquée à vos chiffres juste en dessous.
          </p>
        </div>
      </div>
    </div>

    <BreakEvenCalculator />

    <div class="mt-16 sm:mt-24 print:hidden">
      <TheGuide />
    </div>
  </div>
</template>

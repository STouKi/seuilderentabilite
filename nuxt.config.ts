import tailwindcss from '@tailwindcss/vite'

/**
 * URL publique du site, utilisée pour les URL canoniques, le sitemap et les aperçus de
 * partage. Par ordre de priorité : la variable NUXT_PUBLIC_SITE_URL, puis le domaine de
 * production fourni automatiquement par Vercel, puis l'adresse locale.
 */
const siteUrl = (
  process.env.NUXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  || 'http://localhost:3000'
).replace(/\/+$/, '')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',

  modules: ['@nuxt/fonts'],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Lues au pré-rendu : surchargeables par NUXT_PUBLIC_SITE_URL et
  // NUXT_PUBLIC_VERCEL_ANALYTICS dans les variables d'environnement de Vercel.
  runtimeConfig: {
    public: {
      siteUrl,
      vercelAnalytics: Boolean(process.env.VERCEL),
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#f6f5f1', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0e1214', media: '(prefers-color-scheme: dark)' },
        { name: 'author', content: 'Quentin Sastourné' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  fonts: {
    defaults: {
      subsets: ['latin'],
      styles: ['normal'],
    },
    families: [
      { name: 'Inter', provider: 'google', weights: ['400 700'], preload: true },
      { name: 'Fraunces', provider: 'google', weights: [600], preload: true },
      { name: 'Patrick Hand', provider: 'google', weights: [400] },
    ],
  },

  // Site 100 % statique : toutes les pages sont générées au build (`nuxt generate`).
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/mentions-legales', '/sitemap.xml', '/robots.txt'],
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
  },
})

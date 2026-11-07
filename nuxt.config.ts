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

  runtimeConfig: {
    public: {
      siteUrl,
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
      script: process.env.VERCEL
        // Mesure d'audience Vercel Web Analytics : sans cookie, donc sans bandeau de
        // consentement. Le script n'est servi que sur les déploiements Vercel.
        ? [
            {
              // Les montants d'une simulation partagée vivent dans l'ancre de l'URL
              // (#ca=...) : on la retire avant chaque envoi pour qu'ils restent privés.
              innerHTML: 'window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};'
                + 'window.va("beforeSend",function(e){var u=new URL(e.url);u.hash="";return Object.assign({},e,{url:u.href})});',
            },
            { src: '/_vercel/insights/script.js', defer: true },
          ]
        : [],
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

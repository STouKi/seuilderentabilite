export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      title: 'Calcul du seuil de rentabilité',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Calculez votre seuil de rentabilité, votre taux de marge sur coût variable et votre marge sur coût variable et téléchargez gratuitement vos résultats en PDF.' }
      ],
      script: [
        {
          src: "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
          "data-auto-block": "on",
          "data-website-uuid": "d38f7354-5dc6-4dc6-bb3a-96a85f57d3ac"
        },
      ]  
    }
  },
  modules: [
    ['@nuxtjs/web-vitals', {
      debug: false,
      disabled: false,
      ga: { id: 'G-3XMNMKRK08' }
    }],
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    ['@nuxtjs/google-fonts', { 
      families: {
        Lato: [100, 300],
        Raleway: {
          wght: [100, 400],
          ital: [100]
        },
        "Patrick+Hand": true
      },
    }],
  ],
  css: ['@/assets/scss/style.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/variables.scss" as *;'
        }
      }
    }
  }
})

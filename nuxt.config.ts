export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  app: {
    head: {
      title: process.env.META_TITLE_GLOBAL,
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

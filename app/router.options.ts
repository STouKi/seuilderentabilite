import type { RouterConfig } from 'nuxt/schema'
import { START_LOCATION } from 'vue-router'

/**
 * Défilement entre pages et vers les ancres.
 *
 * Une ancre qui contient « = » (#ca=180000&cf=81000…) transporte les chiffres d'une
 * simulation partagée : ce n'est pas une section de la page vers laquelle défiler.
 */
function hashTarget(hash: string) {
  if (!hash || hash.includes('=')) return null
  const element = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!element) return null
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return {
    el: element,
    top: Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0,
    behavior: reduceMotion ? 'instant' : 'smooth',
  } as const
}

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    // Même page (ou premier affichage) : on suit l'ancre si c'est une section.
    if (from === START_LOCATION || to.path === from.path) {
      return hashTarget(to.hash) ?? (from.hash && !to.hash ? { top: 0 } : false)
    }

    // Changement de page : on attend que la nouvelle page soit affichée.
    const nuxtApp = useNuxtApp()
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce('page:finish', () => {
        requestAnimationFrame(() => resolve(hashTarget(to.hash) ?? { top: 0 }))
      })
    })
  },
} satisfies RouterConfig

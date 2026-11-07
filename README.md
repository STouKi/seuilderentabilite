# Seuil de rentabilité

Simulateur gratuit du **seuil de rentabilité**, du **point mort** et de la **marge de sécurité**, avec le détail de chaque calcul, un graphique interactif et l'export PDF.

Trois montants suffisent (chiffre d'affaires, charges fixes, charges variables) : les résultats se mettent à jour pendant la saisie et rien ne quitte le navigateur.

## Fonctionnalités

- Seuil de rentabilité, point mort daté, marge et indice de sécurité, résultat estimé
- Nombre de ventes à réaliser à partir d'un prix de vente moyen (facultatif)
- Détail du calcul pas à pas, formules écrites « à la craie »
- Graphique du seuil (survol et navigation au clavier, tableau de données équivalent)
- Export PDF via une mise en page d'impression dédiée
- Lien de partage : les montants sont stockés dans l'ancre de l'URL (`#ca=…&cf=…&cv=…`), jamais envoyée au serveur
- Saisie souple des montants : `12 500,50`, `12500.50`, `12 500 €`…
- Mode sombre, accessibilité (libellés, annonces vocales, contrastes vérifiés), site entièrement statique

## Stack

- [Nuxt 4](https://nuxt.com) en génération statique, Vue 3.5, TypeScript 7
- [Golar](https://golar.dev) pour la vérification des types (typescript-go, composants `.vue` compris)
- [Tailwind CSS 4](https://tailwindcss.com) (configuration dans `app/assets/css/main.css`)
- [@nuxt/fonts](https://fonts.nuxt.com) : polices Inter, Fraunces et Patrick Hand auto-hébergées au build
- [Bun](https://bun.sh) pour les dépendances et les tests
- Hébergement et mesure d'audience sans cookie sur [Vercel](https://vercel.com)

## Démarrer

```bash
bun install
bun run dev        # http://localhost:3000
```

## Scripts

| Commande | Rôle |
| --- | --- |
| `bun run dev` | Serveur de développement |
| `bun run generate` | Génère le site statique dans `.output/public` |
| `bun run preview` | Prévisualise le build |
| `bun test` | Tests des calculs et du format des montants (`tests/`) |
| `bun run typecheck` | Vérification des types avec Golar (`golar.config.ts`) |

## Déploiement sur Vercel

Le dépôt est prêt pour Vercel : `vercel.json` lance `bun run generate`, et Nuxt produit directement une sortie statique Vercel (en-têtes de sécurité et de cache compris).

1. Importer le dépôt dans Vercel (préréglage Nuxt détecté automatiquement).
2. Activer **Web Analytics** dans l'onglet *Analytics* du projet. Le script n'est injecté que sur les builds Vercel, et l'ancre de l'URL (qui contient les montants) est retirée avant chaque envoi.
3. Ajouter le domaine. L'URL utilisée pour les liens canoniques, le sitemap et les aperçus de partage est, par ordre de priorité :
   - la variable `NUXT_PUBLIC_SITE_URL` (par exemple `https://www.exemple.fr`) ;
   - sinon le domaine de production fourni par Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) ;
   - sinon `http://localhost:3000`.

Le site étant statique, il peut aussi être servi par n'importe quel hébergeur : déployer le contenu de `.output/public`.

## Structure

```
app/
  components/   Simulateur, graphique, détail du calcul, contenu éditorial
  composables/  État de la simulation et synchronisation avec l'URL
  data/         Questions fréquentes (page et données structurées)
  pages/        Accueil et mentions légales
  utils/        Calculs et formatage, sans dépendance (testés)
server/routes/  sitemap.xml et robots.txt, générés au build
tests/          Tests unitaires (bun test)
```

## Dépendances

Dependabot propose une seule PR groupée par mois, plus une PR groupée pour les correctifs de sécurité (`.github/dependabot.yml`). La CI (`.github/workflows/ci.yml`) lance tests, vérification des types et build sur chaque PR : si elle est verte, la mise à jour peut être fusionnée.

Le projet utilise TypeScript 7 (compilateur natif en Go). `vue-tsc` ne le prend pas encore en charge : la vérification des types passe donc par Golar, que `nuxt typecheck` intègre officiellement. Golar est encore en version 0.x ; en cas de problème, le retour arrière consiste à réinstaller `vue-tsc` avec `typescript@6` et à lancer `nuxt typecheck` sans l'option `--checker golar`.

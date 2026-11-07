<script setup lang="ts">
import { faq } from '~/data/faq'

const exampleRows = [
  { step: 'Marge sur coûts variables', calculation: '180 000 - 72 000', result: '108 000 €' },
  { step: 'Taux de marge', calculation: '108 000 ÷ 180 000', result: '60 %' },
  { step: 'Seuil de rentabilité', calculation: '81 000 ÷ 0,60', result: '135 000 €' },
  { step: 'Point mort', calculation: '135 000 ÷ 180 000 × 12', result: '9 mois, le 30 septembre' },
  { step: 'Marge de sécurité', calculation: '180 000 - 135 000', result: '45 000 €, soit 25 %' },
]

const fixedCosts = [
  'Loyer et charges locatives',
  'Salaires et cotisations du personnel permanent',
  'Assurances, abonnements et logiciels',
  'Honoraires de l’expert-comptable',
  'Amortissements et intérêts d’emprunt',
  'Publicité et communication récurrentes',
]

const variableCosts = [
  'Achats de marchandises et de matières premières',
  'Sous-traitance liée aux commandes',
  'Emballages, transport et livraison',
  'Commissions des commerciaux et des places de marché',
  'Commissions bancaires sur les paiements par carte',
  'Cotisations sociales d’un micro-entrepreneur',
]

const indicators = [
  {
    term: 'Point mort',
    formula: 'Seuil ÷ CA × 12 mois',
    text: 'La date à laquelle le seuil est atteint dans l’exercice. On le calcule aussi en jours (seuil ÷ CA × 360). Le calcul suppose des ventes régulières : pour une activité saisonnière, cumulez votre chiffre d’affaires mois après mois.',
  },
  {
    term: 'Marge de sécurité',
    formula: 'CA - Seuil',
    text: 'L’écart entre votre chiffre d’affaires et votre seuil. C’est la baisse de ventes que vous pouvez encaisser avant de perdre de l’argent.',
  },
  {
    term: 'Indice de sécurité',
    formula: 'Marge de sécurité ÷ CA',
    text: 'La marge de sécurité en pourcentage du chiffre d’affaires. Un indice de 25 % signifie que les ventes peuvent reculer d’un quart sans entraîner de perte.',
  },
]
</script>

<template>
  <div>
    <GuideSection id="definition" eyebrow="Comprendre" title="Qu’est-ce que le seuil de rentabilité ?">
      <div class="prose-content max-w-[68ch]">
        <p>
          Le <strong>seuil de rentabilité</strong> est le chiffre d’affaires minimum qu’une entreprise doit réaliser pour couvrir l’ensemble de ses charges. À ce niveau, son résultat est nul&nbsp;: elle ne perd pas d’argent, mais n’en gagne pas encore. Chaque euro vendu au-delà du seuil dégage du bénéfice.
        </p>
        <p>
          On l’appelle aussi <strong>chiffre d’affaires critique</strong>. C’est l’un des premiers indicateurs à calculer pour construire un prévisionnel, fixer ses prix ou défendre un projet devant un banquier, puis à suivre chaque année pour vérifier que l’activité reste viable.
        </p>
      </div>
    </GuideSection>

    <GuideSection id="methode" eyebrow="Méthode" title="Comment calculer le seuil de rentabilité ?">
      <div class="prose-content max-w-[68ch]">
        <p>
          Le calcul repose sur la distinction entre les charges qui suivent l’activité et celles qui n’en dépendent pas. Il se fait en trois étapes.
        </p>
      </div>
      <ol class="mt-8 grid gap-6">
        <li class="grid gap-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
          <span class="flex size-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-on-brand" aria-hidden="true">1</span>
          <div>
            <h3 class="font-sans text-lg font-semibold tracking-normal text-ink">
              Classez vos charges
            </h3>
            <p class="mt-1 text-ink-2">
              Les charges variables évoluent avec les ventes (achats, matières, commissions). Les charges fixes restent stables quel que soit le volume vendu (loyer, assurances, salaires).
              <a href="#charges" class="font-medium text-brand underline underline-offset-3">Voir comment les classer</a>.
            </p>
          </div>
        </li>
        <li class="grid gap-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
          <span class="flex size-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-on-brand" aria-hidden="true">2</span>
          <div>
            <h3 class="font-sans text-lg font-semibold tracking-normal text-ink">
              Calculez la marge sur coûts variables et son taux
            </h3>
            <p class="mt-1 text-ink-2">
              La marge sur coûts variables est le chiffre d’affaires diminué des charges variables. Divisée par le chiffre d’affaires, elle donne le taux de marge sur coûts variables.
            </p>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <ChalkFormula label="Marge sur coûts variables égale chiffre d’affaires moins charges variables">
                <span class="text-chalk-mint">MCV</span>
                <span>=</span>
                <span>CA - Charges variables</span>
              </ChalkFormula>
              <ChalkFormula label="Taux de marge sur coûts variables égale marge sur coûts variables divisée par chiffre d’affaires">
                <span class="text-chalk-mint">Taux</span>
                <span>=</span>
                <ChalkFraction numerator="MCV" denominator="CA" />
              </ChalkFormula>
            </div>
          </div>
        </li>
        <li class="grid gap-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
          <span class="flex size-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-on-brand" aria-hidden="true">3</span>
          <div>
            <h3 class="font-sans text-lg font-semibold tracking-normal text-ink">
              Divisez les charges fixes par ce taux
            </h3>
            <p class="mt-1 text-ink-2">
              Vous obtenez le seuil de rentabilité&nbsp;: le chiffre d’affaires qui couvre tout juste les charges fixes.
            </p>
            <ChalkFormula class="mt-4" label="Seuil de rentabilité égale charges fixes divisées par le taux de marge sur coûts variables">
              <span class="text-chalk-mint">Seuil de rentabilité</span>
              <span>=</span>
              <ChalkFraction numerator="Charges fixes" denominator="Taux de marge sur coûts variables" />
            </ChalkFormula>
            <p class="mt-3 text-sm text-ink-3">
              Formule équivalente, pratique pour vérifier&nbsp;: seuil = charges fixes × chiffre d’affaires ÷ marge sur coûts variables.
            </p>
          </div>
        </li>
      </ol>
    </GuideSection>

    <GuideSection id="exemple" eyebrow="Exemple" title="Un exemple de calcul pas à pas">
      <div class="prose-content max-w-[68ch]">
        <p>
          Une boulangerie réalise <strong>180&nbsp;000&nbsp;€ de chiffre d’affaires HT</strong> sur l’année. Ses charges variables (farine, beurre, emballages, énergie des fours) s’élèvent à <strong>72&nbsp;000&nbsp;€</strong>, et ses charges fixes (loyer, salaires, assurances, amortissement du matériel) à <strong>81&nbsp;000&nbsp;€</strong>.
        </p>
      </div>
      <div class="card mt-8 overflow-x-auto">
        <table class="w-full min-w-136 text-left">
          <caption class="sr-only">
            Calcul du seuil de rentabilité de la boulangerie
          </caption>
          <thead class="border-b border-line text-sm text-ink-3">
            <tr>
              <th scope="col" class="px-5 py-3 font-medium">
                Indicateur
              </th>
              <th scope="col" class="px-5 py-3 font-medium">
                Calcul
              </th>
              <th scope="col" class="px-5 py-3 text-right font-medium">
                Résultat
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in exampleRows" :key="row.step" class="border-b border-line/70 last:border-0">
              <th scope="row" class="px-5 py-3.5 font-semibold text-ink">
                {{ row.step }}
              </th>
              <td class="px-5 py-3.5 whitespace-nowrap text-ink-2 tabular-nums">
                {{ row.calculation }}
              </td>
              <td class="px-5 py-3.5 text-right font-semibold whitespace-nowrap text-ink tabular-nums">
                {{ row.result }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="prose-content mt-8 max-w-[68ch]">
        <p>
          La boulangerie couvre toutes ses charges à la fin du mois de septembre. Ses ventes pourraient baisser de 25&nbsp;% avant qu’elle ne perde de l’argent. Avec un panier moyen de 6&nbsp;€, elle doit servir 22&nbsp;500 clients dans l’année pour atteindre son seuil, soit 75 par jour sur 300&nbsp;jours d’ouverture.
        </p>
      </div>
      <a href="#ca=180000&cf=81000&cv=72000&pv=6" class="btn btn-secondary mt-6">
        <AppIcon name="sparkle" />
        Charger cet exemple dans le simulateur
      </a>
    </GuideSection>

    <GuideSection id="indicateurs" eyebrow="Indicateurs" title="Point mort, marge et indice de sécurité">
      <div class="prose-content max-w-[68ch]">
        <p>
          Trois indicateurs complètent le seuil de rentabilité&nbsp;: ils disent quand l’entreprise devient rentable, et avec quelle marge de manœuvre.
        </p>
      </div>
      <dl class="mt-8 grid gap-4">
        <!-- dt et dd restent enfants directs du div, comme l'exige une liste de définitions valide. -->
        <div v-for="indicator in indicators" :key="indicator.term" class="card grid content-start gap-3 p-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:grid-rows-[auto_1fr] sm:gap-x-6">
          <dt class="font-display text-xl font-semibold text-ink sm:col-start-1 sm:row-start-1">
            {{ indicator.term }}
          </dt>
          <dd class="chalkboard self-start px-3 py-2 text-center text-lg sm:col-start-1 sm:row-start-2">
            {{ indicator.formula }}
          </dd>
          <dd class="text-ink-2 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:pt-1">
            {{ indicator.text }}
          </dd>
        </div>
      </dl>
    </GuideSection>

    <GuideSection id="charges" eyebrow="Classement" title="Charges fixes ou variables : comment les classer ?">
      <div class="prose-content max-w-[68ch]">
        <p>
          La justesse du calcul dépend de ce classement. Pour chaque charge, posez-vous une seule question&nbsp;: augmente-t-elle si je vends davantage&nbsp;?
        </p>
      </div>
      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <div class="card p-6">
          <h3 class="text-xl text-ink">
            Charges fixes
          </h3>
          <p class="mt-1 text-sm text-ink-3">
            Aussi appelées charges de structure&nbsp;: elles ne bougent pas avec les ventes.
          </p>
          <ul class="mt-4 grid gap-2.5 text-ink-2">
            <li v-for="item in fixedCosts" :key="item" class="flex gap-2.5">
              <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="card p-6">
          <h3 class="text-xl text-ink">
            Charges variables
          </h3>
          <p class="mt-1 text-sm text-ink-3">
            Aussi appelées charges opérationnelles&nbsp;: elles suivent le volume des ventes.
          </p>
          <ul class="mt-4 grid gap-2.5 text-ink-2">
            <li v-for="item in variableCosts" :key="item" class="flex gap-2.5">
              <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <p class="mt-4 flex gap-3 rounded-xl border border-line bg-surface p-4 text-[0.9375rem] text-ink-2">
        <AppIcon name="info" class="mt-1 shrink-0 text-brand" />
        <span>
          Certaines charges sont <strong class="font-semibold text-ink">semi-variables</strong>, comme l’électricité ou des salaires comprenant des primes. Répartissez-les entre une part fixe et une part variable, selon ce qui dépend réellement de votre activité.
        </span>
      </p>
    </GuideSection>

    <GuideSection id="faq" eyebrow="Questions fréquentes" title="Vos questions sur le seuil de rentabilité">
      <div class="divide-y divide-line border-y border-line">
        <details v-for="item in faq" :key="item.question" class="group">
          <summary class="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {{ item.question }}
            <AppIcon name="chevron-down" class="mt-1 shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
          </summary>
          <div class="prose-content max-w-[68ch] pb-6">
            <p v-for="paragraph in item.answer" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </details>
      </div>
    </GuideSection>

    <section class="chalkboard mb-4 flex flex-col items-start gap-5 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10" aria-labelledby="appel-titre">
      <div>
        <h2 id="appel-titre" class="font-chalk text-3xl font-normal tracking-normal text-chalk sm:text-4xl">
          À vous de jouer&nbsp;!
        </h2>
        <p class="mt-1 font-sans text-chalk-2">
          Trois montants suffisent pour connaître votre seuil de rentabilité.
        </p>
      </div>
      <a href="#simulateur" class="btn shrink-0 bg-chalk-mint font-sans text-board hover:bg-chalk">
        Calculer mon seuil
      </a>
    </section>
  </div>
</template>

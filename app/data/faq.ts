/**
 * Questions fréquentes : affichées sur la page et reprises telles quelles dans les
 * données structurées (schema.org FAQPage) pour les moteurs de recherche.
 */
export interface FaqItem {
  question: string
  /** Paragraphes de la réponse, en texte brut. */
  answer: string[]
}

export const faq: FaqItem[] = [
  {
    question: 'Quelle différence entre seuil de rentabilité et point mort ?',
    answer: [
      'Le seuil de rentabilité est un montant : le chiffre d’affaires à réaliser pour couvrir toutes vos charges. Le point mort est une date : le jour de l’exercice où ce montant est atteint, si vos ventes sont régulières.',
    ],
  },
  {
    question: 'Faut-il calculer le seuil de rentabilité en HT ou en TTC ?',
    answer: [
      'En hors taxes. La TVA que vous facturez est reversée à l’État : ce n’est pas un revenu. Saisissez donc votre chiffre d’affaires et vos charges hors taxes.',
      'Si vous bénéficiez de la franchise en base de TVA, saisissez vos charges TTC, puisque vous ne récupérez pas la TVA sur vos achats.',
    ],
  },
  {
    question: 'Comment calculer le seuil de rentabilité en nombre de ventes ?',
    answer: [
      'Divisez le seuil de rentabilité par votre prix de vente moyen HT. Avec un seuil de 135 000 € et un panier moyen de 6 €, il faut réaliser 22 500 ventes sur l’année.',
      'Avec des données unitaires, la formule devient : charges fixes ÷ (prix de vente unitaire - coût variable unitaire). Renseignez le prix de vente moyen dans le simulateur pour obtenir ce nombre directement.',
    ],
  },
  {
    question: 'Pourquoi le simulateur ne trouve-t-il aucun seuil ?',
    answer: [
      'Quand vos charges variables égalent ou dépassent votre chiffre d’affaires, chaque vente coûte plus qu’elle ne rapporte. La marge sur coûts variables est nulle ou négative : vendre davantage creuse la perte au lieu de la combler. Il faut d’abord revoir vos prix de vente ou vos coûts d’achat.',
    ],
  },
  {
    question: 'Comment abaisser son seuil de rentabilité ?',
    answer: [
      'Trois leviers existent : réduire les charges fixes (loyer, abonnements, frais de structure), améliorer le taux de marge sur coûts variables (hausse des prix, négociation des achats, réduction des pertes) ou orienter l’offre vers les produits les plus rentables. Testez chaque hypothèse dans le simulateur pour mesurer son effet.',
    ],
  },
  {
    question: 'Comment faire pour une micro-entreprise ?',
    answer: [
      'Le calcul est identique. Classez vos cotisations sociales en charges variables, puisqu’elles sont proportionnelles au chiffre d’affaires. Pour savoir à partir de quand l’activité vous rémunère, ajoutez aux charges fixes le revenu que vous souhaitez vous verser.',
    ],
  },
  {
    question: 'Mes chiffres sont-ils enregistrés ?',
    answer: [
      'Non. Les calculs sont faits dans votre navigateur : aucun montant n’est envoyé ni conservé sur un serveur. Le lien de partage contient vos chiffres après le signe #, une partie de l’adresse que les navigateurs ne transmettent pas au serveur.',
    ],
  },
]

/**
 * BARÈME CLIENT PUBLIC — honoraires de transaction de LYAT IMMO.
 *
 * SOURCE DE VÉRITÉ de la page /honoraires. Contenu réglementaire (arrêté du
 * 10 janvier 2017 modifié), statique et daté : il vit ici, versionné dans git,
 * et n'a aucune raison d'être en base ni dans une configuration.
 *
 * NE PAS CONFONDRE avec lib/bareme.js, qui porte la grille de RÉMUNÉRATION
 * DES CONSEILLERS (Partenaire / Confirmé / Team Leader, calcul marginal) et
 * n'a aucun rapport avec ce barème client.
 *
 * Toute mise à jour = reprise FIDÈLE du PDF « Bareme_Honoraires_LYAT_IMMO ».
 * Aucune tranche, aucun montant, aucune règle ne doit être déduit ou complété.
 */

export const HONORAIRES = {
  titre: "Barème d'honoraires maximums TTC",
  applicable: "Applicable au 1er septembre 2026",

  vente: {
    regle:
      "Tranches non cumulatives. Le taux correspondant s'applique à la totalité du prix global de vente du bien.",
    colonnes: {
      plage: "Prix global de vente du bien",
      taux: "Honoraires maximums TTC",
    },
    tranches: [
      { plage: "0 à 100 000 €", taux: "8 %" },
      { plage: "100 001 à 200 000 €", taux: "7 %" },
      { plage: "200 001 à 300 000 €", taux: "6,5 %" },
      { plage: "300 001 à 400 000 €", taux: "6 %" },
      { plage: "400 001 à 500 000 €", taux: "5,5 %" },
      { plage: "Au-delà de 500 000 €", taux: "5 %" },
    ],
    forfait:
      "Forfait minimum de référence de 8 000 € TTC. Le montant maximal prévu au barème est le plus élevé entre 8 000 € TTC et le résultat du pourcentage applicable. Des honoraires inférieurs, y compris à ce forfait, peuvent être convenus au mandat.",
    exemple:
      "Pour un prix global de vente de 250 000 €, le montant maximal est de 250 000 × 6,5 % = 16 250 € TTC.",
  },

  location: {
    colonnes: { prestation: "Prestations", bailleur: "Bailleur", locataire: "Locataire" },
    // locataire / bailleur à null = prestation non due par cette partie.
    lignes: [
      {
        prestation: "Baux d'habitation - État des lieux d'entrée",
        bailleur: "3 €/m²",
        locataire: "3 €/m²",
      },
      {
        prestation: "Baux d'habitation - Visite, dossier et rédaction du bail",
        bailleur: "8 €/m²",
        locataire: "8 €/m²",
      },
      {
        prestation: "Baux d'habitation - Entremise et négociation",
        bailleur: "1 € TTC",
        locataire: null,
      },
      {
        prestation: "Baux commerciaux et professionnels - Location et rédaction du bail",
        bailleur: null,
        locataire: "9 % du loyer annuel",
      },
    ],
    note:
      "Tous les honoraires de location sont TTC. Les montants au m² s'entendent par m² de surface habitable. Pour les baux d'habitation soumis à la loi du 6 juillet 1989, la part du locataire ne peut dépasser celle du bailleur pour les prestations concernées, ni les plafonds légaux applicables. Pour les baux commerciaux et professionnels, les honoraires TTC sont calculés sur le loyer annuel hors charges, taxes comprises si applicables.",
  },

  conditions: [
    "Les honoraires constituent le barème maximum TTC de l'agence, conformément à l'arrêté du 10 janvier 2017 modifié. Pour les ventes, ils sont à la charge du vendeur, sauf convention contraire expressément prévue au mandat.",
    "Si le mandat prévoit exceptionnellement des honoraires à la charge de l'acquéreur, l'annonce précise qui les supporte, affiche le prix honoraires inclus et hors honoraires, avec le prix honoraires inclus en caractères plus importants, et indique « Honoraires » suivi du pourcentage TTC calculé sur le prix hors honoraires.",
  ],

  identite: [
    "SARL LYAT IMMO · MBE 551 Mangot Vulcin, 97232 Le Lamentin",
    "SIREN 107 987 687 · RCS Fort-de-France · SIRET 107 987 687 00012",
    "Carte professionnelle n° CPI 9721 2026 000 000 014 · CCI Martinique",
    "RCP GALIAN-SMABTP · Contrat n° RCP_01_511461L · 89, rue La Boétie, 75008 Paris",
    "Non-détention de fonds, effets ou valeurs, à l'exception de ceux représentatifs de ses honoraires.",
  ],
};

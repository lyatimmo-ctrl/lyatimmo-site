import NousRejoindreClient from "./NousRejoindreClient";
import { getBaremePublic } from "@/lib/bareme";

// Grille de rémunération lue de la vue publique v_bareme_remuneration_public
// (source de vérité = config Supabase, clé bareme_remuneration, mode marginal).
// ISR 1 h ; fallback en dur dans lib/bareme.js si la vue est injoignable au build.
export const revalidate = 3600;

export const metadata = {
  title: "LYAT IMMO | Nous rejoindre",
  description:
    "L'environnement professionnel LYAT IMMO pour les conseillers immobiliers : pilotage de l'activité, outils métier, accompagnement, visibilité et un abonnement unique.",
};

const nf = new Intl.NumberFormat("fr-FR");
const pct = (t) => `${Math.round(Number(t) * 100)} %`;
const eur = (n) => `${nf.format(Math.round(Number(n) || 0))} €`;

// Bornes basses -> hautes d'un statut (ex. "70 % puis 90 %").
function bornes(arr) {
  if (!Array.isArray(arr) || !arr.length) return "";
  const s = arr.slice().sort((a, b) => Number(a.min) - Number(b.min));
  return `${pct(s[0].taux)} → ${pct(s[s.length - 1].taux)}`;
}

// Paliers marginaux préparés pour un rendu graphique côté client.
// { de, a, taux } : memes valeurs que la config, aucune transformation de logique.
function paliersViz(arr) {
  if (!Array.isArray(arr) || !arr.length) return [];
  return arr
    .slice()
    .sort((a, b) => Number(a.min) - Number(b.min))
    .map((p) => ({
      de: eur(p.min),
      a: p.max == null ? null : eur(p.max),
      taux: Number(p.taux),
    }));
}

// Textes éditoriaux (hors config, ils ne changent pas avec la grille).
const TEXTE = {
  partenaire:
    "Un parcours progressif qui fait évoluer la rémunération avec le chiffre d'affaires annuel.",
  confirme:
    "Rémunération jusqu'au cap de production personnelle annuelle. Au-delà de ce seuil, le conseiller conserve 100 % de sa rémunération sur sa production personnelle jusqu'au renouvellement annuel du cap.",
  team_leader:
    "Sur sa production personnelle, le Team Leader bénéficie du même modèle qu'un Conseiller Confirmé.",
};

export default async function NousRejoindrePage() {
  const bareme = await getBaremePublic();
  const p = bareme.paliers || {};

  const statuts = [
    {
      nom: "Conseiller Partenaire",
      valeur: bornes(p.partenaire),
      texte: TEXTE.partenaire,
      viz: paliersViz(p.partenaire),
      note: "Le Conseiller Partenaire est accompagné par un Team Leader.",
    },
    {
      nom: "Conseiller Confirmé",
      valeur: bornes(p.confirme),
      texte: TEXTE.confirme,
      viz: paliersViz(p.confirme),
      note: "",
    },
    {
      nom: "Team Leader",
      // Production personnelle : mêmes bornes qu'un Conseiller Confirmé.
      // L'accompagnement est présenté séparément, jamais additionné ici.
      valeur: bornes(p.team_leader),
      texte: TEXTE.team_leader,
      viz: [],
      note: "",
      accompagnement: {
        production:
          "Une rémunération qui progresse selon votre propre activité.",
        reseau: `Une rémunération complémentaire liée aux Conseillers Partenaires que vous accompagnez. Elle correspond à ${pct(
          bareme.override_team_leader,
        )} de leur production, prise en charge par LYAT et non déduite de leur rémunération.`,
      },
    },
  ];

  return <NousRejoindreClient statuts={statuts} />;
}

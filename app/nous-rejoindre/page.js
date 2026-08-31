import NousRejoindreClient from "./NousRejoindreClient";
import { getBaremePublic, palierLines } from "@/lib/bareme";

// Grille de rémunération lue de la vue publique v_bareme_remuneration_public
// (source de vérité = config Supabase). ISR 1 h ; fallback en dur dans
// lib/bareme.js si la vue est injoignable au build.
export const revalidate = 3600;

const nf = new Intl.NumberFormat("fr-FR");
const pct = (t) => `${Math.round(Number(t) * 100)} %`;

// Textes éditoriaux (hors config — ne changent pas avec la grille).
const TEXTE = {
  partenaire:
    "Un parcours progressif permettant de faire évoluer sa rémunération avec son chiffre d’affaires annuel.",
  confirme:
    "Rémunération jusqu’au cap de production personnelle annuelle. Au-delà de ce seuil, le conseiller conserve 100 % de sa rémunération sur sa production personnelle jusqu’au renouvellement annuel du cap.",
  team_leader:
    "Le Team Leader bénéficie du même modèle sur sa production personnelle qu’un Conseiller Confirmé et perçoit une rémunération d’accompagnement sur la production des Conseillers Partenaires qu’il accompagne, prélevée sur la marge du réseau.",
};
const NOTE = {
  partenaire: "Le Conseiller Partenaire est accompagné par un Team Leader.",
  confirme: "",
  team_leader: "",
};

function bornes(arr) {
  if (!Array.isArray(arr) || !arr.length) return "";
  const sorted = arr.slice().sort((a, b) => Number(a.min) - Number(b.min));
  return `${pct(sorted[0].taux)} → ${pct(sorted[sorted.length - 1].taux)}`;
}

export default async function NousRejoindrePage() {
  const bareme = await getBaremePublic();
  const p = bareme.paliers || {};
  const overridePct = pct(bareme.override_team_leader);

  const statuts = [
    {
      nom: "Conseiller Partenaire",
      valeur: bornes(p.partenaire),
      texte: TEXTE.partenaire,
      paliers: palierLines(p, "partenaire"),
      note: NOTE.partenaire,
    },
    {
      nom: "Conseiller Confirmé",
      valeur: bornes(p.confirme),
      texte: TEXTE.confirme,
      paliers: palierLines(p, "confirme"),
      note: NOTE.confirme,
    },
    {
      nom: "Team Leader",
      valeur: `${bornes(p.team_leader)} + ${overridePct}`,
      texte: TEXTE.team_leader,
      paliers: palierLines(p, "team_leader"),
      note: NOTE.team_leader,
    },
  ];

  return <NousRejoindreClient statuts={statuts} />;
}

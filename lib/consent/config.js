/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LYAT IMMO — Registre central du consentement et des services tiers
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  RÈGLE POUR TOUTE ÉVOLUTION FUTURE (développeur ou session Claude Code) :
 *
 *  Tout nouveau script marketing, analytics ou contenu tiers nécessitant un
 *  consentement DOIT être déclaré dans le tableau `services` ci-dessous et
 *  chargé via le gestionnaire de consentement LYAT IMMO (composants de
 *  `components/consent/`). Il ne doit JAMAIS être ajouté directement dans le
 *  <head>, dans `app/layout.js` ou dans un composant métier en contournant ce
 *  mécanisme.
 *
 *  Ajouter un service = 3 étapes, sans reconstruire le système de consentement :
 *    1. le déclarer ici (id, catégorie, requiresConsent, envVar, doc…) ;
 *    2. le raccorder au gestionnaire — nouveau composant sur le modèle de
 *       `MetaPixel`, ou intégration via `<ConsentAwareEmbed>` pour un contenu
 *       embarqué (vidéo, visite virtuelle, iframe tierce) ;
 *    3. renseigner sa documentation (champ `doc`) pour la page /cookies.
 *
 *  Ne jamais marquer `active: true` un service qui n'est pas réellement installé
 *  ou configuré. La page /cookies s'appuie sur ce registre : un service marqué
 *  actif y apparaît automatiquement dans l'inventaire correspondant.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Incrémenter UNIQUEMENT si les finalités changent substantiellement : cela
// invalide les choix antérieurs et le bandeau est présenté de nouveau.
// Ne pas s'en servir pour redemander le consentement sans nécessité.
export const CONSENT_VERSION = 1;

// Cookie de préférence — aucune donnée personnelle, uniquement le choix.
export const CONSENT_COOKIE = "lyat_consent";

// CNIL : durée de conservation du choix raisonnable — 6 mois.
export const CONSENT_MAX_AGE_DAYS = 182;

export const CONSENT_STATUS = {
  PENDING: "pending", // aucun choix encore exprimé
  ACCEPTED: "accepted", // technologies non nécessaires acceptées
  REJECTED: "rejected", // technologies non nécessaires refusées
};

export const CATEGORIES = {
  necessary: { id: "necessary", title: "Cookies strictement nécessaires" },
  analytics: { id: "analytics", title: "Mesure d'audience et publicité" },
  external: { id: "external", title: "Contenus et services externes" },
};

/**
 * Registre des services tiers / traceurs.
 *
 *  id            identifiant technique stable
 *  name          nom affiché
 *  provider      fournisseur / éditeur
 *  category      clé de CATEGORIES
 *  purpose       finalité, formulée pour l'utilisateur
 *  requiresConsent  true = bloqué tant que le consentement n'est pas "accepted"
 *  active        true seulement si le service est réellement installé/configuré
 *  envVar        variable d'environnement requise, le cas échéant
 *  doc           informations destinées à la page /cookies
 */
export const services = [
  {
    id: "consent-preference",
    name: "Préférence de consentement",
    provider: "LYAT IMMO",
    category: "necessary",
    purpose:
      "Mémoriser votre choix concernant les cookies et technologies soumis au consentement, afin de ne pas vous le redemander à chaque page.",
    requiresConsent: false,
    active: true,
    doc: {
      name: CONSENT_COOKIE,
      finalite: "Conservation de votre choix de consentement.",
      duree: "6 mois",
      origine: "lyatimmo.com — cookie déposé par le site (first-party).",
      contenu:
        "Version du consentement, statut (accepté ou refusé) et date du choix. Aucune donnée personnelle, aucun identifiant publicitaire.",
      securite:
        "Attributs SameSite=Lax et Secure (HTTPS). Lisible uniquement par le site lyatimmo.com.",
    },
  },
  {
    id: "meta-pixel",
    name: "Meta Pixel",
    provider: "Meta Platforms Ireland Ltd.",
    category: "analytics",
    purpose:
      "Mesurer l'efficacité des communications et des campagnes publicitaires de LYAT IMMO et en améliorer la pertinence.",
    requiresConsent: true,
    envVar: "NEXT_PUBLIC_META_PIXEL_ID",
    // Prêt dans le code (composant MetaPixel), INACTIF tant qu'aucun identifiant
    // n'est configuré. Renseigner NEXT_PUBLIC_META_PIXEL_ID pour l'activer.
    active: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    doc: {
      dataCollected:
        "Données techniques de navigation (adresse IP, identifiants de cookies Meta, pages consultées). Aucune donnée de formulaire n'est transmise.",
      transfer:
        "États-Unis — encadré par des clauses contractuelles types et le Data Privacy Framework UE–États-Unis.",
    },
  },
  {
    id: "external-embeds",
    name: "Vidéos et visites virtuelles",
    provider: "Plateformes tierces (selon le contenu réellement intégré)",
    category: "external",
    purpose:
      "Afficher des vidéos ou des visites virtuelles hébergées par des plateformes tierces. Ces services peuvent déposer des traceurs ou transmettre des données techniques.",
    requiresConsent: true,
    // Passer à true dès qu'une page utilise réellement <ConsentAwareEmbed> /
    // <VideoEmbed> / <VirtualTourEmbed> avec un fournisseur soumis au consentement,
    // et compléter `doc` avec le ou les fournisseurs concernés.
    active: false,
    doc: {
      note: "Aucun contenu externe soumis au consentement n'est actuellement intégré au site.",
    },
  },
];

export function servicesByCategory(categoryId) {
  return services.filter((s) => s.category === categoryId);
}

export function activeServicesByCategory(categoryId) {
  return services.filter((s) => s.category === categoryId && s.active);
}

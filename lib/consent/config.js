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
 *    2. le raccorder au gestionnaire — <ConsentGatedScript category="…"> pour un
 *       script tiers, <ConsentAwareEmbed category="…"> pour un contenu embarqué ;
 *    3. renseigner sa documentation (champ `doc`) pour la page /cookies.
 *
 *  Ne jamais marquer `active: true` un service qui n'est pas réellement installé
 *  ou configuré. La page /cookies s'appuie sur ce registre : un service marqué
 *  actif y apparaît automatiquement dans l'inventaire correspondant.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// v3 : consentement PAR CATÉGORIE (et non plus binaire global). Le cookie
// stocke l'état de chaque catégorie soumise au consentement. Les cookies v2
// (binaire "accepted"/"rejected") sont migrés automatiquement.
// Incrémenter uniquement si les finalités changent substantiellement : cela
// invalide les choix antérieurs et le bandeau est présenté de nouveau.
export const CONSENT_VERSION = 3;

// Cookie de préférence — aucune donnée personnelle, uniquement les choix.
export const CONSENT_COOKIE = "lyat_consent";

// CNIL : durée de conservation du choix raisonnable — 6 mois.
export const CONSENT_MAX_AGE_DAYS = 182;

// Conservé pour compatibilité de code ancien / lisibilité ; le système
// raisonne désormais par catégorie (booléens), plus par statut global.
export const CONSENT_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

/**
 * Catégories de consentement.
 *   alwaysOn : true  -> toujours active, non modifiable (jamais dans le cookie)
 *   alwaysOn : false -> soumise au consentement, stockée dans le cookie
 */
export const CATEGORIES = {
  necessary: {
    id: "necessary",
    title: "Nécessaire",
    alwaysOn: true,
    description:
      "Cookies indispensables au fonctionnement du site, à sa sécurité et à la mémorisation de vos choix. Ils ne sont pas soumis au consentement.",
  },
  external: {
    id: "external",
    title: "Contenus externes",
    alwaysOn: false,
    description:
      "Vidéos et visites virtuelles hébergées par des plateformes tierces, affichées sur les fiches biens. Rien n'est chargé tant que cette catégorie n'est pas acceptée.",
  },
  analytics: {
    id: "analytics",
    title: "Publicité et mesure d'audience",
    alwaysOn: false,
    description:
      "Outils de mesure d'audience et de publicité permettant d'évaluer l'utilisation du site et l'efficacité des communications de LYAT IMMO.",
  },
};

// Ordre d'affichage (bandeau + page /cookies).
export const CATEGORY_LIST = [CATEGORIES.necessary, CATEGORIES.external, CATEGORIES.analytics];

// Catégories réellement soumises au consentement (hors `necessary`) — clés
// stockées dans le cookie, dans cet ordre.
export const CONSENTABLE_CATEGORIES = ["external", "analytics"];

/**
 * Registre des services tiers / traceurs.
 *
 *  id            identifiant technique stable
 *  name          nom affiché
 *  provider      fournisseur / éditeur
 *  category      clé de CATEGORIES
 *  purpose       finalité, formulée pour l'utilisateur
 *  requiresConsent  true = bloqué tant que sa catégorie n'est pas acceptée
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
      "Mémoriser vos choix concernant les cookies et technologies soumis au consentement, afin de ne pas vous les redemander à chaque page.",
    requiresConsent: false,
    active: true,
    doc: {
      name: CONSENT_COOKIE,
      finalite: "Conservation de vos choix de consentement, catégorie par catégorie.",
      duree: "6 mois",
      origine: "lyatimmo.com - cookie déposé par le site (first-party).",
      contenu:
        "Version du consentement, état de chaque catégorie (accepté ou refusé) et date du choix. Aucune donnée personnelle, aucun identifiant publicitaire.",
      securite:
        "Attributs SameSite=Lax et Secure (HTTPS). Lisible uniquement par le site lyatimmo.com.",
    },
  },
  {
    id: "external-embeds",
    name: "Vidéos et visites virtuelles",
    provider:
      "Plateformes tierces : YouTube, Vimeo, Matterport, Klapty, Nodalview, Previsite, Kuula, Instagram, TikTok, Facebook",
    category: "external",
    purpose:
      "Lecteurs vidéo et visites virtuelles intégrés sur les fiches biens, chargés uniquement après votre accord. Ces services tiers peuvent déposer des traceurs ou transmettre des données techniques (adresse IP, données de navigation).",
    requiresConsent: true,
    // Intégré via <PropertyMedia> / <ConsentAwareEmbed category="external"> sur
    // les fiches /biens/[slug] : l'iframe du fournisseur n'est créée qu'après
    // acceptation de la catégorie "Contenus externes".
    active: true,
    doc: {
      note: "Lecteurs vidéo et visites virtuelles intégrés sur les fiches biens, chargés uniquement après votre accord.",
      providers: [
        "YouTube",
        "Vimeo",
        "Matterport",
        "Klapty",
        "Nodalview",
        "Previsite",
        "Kuula",
        "Instagram",
        "TikTok",
        "Facebook",
      ],
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
    // Prêt dans le code (<MetaPixel> via <ConsentGatedScript category="analytics">),
    // INACTIF tant qu'aucun identifiant n'est configuré. Renseigner
    // NEXT_PUBLIC_META_PIXEL_ID pour l'activer.
    active: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    doc: {
      dataCollected:
        "Données techniques de navigation (adresse IP, identifiants de cookies Meta, pages consultées). Aucune donnée de formulaire n'est transmise.",
      transfer:
        "États-Unis - encadré par des clauses contractuelles types et le Data Privacy Framework UE-États-Unis.",
    },
  },
];

export function servicesByCategory(categoryId) {
  return services.filter((s) => s.category === categoryId);
}

export function activeServicesByCategory(categoryId) {
  return services.filter((s) => s.category === categoryId && s.active);
}

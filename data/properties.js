// Liste de repli (dev / preview, ou si NEXT_PUBLIC_SUPABASE_* non defini).
// En production, les annonces proviennent de la table Supabase `listings`,
// alimentee par l'ingestion Transactimo (repo lyatimmo-app). Voir lib/listings.js.

export const properties = [
  {
    slug: "villa-contemporaine-schoelcher",
    transaction: "vente",
    type: "Villa",
    commune: "Schœlcher",
    title: "Villa contemporaine",
    price: 695000,
    surface: 180,
    pieces: 6,
    chambres: 4,
    tag: "Vue mer",
    description:
      "Villa contemporaine de plain-pied, grands volumes ouverts sur piscine à débordement et vue mer dégagée. Prestations haut de gamme, terrain paysager clos.",
  },
  {
    slug: "appartement-renove-fort-de-france",
    transaction: "vente",
    type: "Appartement",
    commune: "Fort-de-France",
    title: "Appartement rénové",
    price: 312000,
    surface: 78,
    pieces: 4,
    chambres: 3,
    tag: "Rare",
    description:
      "Appartement entièrement rénové au cœur de Fort-de-France, cuisine ouverte, double exposition, faibles charges de copropriété.",
  },
  {
    slug: "maison-familiale-le-lamentin",
    transaction: "vente",
    type: "Maison",
    commune: "Le Lamentin",
    title: "Maison familiale",
    price: 438000,
    surface: 145,
    pieces: 7,
    chambres: 5,
    tag: "Nouveau",
    description:
      "Maison familiale sur terrain clos et arboré, proche des commodités et établissements scolaires, garage et dépendance.",
  },
  {
    slug: "local-commercial-ducos",
    transaction: "vente",
    type: "Local commercial",
    commune: "Ducos",
    title: "Local commercial en zone d'activité",
    price: 265000,
    surface: 120,
    pieces: 2,
    chambres: 0,
    tag: "Emplacement",
    description:
      "Local commercial en zone d'activité passante, visibilité directe, parking privatif, idéal activité commerciale ou artisanale.",
  },
  {
    slug: "appartement-location-fort-de-france",
    transaction: "location",
    type: "Appartement",
    commune: "Fort-de-France",
    title: "Appartement lumineux",
    price: 1150,
    surface: 62,
    pieces: 3,
    chambres: 2,
    tag: "Disponible",
    description:
      "Appartement lumineux proche du centre-ville, résidence sécurisée, place de parking incluse.",
  },
  {
    slug: "bureau-le-lamentin",
    transaction: "location",
    type: "Bureau",
    commune: "Le Lamentin",
    title: "Plateau de bureaux",
    price: 1800,
    surface: 95,
    pieces: 4,
    chambres: 0,
    tag: "Zone d'affaires",
    description:
      "Plateau de bureaux modulable en zone d'affaires, climatisation centralisée, accès facile et places de stationnement.",
  },
];

export const communes = [...new Set(properties.map((p) => p.commune))].sort();
export const propertyTypes = [
  "Appartement",
  "Maison",
  "Villa",
  "Immeuble",
  "Local commercial",
  "Bureau",
  "Terrain",
];

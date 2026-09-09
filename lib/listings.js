import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { PROPERTY_TYPES } from "@/lib/property-types";

export { PROPERTY_TYPES };

/**
 * Source unique des annonces du site : la table `listings` de Supabase,
 * alimentee par l'ingestion Transactimo (repo lyatimmo-app).
 *
 * Seules les annonces status = 'published' sont exposees :
 *  - filtre applicatif .eq('status', 'published') ci-dessous ;
 *  - ET Row Level Security cote Supabase (policy `using (status = 'published')`).
 * Les annonces 'draft' et 'withdrawn' ne sont jamais renvoyees.
 *
 * Requiert NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
 * (Vercel > Project Settings > Environment Variables). La cle anon est publique
 * et sans risque : la RLS limite l'acces aux seules annonces publiees.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client = null;
function client() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      "[listings] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY absents : aucune annonce ne sera affichee."
    );
    return null;
  }
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  }
  return _client;
}

const SELECT =
  "slug,reference,transaction,type_bien,commune,localisation,code_postal,secteur,price,charges,depot_garantie," +
  "fees,fees_payer,surface,land_surface,floor,rooms,bedrooms,bathrooms,shower_rooms,furnished,title1,title2," +
  "description,virtual_tour_url,dpe_letter,dpe_value,ges_letter,ges_value,photos,updated_at,source_created_at";

function titleCase(s) {
  // Capitalise uniquement en debut de mot reel (debut de chaine, ou apres
  // espace / apostrophe / trait d'union). Le flag `u` + \p{L} evite que `\b`
  // traite une lettre accentuee comme une frontiere de mot ("trinite" ->
  // "TrinitE" avec l'ancienne version).
  return String(s || "")
    .toLowerCase()
    .replace(/(^|[\s'’-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

/** Le champ `description` du XML Transactimo contient du HTML (<br>, entités).
 *  On le ramène en texte avec de vrais retours à la ligne (affiché ensuite
 *  avec `whitespace-pre-line`). */
function htmlToText(s) {
  return String(s || "")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Types de biens "fonciers" : pas de pieces ni de chambres a afficher. */
const LAND_TYPES = /^(terrain|parking)$/i;

/** Ligne `listings` -> objet consomme par PropertyCard / la page detail. */
export function toCard(row) {
  const commune = titleCase(row.commune || row.localisation || "");
  const type = row.type_bien || "";
  const surface = Number(row.surface) || 0;
  const landSurface = Number(row.land_surface) || 0;
  const isLand = LAND_TYPES.test(type);

  // Titre : on respecte toujours le <titre1> fourni par Transactimo. A defaut,
  // on compose un libelle avec la surface (terrain pour un bien foncier,
  // habitable sinon) : "Terrain de 850 m2 a Schoelcher".
  const areaForTitle = isLand ? landSurface : surface;
  const fallbackTitle =
    [type, areaForTitle ? `de ${areaForTitle} m²` : null, commune ? `à ${commune}` : null]
      .filter(Boolean)
      .join(" ") || "Bien immobilier";

  return {
    slug: row.slug,
    reference: row.reference || "",
    transaction: row.transaction || "vente",
    type,
    commune,
    title: row.title1 || fallbackTitle,
    price: Number(row.price) || 0,
    surface,
    pieces: Number(row.rooms) || 0,
    chambres: Number(row.bedrooms) || 0,
    isLand,
    tag: row.transaction === "location" ? "Location" : "Vente",
    description: htmlToText(row.description),
    // champs additionnels (page detail)
    photos: Array.isArray(row.photos) ? row.photos : [],
    landSurface,
    fees: Number(row.fees) || 0,
    feesPayer: row.fees_payer || null,
    charges: Number(row.charges) || 0,
    furnished: row.furnished || null,
    dpeLetter: row.dpe_letter || null,
    dpeValue: row.dpe_value ?? null,
    gesLetter: row.ges_letter || null,
    gesValue: row.ges_value ?? null,
    virtualTourUrl: row.virtual_tour_url || null,
    codePostal: row.code_postal || "",
    secteur: row.secteur || "",
    accroche: String(row.title2 || "").trim() || null,
    floor: String(row.floor || "").trim() || null,
    bathrooms: Number(row.bathrooms) || 0,
    showerRooms: Number(row.shower_rooms) || 0,
    depotGarantie: Number(row.depot_garantie) || 0,
  };
}

export async function getPublishedListings() {
  const sb = client();
  if (!sb) return { rows: [] };
  const { data, error } = await sb
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[listings] getPublishedListings:", error.message);
    return { rows: [], error: true };
  }
  return { rows: (data || []).map(toCard) };
}

export async function getSelection(n = 3) {
  const sb = client();
  if (!sb) return { rows: [] };
  const { data, error } = await sb
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(n);
  if (error) {
    console.error("[listings] getSelection:", error.message);
    return { rows: [], error: true };
  }
  return { rows: (data || []).map(toCard) };
}

// `cache()` : la fiche appelle getListingBySlug dans generateMetadata ET dans le
// composant page (meme requete). React memoise l'appel pour la duree du rendu
// -> une seule requete Supabase par requete HTTP.
export const getListingBySlug = cache(async (slug) => {
  const sb = client();
  if (!sb) return null;
  const { data, error } = await sb
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("[listings] getListingBySlug:", error.message);
    return null;
  }
  return data ? toCard(data) : null;
});

/**
 * Slugs des annonces publiees (pour /sitemap.xml). RLS + filtre applicatif
 * garantissent que seules les annonces reellement accessibles publiquement
 * sont renvoyees. Aucune donnee metier lue au-dela de slug + date.
 */
export async function getPublishedListingSlugs() {
  const sb = client();
  if (!sb) return [];
  const { data, error } = await sb
    .from("listings")
    .select("slug,updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[listings] getPublishedListingSlugs:", error.message);
    return [];
  }
  return (data || []).filter((r) => r.slug);
}

/**
 * Données complémentaires d'un bien pour la page détail : identité + RSAC de
 * l'agent commercial (mention légale), obtenues par rapprochement avec
 * public.profiles dans la vue v_listings_public.
 *
 * L'email de contact du bien N'EST PAS lu ici (donnée privée, jamais côté
 * client). Le CC de l'email transactionnel est résolu côté serveur dans
 * app/api/contact/route.js.
 *
 * Tant que la migration `listings_v3.sql` n'est pas appliquée (vue absente),
 * la requête échoue silencieusement -> {} : la mention légale reste générique.
 */
export async function getListingExtras(slug) {
  const sb = client();
  if (!sb) return {};
  try {
    const { data, error } = await sb
      .from("v_listings_public")
      .select("agent_prenom,agent_nom,agent_rsac_numero,agent_rsac_lieu")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return {};
    return {
      agentPrenom: data.agent_prenom || null,
      agentNom: data.agent_nom || null,
      agentRsacNumero: data.agent_rsac_numero || null,
      agentRsacLieu: data.agent_rsac_lieu || null,
    };
  } catch {
    return {};
  }
}

export function filterOptions(rows) {
  const communes = [...new Set(rows.map((r) => r.commune).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "fr")
  );
  return { communes, types: PROPERTY_TYPES };
}

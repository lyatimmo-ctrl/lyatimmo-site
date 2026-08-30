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
  "slug,reference,transaction,type_bien,commune,localisation,code_postal,secteur,price,charges,fees,fees_payer," +
  "surface,land_surface,floor,rooms,bedrooms,bathrooms,shower_rooms,furnished,title1,title2,description," +
  "virtual_tour_url,dpe_letter,dpe_value,ges_letter,ges_value,photos,updated_at,source_created_at";

function titleCase(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\b([a-zà-ÿ])/g, (m) => m.toUpperCase());
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

/** Ligne `listings` -> objet consomme par PropertyCard / la page detail. */
export function toCard(row) {
  const commune = titleCase(row.commune || row.localisation || "");
  return {
    slug: row.slug,
    reference: row.reference || "",
    transaction: row.transaction || "vente",
    type: row.type_bien || "",
    commune,
    title: row.title1 || [row.type_bien, commune && `à ${commune}`].filter(Boolean).join(" ") || "Bien immobilier",
    price: Number(row.price) || 0,
    surface: Number(row.surface) || 0,
    pieces: Number(row.rooms) || 0,
    chambres: Number(row.bedrooms) || 0,
    tag: row.transaction === "location" ? "Location" : "Vente",
    description: htmlToText(row.description),
    // champs additionnels (page detail)
    photos: Array.isArray(row.photos) ? row.photos : [],
    landSurface: Number(row.land_surface) || 0,
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

export async function getListingBySlug(slug) {
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
}

/**
 * Données complémentaires d'un bien pour la page détail :
 *  - email_contact : email de contact Transactimo (CC du formulaire) ;
 *  - agent_* : identité + RSAC de l'agent commercial (mention légale), obtenus
 *    par rapprochement avec public.profiles dans la vue v_listings_public.
 *
 * Tant que la migration `listings_v3.sql` n'est pas appliquée (colonne
 * email_contact + vue), la requête échoue silencieusement -> {} :
 * le formulaire part alors sans CC et la mention légale est générique.
 */
export async function getListingExtras(slug) {
  const sb = client();
  if (!sb) return {};
  try {
    const { data, error } = await sb
      .from("v_listings_public")
      .select("email_contact,agent_prenom,agent_nom,agent_rsac_numero,agent_rsac_lieu")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return {};
    return {
      emailContact: data.email_contact || null,
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

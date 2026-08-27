import { createClient } from "@supabase/supabase-js";
import { properties as STATIC, propertyTypes as STATIC_TYPES } from "@/data/properties";

/**
 * Source des annonces du site.
 *
 *  - Si NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY sont definis : lecture de la table
 *    `listings` de Supabase (RLS -> uniquement les lignes status = 'published',
 *    alimentees par l'ingestion Transactimo du repo lyatimmo-app).
 *  - Sinon : repli sur la liste statique data/properties.js (dev / preview).
 *
 * La cle anon est publique et sans risque : elle ne donne acces qu'aux annonces
 * publiees, via la Row Level Security.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const LIVE = Boolean(URL && KEY);

let _client = null;
function client() {
  if (!_client) _client = createClient(URL, KEY, { auth: { persistSession: false } });
  return _client;
}

const SELECT =
  "slug,transaction,type_bien,commune,localisation,code_postal,secteur,price,charges,fees,fees_payer," +
  "surface,land_surface,floor,rooms,bedrooms,bathrooms,shower_rooms,furnished,title1,title2,description," +
  "virtual_tour_url,dpe_letter,dpe_value,ges_letter,ges_value,photos,updated_at,source_created_at";

function titleCase(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\b([a-zà-ÿ])/g, (m) => m.toUpperCase());
}

/** Ligne `listings` -> objet consomme par PropertyCard / la page detail. */
export function toCard(row) {
  const commune = titleCase(row.commune || row.localisation || "");
  return {
    slug: row.slug,
    transaction: row.transaction || "vente",
    type: row.type_bien || "",
    commune,
    title: row.title1 || [row.type_bien, commune && `à ${commune}`].filter(Boolean).join(" ") || "Bien immobilier",
    price: Number(row.price) || 0,
    surface: Number(row.surface) || 0,
    pieces: Number(row.rooms) || 0,
    chambres: Number(row.bedrooms) || 0,
    tag: row.transaction === "location" ? "Location" : "Vente",
    description: row.description || "",
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
  if (!LIVE) return { rows: STATIC, live: false };
  const { data, error } = await client()
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[listings] getPublishedListings:", error.message);
    return { rows: [], live: true, error: true };
  }
  return { rows: (data || []).map(toCard), live: true };
}

export async function getSelection(n = 3) {
  if (!LIVE) return { rows: [], live: false };
  const { data, error } = await client()
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(n);
  if (error) {
    console.error("[listings] getSelection:", error.message);
    return { rows: [], live: true, error: true };
  }
  return { rows: (data || []).map(toCard), live: true };
}

export async function getListingBySlug(slug) {
  if (!LIVE) return STATIC.find((p) => p.slug === slug) || null;
  const { data, error } = await client()
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

export function filterOptions(rows) {
  const communes = [...new Set(rows.map((r) => r.commune).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "fr")
  );
  return { communes, types: STATIC_TYPES };
}

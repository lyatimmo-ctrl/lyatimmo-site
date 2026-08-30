import { createClient } from "@supabase/supabase-js";

/**
 * Accès aux données des MINI-SITES CONSEILLERS.
 *
 * Source : uniquement les vues publiques `v_minisite_*` de Supabase + des RPC
 * `SECURITY DEFINER` (décision #12), lues avec la clé ANON (publique, sans
 * risque : chaque vue ne renvoie que les mini-sites `statut='publie'` et les
 * profils `actif`, et n'expose AUCUNE donnée financière — cf. §15 du plan).
 *
 * Aucune requête sur une table brute. Aucun `service_role` ici.
 *
 * Séparation des sources (décision #4) :
 *   v_minisite_biens   -> listings + transactimo_agent_map (biens commercialisés)
 *   v_minisite_ventes  -> transactions acte_signe (« transactions accompagnées »)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client = null;
function client() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[minisites] NEXT_PUBLIC_SUPABASE_URL / ANON_KEY absents.");
    return null;
  }
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  }
  return _client;
}

function normSlug(s) {
  return String(s || "").trim().toLowerCase();
}

/** Profil public d'un mini-site publié, ou null. */
export async function getMinisite(slug) {
  const sb = client();
  if (!sb) return null;
  const { data, error } = await sb
    .from("v_minisite_public")
    .select("*")
    .eq("slug", normSlug(slug))
    .maybeSingle();
  if (error) {
    console.error("[minisites] getMinisite:", error.message);
    return null;
  }
  return data || null;
}

/**
 * Statut public d'un slug quand `getMinisite` renvoie null :
 * 'publie' | 'suspendu' | 'parti' | 'inconnu'.
 */
export async function getMinisiteStatus(slug) {
  const sb = client();
  if (!sb) return "inconnu";
  const { data, error } = await sb.rpc("minisite_public_status", { p_slug: normSlug(slug) });
  if (error) {
    console.error("[minisites] getMinisiteStatus:", error.message);
    return "inconnu";
  }
  return data || "inconnu";
}

export async function getMinisiteBiens(slug) {
  const sb = client();
  if (!sb) return [];
  const { data, error } = await sb
    .from("v_minisite_biens")
    .select("*")
    .eq("conseiller_slug", normSlug(slug))
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[minisites] getMinisiteBiens:", error.message);
    return [];
  }
  return data || [];
}

export async function getMinisiteVentes(slug) {
  const sb = client();
  if (!sb) return [];
  const { data, error } = await sb
    .from("v_minisite_ventes")
    .select("*")
    .eq("conseiller_slug", normSlug(slug))
    .order("annee_acte", { ascending: false })
    .order("mois_acte", { ascending: false })
    .limit(24);
  if (error) {
    console.error("[minisites] getMinisiteVentes:", error.message);
    return [];
  }
  return data || [];
}

export async function getMinisiteTemoignages(slug) {
  const sb = client();
  if (!sb) return [];
  const { data, error } = await sb
    .from("v_minisite_temoignages")
    .select("*")
    .eq("conseiller_slug", normSlug(slug))
    .order("date_publication", { ascending: false });
  if (error) {
    console.error("[minisites] getMinisiteTemoignages:", error.message);
    return [];
  }
  return data || [];
}

export async function getMinisiteBadges(slug) {
  const sb = client();
  if (!sb) return [];
  const { data, error } = await sb
    .from("v_minisite_badges")
    .select("*")
    .eq("conseiller_slug", normSlug(slug))
    .order("ordre", { ascending: true });
  if (error) {
    console.error("[minisites] getMinisiteBadges:", error.message);
    return [];
  }
  return data || [];
}

/** Grille /conseillers (mini-sites publiés). */
export async function listPublishedMinisites() {
  const sb = client();
  if (!sb) return [];
  const { data, error } = await sb
    .from("v_minisite_index")
    .select("*")
    .order("nom", { ascending: true });
  if (error) {
    console.error("[minisites] listPublishedMinisites:", error.message);
    return [];
  }
  return data || [];
}

/** Aperçu (jeton signé côté app, #27) — renvoie un bundle brouillons inclus. */
export async function resolvePreview(token) {
  const sb = client();
  if (!sb || !token) return null;
  const { data, error } = await sb.rpc("minisite_preview_resolve", { p_token: String(token) });
  if (error || !data || data.ok === false) return null;
  return data;
}

/** Confirmation double opt-in d'un témoignage. */
export async function verifyTemoignage(token) {
  const sb = client();
  if (!sb || !token) return false;
  const { data, error } = await sb.rpc("verifier_temoignage", { p_token: String(token) });
  if (error) {
    console.error("[minisites] verifyTemoignage:", error.message);
    return false;
  }
  return Boolean(data?.ok);
}

/** Assemble tout ce qu'il faut pour rendre une page vitrine. */
export async function getMinisiteBundle(slug) {
  const s = normSlug(slug);
  const [profil, biens, ventes, temoignages, badges] = await Promise.all([
    getMinisite(s),
    getMinisiteBiens(s),
    getMinisiteVentes(s),
    getMinisiteTemoignages(s),
    getMinisiteBadges(s),
  ]);
  return { profil, biens, ventes, temoignages, badges };
}

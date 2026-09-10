import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

/**
 * Conseiller responsable d'une annonce (bloc « conseiller responsable », E4).
 *
 * Source UNIQUE : la vue publique `v_annonce_conseiller` (Supabase), lue avec
 * la clé ANON. La vue s'exécute côté propriétaire (`security_invoker = off`) et
 * filtre déjà, côté base :
 *   - `listings.status = 'published'` ;
 *   - profil `actif` ET `est_conseiller` ;
 *   - `telephone_publication` ET `email_publication` renseignés.
 * Elle n'expose ni RSAC, ni statut réseau, ni donnée interne, et ne dépend PAS
 * du statut du mini-site. Aucun rapprochement CRM. Aucun `service_role`.
 *
 * Pas de fallback : si la vue ne renvoie rien -> `null` -> aucun bloc rendu.
 *
 * Cache : `cache()` mémoïse l'appel pour la durée d'un rendu (dé-duplication).
 * La fraîcheur est portée par `export const revalidate = 300` de la page
 * `/biens/[slug]` (<= 15 min, conforme E4.4). Aucun cache de données séparé.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client = null;
function client() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[advisor] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY absents.");
    return null;
  }
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  }
  return _client;
}

export const getListingAdvisor = cache(async (slug) => {
  const sb = client();
  if (!sb || !slug) return null;
  const { data, error } = await sb
    .from("v_annonce_conseiller")
    .select(
      "prenom,nom,photo_url,telephone_publication,email_publication,minisite_slug,minisite_publie,lien_annonces_actif"
    )
    .eq("listing_slug", String(slug))
    .maybeSingle();
  if (error) {
    console.error("[advisor] getListingAdvisor:", error.message);
    return null;
  }
  if (!data) return null;
  return {
    prenom: data.prenom || "",
    nom: data.nom || "",
    photoUrl: data.photo_url || null,
    telephone: data.telephone_publication || null,
    email: data.email_publication || null,
    minisiteSlug: data.minisite_slug || null,
    minisitePublie: data.minisite_publie === true,
    lienAnnoncesActif: data.lien_annonces_actif === true,
  };
});

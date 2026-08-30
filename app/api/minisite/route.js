import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

/* ============================================================================
   API du formulaire des MINI-SITES CONSEILLERS.

   Décision #12 / #12b :
     - clé ANON uniquement (aucun service_role) ;
     - toute écriture passe par une RPC SECURITY DEFINER à surface minimale
       (creer_prospect_minisite / soumettre_temoignage) ;
     - honeypot + limitation de débit en mémoire (repris de /api/contact) ;
     - la notification e-mail est envoyée côté Supabase (Database Webhook ->
       Edge Function minisite-notify), pas ici.

   Actions (POST JSON) :
     { action: "prospect",   slug, prenom, nom, telephone, email?, commune?,
                             type_projet?, message?, site_web? }
     { action: "temoignage", slug, contenu, auteur_nom_public?, auteur_email,
                             auteur_nom_complet?, commune?, note?, relation?,
                             consent, consent_text?, site_web? }
   ========================================================================== */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const RL_WINDOW_MS = 10 * 60 * 1000;
const RL_MAX = 6;
const rlHits = new Map();

function isRateLimited(request) {
  const xff = request.headers.get("x-forwarded-for") || "";
  const ip = (xff.split(",")[0] || "").trim() || "unknown";
  const key = crypto.createHash("sha256").update(ip).digest("hex");
  const now = Date.now();
  const hits = (rlHits.get(key) || []).filter((t) => now - t < RL_WINDOW_MS);
  if (hits.length >= RL_MAX) {
    rlHits.set(key, hits);
    return { limited: true, hash: key };
  }
  hits.push(now);
  rlHits.set(key, hits);
  if (rlHits.size > 5000) {
    for (const [k, v] of rlHits) {
      const keep = v.filter((t) => now - t < RL_WINDOW_MS);
      if (keep.length) rlHits.set(k, keep);
      else rlHits.delete(k);
    }
  }
  return { limited: false, hash: key };
}

function clean(v) {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sbClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
}

export async function POST(request) {
  const rl = isRateLimited(request);
  if (rl.limited) return Response.json({ error: "rate_limited" }, { status: 429 });

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot : accusé neutre, rien n'est transmis.
  if (clean(data?.site_web)) return Response.json({ ok: true });

  const sb = sbClient();
  if (!sb) {
    console.error("[minisite] NEXT_PUBLIC_SUPABASE_URL / ANON_KEY manquants.");
    return Response.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const action = clean(data?.action);
  const slug = clean(data?.slug).toLowerCase();
  if (!slug) return Response.json({ error: "missing_slug" }, { status: 400 });

  // ----------------------------------------------------------------- PROSPECT
  if (action === "prospect") {
    const prenom = clean(data?.prenom);
    const nom = clean(data?.nom);
    const telephone = clean(data?.telephone);
    const email = clean(data?.email);
    if (!prenom && !nom) return Response.json({ error: "missing_name" }, { status: 400 });
    if (telephone.replace(/\D/g, "").length < 6) {
      return Response.json({ error: "missing_phone" }, { status: 400 });
    }
    if (email && !EMAIL_RE.test(email)) {
      return Response.json({ error: "invalid_email" }, { status: 400 });
    }

    const { data: res, error } = await sb.rpc("creer_prospect_minisite", {
      p_slug: slug,
      p_payload: {
        prenom,
        nom,
        telephone,
        email,
        commune: clean(data?.commune),
        type_projet: clean(data?.type_projet),
        message: clean(data?.message).slice(0, 4000),
        site_web: "",
      },
    });
    if (error) {
      console.error("[minisite] creer_prospect_minisite:", error.message);
      return Response.json({ error: "rpc_failed" }, { status: 502 });
    }
    return Response.json({ ok: Boolean(res?.ok) });
  }

  // --------------------------------------------------------------- TEMOIGNAGE
  if (action === "temoignage") {
    const contenu = clean(data?.contenu);
    const auteurEmail = clean(data?.auteur_email);
    if (contenu.length < 10 || contenu.length > 4000) {
      return Response.json({ error: "invalid_content" }, { status: 400 });
    }
    if (!EMAIL_RE.test(auteurEmail)) {
      return Response.json({ error: "invalid_email" }, { status: 400 });
    }
    if (data?.consent !== true && clean(data?.consent) !== "true") {
      return Response.json({ error: "missing_consent" }, { status: 400 });
    }
    const note = Number(data?.note);

    const { data: res, error } = await sb.rpc("soumettre_temoignage", {
      p_slug: slug,
      p_payload: {
        contenu,
        titre: clean(data?.titre).slice(0, 160),
        auteur_nom_public: clean(data?.auteur_nom_public).slice(0, 120),
        auteur_nom_complet: clean(data?.auteur_nom_complet).slice(0, 200),
        auteur_email: auteurEmail,
        commune: clean(data?.commune).slice(0, 120),
        note: Number.isInteger(note) && note >= 1 && note <= 5 ? note : null,
        relation: clean(data?.relation),
        consent: true,
        consent_text: clean(data?.consent_text).slice(0, 2000),
        ip_hash: rl.hash,
        site_web: "",
      },
    });
    if (error) {
      console.error("[minisite] soumettre_temoignage:", error.message);
      return Response.json({ error: "rpc_failed" }, { status: 502 });
    }
    return Response.json({ ok: Boolean(res?.ok), verify_required: Boolean(res?.verify_required) });
  }

  return Response.json({ error: "unknown_action" }, { status: 400 });
}

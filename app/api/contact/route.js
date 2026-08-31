import crypto from "node:crypto";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const CONTACT_TO = "contact@lyatimmo.com";
const CONTACT_FROM = "LYAT IMMO - Site <contact@lyatimmo.com>";

/* ─── Limitation de débit — en mémoire, sans stockage ni prestataire externe ───
   Best-effort : l'état vit dans l'instance serverless courante (réinitialisé au
   cold start, non partagé entre instances). Suffisant pour freiner un flood
   depuis une même origine. L'IP n'est ni journalisée ni conservée : seule une
   empreinte SHA-256 sert de clé, purgée après la fenêtre. */
const RL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RL_MAX = 5; // envois autorisés par fenêtre et par origine
const rlHits = new Map();

function isRateLimited(request) {
  const xff = request.headers.get("x-forwarded-for") || "";
  const ip = (xff.split(",")[0] || "").trim() || "unknown";
  const key = crypto.createHash("sha256").update(ip).digest("hex");
  const now = Date.now();
  const hits = (rlHits.get(key) || []).filter((t) => now - t < RL_WINDOW_MS);
  if (hits.length >= RL_MAX) {
    rlHits.set(key, hits);
    return true;
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
  return false;
}

const MOTIF_LABEL = {
  vente: "Projet de vente",
  estimation: "Estimation",
  expertise: "Expertise immobilière",
  reseau: "Rejoindre LYAT IMMO",
  autre: "Autre demande",
  bien: "Demande sur un bien",
};

// Champs obligatoires côté serveur, par motif (miroir de la validation client).
// "reseau" inclut désormais "prenom" : prénom et nom sont deux champs
// distincts et obligatoires pour ce motif (décision Miguel — pas de champ
// unique, pas de découpage automatique).
const REQUIRED_BY_MOTIF = {
  vente: ["typeBien", "commune"],
  estimation: ["typeBien", "commune"],
  expertise: ["typeBien", "commune", "contexte"],
  reseau: ["prenom", "situation", "experience", "secteur"],
  autre: [],
  bien: [],
};

// Motif "bien" : demande de rappel depuis une fiche annonce. Pas d'email
// visiteur (rappel telephonique), donc l'email n'est pas exige.
const EMAIL_OPTIONAL_MOTIFS = ["bien"];

const CONSENT_MOTIFS = ["vente", "estimation", "expertise", "reseau"];
const CONSENT_TEXT_FALLBACK =
  "J'accepte que LYAT IMMO utilise mes coordonnées pour me recontacter ultérieurement au sujet de ses services immobiliers et de mon projet, notamment par téléphone, e-mail ou SMS.";
const CONSENT_TEXT_RESEAU_FALLBACK =
  "J'accepte que LYAT IMMO utilise les informations transmises pour traiter ma demande d'intégration / de recrutement au sein du réseau LYAT IMMO, notamment par téléphone, e-mail ou SMS. Voir notre Politique de confidentialité (lyatimmo.com/confidentialite).";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v) {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

/* CC de l'agent du bien — résolu CÔTÉ SERVEUR uniquement, jamais transmis par
   le client. Lecture de la table PRIVÉE public.listing_contact_emails avec la
   service_role key (variable d'env serveur, non préfixée NEXT_PUBLIC_).
   Absente ou table vide -> pas de CC (dégradation silencieuse). */
async function lookupAgentCc(reference) {
  const ref = clean(reference);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!ref || !url || !key) return null;
  try {
    const admin = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await admin
      .from("listing_contact_emails")
      .select("email_contact")
      .eq("reference", ref)
      .maybeSingle();
    if (error || !data) return null;
    const email = clean(data.email_contact);
    return EMAIL_RE.test(email) ? email : null;
  } catch (e) {
    console.error("[contact] lookupAgentCc:", e?.message || e);
    return null;
  }
}

/* Candidature réseau -> module Recrutement (public.candidats), service_role,
   même modèle que lookupAgentCc ci-dessus. BEST-EFFORT et volontairement
   isolé : si Supabase est indisponible ou mal configuré, l'email de
   notification (canal existant, plus ancien) part quand même — cette
   écriture ne doit jamais faire échouer la soumission du formulaire.
   Aucune écriture anonyme directe en base ailleurs que via cette route
   serveur (service_role) : la table candidats n'accorde rien à `anon`. */
async function insertCandidatureReseau({
  prenom, nom, email, tel, secteur, experience, situation, demande, message,
  consentGiven, consentTextValue, consentContextValue,
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[contact] insertCandidatureReseau: variables Supabase manquantes.");
    return;
  }
  try {
    const admin = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await admin
      .from("candidats")
      .insert({
        prenom,
        nom,
        email,
        telephone: tel,
        localisation: secteur || null,
        experience_immo: experience || null,
        situation_actuelle: situation || null,
        demande_initiale: demande || null,
        message: message || null,
        source: "site_lyat_nous_rejoindre",
        consentement_rgpd_at: consentGiven ? new Date().toISOString() : null,
        consentement_rgpd_texte: consentGiven ? consentTextValue : null,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[contact] insertCandidatureReseau insert:", error.message);
      return;
    }
    const { error: auditErr } = await admin.from("audit_log").insert({
      acteur_id: null, // action système/anonyme — recrutement_v1_schema.sql §0
      action: "candidature_recue",
      cible_type: "candidat",
      cible_id: data.id,
      metadata: { source: "site_lyat_nous_rejoindre" },
    });
    if (auditErr) console.error("[contact] insertCandidatureReseau audit_log:", auditErr.message);
  } catch (e) {
    console.error("[contact] insertCandidatureReseau exception:", e?.message || e);
  }
}

export async function POST(request) {
  if (isRateLimited(request)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot : champ invisible pour les humains. S'il est rempli, la soumission
  // est automatisée → accusé de réception silencieux, aucun e-mail n'est envoyé.
  if (clean(data?.site_web)) {
    return Response.json({ ok: true, id: null });
  }

  const motif = clean(data?.motif);
  const nom = clean(data?.nom);
  const prenom = clean(data?.prenom);
  const email = clean(data?.email);
  const tel = clean(data?.tel);
  const message = clean(data?.message);

  if (!MOTIF_LABEL[motif]) {
    return Response.json({ error: "invalid_motif" }, { status: 400 });
  }
  const emailRequired = !EMAIL_OPTIONAL_MOTIFS.includes(motif);
  if (!nom || !tel || (emailRequired && !email)) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }
  for (const field of REQUIRED_BY_MOTIF[motif]) {
    if (!clean(data?.[field])) {
      return Response.json({ error: "missing_fields", field }, { status: 400 });
    }
  }
  if (motif === "autre" && !message) {
    return Response.json({ error: "missing_fields", field: "message" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY manquante dans l'environnement.");
    return Response.json({ error: "server_misconfigured" }, { status: 500 });
  }

  // Lignes propres au motif — aucune ligne vide.
  const L = (label, value, suffix = "") => {
    const v = clean(value);
    return v ? `${label} : ${v}${suffix}` : null;
  };
  let details = [];
  if (motif === "vente") {
    details = [
      L("Type de bien", data?.typeBien),
      L("Commune / secteur", data?.commune),
      L("Projet", data?.projet),
      L("Échéance", data?.echeance),
    ];
  } else if (motif === "estimation") {
    details = [
      L("Type de bien", data?.typeBien),
      L("Commune / secteur", data?.commune),
      L("Projet", data?.projet),
    ];
  } else if (motif === "expertise") {
    details = [
      L("Type de bien", data?.typeBien),
      L("Commune / secteur", data?.commune),
      L("Contexte", data?.contexte),
    ];
  } else if (motif === "reseau") {
    details = [
      L("Prénom", prenom),
      L("Situation actuelle", data?.situation),
      L("Expérience", data?.experience),
      L("Secteur", data?.secteur),
      L("Demande", data?.demande),
    ];
  } else if (motif === "bien") {
    details = [
      L("Référence du bien", data?.propertyRef),
      L("Lien du bien", data?.propertyUrl),
    ];
  }
  details = details.filter(Boolean);

  // Motif "bien" : l'agent du bien est mis en copie s'il est connu. L'email est
  // résolu ICI, côté serveur, à partir de la seule référence du bien — il n'est
  // jamais fourni ni exposé au client.
  const propertyAgentEmail =
    motif === "bien" ? await lookupAgentCc(data?.propertyRef) : null;

  // Consentement à une sollicitation commerciale ultérieure, ou — pour
  // "reseau" — au traitement de la demande d'intégration/recrutement.
  const consentGiven =
    CONSENT_MOTIFS.includes(motif) && clean(data?.consentCommercial) === "oui";
  const fallbackConsentText = motif === "reseau" ? CONSENT_TEXT_RESEAU_FALLBACK : CONSENT_TEXT_FALLBACK;
  const consentTextValue = clean(data?.consentText) || fallbackConsentText;
  const consentContextValue =
    clean(data?.consentContext) || `${MOTIF_LABEL[motif]} - formulaire de contact, lyatimmo.com`;
  // "reseau" n'est pas une sollicitation commerciale (demande d'intégration /
  // recrutement) : libellé sans "commerciale". Les autres motifs conservent
  // le libellé d'origine.
  const consentLabel =
    motif === "reseau"
      ? "Consentement à une sollicitation ultérieure"
      : "Consentement à une sollicitation commerciale ultérieure";
  const consentBlock = [
    `${consentLabel} : ${consentGiven ? "OUI" : "NON"}`,
  ];
  if (consentGiven) {
    consentBlock.push(`  - Date/heure du consentement : ${new Date().toISOString()}`);
    consentBlock.push(`  - Texte présenté : "${consentTextValue}"`);
    consentBlock.push(`  - Contexte de collecte : ${consentContextValue}`);
  }

  // Candidature réseau -> module Recrutement. Best-effort, en parallèle du
  // canal email existant qui n'est jamais bloqué par cet ajout (cf.
  // insertCandidatureReseau ci-dessus).
  if (motif === "reseau") {
    await insertCandidatureReseau({
      prenom, nom, email, tel,
      secteur: data?.secteur, experience: data?.experience, situation: data?.situation,
      demande: data?.demande, message,
      consentGiven, consentTextValue, consentContextValue,
    });
  }

  const nomAffiche = motif === "reseau" && prenom ? `${prenom} ${nom}` : nom;

  const text = [
    "Nouvelle demande LYAT IMMO",
    "",
    `Motif : ${MOTIF_LABEL[motif]}`,
    `Nom : ${nomAffiche}`,
    ...(email ? [`Email : ${email}`] : []),
    `Téléphone : ${tel}`,
    ...(details.length ? ["", ...details] : []),
    ...(message ? ["", `Message : ${message}`] : []),
    ...(motif === "bien" ? ["", "Demande envoyée depuis la fiche du bien sur lyatimmo.com."] : []),
    "",
    ...consentBlock,
  ].join("\n");

  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject =
    motif === "bien"
      ? `LYAT IMMO - Demande sur le bien${clean(data?.propertyRef) ? ` ${clean(data?.propertyRef)}` : ""} - ${nomAffiche}`
      : `LYAT IMMO - ${MOTIF_LABEL[motif]} - ${nomAffiche}`;

  try {
    const result = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      ...(propertyAgentEmail ? { cc: [propertyAgentEmail] } : {}),
      ...(email ? { replyTo: email } : {}),
      subject,
      text,
    });

    if (result.error) {
      console.error("[contact] Erreur Resend :", result.error);
      return Response.json({ error: "send_failed" }, { status: 502 });
    }

    return Response.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("[contact] Exception Resend :", err);
    return Response.json({ error: "send_failed" }, { status: 500 });
  }
}

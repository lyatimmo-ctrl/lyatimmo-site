import crypto from "node:crypto";
import { Resend } from "resend";

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
};

// Champs obligatoires côté serveur, par motif (miroir de la validation client).
const REQUIRED_BY_MOTIF = {
  vente: ["typeBien", "commune"],
  estimation: ["typeBien", "commune"],
  expertise: ["typeBien", "commune", "contexte"],
  reseau: ["situation", "experience", "secteur"],
  autre: [],
};

const CONSENT_MOTIFS = ["vente", "estimation", "expertise"];
const CONSENT_TEXT_FALLBACK =
  "J'accepte que LYAT IMMO utilise mes coordonnées pour me recontacter ultérieurement au sujet de ses services immobiliers et de mon projet, notamment par téléphone, e-mail ou SMS.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v) {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
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
  const email = clean(data?.email);
  const tel = clean(data?.tel);
  const message = clean(data?.message);

  if (!MOTIF_LABEL[motif]) {
    return Response.json({ error: "invalid_motif" }, { status: 400 });
  }
  if (!nom || !email || !tel) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
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
  const isTerrain = clean(data?.typeBien) === "Terrain";

  let details = [];
  if (motif === "vente") {
    details = [
      L("Type de bien", data?.typeBien),
      L("Commune / secteur", data?.commune),
      L("Adresse", data?.adresse),
      L("Surface approximative", data?.surface, " m²"),
      isTerrain ? null : L("Nombre de pièces", data?.pieces),
      L("Projet", data?.projet),
      L("Échéance", data?.echeance),
    ];
  } else if (motif === "estimation") {
    details = [
      L("Type de bien", data?.typeBien),
      L("Commune / secteur", data?.commune),
      L("Adresse", data?.adresse),
      L("Surface approximative", data?.surface, " m²"),
      isTerrain ? null : L("Nombre de pièces", data?.pieces),
      L("Projet", data?.projet),
    ];
  } else if (motif === "expertise") {
    details = [
      L("Type de bien", data?.typeBien),
      L("Commune / secteur", data?.commune),
      L("Adresse", data?.adresse),
      L("Contexte", data?.contexte),
      L("Délai", data?.delai),
    ];
  } else if (motif === "reseau") {
    details = [
      L("Situation actuelle", data?.situation),
      L("Expérience", data?.experience),
      L("Secteur", data?.secteur),
      L("Demande", data?.demande),
    ];
  }
  details = details.filter(Boolean);

  // Consentement à une sollicitation commerciale ultérieure (particuliers uniquement).
  const consentGiven =
    CONSENT_MOTIFS.includes(motif) && clean(data?.consentCommercial) === "oui";
  const consentBlock = [
    `Consentement à une sollicitation commerciale ultérieure : ${consentGiven ? "OUI" : "NON"}`,
  ];
  if (consentGiven) {
    consentBlock.push(`  - Date/heure du consentement : ${new Date().toISOString()}`);
    consentBlock.push(`  - Texte présenté : "${clean(data?.consentText) || CONSENT_TEXT_FALLBACK}"`);
    consentBlock.push(
      `  - Contexte de collecte : ${clean(data?.consentContext) || `${MOTIF_LABEL[motif]} - formulaire de contact, lyatimmo.com`}`
    );
  }

  const text = [
    "Nouvelle demande LYAT IMMO",
    "",
    `Motif : ${MOTIF_LABEL[motif]}`,
    `Nom : ${nom}`,
    `Email : ${email}`,
    `Téléphone : ${tel}`,
    ...(details.length ? ["", ...details] : []),
    ...(message ? ["", `Message : ${message}`] : []),
    "",
    ...consentBlock,
  ].join("\n");

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `LYAT IMMO - ${MOTIF_LABEL[motif]} - ${nom}`,
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

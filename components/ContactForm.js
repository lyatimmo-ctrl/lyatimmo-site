"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/* ─────────────────────────────────────────────────────────────
   FORMULAIRE DE CONTACT UNIQUE — LYAT IMMO
   Un seul composant pour tout le site. Chaque CTA transmet son
   contexte via le query param ?motif= (et ?demande=infos pour le
   parcours réseau). Les champs affichés s'adaptent au motif ;
   les valeurs devenues sans objet sont retirées de l'état et
   ne sont jamais envoyées.

   Motif "reseau" (candidature réseau / recrutement) : prénom et nom
   sont deux champs distincts et obligatoires (pas de champ unique,
   pas de découpage automatique — alimentent directement
   candidats.prenom / candidats.nom côté module Recrutement), et une
   case de consentement RGPD dédiée est proposée, non précochée.
   ───────────────────────────────────────────────────────────── */

const MOTIFS = [
  { value: "vente", label: "Projet de vente" },
  { value: "estimation", label: "Estimation" },
  { value: "expertise", label: "Expertise immobilière" },
  { value: "reseau", label: "Rejoindre LYAT IMMO" },
  { value: "autre", label: "Autre demande" },
];
const MOTIF_LABEL = Object.fromEntries(MOTIFS.map((m) => [m.value, m.label]));

const TYPES_BIEN = [
  "Appartement", "Maison", "Villa", "Immeuble",
  "Local commercial", "Bureau", "Terrain", "Autre",
];
const PROJET_VENTE = [
  "Je souhaite mettre mon bien en vente",
  "Mon bien est déjà en vente",
  "Je réfléchis encore à mon projet",
  "Je souhaite changer d'agence / de professionnel",
  "Autre",
];
const ECHEANCE = [
  "Dès que possible",
  "Dans les 3 prochains mois",
  "Dans les 6 prochains mois",
  "Plus tard",
  "Je ne sais pas encore",
];
const PROJET_ESTIMATION = [
  "Je souhaite connaître la valeur de mon bien",
  "J'envisage de vendre prochainement",
  "J'envisage de vendre mais je n'ai pas encore décidé",
  "Autre",
];
const CONTEXTE_EXPERTISE = [
  "Succession",
  "Divorce ou séparation",
  "Donation / partage",
  "Contentieux",
  "Expertise judiciaire",
  "Déclaration patrimoniale",
  "Acquisition / cession",
  "Autre",
];
const SITUATION_RESEAU = [
  "Conseiller immobilier / Agent commercial",
  "Agent immobilier / titulaire d'une carte professionnelle",
  "Professionnel de l'immobilier dans une autre fonction",
  "En reconversion professionnelle",
  "Autre",
];
const EXPERIENCE_RESEAU = [
  "Aucune expérience",
  "Moins d'un an",
  "1 à 3 ans",
  "3 à 5 ans",
  "Plus de 5 ans",
  "Plus de 10 ans",
];
const DEMANDE_RESEAU = [
  "Je souhaite en savoir davantage sur LYAT IMMO",
  "Je souhaite être recontacté",
  "Je souhaite comprendre le modèle de rémunération",
  "Je souhaite connaître les outils et services proposés",
  "Je souhaite échanger sur une éventuelle intégration",
  "Autre",
];

// Texte de consentement par motif — celui pour "reseau" décrit l'usage
// recrutement/intégration, distinct du consentement de sollicitation
// commerciale utilisé pour vente/estimation/expertise.
const CONSENT_TEXT_COMMERCIAL =
  "J'accepte que LYAT IMMO utilise mes coordonnées pour me recontacter ultérieurement au sujet de ses services immobiliers et de mon projet, notamment par téléphone, e-mail ou SMS.";
const CONSENT_TEXT_RESEAU =
  "J'accepte que LYAT IMMO utilise les informations transmises pour traiter ma demande d'intégration / de recrutement au sein du réseau LYAT IMMO, notamment par téléphone, e-mail ou SMS. Voir notre Politique de confidentialité (lyatimmo.com/confidentialite).";
const CONSENT_TEXT_BY_MOTIF = {
  vente: CONSENT_TEXT_COMMERCIAL,
  estimation: CONSENT_TEXT_COMMERCIAL,
  expertise: CONSENT_TEXT_COMMERCIAL,
  reseau: CONSENT_TEXT_RESEAU,
};
// Motifs pour lesquels la case de consentement est proposée.
const CONSENT_MOTIFS = ["vente", "estimation", "expertise", "reseau"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^\+?[0-9 .\-()]{6,}$/;

// Champs communs conservés lorsque le motif change. "prenom" n'y figure pas
// volontairement : c'est un champ propre au motif "reseau", il ne doit pas
// se propager si le visiteur change ensuite de motif.
const COMMON_KEYS = ["nom", "email", "tel", "message"];

const inputCls =
  "w-full border-b border-line bg-transparent py-2.5 text-[15px] focus:outline-none focus:border-gold";

function normalizeMotif(raw) {
  return MOTIF_LABEL[raw] ? raw : "";
}

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
      {children}
    </label>
  );
}

function ErrText({ id, children }) {
  return (
    <p id={id} className="text-red-600 text-[13px] mt-1">
      {children}
    </p>
  );
}

function TextField({ id, label, value, onChange, type = "text", required, optional, error, autoComplete, inputMode }) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {optional ? " (facultatif)" : ""}
      </Label>
      <input
        id={id}
        name={id}
        type={type}
        value={value || ""}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        min={type === "number" ? "0" : undefined}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={inputCls}
      />
      {error && <ErrText id={`${id}-err`}>{error}</ErrText>}
    </div>
  );
}

function SelectField({ id, label, value, onChange, options, required, error, placeholder = "Sélectionnez" }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        value={value || ""}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={inputCls}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <ErrText id={`${id}-err`}>{error}</ErrText>}
    </div>
  );
}

export default function ContactForm() {
  const params = useSearchParams();
  const initialMotif = normalizeMotif(params.get("motif"));
  const preselectDemande =
    initialMotif === "reseau" && params.get("demande") === "infos" ? DEMANDE_RESEAU[0] : "";

  const [values, setValues] = useState(() => ({
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    message: "",
    motif: initialMotif,
    demande: preselectDemande,
    parrainDeclare: "",
    consent: false,
  }));
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  // Honeypot anti-robot : hors de `values` pour ne pas interférer avec le
  // changement de motif. Un envoi avec ce champ rempli est rejeté silencieusement.
  const [honeypot, setHoneypot] = useState("");

  const motif = values.motif;
  const isReseau = motif === "reseau";
  const showConsent = CONSENT_MOTIFS.includes(motif);
  const showBienFields = motif === "vente" || motif === "estimation" || motif === "expertise";
  const messageRequired = motif === "autre";

  function set(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  function changeMotif(next) {
    setValues((v) => {
      const kept = { motif: next, consent: CONSENT_MOTIFS.includes(next) ? v.consent : false };
      for (const k of COMMON_KEYS) kept[k] = v[k];
      if (next === "reseau") kept.prenom = v.prenom || "";
      return kept; // tous les champs spécifiques à l'ancien motif sont retirés
    });
    setErrors({});
  }

  function validate() {
    const e = {};
    if (!values.nom.trim()) e.nom = isReseau ? "Merci d'indiquer votre nom." : "Merci d'indiquer votre nom et prénom.";
    if (isReseau && !(values.prenom || "").trim()) e.prenom = "Merci d'indiquer votre prénom.";
    if (!values.email.trim()) e.email = "Merci d'indiquer votre email.";
    else if (!EMAIL_RE.test(values.email.trim())) e.email = "Le format de l'email est invalide.";
    if (!values.tel.trim()) e.tel = "Merci d'indiquer un numéro de téléphone.";
    else if (!TEL_RE.test(values.tel.trim())) e.tel = "Le numéro de téléphone est invalide.";
    if (!motif) e.motif = "Merci de sélectionner votre demande.";

    if (motif === "vente" || motif === "estimation" || motif === "expertise") {
      if (!values.typeBien) e.typeBien = "Merci de sélectionner un type de bien.";
      if (!values.commune || !values.commune.trim()) e.commune = "Merci d'indiquer une commune ou un secteur.";
    }
    if (motif === "expertise" && !values.contexte) e.contexte = "Merci de préciser le contexte.";
    if (isReseau) {
      if (!values.situation) e.situation = "Merci de préciser votre situation.";
      if (!values.experience) e.experience = "Merci de préciser votre expérience.";
      if (!values.secteur || !values.secteur.trim()) e.secteur = "Merci d'indiquer votre secteur géographique.";
    }
    if (messageRequired && !values.message.trim()) e.message = "Merci de préciser votre demande.";
    return e;
  }

  function buildPayload() {
    const p = {
      motif,
      nom: values.nom.trim(),
      email: values.email.trim(),
      tel: values.tel.trim(),
      message: values.message.trim(),
    };
    if (isReseau) p.prenom = (values.prenom || "").trim();

    const pick = (keys) => {
      for (const k of keys) {
        const val = (values[k] ?? "").toString().trim();
        if (val) p[k] = val;
      }
    };
    if (motif === "vente") pick(["typeBien", "commune", "projet", "echeance"]);
    else if (motif === "estimation") pick(["typeBien", "commune", "projet"]);
    else if (motif === "expertise") pick(["typeBien", "commune", "contexte"]);
    else if (isReseau) pick(["situation", "experience", "secteur", "demande", "parrainDeclare"]);

    if (showConsent) {
      p.consentCommercial = values.consent ? "oui" : "non";
      if (values.consent) {
        p.consentText = CONSENT_TEXT_BY_MOTIF[motif] || CONSENT_TEXT_COMMERCIAL;
        p.consentContext = `${MOTIF_LABEL[motif]} - formulaire de contact, lyatimmo.com`;
      }
    }
    p.site_web = honeypot; // honeypot — doit rester vide
    return p;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (sending) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      const el = typeof document !== "undefined" && document.getElementById(first);
      if (el && el.focus) el.focus();
      return;
    }
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (res.status === 429) {
        setSendError(
          "Trop de demandes ont été envoyées depuis votre appareil. Merci de patienter quelques minutes avant de réessayer."
        );
        return;
      }
      if (!res.ok) throw new Error("send-failed");
      setSent(true);
    } catch {
      setSendError(
        "Une erreur est survenue lors de l'envoi. Vos informations sont conservées : merci de réessayer, ou de nous contacter directement par téléphone ou par email."
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-line px-8 py-16 text-center mt-10">
        <p className="font-serif text-2xl mb-3">Demande envoyée</p>
        <p className="text-stone text-[14px]">Nous revenons vers vous sous 24h ouvrées.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 space-y-7">
      {/* Honeypot — masqué aux humains, non focusable, non annoncé. Les robots
          qui remplissent tous les champs déclenchent un rejet silencieux serveur. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="site_web">Ne pas remplir</label>
        <input
          id="site_web"
          name="site_web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {isReseau ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <TextField id="prenom" label="Prénom" value={values.prenom} onChange={(v) => set("prenom", v)} required autoComplete="given-name" error={errors.prenom} />
            <TextField id="nom" label="Nom" value={values.nom} onChange={(v) => set("nom", v)} required autoComplete="family-name" error={errors.nom} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <TextField id="tel" label="Téléphone" type="tel" value={values.tel} onChange={(v) => set("tel", v)} required autoComplete="tel" error={errors.tel} />
            <TextField id="email" label="Email" type="email" value={values.email} onChange={(v) => set("email", v)} required autoComplete="email" error={errors.email} />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <TextField id="nom" label="Nom et prénom" value={values.nom} onChange={(v) => set("nom", v)} required autoComplete="name" error={errors.nom} />
            <TextField id="tel" label="Téléphone" type="tel" value={values.tel} onChange={(v) => set("tel", v)} required autoComplete="tel" error={errors.tel} />
          </div>
          <TextField id="email" label="Email" type="email" value={values.email} onChange={(v) => set("email", v)} required autoComplete="email" error={errors.email} />
        </>
      )}

      <div>
        <Label htmlFor="motif">Motif de la demande</Label>
        <select
          id="motif"
          name="motif"
          value={motif}
          onChange={(e) => changeMotif(e.target.value)}
          aria-invalid={errors.motif ? "true" : undefined}
          aria-describedby={errors.motif ? "motif-err" : undefined}
          className={inputCls}
        >
          <option value="">Sélectionnez votre demande</option>
          {MOTIFS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        {errors.motif && <ErrText id="motif-err">{errors.motif}</ErrText>}
      </div>

      {showBienFields && (
        <>
          <SelectField id="typeBien" label="Type de bien" value={values.typeBien} onChange={(v) => set("typeBien", v)} options={TYPES_BIEN} required error={errors.typeBien} />
          <TextField id="commune" label="Commune / secteur" value={values.commune} onChange={(v) => set("commune", v)} required error={errors.commune} />
        </>
      )}

      {motif === "vente" && (
        <>
          <SelectField id="projet" label="Votre projet" value={values.projet} onChange={(v) => set("projet", v)} options={PROJET_VENTE} />
          <SelectField id="echeance" label="Quand envisagez-vous de vendre ?" value={values.echeance} onChange={(v) => set("echeance", v)} options={ECHEANCE} />
        </>
      )}

      {motif === "estimation" && (
        <SelectField id="projet" label="Votre projet" value={values.projet} onChange={(v) => set("projet", v)} options={PROJET_ESTIMATION} />
      )}

      {motif === "expertise" && (
        <SelectField id="contexte" label="Contexte de la demande" value={values.contexte} onChange={(v) => set("contexte", v)} options={CONTEXTE_EXPERTISE} required error={errors.contexte} />
      )}

      {isReseau && (
        <>
          <SelectField id="situation" label="Votre situation actuelle" value={values.situation} onChange={(v) => set("situation", v)} options={SITUATION_RESEAU} required error={errors.situation} />
          <SelectField id="experience" label="Votre expérience dans l'immobilier" value={values.experience} onChange={(v) => set("experience", v)} options={EXPERIENCE_RESEAU} required error={errors.experience} />
          <TextField id="secteur" label="Votre secteur géographique" value={values.secteur} onChange={(v) => set("secteur", v)} required error={errors.secteur} />
          <SelectField id="demande" label="Votre demande" value={values.demande} onChange={(v) => set("demande", v)} options={DEMANDE_RESEAU} />
          <div>
            <Label htmlFor="parrainDeclare">Qui vous a fait connaître LYAT IMMO ?</Label>
            <input
              id="parrainDeclare"
              name="parrainDeclare"
              type="text"
              maxLength={120}
              value={values.parrainDeclare || ""}
              onChange={(e) => set("parrainDeclare", e.target.value)}
              className={inputCls}
            />
            <p className="text-[12px] text-stone leading-[1.6] mt-2">
              Facultatif. Si un conseiller LYAT vous a orienté, indiquez son nom.
            </p>
          </div>
        </>
      )}

      <div>
        <Label htmlFor="message">{messageRequired ? "Message" : "Message (facultatif)"}</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          required={messageRequired}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-err" : undefined}
          className={`${inputCls} resize-none`}
          placeholder="Votre message…"
        />
        <p className="text-[12px] text-stone leading-[1.6] mt-2">
          Indiquez uniquement les informations utiles au traitement de votre demande.
          Merci de ne pas transmettre de données sensibles ni de documents à ce stade.
        </p>
        {errors.message && <ErrText id="message-err">{errors.message}</ErrText>}
      </div>

      {showConsent && (
        <label className="flex gap-3 items-start text-[13px] text-stone leading-[1.7] cursor-pointer">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-1 shrink-0 accent-gold"
          />
          <span>
            {isReseau ? (
              <>
                J&apos;accepte que LYAT IMMO utilise les informations transmises pour traiter ma
                demande d&apos;intégration / de recrutement au sein du réseau LYAT IMMO, notamment
                par téléphone, e-mail ou SMS. Voir notre{" "}
                <Link href="/confidentialite" className="underline underline-offset-2 hover:text-ink" target="_blank">
                  Politique de confidentialité
                </Link>
                .
              </>
            ) : (
              CONSENT_TEXT_COMMERCIAL
            )}
          </span>
        </label>
      )}

      <p className="text-[12px] text-stone leading-[1.7]">
        Les informations recueillies par LYAT IMMO sont utilisées pour traiter votre demande et
        vous recontacter dans ce cadre. Pour en savoir plus sur l&apos;utilisation de vos données et
        l&apos;exercice de vos droits, consultez notre{" "}
        <Link href="/confidentialite" className="underline underline-offset-2 hover:text-ink">
          Politique de confidentialité
        </Link>
        .
      </p>

      {sendError && <p className="text-red-600 text-[13px]">{sendError}</p>}

      <button
        type="submit"
        disabled={sending}
        className="bg-ink text-paper px-9 py-4 text-[12px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {sending ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}

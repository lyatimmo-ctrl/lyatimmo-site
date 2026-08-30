"use client";

import { useState } from "react";
import Link from "next/link";

/* Formulaire « Parler de mon projet » d'un mini-site conseiller.
   -> POST /api/minisite { action:"prospect" } -> RPC creer_prospect_minisite
   (clé anon). Le prospect entre dans l'onglet Prospection du conseiller ;
   la notification e-mail part côté Supabase (Edge Function). */

const TEL_RE = /^\+?[0-9 .\-()]{6,}$/;
const inputCls =
  "w-full border-b border-line bg-transparent py-2.5 text-[15px] text-ink focus:outline-none focus:border-gold";

const PROJETS = [
  { v: "", label: "Je préfère ne pas préciser" },
  { v: "vente", label: "J'ai un projet de vente" },
  { v: "estimation", label: "Je veux estimer un bien" },
  { v: "recherche", label: "Je recherche un bien" },
  { v: "achat", label: "J'ai un projet d'achat" },
];

export default function MiniSiteEnquiry({ slug, prenom: conseillerPrenom }) {
  const [f, setF] = useState({
    prenom: "", nom: "", telephone: "", email: "", commune: "", type_projet: "", message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const set = (k) => (e) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  function validate() {
    const e = {};
    if (!f.prenom.trim() && !f.nom.trim()) e.prenom = "Merci d'indiquer votre nom.";
    if (!f.telephone.trim()) e.telephone = "Merci d'indiquer un téléphone.";
    else if (!TEL_RE.test(f.telephone.trim())) e.telephone = "Numéro invalide.";
    if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      e.email = "Adresse e-mail invalide.";
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (sending) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/minisite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "prospect", slug, ...f, site_web: honeypot }),
      });
      if (res.status === 429) {
        setSendError("Trop de demandes depuis votre appareil. Merci de patienter quelques minutes.");
        return;
      }
      if (!res.ok) throw new Error("failed");
      setSent(true);
    } catch {
      setSendError(
        "Une erreur est survenue. Vous pouvez joindre LYAT IMMO au 0696 33 58 11 ou à contact@lyatimmo.com."
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-line bg-paper px-6 py-10 text-center">
        <p className="font-serif text-xl text-ink mb-2">Message envoyé</p>
        <p className="text-stone text-[14px]">
          {conseillerPrenom ? `${conseillerPrenom} vous` : "Votre conseiller vous"} recontacte
          rapidement.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line bg-paper p-6 md:p-8">
      <div className="text-[10px] tracking-[0.16em] uppercase text-gold mb-1">Prendre contact</div>
      <h2 className="font-serif text-[22px] md:text-[26px] font-medium text-ink mb-1">
        Parler de mon projet
      </h2>
      <p className="text-[13px] text-stone leading-[1.7] mb-6">
        Laissez vos coordonnées, {conseillerPrenom || "votre conseiller"} vous rappelle.
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="ms_site_web">Ne pas remplir</label>
          <input id="ms_site_web" type="text" tabIndex={-1} autoComplete="off"
            value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field id="ms_prenom" label="Prénom" value={f.prenom} onChange={set("prenom")}
            autoComplete="given-name" error={errors.prenom} />
          <Field id="ms_nom" label="Nom" value={f.nom} onChange={set("nom")} autoComplete="family-name" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field id="ms_tel" label="Téléphone" type="tel" inputMode="tel" autoComplete="tel"
            value={f.telephone} onChange={set("telephone")} error={errors.telephone} />
          <Field id="ms_email" label="E-mail (facultatif)" type="email" autoComplete="email"
            value={f.email} onChange={set("email")} error={errors.email} />
        </div>
        <Field id="ms_commune" label="Commune / secteur (facultatif)" value={f.commune} onChange={set("commune")} />

        <div>
          <label htmlFor="ms_projet" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
            Votre projet
          </label>
          <select id="ms_projet" value={f.type_projet} onChange={set("type_projet")}
            className={`${inputCls} appearance-none`}>
            {PROJETS.map((p) => (
              <option key={p.v} value={p.v}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ms_msg" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
            Message (facultatif)
          </label>
          <textarea id="ms_msg" rows={4} value={f.message} onChange={set("message")}
            className={`${inputCls} resize-none`} />
        </div>

        {sendError && <p className="text-red-600 text-[13px]">{sendError}</p>}

        <button type="submit" disabled={sending}
          className="w-full bg-ink text-white px-9 py-4 text-[12px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50">
          {sending ? "Envoi en cours…" : "Envoyer"}
        </button>

        <p className="text-[12px] text-stone leading-[1.7]">
          Vos coordonnées ne sont transmises qu&apos;au conseiller concerné et à LYAT IMMO.{" "}
          <Link href="/confidentialite" className="underline underline-offset-2 hover:text-ink">
            Politique de confidentialité
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

function Field({ id, label, error, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
        {label}
      </label>
      <input id={id} type="text"
        className="w-full border-b border-line bg-transparent py-2.5 text-[15px] text-ink focus:outline-none focus:border-gold"
        aria-invalid={error ? "true" : undefined} {...rest} />
      {error && <p className="text-red-600 text-[13px] mt-1">{error}</p>}
    </div>
  );
}

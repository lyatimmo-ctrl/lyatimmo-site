"use client";

import { useState } from "react";
import Link from "next/link";

/* Dépôt d'un témoignage client sur le mini-site d'un conseiller.
   -> POST /api/minisite { action:"temoignage" } -> RPC soumettre_temoignage.
   Double opt-in (#10) : un e-mail de confirmation est envoyé avant modération.
   Aucune note chiffrée n'est affichée publiquement au lancement (#9) — la note
   est collectée à titre interne. */

const inputCls =
  "w-full border-b border-line bg-transparent py-2.5 text-[15px] text-ink focus:outline-none focus:border-gold";

const CONSENT_TEXT =
  "J'autorise LYAT IMMO à publier mon témoignage (prénom et initiale, commune, contenu) sur le mini-site du conseiller, après modération.";

export default function TemoignageForm({ slug, conseillerNom }) {
  const [f, setF] = useState({
    contenu: "", titre: "", auteur_nom_public: "", auteur_email: "", commune: "",
    note: "", relation: "",
  });
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null); // { verify_required }
  const [sendError, setSendError] = useState("");

  const set = (k) => (e) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  function validate() {
    const e = {};
    if (f.contenu.trim().length < 10) e.contenu = "Merci d'écrire au moins quelques phrases.";
    if (f.contenu.trim().length > 4000) e.contenu = "Témoignage trop long (4000 caractères max).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.auteur_email.trim()))
      e.auteur_email = "Adresse e-mail invalide (nécessaire pour confirmer).";
    if (!consent) e.consent = "Votre accord est nécessaire pour publier le témoignage.";
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
        body: JSON.stringify({
          action: "temoignage",
          slug,
          ...f,
          note: f.note ? Number(f.note) : null,
          consent: true,
          consent_text: CONSENT_TEXT,
          site_web: honeypot,
        }),
      });
      if (res.status === 429) {
        setSendError("Trop de dépôts depuis votre appareil. Merci de patienter quelques minutes.");
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error("failed");
      setDone({ verify_required: Boolean(body.verify_required) });
    } catch {
      setSendError("Une erreur est survenue. Merci de réessayer plus tard.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="border border-line bg-paper px-6 py-10 text-center">
        <p className="font-serif text-xl text-ink mb-2">Merci pour votre témoignage</p>
        <p className="text-stone text-[14px] leading-[1.7]">
          {done.verify_required
            ? "Un e-mail de confirmation vient de vous être envoyé. Ouvrez le lien qu'il contient pour que votre témoignage soit transmis à notre équipe de modération."
            : "Votre témoignage a été transmis à notre équipe de modération."}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line bg-paper p-6 md:p-8">
      <h1 className="font-serif text-[24px] md:text-[30px] font-medium text-ink mb-1">
        Votre témoignage{conseillerNom ? ` sur ${conseillerNom}` : ""}
      </h1>
      <p className="text-[13px] text-stone leading-[1.7] mb-6">
        Votre retour aide les futurs clients. Il sera publié après vérification de votre e-mail
        et modération par LYAT IMMO.
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="tm_site_web">Ne pas remplir</label>
          <input id="tm_site_web" type="text" tabIndex={-1} autoComplete="off"
            value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        <div>
          <label htmlFor="tm_contenu" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
            Votre témoignage
          </label>
          <textarea id="tm_contenu" rows={6} value={f.contenu} onChange={set("contenu")}
            className={`${inputCls} resize-none`} aria-invalid={errors.contenu ? "true" : undefined} />
          {errors.contenu && <p className="text-red-600 text-[13px] mt-1">{errors.contenu}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="tm_nom" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
              Nom affiché (ex. « Sophie M. »)
            </label>
            <input id="tm_nom" type="text" value={f.auteur_nom_public} onChange={set("auteur_nom_public")}
              className={inputCls} />
          </div>
          <div>
            <label htmlFor="tm_commune" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
              Commune (facultatif)
            </label>
            <input id="tm_commune" type="text" value={f.commune} onChange={set("commune")} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="tm_email" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
              Votre e-mail (non publié)
            </label>
            <input id="tm_email" type="email" autoComplete="email" value={f.auteur_email}
              onChange={set("auteur_email")} className={inputCls}
              aria-invalid={errors.auteur_email ? "true" : undefined} />
            {errors.auteur_email && <p className="text-red-600 text-[13px] mt-1">{errors.auteur_email}</p>}
          </div>
          <div>
            <label htmlFor="tm_relation" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
              Vous étiez… (facultatif)
            </label>
            <select id="tm_relation" value={f.relation} onChange={set("relation")}
              className={`${inputCls} appearance-none`}>
              <option value="">—</option>
              <option value="vendeur">Vendeur</option>
              <option value="acquereur">Acquéreur</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tm_note" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
            Note (facultatif, non affichée publiquement)
          </label>
          <select id="tm_note" value={f.note} onChange={set("note")} className={`${inputCls} appearance-none`}>
            <option value="">—</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} / 5</option>
            ))}
          </select>
        </div>

        <label className="flex gap-3 text-[13px] text-stone leading-[1.6]">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 accent-gold" />
          <span>{CONSENT_TEXT}</span>
        </label>
        {errors.consent && <p className="text-red-600 text-[13px]">{errors.consent}</p>}

        {sendError && <p className="text-red-600 text-[13px]">{sendError}</p>}

        <button type="submit" disabled={sending}
          className="w-full bg-ink text-paper px-9 py-4 text-[12px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50">
          {sending ? "Envoi en cours…" : "Envoyer mon témoignage"}
        </button>

        <p className="text-[12px] text-stone leading-[1.7]">
          Conformément à la réglementation sur les avis en ligne, tous les témoignages sont modérés
          par LYAT IMMO et ne sont jamais supprimés de façon sélective.{" "}
          <Link href="/confidentialite" className="underline underline-offset-2 hover:text-ink">
            Politique de confidentialité
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

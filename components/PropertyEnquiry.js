"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   FORMULAIRE "CONTACTER L'AGENCE POUR CE BIEN"
   Envoi direct par email (Resend, /api/contact motif=bien) — aucune
   sauvegarde en base. Champs : nom/prénom, téléphone, message pré-rempli
   modifiable. La référence et le lien du bien sont joints à l'envoi ;
   l'agent du bien (email de contact Transactimo) est mis en copie s'il est
   connu (prop `agentEmail`).
   ───────────────────────────────────────────────────────────── */

const TEL_RE = /^\+?[0-9 .\-()]{6,}$/;
const DEFAULT_MESSAGE =
  "Je suis intéressé par ce bien, pouvez-vous me rappeler ?";

const inputCls =
  "w-full border-b border-line bg-transparent py-2.5 text-[15px] text-ink focus:outline-none focus:border-gold";

export default function PropertyEnquiry({ reference, url, title }) {
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  function validate() {
    const e = {};
    if (!nom.trim()) e.nom = "Merci d'indiquer votre nom et prénom.";
    if (!tel.trim()) e.tel = "Merci d'indiquer un numéro de téléphone.";
    else if (!TEL_RE.test(tel.trim())) e.tel = "Le numéro de téléphone est invalide.";
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motif: "bien",
          nom: nom.trim(),
          tel: tel.trim(),
          message: message.trim(),
          propertyRef: reference || "",
          propertyUrl: url || "",
          site_web: honeypot,
        }),
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
        "Une erreur est survenue lors de l'envoi. Vous pouvez nous joindre directement au 0696 33 58 11 ou à contact@lyatimmo.com."
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-line bg-paper px-6 py-10 text-center">
        <p className="font-serif text-xl text-ink mb-2">Demande envoyée</p>
        <p className="text-stone text-[14px]">
          Nous vous rappelons sous 24h ouvrées.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line bg-paper p-6 md:p-8">
      <div className="text-[10px] tracking-[0.16em] uppercase text-gold mb-1">
        Ce bien vous intéresse ?
      </div>
      <h2 className="font-serif text-[22px] md:text-[26px] font-medium text-ink mb-1">
        Contacter l&apos;agence pour ce bien
      </h2>
      <p className="text-[13px] text-stone leading-[1.7] mb-6">
        {reference ? (
          <>
            Réf. <span className="text-ink">{reference}</span>
            {title ? <> — {title}</> : null}.{" "}
          </>
        ) : null}
        Laissez vos coordonnées, nous vous rappelons.
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Honeypot anti-robot */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
        >
          <label htmlFor="pe_site_web">Ne pas remplir</label>
          <input
            id="pe_site_web"
            name="pe_site_web"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="pe_nom" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
            Nom et prénom
          </label>
          <input
            id="pe_nom"
            type="text"
            autoComplete="name"
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              if (errors.nom) setErrors((p) => ({ ...p, nom: undefined }));
            }}
            aria-invalid={errors.nom ? "true" : undefined}
            className={inputCls}
          />
          {errors.nom && <p className="text-red-600 text-[13px] mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label htmlFor="pe_tel" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
            Téléphone
          </label>
          <input
            id="pe_tel"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={tel}
            onChange={(e) => {
              setTel(e.target.value);
              if (errors.tel) setErrors((p) => ({ ...p, tel: undefined }));
            }}
            aria-invalid={errors.tel ? "true" : undefined}
            className={inputCls}
          />
          {errors.tel && <p className="text-red-600 text-[13px] mt-1">{errors.tel}</p>}
        </div>

        <div>
          <label htmlFor="pe_msg" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
            Message
          </label>
          <textarea
            id="pe_msg"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>

        {sendError && <p className="text-red-600 text-[13px]">{sendError}</p>}

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-ink text-paper px-9 py-4 text-[12px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {sending ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>

        <p className="text-[12px] text-stone leading-[1.7]">
          En envoyant ce formulaire, vous acceptez d&apos;être recontacté au sujet
          de ce bien. Détails :{" "}
          <Link href="/confidentialite" className="underline underline-offset-2 hover:text-ink">
            Politique de confidentialité
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

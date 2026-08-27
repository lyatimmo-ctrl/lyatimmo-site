"use client";

import { useConsent } from "./ConsentProvider";
import { CONSENT_STATUS } from "@/lib/consent/config";

const LABEL = {
  [CONSENT_STATUS.ACCEPTED]: "Tout accepté",
  [CONSENT_STATUS.REJECTED]: "Tout refusé",
  [CONSENT_STATUS.PENDING]: "Aucun choix enregistré",
};

/**
 * Bloc « Votre choix actuel » de la page /cookies : affiche l'état courant et
 * permet d'en changer dans les deux sens, avec une facilité d'usage identique.
 */
export default function CookiePreferences() {
  const { status, ready, accept, reject } = useConsent();

  function apply(next) {
    const wasAccepted = status === CONSENT_STATUS.ACCEPTED;
    if (next === CONSENT_STATUS.ACCEPTED) accept();
    else reject();
    // Passage d'"accepté" à "refusé" : rechargement pour garantir qu'aucun
    // service chargé sous l'ancien consentement ne reste actif.
    if (wasAccepted && next === CONSENT_STATUS.REJECTED && typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <div className="border border-line p-6 md:p-8 my-8">
      <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-2">
        Votre choix actuel
      </p>
      <p className="font-serif text-[20px] text-ink mb-6" aria-live="polite">
        {ready ? LABEL[status] : "…"}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => apply(CONSENT_STATUS.REJECTED)}
          className="flex-1 text-[12px] tracking-[0.18em] uppercase border border-ink px-6 py-3 text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          Tout refuser
        </button>
        <button
          type="button"
          onClick={() => apply(CONSENT_STATUS.ACCEPTED)}
          className="flex-1 text-[12px] tracking-[0.18em] uppercase bg-ink text-paper px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Tout accepter
        </button>
      </div>
    </div>
  );
}

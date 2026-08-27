"use client";

import Link from "next/link";
import { useConsent } from "./ConsentProvider";
import { CONSENT_STATUS } from "@/lib/consent/config";

/**
 * Bandeau de consentement — deux choix, point.
 * Ne s'affiche que tant qu'aucun choix valide n'a été enregistré.
 * Bande discrète ancrée en bas : ne recouvre pas le Hero, contenu du site visible.
 */
export default function ConsentBanner() {
  const { status, ready, accept, reject } = useConsent();
  if (!ready || status !== CONSENT_STATUS.PENDING) return null;

  return (
    <div
      role="region"
      aria-label="Cookies et confidentialité"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-line bg-paper px-6 md:px-14 py-5"
    >
      <div className="mx-auto max-w-[1100px] flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
        <div className="flex-1">
          <p className="font-serif text-[15px] text-ink mb-1">Cookies et confidentialité</p>
          <p className="text-[13px] leading-[1.7] text-stone">
            Nous utilisons des cookies et technologies similaires pour assurer le
            fonctionnement du site et, avec votre accord, mesurer son utilisation,
            améliorer nos communications et permettre certains contenus ou services
            externes.{" "}
            <Link href="/cookies" className="underline underline-offset-2 hover:text-ink">
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={reject}
            className="flex-1 md:flex-none text-[12px] tracking-[0.18em] uppercase border border-ink px-6 py-3 text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            Tout refuser
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex-1 md:flex-none text-[12px] tracking-[0.18em] uppercase bg-ink text-paper px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}

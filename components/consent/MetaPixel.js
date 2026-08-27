"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";
import { CONSENT_STATUS } from "@/lib/consent/config";

/**
 * Meta Pixel — prêt à l'emploi, entièrement piloté par le consentement.
 *
 *   Pixel ID absent                     → rien n'est chargé, aucune requête Meta
 *   Pixel ID présent + consentement pending   → rien n'est chargé
 *   Pixel ID présent + consentement rejected  → rien n'est chargé
 *   Pixel ID présent + consentement accepted  → le pixel est chargé et initialisé
 *
 * Renseigner NEXT_PUBLIC_META_PIXEL_ID pour l'activer. Ne jamais coder d'ID en dur.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  const { status } = useConsent();

  if (!PIXEL_ID) return null;
  if (status !== CONSENT_STATUS.ACCEPTED) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', ${JSON.stringify(PIXEL_ID)});
        fbq('track', 'PageView');
        window.__lyatMetaReady = true;
      `}
    </Script>
  );
}

/**
 * Abstraction centralisée pour déclencher un événement Meta.
 * L'événement N'EST envoyé que si Meta est configuré, chargé ET autorisé par le
 * consentement. À utiliser depuis les composants métier plutôt que d'appeler
 * `fbq` directement.
 *
 * Ne JAMAIS transmettre de données personnelles (nom, e-mail, téléphone,
 * adresse, contenu de formulaire). Toute future configuration de conversion doit
 * respecter la minimisation et faire l'objet d'une vérification spécifique.
 */
export function metaTrack(eventName, params) {
  if (typeof window === "undefined") return;
  if (!window.__lyatMetaReady || typeof window.fbq !== "function") return;
  if (params && typeof params === "object") window.fbq("track", eventName, params);
  else window.fbq("track", eventName);
}

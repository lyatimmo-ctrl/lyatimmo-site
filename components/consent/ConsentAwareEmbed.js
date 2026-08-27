"use client";

import Image from "next/image";
import { useConsent } from "./ConsentProvider";
import { CONSENT_STATUS } from "@/lib/consent/config";

/**
 * Enveloppe générique pour tout contenu tiers embarqué (vidéo, visite virtuelle,
 * iframe externe…).
 *
 *   consentement "accepted"           → l'iframe est réellement rendue
 *   consentement "pending" / "rejected" → l'iframe N'EST PAS créée (pas seulement
 *                                        masquée) ; aucune requête vers le
 *                                        fournisseur tiers n'est déclenchée
 *
 * En cas de refus/attente, un bloc discret dans la DA LYAT IMMO invite à
 * autoriser l'affichage en une seule action.
 */
export default function ConsentAwareEmbed({
  provider,
  src,
  title,
  poster,
  allow,
  allowFullScreen = true,
  aspectRatio = "16 / 9",
  requiresConsent = true,
  className = "",
}) {
  const { status, accept } = useConsent();
  const authorized = !requiresConsent || status === CONSENT_STATUS.ACCEPTED;

  return (
    <div
      className={`relative w-full overflow-hidden border border-line bg-paper-deep ${className}`}
      style={{ aspectRatio }}
    >
      {authorized && src ? (
        <iframe
          src={src}
          title={title}
          allow={allow}
          allowFullScreen={allowFullScreen}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {poster ? (
            <Image
              src={poster}
              alt=""
              fill
              aria-hidden="true"
              className="object-cover opacity-25"
            />
          ) : null}
          <div className="relative">
            <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-2">
              Contenu externe
            </p>
            <p className="text-stone text-[14px] leading-[1.7] max-w-[340px] mb-5">
              Ce contenu{provider ? ` (${provider})` : ""} nécessite votre autorisation
              pour être affiché.
            </p>
            <button
              type="button"
              onClick={accept}
              className="text-[12px] tracking-[0.18em] uppercase bg-ink text-paper px-6 py-3 hover:opacity-90 transition-opacity"
            >
              Autoriser et afficher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

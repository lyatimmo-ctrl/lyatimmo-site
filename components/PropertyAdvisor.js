import Link from "next/link";
import Image from "next/image";
import { isMobile, formatNational, toWaMe } from "@/lib/phone";

/**
 * Bloc « conseiller responsable » d'une fiche bien (/biens/[slug]).
 *
 * `advisor` = objet de lib/advisor.js (getListingAdvisor) ou null.
 *   - null  -> rien n'est rendu (formulaire agence conservé, pas de trou) ;
 *   - sinon -> photo/avatar, Prénom NOM, « Conseiller immobilier »,
 *     téléphone (tel:), WhatsApp (si mobile, message pré-rempli avec la
 *     référence réelle), e-mail (mailto:), et le CTA « Découvrir mon profil »
 *     UNIQUEMENT si lien_annonces_actif && minisite_publie && minisite_slug.
 *
 * Aucun rang interne, aucun RSAC, aucun fallback : tout vient de `advisor`.
 */

function initiales(prenom, nom) {
  const a = (prenom || "").trim()[0] || "";
  const b = (nom || "").trim()[0] || "";
  return (a + b).toUpperCase() || "·";
}

const ACTION_CLS =
  "inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[12px] tracking-[0.14em] uppercase text-ink hover:bg-ink hover:text-paper transition-colors";

export default function PropertyAdvisor({ advisor, reference }) {
  if (!advisor) return null;

  const {
    prenom,
    nom,
    photoUrl,
    telephone,
    email,
    minisiteSlug,
    minisitePublie,
    lienAnnoncesActif,
  } = advisor;

  const nomComplet = [prenom, nom].filter(Boolean).join(" ");
  const tel = telephone || null;
  const ref = String(reference || "").trim();
  const waMessage = `Bonjour, je souhaiterais obtenir davantage d'informations concernant le bien réf. ${ref}.`;
  const waHref = tel && ref && isMobile(tel) ? toWaMe(tel, waMessage) : null;
  const showCta = lienAnnoncesActif && minisitePublie && Boolean(minisiteSlug);

  return (
    <div className="mb-10 border border-line p-6">
      <div className="text-[10px] tracking-[0.16em] uppercase text-gold mb-4">
        Votre conseiller
      </div>

      <div className="flex items-center gap-4">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={nomComplet}
            width={96}
            height={96}
            unoptimized
            className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] rounded-full object-cover bg-paper-deep shrink-0"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] rounded-full bg-paper-deep text-gold font-serif text-[22px] md:text-[26px] flex items-center justify-center shrink-0"
          >
            {initiales(prenom, nom)}
          </div>
        )}
        <div>
          <div className="font-serif text-[20px] md:text-[22px] leading-tight">
            {prenom} <span className="uppercase">{nom}</span>
          </div>
          <div className="text-[12px] tracking-[0.08em] text-stone uppercase mt-1">
            Conseiller immobilier
          </div>
        </div>
      </div>

      {(tel || waHref || email) && (
        <div className="flex flex-wrap gap-3 mt-5">
          {tel && (
            <a href={`tel:${tel}`} className={ACTION_CLS}>
              {formatNational(tel)}
            </a>
          )}
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className={ACTION_CLS}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 2.1.55 4.06 1.6 5.83L2 22l4.4-1.15a9.86 9.86 0 0 0 5.64 1.76h.01c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.2.85 5.74 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.47-3.64 8.1-8.12 8.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-2.61.69.7-2.55-.19-.31a8.02 8.02 0 0 1-1.24-4.32c0-4.47 3.64-8.1 8.11-8.1Zm-2.5 3.9c-.18 0-.47.07-.72.34-.24.27-.94.92-.94 2.24 0 1.32.96 2.6 1.1 2.78.13.18 1.87 2.98 4.66 4.06 2.32.9 2.79.72 3.3.68.5-.05 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.53-.32-.28-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.6.07-.28-.14-1.16-.43-2.2-1.36-.82-.73-1.36-1.63-1.52-1.9-.16-.28-.02-.43.12-.57.12-.12.28-.32.41-.48.14-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47l-.53-.01Z" />
              </svg>
              WhatsApp
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className={ACTION_CLS}>
              E-mail
            </a>
          )}
        </div>
      )}

      {showCta && (
        <Link
          href={`/conseillers/${minisiteSlug}`}
          className="inline-block mt-4 text-[12px] tracking-[0.14em] uppercase text-stone underline underline-offset-4 hover:text-ink"
        >
          Découvrir mon profil
        </Link>
      )}
    </div>
  );
}

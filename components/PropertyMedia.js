"use client";

import ConsentAwareEmbed from "@/components/consent/ConsentAwareEmbed";

/**
 * Bloc « vidéo / visite virtuelle » d'une fiche bien, à partir de l'analyse
 * de l'URL Transactimo (voir lib/media-embed.js).
 *
 *   - media null            -> rien n'est rendu
 *   - type video/visite/social -> iframe (derrière le consentement)
 *   - type externe          -> bouton « Ouvrir la visite virtuelle » (nouvel onglet)
 *
 * Dans tous les cas où un bloc est affiché, le lien « Ouvrir dans un nouvel
 * onglet » reste présent sous le bloc.
 */
const EMBED_ALLOW = "autoplay; fullscreen; xr-spatial-tracking; gyroscope; accelerometer";

export default function PropertyMedia({ media, contextTitle }) {
  if (!media) return null;

  const isExterne = media.type === "externe" || !media.embedUrl;
  // Réseaux sociaux : contenu vertical -> cadre 9:16 plafonné (~700 px de haut
  // sur desktop, pleine largeur sur mobile), pas le 16:9 des vidéos.
  const isSocial = media.type === "social";

  return (
    <div className="mt-8">
      <div className="text-[10px] tracking-[0.16em] uppercase text-gold mb-3">{media.title}</div>

      {isExterne ? (
        <a
          href={media.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center border border-ink px-6 py-3 text-[12px] tracking-[0.18em] uppercase text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          Ouvrir la visite virtuelle
        </a>
      ) : (
        <ConsentAwareEmbed
          provider={media.provider || media.title}
          category="external"
          src={media.embedUrl}
          title={contextTitle ? `${media.title} | ${contextTitle}` : media.title}
          allow={EMBED_ALLOW}
          allowFullScreen
          aspectRatio={isSocial ? "9 / 16" : "16 / 9"}
          className={isSocial ? "max-w-[400px]" : ""}
        />
      )}

      <a
        href={media.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-[12px] text-stone underline underline-offset-2 hover:text-ink"
      >
        Ouvrir dans un nouvel onglet
      </a>
    </div>
  );
}

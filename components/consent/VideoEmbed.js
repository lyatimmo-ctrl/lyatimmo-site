"use client";

import ConsentAwareEmbed from "./ConsentAwareEmbed";

/**
 * Vidéo externe — prête à l'emploi. Aucune vidéo n'est intégrée tant qu'un
 * appelant ne fournit pas `provider` + `videoId` (ou `url`).
 *
 *   consentement "accepted"            → l'iframe du fournisseur est chargée
 *   consentement "pending" / "rejected" → aucune connexion au fournisseur
 *
 * Fournisseurs reconnus : "youtube" (domaine sans cookie), "vimeo". Tout autre
 * fournisseur : passer directement `url`.
 */
function buildSrc(provider, { videoId, url, params }) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  switch ((provider || "").toLowerCase()) {
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${videoId}${qs}`;
    case "vimeo":
      return `https://player.vimeo.com/video/${videoId}${qs}`;
    default:
      return url || "";
  }
}

export default function VideoEmbed({
  provider,
  videoId,
  url,
  title,
  poster,
  params,
  className,
}) {
  return (
    <ConsentAwareEmbed
      provider={provider}
      src={buildSrc(provider, { videoId, url, params })}
      title={title}
      poster={poster}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      aspectRatio="16 / 9"
      className={className}
    />
  );
}

"use client";

import ConsentAwareEmbed from "./ConsentAwareEmbed";

/**
 * Visite virtuelle externe — prête à l'emploi. Aucun fournisseur n'est imposé :
 * Matterport ou tout autre service se branche via `provider` + `url` / `tourId`.
 *
 *   consentement "accepted"            → la visite est chargée
 *   consentement "pending" / "rejected" → aucune iframe, aucun script, aucune requête
 */
function buildSrc(provider, { tourId, url, params }) {
  const extra = params ? new URLSearchParams(params).toString() : "";
  switch ((provider || "").toLowerCase()) {
    case "matterport":
      return `https://my.matterport.com/show/?m=${tourId}${extra ? "&" + extra : ""}`;
    default:
      return url || "";
  }
}

export default function VirtualTourEmbed({
  provider,
  tourId,
  url,
  title,
  poster,
  params,
  className,
}) {
  return (
    <ConsentAwareEmbed
      provider={provider}
      src={buildSrc(provider, { tourId, url, params })}
      title={title}
      poster={poster}
      allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
      aspectRatio="16 / 9"
      className={className}
    />
  );
}

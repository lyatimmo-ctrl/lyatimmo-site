"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Galerie photo d'une fiche bien : une grande photo (ratio 4/3, object-fit cover)
 * + une bande de vignettes cliquables sous celle-ci. Aucune dépendance externe,
 * pas de lightbox : cliquer une vignette change la grande photo.
 *
 * Cohérent quel que soit le nombre de photos :
 *   1 photo   -> grande photo seule, pas de bande
 *   2 a N     -> grande photo + bande de vignettes qui passe a la ligne
 */
export default function PropertyGallery({ photos, alt }) {
  const [active, setActive] = useState(0);
  if (!photos || photos.length === 0) return null;

  const main = photos[Math.min(active, photos.length - 1)];

  return (
    <div>
      <div
        className="relative w-full overflow-hidden bg-paper-deep"
        style={{ aspectRatio: "4 / 3" }}
      >
        <Image
          key={main}
          src={main}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          style={{ objectFit: "cover" }}
          priority
          unoptimized
        />
      </div>

      {photos.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1} sur ${photos.length}`}
              aria-current={i === active ? "true" : undefined}
              className={`relative overflow-hidden bg-paper-deep transition-opacity ${
                i === active ? "outline outline-1 outline-gold" : "opacity-60 hover:opacity-100"
              }`}
              style={{ width: 96, aspectRatio: "4 / 3" }}
            >
              <Image src={src} alt="" fill sizes="96px" style={{ objectFit: "cover" }} unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

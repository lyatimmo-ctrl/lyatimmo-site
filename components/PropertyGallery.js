"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Galerie photo d'une fiche bien : une grande photo (ratio 4/3, object-fit cover)
 * + une bande de vignettes cliquables sous celle-ci.
 *
 * Cliquer la grande photo OU une vignette ouvre une visionneuse plein ecran
 * (lightbox) :
 *   - navigation par fleches ‹ › (desktop) et clavier Fleche gauche / droite ;
 *   - navigation par glissement du doigt (mobile) ;
 *   - Echap ou clic hors image pour fermer.
 * Aucune dependance externe.
 */
export default function PropertyGallery({ photos, alt }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const count = Array.isArray(photos) ? photos.length : 0;

  const go = useCallback(
    (dir) => setActive((i) => (count ? (i + dir + count) % count : 0)),
    [count]
  );

  const openAt = useCallback((i) => {
    setActive(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  if (!photos || count === 0) return null;

  const main = photos[Math.min(active, count - 1)];

  return (
    <div>
      <button
        type="button"
        onClick={() => openAt(active)}
        aria-label="Agrandir la photo"
        className="relative block w-full overflow-hidden bg-paper-deep cursor-zoom-in"
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
      </button>

      {count > 1 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => openAt(i)}
              aria-label={`Photo ${i + 1} sur ${count}`}
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

      {open && (
        <Lightbox
          photos={photos}
          index={Math.min(active, count - 1)}
          alt={alt}
          onClose={close}
          onNav={go}
        />
      )}
    </div>
  );
}

function Lightbox({ photos, index, alt, onClose, onNav }) {
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const count = photos.length;

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNav(1);
      else if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onNav]);

  function onTouchStart(e) {
    touchX.current = e.changedTouches[0]?.clientX ?? null;
  }
  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
    if (Math.abs(dx) > 40) onNav(dx < 0 ? 1 : -1);
    touchX.current = null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photos du bien"
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex justify-end p-4">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="text-white/80 hover:text-white text-3xl leading-none w-10 h-10"
        >
          &times;
        </button>
      </div>

      <div
        className="relative flex-1 min-h-0 mx-auto w-full max-w-[1400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={photos[index]}
          src={photos[index]}
          alt={alt}
          fill
          sizes="100vw"
          style={{ objectFit: "contain" }}
          unoptimized
          priority
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => onNav(-1)}
              aria-label="Photo précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl w-12 h-12"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              onClick={() => onNav(1)}
              aria-label="Photo suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl w-12 h-12"
            >
              &rsaquo;
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="text-center text-white/70 text-[13px] py-4 tracking-[0.1em]">
          {index + 1} / {count}
        </div>
      )}
    </div>
  );
}

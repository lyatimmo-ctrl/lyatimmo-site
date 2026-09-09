"use client";

import { useState } from "react";
import Link from "next/link";
import { useConsent } from "./ConsentProvider";
import CategoryToggle from "./CategoryToggle";
import { CATEGORY_LIST, CONSENTABLE_CATEGORIES } from "@/lib/consent/config";

/**
 * Bandeau de consentement — deux niveaux.
 *   Niveau 1 : « Tout refuser » · « Tout accepter » (même poids visuel) · « Personnaliser »
 *   Niveau 2 : un interrupteur par catégorie + « Enregistrer mes choix »
 * Ne s'affiche que tant qu'aucun choix valide n'a été enregistré.
 */
export default function ConsentBanner() {
  const { ready, decided, categories, acceptAll, rejectAll, setCategories } = useConsent();
  const [custom, setCustom] = useState(false);
  const [draft, setDraft] = useState(() =>
    Object.fromEntries(CONSENTABLE_CATEGORIES.map((c) => [c, false]))
  );

  if (!ready || decided) return null;

  const btn =
    "flex-1 md:flex-none text-[12px] tracking-[0.18em] uppercase px-6 py-3 transition-colors";
  const btnGhost = `${btn} border border-ink text-ink hover:bg-ink hover:text-paper`;
  const btnSolid = `${btn} bg-ink text-paper hover:opacity-90`;

  return (
    <div
      role="region"
      aria-label="Cookies et confidentialité"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-line bg-paper px-6 md:px-14 py-5"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="font-serif text-[15px] text-ink mb-1">Cookies et confidentialité</p>
        <p className="text-[13px] leading-[1.7] text-stone">
          Nous utilisons des cookies et technologies similaires pour assurer le
          fonctionnement du site et, avec votre accord, afficher certains contenus
          externes et mesurer l&apos;utilisation du site.{" "}
          <Link href="/cookies" className="underline underline-offset-2 hover:text-ink">
            En savoir plus
          </Link>
        </p>

        {custom && (
          <div className="mt-4 border border-line">
            {CATEGORY_LIST.map((cat) => (
              <div key={cat.id} className="px-4">
                <CategoryToggle
                  category={cat}
                  locked={cat.alwaysOn}
                  checked={cat.alwaysOn || draft[cat.id] === true}
                  onChange={(v) => setDraft((d) => ({ ...d, [cat.id]: v }))}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {!custom ? (
            <>
              <button type="button" onClick={rejectAll} className={btnGhost}>
                Tout refuser
              </button>
              <button type="button" onClick={acceptAll} className={btnSolid}>
                Tout accepter
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(
                    Object.fromEntries(
                      CONSENTABLE_CATEGORIES.map((c) => [c, categories[c] === true])
                    )
                  );
                  setCustom(true);
                }}
                className={btnGhost}
              >
                Personnaliser
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={rejectAll} className={btnGhost}>
                Tout refuser
              </button>
              <button type="button" onClick={acceptAll} className={btnGhost}>
                Tout accepter
              </button>
              <button type="button" onClick={() => setCategories(draft)} className={btnSolid}>
                Enregistrer mes choix
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useConsent } from "./ConsentProvider";
import CategoryToggle from "./CategoryToggle";
import { CATEGORY_LIST, CONSENTABLE_CATEGORIES } from "@/lib/consent/config";

/**
 * Bloc « Vos choix » de la page /cookies : un interrupteur par catégorie,
 * modifiable à tout moment, dans les deux sens.
 *
 * Si une catégorie passe de acceptée à refusée, la page est rechargée après
 * l'enregistrement pour garantir qu'aucun script / iframe chargé sous l'ancien
 * consentement ne reste actif.
 */
export default function CookiePreferences() {
  const { ready, categories, setCategories } = useConsent();
  // Modifications en attente d'enregistrement (uniquement les catégories touchées).
  const [pending, setPending] = useState({});
  const [saved, setSaved] = useState(false);

  const base = Object.fromEntries(CONSENTABLE_CATEGORIES.map((c) => [c, categories[c] === true]));
  const effective = { ...base, ...pending };
  const dirty = CONSENTABLE_CATEGORIES.some((c) => base[c] !== effective[c]);

  function save() {
    const downgraded = CONSENTABLE_CATEGORIES.some((c) => base[c] === true && effective[c] !== true);
    setCategories(effective);
    setPending({});
    setSaved(true);
    if (downgraded && typeof window !== "undefined") window.location.reload();
  }

  return (
    <div className="border border-line p-6 md:p-8 my-8">
      <p className="text-[10px] tracking-[0.2em] uppercase text-stone mb-4">Vos choix</p>

      <div className="border-t border-line">
        {CATEGORY_LIST.map((cat) => (
          <CategoryToggle
            key={cat.id}
            category={cat}
            locked={cat.alwaysOn}
            checked={cat.alwaysOn || effective[cat.id] === true}
            onChange={(v) => {
              setSaved(false);
              setPending((p) => ({ ...p, [cat.id]: v }));
            }}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={!ready || !dirty}
          className="text-[12px] tracking-[0.18em] uppercase bg-ink text-paper px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Enregistrer mes choix
        </button>
        {saved && !dirty && (
          <span className="text-[13px] text-stone" aria-live="polite">
            Choix enregistrés.
          </span>
        )}
      </div>
    </div>
  );
}

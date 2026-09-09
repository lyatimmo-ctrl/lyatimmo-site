"use client";

/**
 * Ligne « catégorie de consentement » : titre + description + interrupteur.
 * Réutilisée par le bandeau et par la page /cookies.
 *
 *   locked = true  -> interrupteur figé sur « Toujours actif » (catégorie nécessaire)
 */
export default function CategoryToggle({ category, checked, locked = false, onChange }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-line">
      <div className="min-w-0">
        <p className="text-[13px] tracking-[0.06em] uppercase text-ink">{category.title}</p>
        <p className="text-[13px] leading-[1.6] text-stone mt-1">{category.description}</p>
      </div>

      {locked ? (
        <span className="shrink-0 text-[11px] tracking-[0.14em] uppercase text-stone mt-1">
          Toujours actif
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={`${category.title} : ${checked ? "activé" : "désactivé"}`}
          onClick={() => onChange(!checked)}
          className={`shrink-0 mt-1 relative h-6 w-11 rounded-full transition-colors ${
            checked ? "bg-ink" : "bg-line"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-all ${
              checked ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      )}
    </div>
  );
}

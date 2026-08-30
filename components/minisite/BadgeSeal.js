/* Sceau de distinction du mini-site conseiller — 3 familles visuelles :
   - accomplissement (scope permanent)  -> écusson, escalade 10/25/50/100
   - distinction annuelle (scope='annuel') -> plaque gravée, année en grand
   - fonction (nature='fonction')        -> insigne institutionnel
   Popover d'explication (badge.description) au survol / focus clavier.
   Couleurs via variables CSS (en `style`, pas en attribut SVG -> var() résout)
   -> thèmes clair et sombre automatiques. */

function tierFromCode(code) {
  const n = parseInt((String(code).match(/_(\d+)$/) || [])[1], 10) || 0;
  return n >= 100 ? 4 : n >= 50 ? 3 : n >= 25 ? 2 : 1;
}

function Shield({ code, size = 74 }) {
  const t = tierFromCode(code);
  const n = (String(code).match(/_(\d+)$/) || [])[1] || "";
  const inv = t === 4;
  const gd = "var(--gold-deep)";
  const face = inv ? "var(--paper)" : "var(--ink)";
  return (
    <svg
      width={size}
      height={Math.round((size * 98) / 84)}
      viewBox="0 0 84 98"
      role="img"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 5px 12px rgba(70,55,20,.16))" }}
    >
      <path
        d="M8 8 H76 V56 Q76 85 42 96 Q8 85 8 56 Z"
        style={{ fill: inv ? "var(--gold)" : "var(--paper)", stroke: "var(--gold)", strokeWidth: 1.6 }}
      />
      {t >= 2 && (
        <path
          d="M13 13 H71 V55 Q71 78 42 88 Q13 78 13 55 Z"
          style={{
            fill: "none",
            stroke: inv ? "var(--paper)" : "var(--gold)",
            strokeWidth: 1,
            opacity: inv ? 0.5 : 0.65,
          }}
        />
      )}
      {t >= 3 && (
        <path
          d="M8 20 q-6 4 -2 12 M76 20 q6 4 2 12"
          style={{ fill: "none", stroke: gd, strokeWidth: 2, strokeLinecap: "round" }}
        />
      )}
      {t >= 4 && (
        <path
          d="M24 76 q5 11 18 13 M60 76 q-5 11 -18 13"
          style={{ fill: "none", stroke: gd, strokeWidth: 1.3, strokeLinecap: "round" }}
        />
      )}
      <path
        d="M29 33 L42 22 L55 33 M32 33 V46 H52 V33"
        style={{
          fill: "none",
          stroke: inv ? "var(--paper)" : gd,
          strokeWidth: 1.5,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        }}
      />
      <text
        x="42"
        y="70"
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-serif), "Playfair Display", serif',
          fontSize: 26,
          fontWeight: 600,
          fill: face,
        }}
      >
        {n}
      </text>
    </svg>
  );
}

export default function BadgeSeal({ badge, size = 74, className = "" }) {
  if (!badge) return null;
  const { code, nature, scope, libelle, annee, description } = badge;

  let visual;
  if (scope === "annuel") {
    visual = (
      <div
        className="relative text-center px-5 py-4 rounded-[4px] border border-gold bg-paper"
        style={{ minWidth: 190, boxShadow: "0 5px 12px rgba(70,55,20,.14)" }}
      >
        <span className="absolute left-4 right-4 top-[8px] h-px bg-gold" />
        <span className="absolute left-4 right-4 bottom-[8px] h-px bg-gold" />
        <div className="text-[10px] tracking-[0.22em] uppercase text-gold-deep font-semibold">{libelle}</div>
        <div className="text-gold my-1 text-[9px]">◆</div>
        <div className="font-serif text-[32px] font-semibold leading-none text-gold-deep">{annee || ""}</div>
      </div>
    );
  } else if (nature === "fonction") {
    visual = (
      <div
        className="flex items-stretch rounded-[3px] overflow-hidden border border-line bg-paper"
        style={{ minWidth: 174 }}
      >
        <div className="w-7 flex-none bg-gold grid place-items-center">
          <span className="font-serif text-[15px] font-semibold text-white leading-none">L</span>
        </div>
        <span className="w-px bg-gold/70 flex-none" />
        <div className="px-4 py-2.5">
          <div className="text-[12.5px] font-semibold tracking-[0.06em] uppercase text-ink">{libelle}</div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-stone mt-0.5">LYAT IMMO</div>
        </div>
      </div>
    );
  } else {
    visual = (
      <span className="flex flex-col items-center gap-2">
        <Shield code={code} size={size} />
        <span className="text-[9px] tracking-[0.14em] uppercase text-stone text-center max-w-[112px] leading-[1.35]">
          Transactions accompagnées
        </span>
      </span>
    );
  }

  return (
    <span
      className={`group relative inline-flex outline-none ${className}`}
      tabIndex={description ? 0 : -1}
    >
      {visual}
      {description && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 bottom-[calc(100%+12px)] -translate-x-1/2 translate-y-1 w-[248px] rounded-lg border border-line border-t-2 border-t-gold bg-paper text-ink px-4 py-3 text-[12.5px] leading-[1.55] text-left opacity-0 invisible transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus:opacity-100 group-focus:visible group-focus:translate-y-0 z-20 shadow-[0_12px_34px_rgba(70,55,20,.18)]"
        >
          <b className="block font-serif text-[13px] font-semibold mb-1">
            {libelle}
            {annee ? ` — ${annee}` : ""}
          </b>
          {description}
        </span>
      )}
    </span>
  );
}

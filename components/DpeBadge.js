/* ─────────────────────────────────────────────────────────────
   BANDEAU DPE / GES — à partir des champs du XML Transactimo
   (lettre_bilan_energie / valeur_bilan_energie / lettre_bilan_ges /
    valeur_bilan_ges).
   - lettres absentes -> "Non soumis au DPE"
   - lettres présentes -> échelle A→G avec la classe mise en évidence
   ───────────────────────────────────────────────────────────── */

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

// Dégradé officiel énergie (vert -> rouge) et climat/GES (mauve).
const ENERGY_COLORS = {
  A: "#3aa757", B: "#54b04a", C: "#8fc73e", D: "#f4e70f",
  E: "#f0b40e", F: "#e88b16", G: "#e30613",
};
const GES_COLORS = {
  A: "#efe7f6", B: "#d9c6e8", C: "#c3a5da", D: "#ad84cc",
  E: "#9663be", F: "#7f42b0", G: "#6c2b8f",
};

function Scale({ title, unit, letter, value, colors }) {
  const active = String(letter || "").trim().toUpperCase();
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[10px] tracking-[0.14em] uppercase text-stone">{title}</span>
        {value != null && value !== "" ? (
          <span className="text-[11px] text-stone">
            {value} {unit}
          </span>
        ) : null}
      </div>
      <div className="flex gap-1">
        {LETTERS.map((L) => {
          const isActive = L === active;
          return (
            <div
              key={L}
              className={`flex items-center justify-center text-[11px] font-medium transition-transform ${
                isActive ? "scale-110 text-white" : "text-ink/45"
              }`}
              style={{
                flex: 1,
                height: isActive ? 30 : 24,
                background: isActive ? colors[L] : "var(--paper-deep)",
                border: isActive ? `1px solid ${colors[L]}` : "1px solid var(--line)",
                borderRadius: 2,
              }}
              aria-label={isActive ? `Classe ${L}` : undefined}
            >
              {L}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DpeBadge({ dpeLetter, dpeValue, gesLetter, gesValue }) {
  const hasDpe = String(dpeLetter || "").trim() !== "";
  const hasGes = String(gesLetter || "").trim() !== "";

  if (!hasDpe && !hasGes) {
    return (
      <div className="border border-line px-4 py-3 text-[13px] text-stone">
        Non soumis au DPE
      </div>
    );
  }

  return (
    <div className="border border-line px-4 py-4 space-y-4">
      <Scale
        title="Diagnostic de performance énergétique"
        unit="kWh/m²/an"
        letter={dpeLetter}
        value={dpeValue}
        colors={ENERGY_COLORS}
      />
      {hasGes && (
        <Scale
          title="Émissions de gaz à effet de serre"
          unit="kg CO₂/m²/an"
          letter={gesLetter}
          value={gesValue}
          colors={GES_COLORS}
        />
      )}
    </div>
  );
}

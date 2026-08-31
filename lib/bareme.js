import { createClient } from "@supabase/supabase-js";

/**
 * Grille de rémunération LYAT — SOURCE DE VÉRITÉ UNIQUE : la clé
 * public.config('bareme_remuneration'), exposée en lecture publique par la vue
 * `v_bareme_remuneration_public` (security_invoker=off, grant anon), qui ne
 * renvoie QUE la grille (mode, paliers, override_team_leader, cap_reset).
 *
 * La page /nous-rejoindre lit cette vue au build (ISR) et rend les paliers à
 * partir d'elle. Le FALLBACK ci-dessous ne sert que si la vue est injoignable
 * au build — il doit rester synchrone avec
 * lyatimmo-app/supabase/remuneration_v2_schema.sql §1.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const BAREME_FALLBACK = {
  mode: "marginal",
  cap_reset: "01-01",
  paliers: {
    partenaire: [
      { min: 0, max: 35000, taux: 0.70 },
      { min: 35000, max: 55000, taux: 0.75 },
      { min: 55000, max: 70000, taux: 0.80 },
      { min: 70000, max: 80000, taux: 0.85 },
      { min: 80000, max: null, taux: 0.90 },
    ],
    confirme: [
      { min: 0, max: 90000, taux: 0.80 },
      { min: 90000, max: null, taux: 1.0 },
    ],
    team_leader: [
      { min: 0, max: 90000, taux: 0.80 },
      { min: 90000, max: null, taux: 1.0 },
    ],
    direction: null,
  },
  override_team_leader: 0.1,
};

/** { mode, paliers, override_team_leader, cap_reset } — vue publique ou fallback. */
export async function getBaremePublic() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return BAREME_FALLBACK;
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    const { data, error } = await sb
      .from("v_bareme_remuneration_public")
      .select("mode, paliers, override_team_leader, cap_reset")
      .maybeSingle();
    if (error || !data || !data.paliers) return BAREME_FALLBACK;
    return {
      mode: data.mode || BAREME_FALLBACK.mode,
      cap_reset: data.cap_reset || BAREME_FALLBACK.cap_reset,
      paliers: data.paliers,
      override_team_leader:
        data.override_team_leader != null
          ? Number(data.override_team_leader)
          : BAREME_FALLBACK.override_team_leader,
    };
  } catch (e) {
    console.warn("[bareme] getBaremePublic:", e?.message || e);
    return BAREME_FALLBACK;
  }
}

const nf = new Intl.NumberFormat("fr-FR");
const eur = (n) => `${nf.format(Math.round(Number(n) || 0))} € HT`;
const pct = (t) => `${Math.round(Number(t) * 100)} %`;

/** Paliers d'un statut -> ["de 0 à 35 000 € HT : 70 %", …]. [] si non défini. */
export function palierLines(paliers, statut) {
  const arr = paliers && Array.isArray(paliers[statut]) ? paliers[statut] : null;
  if (!arr || !arr.length) return [];
  return arr
    .slice()
    .sort((a, b) => Number(a.min) - Number(b.min))
    .map((p) =>
      p.max == null
        ? `à partir de ${eur(p.min)} : ${pct(p.taux)}`
        : `de ${eur(p.min)} à ${eur(p.max)} : ${pct(p.taux)}`,
    );
}

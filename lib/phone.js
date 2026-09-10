import { parsePhoneNumberFromString } from "libphonenumber-js/max";

/**
 * Normalisation téléphone — site public (bloc « conseiller responsable »).
 *
 * `libphonenumber-js/max` (métadonnées complètes : la version `min` renvoie
 * `getType()` undefined pour MQ / GP / GF). Version alignée sur E4.0 : 1.13.12.
 *
 * La liste des mobiles acceptés est FIGÉE (E4.0) et STRICTEMENT identique à :
 *   - la garde SQL `public.profiles_publication_tel_guard`
 *     (2026-09-10_bloc_conseiller.sql) ;
 *   - `lyat-phone.js` de l'Espace Conseiller.
 * Toute évolution doit être répercutée aux trois endroits.
 */

// +33 6/7 · +596 696/697 · +590 690/691 · +594 694
const MOBILE_RE = /^\+(33[67]\d{8}|596(?:696|697)\d{6}|590(?:690|691)\d{6}|594694\d{6})$/;
const SEP_RE = /[\s.()–—-]/g;

/** E.164 (`+596696123456`) ou null si non interprétable. */
export function toE164(input, defaultRegion) {
  const raw = String(input ?? "").trim();
  if (!raw) return null;
  try {
    // `isPossible()` (longueur plausible) et non `isValid()` : les métadonnées
    // libphonenumber 1.13.12 ne reconnaissent pas encore la plage GP `+590 691`
    // pourtant figée en E4.0 / dans la garde SQL. `isPossible()` l'accepte et
    // écarte les entrées absurdes (`abc123` -> `+596123`).
    const pn = parsePhoneNumberFromString(raw, defaultRegion || undefined);
    if (pn && pn.isPossible()) return pn.number;
  } catch {
    /* ignore */
  }
  const compact = raw.replace(/[^\d+]/g, "");
  return /^\+\d{8,15}$/.test(compact) ? compact : null;
}

/** true si l'E.164 est un mobile de publication reconnu (liste figée). */
export function isMobile(e164) {
  return MOBILE_RE.test(String(e164 || "").replace(/\s+/g, ""));
}

/** Forme nationale lisible (`0696 12 34 56`), sinon la valeur telle quelle. */
export function formatNational(e164) {
  try {
    const pn = parsePhoneNumberFromString(String(e164 || ""));
    if (pn) return pn.formatNational();
  } catch {
    /* ignore */
  }
  return String(e164 || "");
}

/**
 * Lien `https://wa.me/<E.164 sans +>` (+ `?text=` encodé si `message`).
 * null si l'entrée n'est pas un E.164 exploitable.
 */
export function toWaMe(e164, message) {
  const v = String(e164 || "").replace(/[^\d+]/g, "");
  if (!/^\+\d{8,15}$/.test(v)) return null;
  const digits = v.slice(1);
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}

/**
 * Valeur pour un `href="tel:"` sans deviner de territoire : on compacte les
 * séparateurs et on convertit un préfixe `00` en `+`. Un national reste tel
 * quel (composable en local). Remplace l'ancien `replace(/\s+/g,"")` du
 * mini-site — seule retouche autorisée de ce composant.
 */
export function telHref(raw) {
  let v = String(raw || "").trim().replace(SEP_RE, "");
  if (v.startsWith("00")) v = "+" + v.slice(2);
  return v;
}

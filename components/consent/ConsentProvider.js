"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VERSION,
  CONSENTABLE_CATEGORIES,
} from "@/lib/consent/config";

/**
 * Gestionnaire de consentement centralisé — consentement PAR CATÉGORIE.
 *
 * Source de vérité unique : le cookie first-party `lyat_consent` (aucune donnée
 * personnelle). Format v3 :
 *
 *   { "v": 3, "c": { "external": true|false, "analytics": true|false }, "t": "AAAA-MM-JJ" }
 *
 * Les cookies v2 (ancien binaire { "v":2, "s":"accepted"|"rejected" }) sont
 * migrés : "accepted" -> toutes catégories acceptées, "rejected" -> toutes
 * refusées, sans re-solliciter l'utilisateur.
 *
 * `useConsent()` expose :
 *   ready         : true une fois l'hydratation client faite (évite le flash de bandeau)
 *   decided       : true si un choix explicite (ou migré) existe -> le bandeau se masque
 *   categories    : { necessary:true, external:bool, analytics:bool }
 *   isAllowed(id) : booléen (necessary toujours true)
 *   acceptAll() / rejectAll()
 *   setCategories(partial) : fusionne et enregistre
 */

const listeners = new Set();
function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function readCookie(name) {
  if (typeof document === "undefined") return "";
  const escaped = name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&");
  const match = document.cookie.match(new RegExp("(?:^|; )" + escaped + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : "";
}

function writeCookie(name, value, maxAgeDays) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; Path=/; Max-Age=" +
    Math.round(maxAgeDays * 24 * 60 * 60) +
    "; SameSite=Lax" +
    secure;
}

const NONE = Object.fromEntries(CONSENTABLE_CATEGORIES.map((c) => [c, false]));
const ALL = Object.fromEntries(CONSENTABLE_CATEGORIES.map((c) => [c, true]));

/** Interprète la chaîne brute du cookie -> { decided, categories, legacyV2 }. */
function parseState(raw) {
  if (raw) {
    try {
      const p = JSON.parse(raw);
      if (p && p.v === CONSENT_VERSION && p.c && typeof p.c === "object") {
        const categories = {};
        for (const c of CONSENTABLE_CATEGORIES) categories[c] = p.c[c] === true;
        return { decided: true, categories, legacyV2: false };
      }
      if (p && p.v === 2 && (p.s === "accepted" || p.s === "rejected")) {
        // v2 "accepted" : à l'époque, seule la catégorie "Contenus externes"
        // était réellement en jeu (aucun outil publicité / mesure d'audience
        // actif). On ne présume donc PAS du consentement analytics — il reste
        // refusé ; l'utilisateur l'activera explicitement via le nouveau
        // réglage granulaire (c'est le sens du passage à CONSENT_VERSION 3).
        return {
          decided: true,
          categories: { ...NONE, external: p.s === "accepted" },
          legacyV2: true,
        };
      }
    } catch {
      /* cookie illisible / version inconnue -> pending */
    }
  }
  return { decided: false, categories: { ...NONE }, legacyV2: false };
}

const clientCookieSnapshot = () => readCookie(CONSENT_COOKIE);
const serverCookieSnapshot = () => "";
const clientReady = () => true;
const serverReady = () => false;

/** Écrit le cookie au format v3 et notifie tous les abonnés. */
export function persistConsent(categories) {
  const c = {};
  for (const k of CONSENTABLE_CATEGORIES) c[k] = categories?.[k] === true;
  writeCookie(
    CONSENT_COOKIE,
    JSON.stringify({ v: CONSENT_VERSION, c, t: new Date().toISOString().slice(0, 10) }),
    CONSENT_MAX_AGE_DAYS
  );
  listeners.forEach((l) => l());
}

export function useConsent() {
  const raw = useSyncExternalStore(subscribe, clientCookieSnapshot, serverCookieSnapshot);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const { decided, categories } = parseState(raw);

  const setCategories = useCallback((partial) => {
    const current = parseState(readCookie(CONSENT_COOKIE)).categories;
    persistConsent({ ...current, ...partial });
  }, []);
  const acceptAll = useCallback(() => persistConsent(ALL), []);
  const rejectAll = useCallback(() => persistConsent(NONE), []);
  const isAllowed = useCallback(
    (category) => category === "necessary" || categories[category] === true,
    [categories]
  );

  return {
    ready,
    decided,
    categories: { necessary: true, ...categories },
    isAllowed,
    acceptAll,
    rejectAll,
    setCategories,
  };
}

/**
 * Point de montage stable dans le layout. Migre une fois un éventuel cookie v2
 * vers le format v3 (réécriture silencieuse, choix conservé).
 */
export function ConsentProvider({ children }) {
  useEffect(() => {
    const { decided, categories, legacyV2 } = parseState(readCookie(CONSENT_COOKIE));
    if (decided && legacyV2) persistConsent(categories);
  }, []);
  return children;
}

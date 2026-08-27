"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VERSION,
  CONSENT_STATUS,
} from "@/lib/consent/config";

/**
 * Gestionnaire de consentement centralisé.
 *
 * Source de vérité unique : le cookie first-party `lyat_consent` (aucune donnée
 * personnelle). L'état est exposé aux composants via `useConsent()` :
 *
 *   status : "pending" | "accepted" | "rejected"
 *   ready  : true une fois l'hydratation client faite (évite tout flash de bandeau)
 *   accept() / reject() : enregistrent le choix et notifient tous les abonnés
 *
 * Implémenté avec `useSyncExternalStore` : pas de contexte à propager, pas d'effet,
 * cohérent SSR/hydratation. `ConsentProvider` reste un point de montage stable
 * dans le layout pour d'éventuelles évolutions (UI plus granulaire, etc.).
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

function parseStatus(raw) {
  if (!raw) return CONSENT_STATUS.PENDING;
  try {
    const p = JSON.parse(raw);
    if (
      p &&
      p.v === CONSENT_VERSION &&
      (p.s === CONSENT_STATUS.ACCEPTED || p.s === CONSENT_STATUS.REJECTED)
    ) {
      return p.s;
    }
  } catch {
    /* cookie illisible ou version antérieure → "pending" */
  }
  return CONSENT_STATUS.PENDING;
}

// Snapshots pour useSyncExternalStore — chaîne brute du cookie (comparée par valeur).
const clientCookieSnapshot = () => readCookie(CONSENT_COOKIE);
const serverCookieSnapshot = () => "";
const clientReady = () => true;
const serverReady = () => false;

/** Enregistre le choix et notifie tous les abonnés. */
export function setConsent(next) {
  writeCookie(
    CONSENT_COOKIE,
    JSON.stringify({
      v: CONSENT_VERSION,
      s: next,
      t: new Date().toISOString().slice(0, 10),
    }),
    CONSENT_MAX_AGE_DAYS
  );
  listeners.forEach((l) => l());
}

export function useConsent() {
  const raw = useSyncExternalStore(subscribe, clientCookieSnapshot, serverCookieSnapshot);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const accept = useCallback(() => setConsent(CONSENT_STATUS.ACCEPTED), []);
  const reject = useCallback(() => setConsent(CONSENT_STATUS.REJECTED), []);
  return { status: parseStatus(raw), ready, accept, reject };
}

/** Point de montage stable — n'ajoute aucun comportement pour l'instant. */
export function ConsentProvider({ children }) {
  return children;
}

"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";

/**
 * Charge un <script> tiers (next/script) UNIQUEMENT si la catégorie de
 * consentement `category` est acceptée.
 *
 *   catégorie non acceptée -> rien n'est rendu, aucune requête, aucun cookie tiers
 *   catégorie acceptée      -> le <Script> est monté et exécuté
 *
 * Réagit dynamiquement : si la catégorie est retirée, le composant cesse de
 * rendre le <Script> (un script déjà exécuté ne peut pas être « dé-exécuté » —
 * la page /cookies force un rechargement lors d'un retrait pour garantir l'arrêt).
 *
 * Mécanisme générique, à réutiliser pour tout futur script marketing / analytics
 * (ex. pixel Meta) sans retoucher le système de consentement :
 *
 *   <ConsentGatedScript category="analytics" id="mon-script" strategy="afterInteractive"
 *     src="https://exemple.tld/script.js" />
 *
 *   <ConsentGatedScript category="analytics" id="inline" strategy="afterInteractive">
 *     {`console.log('chargé après consentement');`}
 *   </ConsentGatedScript>
 */
export default function ConsentGatedScript({ category, children, ...scriptProps }) {
  const { isAllowed } = useConsent();
  if (!category || !isAllowed(category)) return null;
  return <Script {...scriptProps}>{children}</Script>;
}

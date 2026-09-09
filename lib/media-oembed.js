import { cache } from "react";

/**
 * Dimensions réelles d'une vidéo YouTube / Vimeo via l'endpoint oEmbed public
 * du fournisseur (aucun jeton requis).
 *
 *   getVideoRatio(provider, oembedUrl) -> { w, h, ratio } | null
 *
 * - Résultat mis en cache 24 h (Next Data Cache, `next: { revalidate }`) et
 *   mémoïsé par rendu (React `cache`).
 * - Délai maximum 3 s (AbortController) : au-delà, ou en cas d'échec / réponse
 *   invalide, renvoie `null` — le rendu de la page n'est jamais bloqué et
 *   l'appelant retombe sur l'indice d'orientation ou le 16/9 par défaut.
 * - Meta (Facebook / Instagram) n'est pas géré ici : leur oEmbed exige un
 *   jeton d'application.
 */

const ENDPOINT = {
  YouTube: (url) => `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  Vimeo: (url) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
};

const REVALIDATE_SECONDS = 24 * 60 * 60; // 24 h
const TIMEOUT_MS = 3000;

export const getVideoRatio = cache(async (provider, oembedUrl) => {
  const build = ENDPOINT[provider];
  if (!build || !oembedUrl) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(build(oembedUrl), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const w = Number(data?.width);
    const h = Number(data?.height);
    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
      return { w, h, ratio: w / h };
    }
    return null;
  } catch {
    return null; // timeout, réseau, JSON invalide…
  } finally {
    clearTimeout(timer);
  }
});

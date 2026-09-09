/**
 * Analyse l'URL du champ « lien » Transactimo (bloc vidéo / visite virtuelle
 * d'une fiche bien) et renvoie de quoi l'afficher correctement.
 *
 *   analyzeMediaUrl(raw) -> null si le champ est vide,
 *   sinon { type, provider, title, embedUrl, href }
 *
 *   type "video"   : YouTube, Vimeo                       -> iframe (embedUrl)
 *   type "visite"  : Matterport, Klapty, Nodalview,
 *                    Previsite, Kuula                     -> iframe (embedUrl = URL fournie)
 *   type "social"  : Instagram, TikTok, Facebook          -> iframe (embedUrl = URL d'embed du plugin)
 *   type "externe" : tout le reste, ou lien court non
 *                    résolvable côté serveur (vm.tiktok…) -> pas d'iframe, bouton
 *
 * Fonction PURE : aucun accès réseau. Un lien raccourci qui exigerait une
 * requête HTTP pour retrouver l'identifiant retombe volontairement en "externe".
 *
 *   href        : URL à ouvrir dans un nouvel onglet (toujours présente)
 *   embedUrl    : URL à mettre dans l'iframe (null pour "externe")
 *   title       : libellé du bloc — "Vidéo" | "Visite virtuelle" | "Publication"
 *   provider    : "YouTube", "Matterport"… (pour le bandeau de consentement)
 *   orientation : "vertical" | "horizontal" | null — indice de format déduit de
 *                 l'URL (YouTube /shorts/, Facebook /reel/ vs /videos/…). null =
 *                 inconnu ; à affiner via oEmbed pour YouTube / Vimeo.
 *   oembedUrl   : (vidéos YouTube / Vimeo) URL à passer à l'endpoint oEmbed du
 *                 fournisseur pour récupérer les dimensions réelles.
 *
 * `mediaLayout(media, ratioInfo)` (plus bas) convertit tout ça en
 * { vertical, aspectRatio } pour l'affichage.
 */
export function analyzeMediaUrl(raw) {
  const input = String(raw || "").trim();
  if (!input) return null;

  const withProto = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  let u;
  try {
    u = new URL(withProto);
  } catch {
    return { type: "externe", provider: null, title: "Visite virtuelle", embedUrl: null, href: withProto };
  }

  const host = u.hostname.replace(/^www\./i, "").toLowerCase();
  const href = u.href;
  const externe = (provider, title = "Visite virtuelle") => ({
    type: "externe",
    provider,
    title,
    embedUrl: null,
    href,
  });

  /* ----------------------------- YouTube ----------------------------- */
  if (host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be" || host === "youtube-nocookie.com") {
    let id = "";
    const isShorts = /\/shorts\//.test(u.pathname);
    if (host === "youtu.be") {
      id = u.pathname.split("/").filter(Boolean)[0] || "";
    } else if (u.pathname === "/watch" || u.pathname === "/watch/") {
      id = u.searchParams.get("v") || "";
    } else {
      const m = u.pathname.match(/\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{6,})/);
      if (m) id = m[1];
    }
    if (/^[A-Za-z0-9_-]{6,}$/.test(id)) {
      return {
        type: "video",
        provider: "YouTube",
        title: "Vidéo",
        embedUrl: `https://www.youtube.com/embed/${id}`,
        // oEmbed : un Short DOIT être interrogé via son URL /shorts/ (l'URL
        // /watch renvoie des dimensions 16:9 génériques).
        oembedUrl: isShorts
          ? `https://www.youtube.com/shorts/${id}`
          : `https://www.youtube.com/watch?v=${id}`,
        orientation: isShorts ? "vertical" : null,
        href,
      };
    }
    return externe("YouTube", "Vidéo");
  }

  /* ------------------------------ Vimeo ------------------------------ */
  if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
    if (host === "player.vimeo.com") {
      const pid = (u.pathname.match(/\/video\/(\d+)/) || [])[1] || "";
      const phash = u.searchParams.get("h") || "";
      return {
        type: "video",
        provider: "Vimeo",
        title: "Vidéo",
        embedUrl: href,
        oembedUrl: pid
          ? `https://vimeo.com/${pid}${phash ? `?h=${phash}` : ""}`
          : href,
        orientation: null,
        href,
      };
    }
    const parts = u.pathname.split("/").filter(Boolean);
    const i = parts.findIndex((p) => /^\d+$/.test(p));
    if (i !== -1) {
      const id = parts[i];
      const hash = parts[i + 1] && /^[A-Za-z0-9]+$/.test(parts[i + 1]) ? parts[i + 1] : "";
      return {
        type: "video",
        provider: "Vimeo",
        title: "Vidéo",
        embedUrl: `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}`,
        oembedUrl: `https://vimeo.com/${id}${hash ? `?h=${hash}` : ""}`,
        orientation: null,
        href,
      };
    }
    return externe("Vimeo", "Vidéo");
  }

  /* ------------------ Visites virtuelles (URL conservée) ------------------ */
  const VISITE = [
    ["matterport.com", "Matterport"],
    ["klapty.com", "Klapty"],
    ["nodalview.com", "Nodalview"],
    ["previsite.com", "Previsite"],
    ["kuula.co", "Kuula"],
  ];
  for (const [domain, name] of VISITE) {
    if (host === domain || host.endsWith(`.${domain}`)) {
      return { type: "visite", provider: name, title: "Visite virtuelle", embedUrl: href, href };
    }
  }

  /* ---------------------------- Instagram ---------------------------- */
  if (host === "instagram.com" || host.endsWith(".instagram.com") || host === "instagr.am") {
    const m = u.pathname.match(/\/(p|reel|reels|tv)\/([^/?#]+)/i);
    if (m) {
      const seg = m[1].toLowerCase() === "reels" ? "reel" : m[1].toLowerCase();
      return {
        type: "social",
        provider: "Instagram",
        title: seg === "reel" ? "Vidéo" : "Publication",
        embedUrl: `https://www.instagram.com/${seg}/${m[2]}/embed`,
        href,
      };
    }
    return externe("Instagram", "Publication");
  }

  /* ------------------------------ TikTok ----------------------------- */
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    // Liens raccourcis : identifiant non déterminable sans requête -> externe.
    if (host === "vm.tiktok.com" || host === "vt.tiktok.com") return externe("TikTok", "Vidéo");
    const m = u.pathname.match(/\/video\/(\d+)/) || u.pathname.match(/\/embed\/v2\/(\d+)/);
    if (m) {
      return { type: "social", provider: "TikTok", title: "Vidéo", embedUrl: `https://www.tiktok.com/embed/v2/${m[1]}`, href };
    }
    return externe("TikTok", "Vidéo");
  }

  /* ----------------------------- Facebook ---------------------------- */
  if (host === "facebook.com" || host.endsWith(".facebook.com") || host === "fb.watch" || host === "fb.me") {
    const enc = encodeURIComponent(href);
    const isReel = /\/reels?\//.test(u.pathname);
    const isVideo =
      isReel ||
      host === "fb.watch" ||
      /\/videos?\//.test(u.pathname) ||
      u.pathname === "/watch" ||
      u.pathname === "/watch/";
    if (isVideo) {
      return {
        type: "social",
        provider: "Facebook",
        title: "Vidéo",
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${enc}&show_text=false`,
        // Meta n'expose pas d'oEmbed sans jeton d'application : on se fie à l'URL.
        orientation: isReel ? "vertical" : "horizontal",
        href,
      };
    }
    return {
      type: "social",
      provider: "Facebook",
      title: "Publication",
      embedUrl: `https://www.facebook.com/plugins/post.php?href=${enc}`,
      orientation: null,
      href,
    };
  }

  /* ------------------------------ Défaut ----------------------------- */
  return { type: "externe", provider: null, title: "Visite virtuelle", embedUrl: null, href };
}

const H16_9 = { vertical: false, aspectRatio: "16 / 9" };
const V9_16 = { vertical: true, aspectRatio: "9 / 16" };

/**
 * Format d'affichage du cadre média -> { vertical, aspectRatio }.
 *
 *   media     : résultat de analyzeMediaUrl
 *   ratioInfo : { w, h, ratio } issu de l'oEmbed (vidéos YouTube / Vimeo), ou null
 *
 * Règles :
 *   - visite / externe / post          -> 16/9 pleine largeur
 *   - Instagram, TikTok                 -> 9/16 fixe (inchangé)
 *   - Facebook : /reel/ -> 9/16, sinon  -> 16/9
 *   - vidéo YouTube / Vimeo :
 *       oEmbed ratio < 1  -> vertical, aspect-ratio réel (w/h)
 *       oEmbed ratio >= 1 -> 16/9
 *       pas d'oEmbed      -> indice `orientation` (/shorts/) sinon 16/9
 */
export function mediaLayout(media, ratioInfo) {
  if (!media || media.type === "externe" || media.type === "visite") return H16_9;

  if (media.type === "social") {
    if (media.provider === "Facebook") {
      return media.orientation === "vertical" ? V9_16 : H16_9;
    }
    return V9_16; // Instagram, TikTok
  }

  // media.type === "video"
  if (ratioInfo && ratioInfo.w > 0 && ratioInfo.h > 0) {
    return ratioInfo.ratio < 1
      ? { vertical: true, aspectRatio: `${ratioInfo.w} / ${ratioInfo.h}` }
      : H16_9;
  }
  return media.orientation === "vertical" ? V9_16 : H16_9;
}

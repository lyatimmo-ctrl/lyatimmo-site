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
 *   href     : URL à ouvrir dans un nouvel onglet (toujours présente)
 *   embedUrl : URL à mettre dans l'iframe (null pour "externe")
 *   title    : libellé du bloc — "Vidéo" | "Visite virtuelle" | "Publication"
 *   provider : "YouTube", "Matterport"… (pour le bandeau de consentement)
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
    if (host === "youtu.be") {
      id = u.pathname.split("/").filter(Boolean)[0] || "";
    } else if (u.pathname === "/watch" || u.pathname === "/watch/") {
      id = u.searchParams.get("v") || "";
    } else {
      const m = u.pathname.match(/\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{6,})/);
      if (m) id = m[1];
    }
    if (/^[A-Za-z0-9_-]{6,}$/.test(id)) {
      return { type: "video", provider: "YouTube", title: "Vidéo", embedUrl: `https://www.youtube.com/embed/${id}`, href };
    }
    return externe("YouTube", "Vidéo");
  }

  /* ------------------------------ Vimeo ------------------------------ */
  if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
    if (host === "player.vimeo.com") {
      return { type: "video", provider: "Vimeo", title: "Vidéo", embedUrl: href, href };
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
    const isVideo =
      host === "fb.watch" ||
      /\/videos?\//.test(u.pathname) ||
      u.pathname === "/watch" ||
      u.pathname === "/watch/" ||
      u.pathname.startsWith("/reel/");
    if (isVideo) {
      return {
        type: "social",
        provider: "Facebook",
        title: "Vidéo",
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${enc}&show_text=false`,
        href,
      };
    }
    return {
      type: "social",
      provider: "Facebook",
      title: "Publication",
      embedUrl: `https://www.facebook.com/plugins/post.php?href=${enc}`,
      href,
    };
  }

  /* ------------------------------ Défaut ----------------------------- */
  return { type: "externe", provider: null, title: "Visite virtuelle", embedUrl: null, href };
}

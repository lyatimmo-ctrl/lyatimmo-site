// Génère /sitemap.xml (convention Next.js App Router).
import { listPublishedMinisites } from "@/lib/minisites";

const SITE_URL = "https://lyatimmo.com";

const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/biens", changeFrequency: "daily", priority: 0.9 },
  { path: "/conseillers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/nous-rejoindre", changeFrequency: "monthly", priority: 0.7 },
  { path: "/honoraires", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap() {
  const now = new Date();
  const base = ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Mini-sites conseillers publiés (statut='publie' + profil actif). Les
  // conseillers suspendus / partis ne sont pas dans v_minisite_index -> exclus.
  let conseillers = [];
  try {
    const rows = await listPublishedMinisites();
    conseillers = rows.map((c) => ({
      url: `${SITE_URL}/conseillers/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    conseillers = [];
  }

  return [...base, ...conseillers];
}

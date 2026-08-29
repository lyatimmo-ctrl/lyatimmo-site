// Génère /sitemap.xml (convention Next.js App Router).
const SITE_URL = "https://lyatimmo.com";

const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/biens", changeFrequency: "daily", priority: 0.9 },
  { path: "/nous-rejoindre", changeFrequency: "monthly", priority: 0.7 },
  { path: "/honoraires", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap() {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

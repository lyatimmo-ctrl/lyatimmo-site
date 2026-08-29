// Génère /robots.txt (convention Next.js App Router).
const SITE_URL = "https://lyatimmo.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

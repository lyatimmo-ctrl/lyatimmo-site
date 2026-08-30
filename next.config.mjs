/** @type {import('next').NextConfig} */

// Hôte du Storage Supabase (photos des conseillers, mini-sites) — dérivé de
// l'URL publique du projet pour ne pas coder le sous-domaine en dur.
let supabaseHost;
try {
  supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname || undefined;
} catch {
  supabaseHost = undefined;
}

const remotePatterns = [
  // Photos des annonces hébergées par Transactimo (lien direct, v1).
  { protocol: "https", hostname: "lyat.transactimo.com", pathname: "/photos/**" },
];
if (supabaseHost) {
  remotePatterns.push({
    protocol: "https",
    hostname: supabaseHost,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig = {
  images: { remotePatterns },
};

export default nextConfig;

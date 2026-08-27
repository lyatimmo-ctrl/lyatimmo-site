/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Photos des annonces hebergees par Transactimo (lien direct, v1).
    remotePatterns: [
      { protocol: "https", hostname: "lyat.transactimo.com", pathname: "/photos/**" },
    ],
  },
};

export default nextConfig;

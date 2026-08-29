import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import ConsentBanner from "@/components/consent/ConsentBanner";
import MetaPixel from "@/components/consent/MetaPixel";

// Polices auto-hébergées par next/font : les fichiers sont téléchargés au build
// et servis depuis le domaine du site. Aucun appel vers fonts.googleapis.com
// ni fonts.gstatic.com au chargement d'une page — l'IP des visiteurs n'est
// plus transmise à Google pour l'affichage des polices.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://lyatimmo.com";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const SITE_TITLE = "LYAT IMMO — L'art de vendre avec exigence | Martinique";
const SITE_DESC =
  "Transaction et expertise immobilière en Martinique. LYAT IMMO accompagne vendeurs et acquéreurs avec exigence, de l'estimation à la signature.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  applicationName: "LYAT IMMO",
  authors: [{ name: "LYAT IMMO" }],
  keywords: [
    "immobilier Martinique",
    "agence immobilière Martinique",
    "estimation immobilière",
    "expertise immobilière",
    "vendre un bien Martinique",
    "acheter un bien Martinique",
    "LYAT IMMO",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "LYAT IMMO",
    locale: "fr_FR",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "LYAT IMMO — Transaction & Expertise Immobilière",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ConsentProvider>
          {children}
          <ConsentBanner />
          <MetaPixel />
        </ConsentProvider>
      </body>
    </html>
  );
}

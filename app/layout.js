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

export const metadata = {
  title: "LYAT IMMO — Transaction & expertise immobilière",
  description:
    "LYAT IMMO accompagne vendeurs et acquéreurs avec exigence : estimation, mise en valeur et suivi jusqu'à l'acte.",
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

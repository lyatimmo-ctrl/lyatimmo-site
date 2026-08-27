import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 md:px-14 pt-16 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12">
        <div>
          <span className="font-serif tracking-[0.28em] text-sm">
            LYAT IMMO
          </span>
          <p className="mt-4 text-[13px] leading-relaxed text-stone max-w-[260px]">
            Transaction et expertise immobilière. Une méthode exigeante, où
            que vous vendiez.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.16em] text-gold uppercase mb-4">
            Navigation
          </h4>
          <Link href="/biens" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            Nos biens
          </Link>
          <Link href="/#agence" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            Notre agence
          </Link>
          <Link href="/#services" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            Nos services
          </Link>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.16em] text-gold uppercase mb-4">
            Contact
          </h4>
          <a href="mailto:contact@lyatimmo.com" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            contact@lyatimmo.com
          </a>
          <a href="tel:+596696335811" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            0696 33 58 11
          </a>
          <Link href="/contact?motif=estimation" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            Demander une estimation
          </Link>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.16em] text-gold uppercase mb-4">
            Informations
          </h4>
          <Link href="/honoraires" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            Honoraires de l&apos;agence
          </Link>
          <Link href="/mentions-legales" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            Politique de confidentialité
          </Link>
          <Link href="/cookies" className="block text-[13px] mb-3 opacity-80 hover:opacity-100">
            Gestion des cookies
          </Link>
        </div>
      </div>
      <div className="border-t border-line pt-6 flex flex-wrap justify-between gap-3 text-[11px] tracking-[0.1em] text-stone">
        <span>© {new Date().getFullYear()} LYAT IMMO — Tous droits réservés</span>
        <span className="flex gap-2">
          <Link href="/mentions-legales" className="underline underline-offset-2">
            Mentions légales
          </Link>
          ·
          <Link href="/contact" className="underline underline-offset-2">
            Contact
          </Link>
        </span>
      </div>
    </footer>
  );
}

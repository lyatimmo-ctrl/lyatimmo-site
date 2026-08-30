import Link from "next/link";
import RoofMark from "./RoofMark";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-14 py-6 bg-gradient-to-b from-paper/95 to-transparent">
      <Link href="/" className="flex items-center gap-3.5 text-ink">
        <RoofMark className="w-5.5 h-3.5" />
        <span className="font-serif text-[15px] tracking-[0.3em]">
          LYAT IMMO
        </span>
      </Link>
      <div className="hidden md:flex gap-11 text-[12px] tracking-[0.18em] text-stone">
        <Link href="/biens" className="hover:text-ink transition-colors">
          Biens
        </Link>
        <Link href="/conseillers" className="hover:text-ink transition-colors">
          Conseillers
        </Link>
        <Link href="/#agence" className="hover:text-ink transition-colors">
          Notre agence
        </Link>
        <Link href="/#services" className="hover:text-ink transition-colors">
          Nos services
        </Link>
        <Link href="/nous-rejoindre" className="hover:text-ink transition-colors">
          Nous rejoindre
        </Link>
        <Link href="/contact" className="hover:text-ink transition-colors">
          Contact
        </Link>
      </div>
      <Link
        href="/contact?motif=estimation"
        className="text-[11px] tracking-[0.18em] border border-ink px-6 py-2.5 text-ink hover:bg-ink hover:text-paper transition-colors"
      >
        Estimer mon bien
      </Link>
    </nav>
  );
}

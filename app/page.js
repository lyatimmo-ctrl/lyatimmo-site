import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RoofMark from "@/components/RoofMark";
import SearchCard from "@/components/SearchCard";
import PropertyCard from "@/components/PropertyCard";
import { properties, propertyTypes } from "@/data/properties";

const typeIcons = {
  Appartement: (
    <>
      <rect x="4" y="3" width="16" height="18" />
      <line x1="8" y1="7" x2="10" y2="7" />
      <line x1="14" y1="7" x2="16" y2="7" />
      <line x1="8" y1="12" x2="10" y2="12" />
      <line x1="14" y1="12" x2="16" y2="12" />
      <line x1="10" y1="21" x2="10" y2="17" />
      <line x1="14" y1="21" x2="14" y2="17" />
    </>
  ),
  Maison: (
    <>
      <path d="M3 11L12 4L21 11" />
      <path d="M5 10V20H19V10" />
      <line x1="10" y1="20" x2="10" y2="14" />
      <line x1="14" y1="20" x2="14" y2="14" />
    </>
  ),
  Villa: (
    <>
      <path d="M3 12L12 5L21 12" />
      <path d="M6 11V20H18V11" />
      <rect x="10" y="14" width="4" height="6" />
      <line x1="8" y1="16" x2="8" y2="18" />
      <line x1="16" y1="16" x2="16" y2="18" />
    </>
  ),
  Immeuble: (
    <>
      <rect x="4" y="2" width="16" height="20" />
      <line x1="7" y1="6" x2="9" y2="6" />
      <line x1="11" y1="6" x2="13" y2="6" />
      <line x1="15" y1="6" x2="17" y2="6" />
      <line x1="7" y1="10" x2="9" y2="10" />
      <line x1="11" y1="10" x2="13" y2="10" />
      <line x1="15" y1="10" x2="17" y2="10" />
      <line x1="7" y1="14" x2="9" y2="14" />
      <line x1="11" y1="14" x2="13" y2="14" />
      <line x1="15" y1="14" x2="17" y2="14" />
    </>
  ),
  "Local commercial": (
    <>
      <rect x="3" y="9" width="18" height="11" />
      <path d="M8 9V6C8 4.5 9.3 3 12 3C14.7 3 16 4.5 16 6V9" />
    </>
  ),
  Bureau: (
    <>
      <rect x="5" y="4" width="14" height="16" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </>
  ),
};

export default function Home() {
  const featured = properties.slice(0, 3);

  return (
    <>
      <Nav />

      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-40 pb-20 relative">
        <RoofMark className="w-[92px] h-[58px] mb-9 text-ink animate-rise" style={{ animationDelay: "0.15s" }} />
        <h1 className="font-serif text-[48px] md:text-[110px] leading-[0.95] font-medium tracking-[0.02em] animate-rise" style={{ animationDelay: "0.35s" }}>
          L&apos;art de vendre
          <br />
          avec exigence
        </h1>
        <div className="mt-6 text-[13px] text-gold flex items-center gap-4 animate-rise" style={{ animationDelay: "0.55s" }}>
          <span className="w-9 h-px bg-gold" />
          <span className="track">Transaction &amp; expertise immobilière</span>
          <span className="w-9 h-px bg-gold" />
        </div>
        <p className="max-w-[480px] mt-8 text-[16px] leading-[1.75] text-stone animate-rise" style={{ animationDelay: "0.75s" }}>
          Estimation juste, mise en valeur soignée, accompagnement jusqu&apos;à
          l&apos;acte. Une méthode exigeante au service de chaque vendeur.
        </p>
        <div className="mt-11 flex gap-4 animate-rise" style={{ animationDelay: "0.95s" }}>
          <Link href="/contact" className="bg-ink text-paper px-9 py-4 text-[12px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity">
            Estimer mon bien
          </Link>
          <Link href="/biens" className="border-b border-ink px-1 py-4 text-[12px] tracking-[0.18em] uppercase">
            Voir la sélection
          </Link>
        </div>
      </section>

      <SearchCard />

      <section id="selection" className="pt-24 md:pt-14 pb-24 px-6 md:px-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-line pb-9">
          <div>
            <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
              Sélection en cours
            </span>
            <h2 className="font-serif text-[30px] md:text-[46px] font-medium max-w-[520px]">
              Des biens choisis, présentés avec exigence
            </h2>
          </div>
          <Link href="/biens" className="text-[12px] tracking-[0.18em] whitespace-nowrap">
            Toute la sélection →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line">
          {featured.map((p) => (
            <div key={p.slug} className="bg-paper px-2">
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-14 pb-24">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Tous types de biens
        </span>
        <h2 className="font-serif text-[30px] md:text-[46px] font-medium mb-9">
          Une expertise transversale
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 border-t border-l border-line">
          {propertyTypes.map((type) => (
            <div
              key={type}
              className="border-r border-b border-line px-4 py-8 text-center hover:bg-paper-deep transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#161513" strokeWidth="1.3" className="w-6 h-6 mx-auto mb-4">
                {typeIcons[type]}
              </svg>
              <span className="track text-[12px]">{type}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center py-20 bg-paper-deep">
        <svg viewBox="0 0 340 60" fill="none" className="w-[340px] max-w-[80%]">
          <path d="M0 40L85 6L170 40L255 6L340 40" stroke="#C6963E" strokeWidth="1.5" />
        </svg>
      </div>

      <section id="agence" className="px-6 md:px-14 py-24 md:py-28 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-20 bg-ink text-paper">
        <h2 className="font-serif text-[30px] md:text-[44px] font-medium leading-[1.15]">
          Vendre n&apos;est pas
          <br />
          seulement transiger.
        </h2>
        <div>
          <p className="text-[15px] leading-[1.9] text-[#C9C4B8] mb-6">
            LYAT IMMO accompagne chaque vendeur avec une conviction simple :
            un bien mérite une estimation rigoureuse, une présentation à la
            hauteur de sa valeur, et un suivi sans zone d&apos;ombre jusqu&apos;à
            la signature.
          </p>
          <p className="text-[15px] leading-[1.9] text-[#C9C4B8] mb-6">
            Expertise en droit immobilier, méthode éprouvée, et un principe
            non négociable : la transparence à chaque étape du mandat.
          </p>
          <div className="flex gap-14 mt-11">
            <Stat value="CFEI®" label="Certification" />
            <Stat value="M2" label="Droit immobilier" />
            <Stat value="100%" label="Transparence" />
          </div>
        </div>
      </section>

      <section id="services" className="px-6 md:px-14 py-24 md:py-28 bg-paper-deep">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Ce que nous faisons
        </span>
        <h2 className="font-serif text-[30px] md:text-[46px] font-medium max-w-[560px] mb-16">
          Nos services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
          <Service num="01 — Vente" title="Transaction" text="Estimation, mise en valeur, diffusion et négociation jusqu'à la signature. Notre cœur de métier." />
          <Service num="02 — Location" title="Mise en location" text="Recherche de locataire et gestion de la mise en location, en complément de notre activité de vente." />
          <Service num="03 — Expertise" title="Expertise immobilière" text="Estimation de valeur, analyse de marché et conseil sur la stratégie de vente la plus adaptée à votre bien." />
        </div>
      </section>

      <section id="contact" className="px-6 py-32 md:py-40 text-center">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Contact
        </span>
        <h2 className="font-serif text-[34px] md:text-[64px] font-medium max-w-[700px] mx-auto leading-[1.1]">
          Vous vendez ? Parlons de votre bien.
        </h2>
        <p className="max-w-[440px] mx-auto mt-6 mb-11 text-stone text-[15px] leading-[1.8]">
          Estimation sur place, sans engagement. Réponse sous 24h.
        </p>
        <Link href="/contact" className="bg-ink text-paper px-9 py-4 text-[12px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity">
          Demander une estimation
        </Link>
      </section>

      <Footer />
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <b className="block font-serif text-[34px] text-gold-soft font-medium">
        {value}
      </b>
      <span className="text-[11px] tracking-[0.14em] text-stone">
        {label}
      </span>
    </div>
  );
}

function Service({ num, title, text }) {
  return (
    <div className="border-t border-ink pt-6">
      <span className="text-[11px] tracking-[0.18em] text-gold block mb-4">
        {num}
      </span>
      <h3 className="font-serif text-[22px] font-medium mb-3.5">{title}</h3>
      <p className="text-[14px] leading-[1.75] text-stone">{text}</p>
    </div>
  );
}

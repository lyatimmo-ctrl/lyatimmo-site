import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Honoraires - LYAT IMMO" };

export default function HonorairesPage() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-24 max-w-[760px] mx-auto">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Transparence
        </span>
        <h1 className="font-serif text-[34px] md:text-[48px] font-medium mb-10">
          Honoraires de l&apos;agence
        </h1>
        <p className="text-stone text-[15px] leading-[1.8] mb-6">
          Le détail de notre grille d&apos;honoraires (vente et location) sera
          publié ici, conformément à la réglementation en vigueur. Cette page
          sera complétée avant la mise en ligne définitive du site.
        </p>
        <p className="text-stone text-[15px] leading-[1.8]">
          Pour toute question sur nos honoraires en attendant, contactez-nous
          directement.
        </p>
      </section>
      <Footer />
    </>
  );
}

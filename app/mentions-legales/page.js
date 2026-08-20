import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Mentions légales — LYAT IMMO" };

export default function MentionsLegalesPage() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-24 max-w-[760px] mx-auto">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Informations légales
        </span>
        <h1 className="font-serif text-[34px] md:text-[48px] font-medium mb-10">
          Mentions légales
        </h1>
        <div className="space-y-6 text-stone text-[15px] leading-[1.8]">
          <p>
            Cette page sera complétée avec les informations légales de la
            structure exploitant LYAT IMMO (raison sociale, SIREN, numéro de
            carte professionnelle, garantie financière, RCP, adresse du
            siège) avant la mise en ligne définitive du site.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

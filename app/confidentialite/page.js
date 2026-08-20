import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Politique de confidentialité — LYAT IMMO" };

export default function ConfidentialitePage() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-24 max-w-[760px] mx-auto">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          RGPD
        </span>
        <h1 className="font-serif text-[34px] md:text-[48px] font-medium mb-10">
          Politique de confidentialité
        </h1>
        <p className="text-stone text-[15px] leading-[1.8]">
          Cette page décrira le traitement des données collectées via le
          formulaire de contact (finalité, durée de conservation, droits
          d&apos;accès et de suppression), à compléter avant mise en ligne.
        </p>
      </section>
      <Footer />
    </>
  );
}

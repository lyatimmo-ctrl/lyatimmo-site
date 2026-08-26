import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Gestion des cookies — LYAT IMMO" };

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-24 max-w-[760px] mx-auto">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          RGPD
        </span>
        <h1 className="font-serif text-[34px] md:text-[48px] font-medium mb-10">
          Gestion des cookies
        </h1>
        <div className="space-y-6 text-stone text-[15px] leading-[1.8]">
          <p>
            En l&apos;état actuel du site, aucun cookie de mesure d&apos;audience
            ni de ciblage publicitaire n&apos;est déposé. Seuls des éléments
            techniques strictement nécessaires au fonctionnement du site
            peuvent être utilisés.
          </p>
          <p>
            Si des outils de mesure d&apos;audience ou de personnalisation
            venaient à être ajoutés, cette page sera mise à jour pour décrire
            précisément leur finalité, leur durée de conservation et les
            moyens de les refuser, conformément à la réglementation en
            vigueur.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Mentions légales — LYAT IMMO" };

const champs = [
  { label: "Dénomination sociale" },
  { label: "Forme juridique" },
  { label: "Capital social" },
  { label: "Adresse du siège social" },
  { label: "Numéro SIREN ou SIRET" },
  { label: "RCS et ville d'immatriculation" },
  { label: "Numéro de TVA intracommunautaire", note: "le cas échéant" },
  { label: "Numéro de carte professionnelle Transaction" },
  { label: "CCI ayant délivré la carte" },
  { label: "Assurance de responsabilité civile professionnelle" },
  { label: "Garantie financière", note: "ou mention de non-détention de fonds" },
  { label: "Directeur de la publication" },
  { label: "Identité et coordonnées de l'hébergeur" },
  { label: "Coordonnées du médiateur de la consommation" },
];

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
        <p className="text-stone text-[15px] leading-[1.8] mb-10">
          Cette page sera complétée avec les informations légales définitives
          de la structure exploitant LYAT IMMO avant la mise en ligne
          définitive du site. Les emplacements ci-dessous sont réservés à
          chacune de ces informations : aucune valeur n&apos;est encore
          renseignée.
        </p>
        <div className="space-y-5">
          {champs.map((c) => (
            <div key={c.label} className="border-b border-line pb-4">
              <p className="text-[10px] tracking-[0.14em] uppercase text-gold mb-1">
                {c.label}
                {c.note ? <span className="text-stone normal-case tracking-normal"> ({c.note})</span> : null}
              </p>
              <p className="text-stone text-[14px] italic">À compléter</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

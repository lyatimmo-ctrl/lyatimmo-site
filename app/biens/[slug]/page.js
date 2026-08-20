import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property) notFound();

  const priceLabel =
    property.transaction === "location"
      ? `${property.price.toLocaleString("fr-FR")} € / mois`
      : `${property.price.toLocaleString("fr-FR")} €`;

  return (
    <>
      <Nav />
      <section className="pt-32 px-6 md:px-14">
        <Link href="/biens" className="text-[12px] tracking-[0.14em] text-stone">
          ← Retour aux biens
        </Link>
      </section>

      <section className="px-6 md:px-14 py-10 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12">
        <div className="aspect-[4/3] bg-paper-deep relative">
          <div className="absolute inset-5 border border-ink/10 flex items-end p-6">
            <span className="text-[10px] tracking-[0.16em] text-gold bg-paper px-3 py-1.5">
              {property.tag}
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] tracking-[0.16em] text-stone uppercase mb-3">
            {property.commune} · {property.type}
          </div>
          <h1 className="font-serif text-[32px] md:text-[42px] font-medium mb-5">
            {property.title}
          </h1>
          <div className="text-2xl font-serif text-gold mb-8">{priceLabel}</div>

          <div className="grid grid-cols-3 border-t border-b border-line py-6 mb-8">
            <Metric label="Surface" value={`${property.surface} m²`} />
            <Metric label="Pièces" value={property.pieces} />
            <Metric label="Chambres" value={property.chambres} />
          </div>

          <p className="text-[15px] leading-[1.8] text-stone mb-10">
            {property.description}
          </p>

          <Link
            href="/contact"
            className="block text-center bg-ink text-paper px-9 py-4 text-[12px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity"
          >
            Contacter l&apos;agence pour ce bien
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Metric({ label, value }) {
  return (
    <div className="text-center">
      <div className="font-serif text-xl mb-1.5">{value}</div>
      <div className="text-[10px] tracking-[0.12em] uppercase text-stone">
        {label}
      </div>
    </div>
  );
}

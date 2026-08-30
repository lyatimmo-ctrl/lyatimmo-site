import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { listPublishedMinisites } from "@/lib/minisites";

export const revalidate = 900;

const SITE_URL = "https://lyatimmo.com";

export const metadata = {
  title: "Nos conseillers immobiliers | LYAT IMMO",
  description:
    "Les conseillers du réseau LYAT IMMO en Martinique : présentation, secteurs d'intervention et prise de contact directe.",
  alternates: { canonical: `${SITE_URL}/conseillers` },
  robots: { index: true, follow: true },
};

export default async function ConseillersIndex() {
  const rows = await listPublishedMinisites();

  return (
    <>
      <Nav />
      <section className="pt-32 px-6 md:px-14 pb-10">
        <div className="text-[10px] tracking-[0.18em] uppercase text-gold mb-3">LYAT IMMO</div>
        <h1 className="font-serif text-[34px] md:text-[46px] font-medium text-ink">Nos conseillers</h1>
        <p className="mt-4 text-[15px] text-stone leading-[1.8] max-w-[620px]">
          Chaque conseiller LYAT IMMO accompagne ses clients avec la même méthode exigeante.
          Choisissez votre interlocuteur par secteur et contactez-le directement.
        </p>
      </section>

      <section className="px-6 md:px-14 pb-24">
        {rows.length === 0 ? (
          <p className="text-[14px] text-stone italic">Les pages conseillers seront bientôt disponibles.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rows.map((c) => {
              const nom = [c.prenom, c.nom].filter(Boolean).join(" ");
              return (
                <li key={c.slug}>
                  <Link href={`/conseillers/${c.slug}`} className="group block border border-line bg-paper hover:-translate-y-1 transition-transform">
                    <div className="relative w-full bg-paper-deep" style={{ aspectRatio: "1 / 1" }}>
                      {c.photo_url ? (
                        <Image src={c.photo_url} alt={nom} fill className="object-cover"
                          sizes="(max-width:1024px) 50vw, 33vw" unoptimized />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h2 className="font-serif text-[20px] text-ink group-hover:text-gold transition-colors">
                        {nom}
                      </h2>
                      {Array.isArray(c.secteurs) && c.secteurs.length > 0 && (
                        <div className="mt-1 text-[11px] tracking-[0.12em] uppercase text-stone">
                          {c.secteurs.slice(0, 3).join(" · ")}
                        </div>
                      )}
                      {c.phrase_accroche && (
                        <p className="mt-3 text-[13px] text-stone leading-[1.7] line-clamp-3">
                          {c.phrase_accroche}
                        </p>
                      )}
                      {Number(c.nb_transactions_accompagnees) > 0 && (
                        <div className="mt-3 text-[12px] text-stone">
                          {c.nb_transactions_accompagnees} transaction
                          {c.nb_transactions_accompagnees > 1 ? "s" : ""} accompagnée
                          {c.nb_transactions_accompagnees > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Footer />
    </>
  );
}

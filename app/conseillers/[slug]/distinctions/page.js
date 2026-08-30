import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BadgeSeal from "@/components/minisite/BadgeSeal";
import { getMinisite, getMinisiteBadges, sortBadges } from "@/lib/minisites";

export const revalidate = 900;

const SITE_URL = "https://lyatimmo.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const profil = await getMinisite(slug);
  if (!profil) return { title: "Distinctions — LYAT IMMO", robots: { index: false, follow: true } };
  const nom = [profil.prenom, profil.nom].filter(Boolean).join(" ");
  return {
    title: `Distinctions de ${nom} | LYAT IMMO`,
    description: `Les distinctions et paliers d'accompagnement de ${nom}, conseiller immobilier LYAT IMMO.`,
    alternates: { canonical: `${SITE_URL}/conseillers/${slug}/distinctions` },
    robots: { index: true, follow: true },
  };
}

export default async function DistinctionsPage({ params }) {
  const { slug } = await params;
  const [profil, badges] = await Promise.all([getMinisite(slug), getMinisiteBadges(slug)]);
  if (!profil) notFound();

  const nom = [profil.prenom, profil.nom].filter(Boolean).join(" ");
  const ordered = sortBadges(badges);
  const groups = [
    { key: "annuel", titre: "Distinctions annuelles", items: ordered.filter((b) => b.scope === "annuel") },
    {
      key: "accomplissement",
      titre: "Paliers d'accompagnement",
      items: ordered.filter((b) => b.scope !== "annuel" && b.nature === "accomplissement"),
    },
    { key: "fonction", titre: "Fonction dans le réseau", items: ordered.filter((b) => b.nature === "fonction") },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <Nav />
      <section className="pt-32 px-6 md:px-14 pb-10">
        <Link href={`/conseillers/${slug}`} className="text-[12px] tracking-[0.14em] text-stone">
          &larr; Retour au profil de {nom}
        </Link>
        <h1 className="mt-6 font-serif text-[32px] md:text-[42px] font-medium text-ink">
          Distinctions de {nom}
        </h1>
        <p className="mt-3 text-[14px] text-stone max-w-[560px] leading-[1.7]">
          Reconnaissances attribuées par LYAT IMMO. Survolez un sceau pour son explication.
        </p>
      </section>

      {badges.length === 0 ? (
        <section className="px-6 md:px-14 pb-24">
          <p className="text-[14px] text-stone italic">Aucune distinction pour le moment.</p>
        </section>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="px-6 md:px-14 py-10 border-t border-line">
            <h2 className="text-[10px] tracking-[0.18em] uppercase text-gold mb-8">{g.titre}</h2>
            <div className="flex flex-wrap items-end gap-x-9 gap-y-10">
              {g.items.map((b) => (
                <BadgeSeal key={b.code + (b.annee || "")} badge={b} size={82} />
              ))}
            </div>
          </section>
        ))
      )}

      <section className="px-6 md:px-14 py-12 border-t border-line">
        <Link
          href={`/conseillers/${slug}`}
          className="inline-block text-[11px] tracking-[0.18em] uppercase text-ink border-b border-gold pb-1 hover:text-gold transition-colors"
        >
          Revenir au mini-site
        </Link>
      </section>

      <Footer />
    </>
  );
}

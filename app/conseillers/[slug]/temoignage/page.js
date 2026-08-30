import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TemoignageForm from "@/components/minisite/TemoignageForm";
import { getMinisite } from "@/lib/minisites";

export const revalidate = 900;

export const metadata = {
  title: "Laisser un témoignage | LYAT IMMO",
  robots: { index: false, follow: true },
};

export default async function TemoignagePage({ params }) {
  const { slug } = await params;
  const profil = await getMinisite(slug);
  if (!profil) notFound();
  const nom = [profil.prenom, profil.nom].filter(Boolean).join(" ");

  return (
    <>
      <Nav />
      <section className="pt-32 px-6 md:px-14 pb-20 max-w-[720px]">
        <Link href={`/conseillers/${slug}`} className="text-[12px] tracking-[0.14em] text-stone">
          &larr; Retour au profil de {nom}
        </Link>
        <div className="mt-8">
          <TemoignageForm slug={slug} conseillerNom={nom} />
        </div>
      </section>
      <Footer />
    </>
  );
}

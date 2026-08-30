import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MiniSiteEnquiry from "@/components/minisite/MiniSiteEnquiry";
import {
  getMinisiteBundle,
  getMinisiteStatus,
  resolvePreview,
} from "@/lib/minisites";

export const revalidate = 900; // 15 min (décision #8 : agrégats pré-calculés)

const SITE_URL = "https://lyatimmo.com";

const RESEAU_LABEL = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

/* --------------------------------------------------------------- data ----- */
async function load(slug, previewToken) {
  if (previewToken) {
    const b = await resolvePreview(previewToken);
    if (!b) return { mode: "notfound" };
    return {
      mode: "preview",
      profil: b.profil,
      biens: b.biens || [],
      ventes: b.ventes || [],
      temoignages: b.temoignages || [],
      badges: b.badges || [],
    };
  }
  const bundle = await getMinisiteBundle(slug);
  if (bundle.profil) return { mode: "public", ...bundle };
  const status = await getMinisiteStatus(slug);
  return { mode: status }; // 'suspendu' | 'parti' | 'inconnu'
}

/* ------------------------------------------------------------- metadata --- */
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const preview = sp?.preview;
  if (preview) {
    return { title: "Aperçu — Mini-site conseiller", robots: { index: false, follow: false } };
  }
  const { mode, profil } = await load(slug);
  if (mode !== "public" || !profil) {
    return { title: "Conseiller — LYAT IMMO", robots: { index: false, follow: false } };
  }
  const nom = [profil.prenom, profil.nom].filter(Boolean).join(" ");
  const secteur = Array.isArray(profil.secteurs) && profil.secteurs.length ? profil.secteurs[0] : "Martinique";
  const desc =
    (profil.presentation_courte || profil.phrase_accroche || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 155) || `${nom}, conseiller immobilier LYAT IMMO en ${secteur}.`;
  const url = `${SITE_URL}/conseillers/${slug}`;
  return {
    title: `${nom} — Conseiller immobilier ${secteur} | LYAT IMMO`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${nom} — LYAT IMMO`,
      description: desc,
      url,
      type: "profile",
      images: profil.photo_url ? [{ url: profil.photo_url }] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

/* ---------------------------------------------------------------- page ---- */
export default async function ConseillerPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const state = await load(slug, sp?.preview);

  if (state.mode === "parti") permanentRedirect("/conseillers");
  if (state.mode === "suspendu") return <Unavailable />;
  if (state.mode === "inconnu" || state.mode === "notfound" || !state.profil) notFound();

  const { profil, biens, ventes, temoignages, badges, mode } = state;
  const nom = [profil.prenom, profil.nom].filter(Boolean).join(" ");
  const indispo =
    profil.indispo_jusqu_au && new Date(profil.indispo_jusqu_au) >= new Date()
      ? profil.indispo_jusqu_au
      : null;
  const reseaux = profil.reseaux && typeof profil.reseaux === "object" ? profil.reseaux : {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: nom,
    image: profil.photo_url || undefined,
    url: `${SITE_URL}/conseillers/${slug}`,
    areaServed: Array.isArray(profil.secteurs) ? profil.secteurs : undefined,
    worksFor: { "@type": "Organization", name: "LYAT IMMO", url: SITE_URL },
    telephone: profil.telephone_public || undefined,
  };

  return (
    <>
      <Nav />

      {mode === "preview" && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-ink text-paper text-center text-[11px] tracking-[0.16em] uppercase py-2">
          Aperçu — non publié
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="pt-32 px-6 md:px-14 pb-10">
        <Link href="/conseillers" className="text-[12px] tracking-[0.14em] text-stone">
          &larr; Tous les conseillers
        </Link>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 items-start">
          <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] overflow-hidden bg-paper-deep rounded-full">
            {profil.photo_url ? (
              <Image src={profil.photo_url} alt={nom} fill className="object-cover" sizes="220px" unoptimized />
            ) : null}
          </div>
          <div>
            <div className="text-[11px] tracking-[0.16em] uppercase text-stone mb-2">
              {profil.statut_public}
              {Array.isArray(profil.secteurs) && profil.secteurs.length
                ? ` · ${profil.secteurs.join(" · ")}`
                : ""}
            </div>
            <h1 className="font-serif text-[34px] md:text-[46px] font-medium text-ink">{nom}</h1>
            {profil.phrase_accroche && (
              <p className="mt-4 text-[16px] md:text-[18px] text-stone leading-[1.7] max-w-[640px]">
                {profil.phrase_accroche}
              </p>
            )}

            {(Number(profil.nb_transactions_accompagnees) > 0 ||
              Number(profil.nb_temoignages_publies) > 0 ||
              profil.anciennete_annees > 0) && (
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-ink">
                {Number(profil.nb_transactions_accompagnees) > 0 && (
                  <Stat n={profil.nb_transactions_accompagnees} label="transactions accompagnées" />
                )}
                {Number(profil.nb_biens_actifs) > 0 && (
                  <Stat n={profil.nb_biens_actifs} label="biens à la vente" />
                )}
                {Number(profil.nb_temoignages_publies) > 0 && (
                  <Stat n={profil.nb_temoignages_publies} label="témoignages clients" />
                )}
                {profil.anciennete_annees > 0 && (
                  <Stat n={profil.anciennete_annees} label={`an${profil.anciennete_annees > 1 ? "s" : ""} chez LYAT`} />
                )}
              </div>
            )}

            {Array.isArray(badges) && badges.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <li key={b.code + (b.annee || "")}
                    className="text-[11px] tracking-[0.08em] uppercase border border-gold/50 text-ink px-3 py-1.5">
                    {b.libelle}{b.annee ? ` ${b.annee}` : ""}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projet" className="bg-ink text-paper px-7 py-3 text-[11px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity">
                Me contacter
              </a>
              {profil.telephone_public && (
                <a href={`tel:${profil.telephone_public.replace(/\s+/g, "")}`}
                  className="border border-ink px-7 py-3 text-[11px] tracking-[0.18em] uppercase text-ink hover:bg-ink hover:text-paper transition-colors">
                  {profil.telephone_public}
                </a>
              )}
              <Link href="/contact?motif=estimation"
                className="border border-ink px-7 py-3 text-[11px] tracking-[0.18em] uppercase text-ink hover:bg-ink hover:text-paper transition-colors">
                Estimer mon bien
              </Link>
            </div>

            {indispo && (
              <p className="mt-5 text-[13px] text-stone border-l-2 border-gold pl-4">
                Absent jusqu&apos;au {new Date(indispo).toLocaleDateString("fr-FR")}.
                {profil.message_absence ? ` ${profil.message_absence}` : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      {(profil.presentation_courte || profil.presentation_longue) && (
        <Section title="À propos">
          <div className="max-w-[760px] text-[15px] leading-[1.85] text-stone whitespace-pre-line">
            {profil.presentation_longue || profil.presentation_courte}
          </div>
          {Array.isArray(profil.langues) && profil.langues.length > 0 && (
            <p className="mt-6 text-[12px] tracking-[0.1em] uppercase text-stone">
              Langues : {profil.langues.join(", ")}
            </p>
          )}
          {(profil.rsac_numero || profil.rsac_lieu) && (
            <p className="mt-2 text-[12px] text-stone">
              Agent commercial — EI inscrit au RSAC
              {profil.rsac_lieu ? ` de ${profil.rsac_lieu}` : ""}
              {profil.rsac_numero ? ` sous le numéro ${profil.rsac_numero}` : ""}.
            </p>
          )}
          {Object.keys(reseaux).some((k) => reseaux[k]) && (
            <div className="mt-5 flex flex-wrap gap-4 text-[12px]">
              {Object.entries(reseaux)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer nofollow"
                    className="underline underline-offset-2 text-stone hover:text-ink">
                    {RESEAU_LABEL[k] || k}
                  </a>
                ))}
            </div>
          )}
        </Section>
      )}

      {/* DOMAINES */}
      {Array.isArray(profil.domaines) && profil.domaines.length > 0 && (
        <Section title="Domaines d'accompagnement">
          <ul className="flex flex-wrap gap-3">
            {profil.domaines.map((d) => (
              <li key={d} className="text-[12px] tracking-[0.08em] uppercase border border-line px-4 py-2 text-ink">
                {d}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* BIENS À LA VENTE */}
      {biens.length > 0 && (
        <Section title="Mes biens à la vente">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {biens.map((b) => (
              <Link key={b.listing_slug} href={`/biens/${b.listing_slug}`}
                className="border border-line bg-paper hover:-translate-y-1 transition-transform block">
                <div className="relative w-full bg-paper-deep" style={{ aspectRatio: "4 / 3" }}>
                  {b.photo_principale ? (
                    <Image src={b.photo_principale} alt={`${b.type_bien || "Bien"} à ${b.commune || ""}`}
                      fill className="object-cover" sizes="(max-width:1024px) 50vw, 33vw" unoptimized />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="text-[10px] tracking-[0.14em] uppercase text-stone">
                    {[b.commune, b.type_bien].filter(Boolean).join(" · ")}
                  </div>
                  <div className="mt-1 font-serif text-gold">
                    {Number(b.price) > 0
                      ? `${Number(b.price).toLocaleString("fr-FR")} €${b.transaction === "location" ? " / mois" : ""}`
                      : "Prix sur demande"}
                  </div>
                  <div className="mt-1 text-[12px] text-stone">
                    {[b.surface ? `${b.surface} m²` : null, b.rooms ? `${b.rooms} p.` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* TRANSACTIONS ACCOMPAGNÉES */}
      {ventes.length > 0 && (
        <Section title="Transactions accompagnées">
          <p className="text-[13px] text-stone mb-5 max-w-[640px]">
            Ventes menées à leur terme (acte signé), seul ou en équipe.
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ventes.map((v, i) => (
              <li key={i} className="border border-line px-4 py-3 text-[13px]">
                <div className="text-ink">{v.type_bien || "Bien"}</div>
                <div className="text-stone text-[12px]">
                  {[v.commune, v.mois_acte].filter(Boolean).join(" · ")}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* TÉMOIGNAGES */}
      <Section title="Témoignages clients">
        {temoignages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {temoignages.map((t, i) => (
              <figure key={i} className="border-l-2 border-gold pl-5">
                <blockquote className="font-serif text-[16px] italic text-ink leading-[1.7] whitespace-pre-line">
                  {t.contenu}
                </blockquote>
                <figcaption className="mt-3 text-[12px] text-stone">
                  {t.auteur_nom_public || "Client"}
                  {t.commune ? ` · ${t.commune}` : ""}
                  {t.verifie ? " · Client accompagné par LYAT IMMO" : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-stone italic">Aucun témoignage publié pour le moment.</p>
        )}
        <Link href={`/conseillers/${slug}/temoignage`}
          className="inline-block mt-8 text-[11px] tracking-[0.18em] uppercase text-ink border-b border-gold pb-1 hover:text-gold transition-colors">
          Laisser un témoignage
        </Link>
      </Section>

      {/* FORMULAIRE PROJET */}
      <section id="projet" className="px-6 md:px-14 py-14 max-w-[720px]">
        <MiniSiteEnquiry slug={slug} prenom={profil.prenom} />
      </section>

      <Footer />
    </>
  );
}

/* ------------------------------------------------------------- helpers ---- */
function Section({ title, children }) {
  return (
    <section className="px-6 md:px-14 py-12 border-t border-line">
      <h2 className="text-[10px] tracking-[0.18em] uppercase text-gold mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <span>
      <span className="font-serif text-[22px] text-ink">{n}</span>{" "}
      <span className="text-stone text-[13px]">{label}</span>
    </span>
  );
}

function Unavailable() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-32 max-w-[640px]">
        <h1 className="font-serif text-[30px] text-ink mb-4">Page temporairement indisponible</h1>
        <p className="text-[15px] text-stone leading-[1.8]">
          Ce mini-site conseiller est momentanément hors ligne. Pour toute demande, contactez
          LYAT IMMO au 0696 33 58 11 ou à{" "}
          <a href="mailto:contact@lyatimmo.com" className="underline underline-offset-2 hover:text-ink">
            contact@lyatimmo.com
          </a>
          .
        </p>
        <Link href="/conseillers" className="inline-block mt-8 text-[12px] tracking-[0.16em] uppercase text-ink border-b border-gold pb-1">
          Voir les conseillers LYAT IMMO
        </Link>
      </section>
      <Footer />
    </>
  );
}

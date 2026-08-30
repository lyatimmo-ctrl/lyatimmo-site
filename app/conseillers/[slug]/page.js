import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MiniSiteEnquiry from "@/components/minisite/MiniSiteEnquiry";
import BadgeSeal from "@/components/minisite/BadgeSeal";
import {
  getMinisiteBundle,
  getMinisiteStatus,
  resolvePreview,
  sortBadges,
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

// Icônes réseaux sociaux (Simple Icons, tracé unique, 24×24, fill=currentColor).
const RESEAU_ICON = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
};

function ReseauIcon({ k }) {
  const d = RESEAU_ICON[k];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

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
        <div className="fixed top-0 inset-x-0 z-[60] bg-ink text-white text-center text-[11px] tracking-[0.16em] uppercase py-2">
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
              <div className="mt-7">
                <div className="flex flex-wrap items-end gap-x-6 gap-y-5">
                  {sortBadges(badges)
                    .slice(0, 3)
                    .map((b) => (
                      <BadgeSeal key={b.code + (b.annee || "")} badge={b} size={68} />
                    ))}
                  {badges.length > 3 && mode !== "preview" && (
                    <Link
                      href={`/conseillers/${slug}/distinctions`}
                      className="self-center text-[12px] font-medium text-gold-deep border-b border-gold pb-0.5 hover:text-ink transition-colors whitespace-nowrap"
                    >
                      Voir mes distinctions →
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projet" className="bg-ink text-white font-medium px-8 py-3.5 text-[12px] tracking-[0.18em] uppercase hover:bg-gold hover:text-ink transition-colors">
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
          {Object.keys(reseaux).some((k) => reseaux[k] && RESEAU_ICON[k]) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {Object.entries(reseaux)
                .filter(([k, v]) => v && RESEAU_ICON[k])
                .map(([k, v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer nofollow"
                    aria-label={RESEAU_LABEL[k] || k}
                    className="inline-flex items-center justify-center w-9 h-9 border border-line text-stone hover:text-ink hover:border-ink transition-colors">
                    <ReseauIcon k={k} />
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

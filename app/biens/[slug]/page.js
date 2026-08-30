import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VirtualTourEmbed from "@/components/consent/VirtualTourEmbed";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyEnquiry from "@/components/PropertyEnquiry";
import DpeBadge from "@/components/DpeBadge";
import { getListingBySlug, getListingExtras } from "@/lib/listings";

export const revalidate = 300;

const SITE_URL = "https://lyatimmo.com";

export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const [property, extras] = await Promise.all([
    getListingBySlug(slug),
    getListingExtras(slug),
  ]);
  if (!property) notFound();

  const priceLabel =
    property.price > 0
      ? property.transaction === "location"
        ? `${property.price.toLocaleString("fr-FR")} € / mois`
        : `${property.price.toLocaleString("fr-FR")} €`
      : "Prix sur demande";

  const photos = Array.isArray(property.photos) ? property.photos : [];

  // Mention légale — par agent (RSAC) si le profil est rapproché, sinon générique.
  const legalMention =
    extras.agentRsacNumero && (extras.agentPrenom || extras.agentNom)
      ? `Ce bien est présenté par ${[extras.agentPrenom, extras.agentNom]
          .filter(Boolean)
          .join(" ")}, agent commercial - EI inscrit au RSAC de ${
          extras.agentRsacLieu || "—"
        } sous le numéro ${extras.agentRsacNumero}.`
      : "Ce bien est présenté par LYAT IMMO.";

  return (
    <>
      <Nav />
      <section className="pt-32 px-6 md:px-14">
        <Link href="/biens" className="text-[12px] tracking-[0.14em] text-stone">
          &larr; Retour aux biens
        </Link>
      </section>

      <section className="px-6 md:px-14 py-10 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12">
        <div>
          {photos.length > 0 ? (
            <PropertyGallery photos={photos} alt={property.title} />
          ) : (
            <div
              className="relative w-full overflow-hidden bg-paper-deep"
              style={{ aspectRatio: "4 / 3" }}
            >
              <div className="absolute inset-5 border border-ink/10 flex items-end p-6">
                <span className="text-[10px] tracking-[0.16em] text-gold bg-paper px-3 py-1.5">
                  {property.tag}
                </span>
              </div>
            </div>
          )}

          {property.virtualTourUrl && (
            <div className="mt-8">
              <div className="text-[10px] tracking-[0.16em] uppercase text-gold mb-3">
                Visite virtuelle
              </div>
              <VirtualTourEmbed
                provider="visite virtuelle"
                url={property.virtualTourUrl}
                title={`Visite virtuelle - ${property.title}`}
              />
              <a
                href={property.virtualTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-[12px] text-stone underline underline-offset-2 hover:text-ink"
              >
                Ouvrir la visite dans un nouvel onglet
              </a>
            </div>
          )}
        </div>

        <div>
          <div className="text-[11px] tracking-[0.16em] text-stone uppercase mb-3">
            {[property.commune, property.type].filter(Boolean).join(" · ")}
          </div>
          <h1 className="font-serif text-[32px] md:text-[42px] font-medium mb-5">
            {property.title}
          </h1>
          <div className="text-2xl font-serif text-gold mb-8">{priceLabel}</div>

          <div className="grid grid-cols-3 border-t border-b border-line py-6 mb-8">
            <Metric label="Surface" value={property.surface ? `${property.surface} m²` : "-"} />
            <Metric label="Pièces" value={property.pieces || "-"} />
            <Metric label="Chambres" value={property.chambres || "-"} />
          </div>

          {(property.landSurface > 0 ||
            property.furnished ||
            property.feesPayer ||
            (property.transaction === "location" && property.charges > 0)) && (
            <dl className="text-[13px] leading-[1.9] text-stone mb-8">
              {property.landSurface > 0 && (
                <Row label="Terrain" value={`${property.landSurface} m²`} />
              )}
              {property.furnished && <Row label="Meublé" value={property.furnished} />}
              {property.transaction === "location" && property.charges > 0 && (
                <Row label="Charges" value={`${property.charges.toLocaleString("fr-FR")} €`} />
              )}
              {property.feesPayer && (
                <Row label="Honoraires" value={`à la charge du ${property.feesPayer}`} />
              )}
            </dl>
          )}

          {/* Bandeau DPE / GES */}
          <div className="mb-8">
            <div className="text-[10px] tracking-[0.16em] uppercase text-stone mb-2">
              Performance énergétique
            </div>
            <DpeBadge
              dpeLetter={property.dpeLetter}
              dpeValue={property.dpeValue}
              gesLetter={property.gesLetter}
              gesValue={property.gesValue}
            />
          </div>

          {property.description && (
            <p className="text-[15px] leading-[1.8] text-stone mb-10 whitespace-pre-line">
              {property.description}
            </p>
          )}

          {/* Contacter l'agence pour ce bien */}
          <PropertyEnquiry
            reference={property.reference}
            title={property.title}
            url={`${SITE_URL}/biens/${slug}`}
            agentEmail={extras.emailContact || undefined}
          />
        </div>
      </section>

      {/* Mentions sous l'annonce */}
      <section className="px-6 md:px-14 pb-16 max-w-[1000px]">
        <div className="border-t border-line pt-6 space-y-2 text-[11px] leading-[1.7] text-stone">
          <p>{legalMention}</p>
          <p>
            Les informations sur les risques auxquels ce bien est exposé sont
            disponibles sur le site{" "}
            <a
              href="https://www.georisques.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-ink"
            >
              www.georisques.gouv.fr
            </a>
            .
          </p>
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
      <div className="text-[10px] tracking-[0.12em] uppercase text-stone">{label}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-6 border-b border-line/60 py-1.5">
      <dt className="uppercase tracking-[0.1em] text-[11px] text-stone/80">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

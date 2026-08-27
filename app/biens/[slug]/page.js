import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VirtualTourEmbed from "@/components/consent/VirtualTourEmbed";
import { getListingBySlug } from "@/lib/listings";

export const revalidate = 300;

export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const property = await getListingBySlug(slug);
  if (!property) notFound();

  const priceLabel =
    property.price > 0
      ? property.transaction === "location"
        ? `${property.price.toLocaleString("fr-FR")} € / mois`
        : `${property.price.toLocaleString("fr-FR")} €`
      : "Prix sur demande";

  const photos = Array.isArray(property.photos) ? property.photos : [];
  const [cover, ...rest] = photos;

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
          <div
            className="relative w-full overflow-hidden bg-paper-deep"
            style={{ aspectRatio: "4 / 3" }}
          >
            {cover ? (
              <Image
                src={cover}
                alt={property.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-5 border border-ink/10 flex items-end p-6">
                <span className="text-[10px] tracking-[0.16em] text-gold bg-paper px-3 py-1.5">
                  {property.tag}
                </span>
              </div>
            )}
          </div>

          {rest.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {rest.slice(0, 6).map((src, i) => (
                <div
                  key={i}
                  className="relative w-full overflow-hidden bg-paper-deep"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <Image
                    src={src}
                    alt={`${property.title} - photo ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}

          {property.virtualTourUrl && (
            <div className="mt-6">
              <VirtualTourEmbed
                provider="visite virtuelle"
                url={property.virtualTourUrl}
                title={`Visite virtuelle - ${property.title}`}
              />
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
            property.dpeLetter ||
            property.gesLetter ||
            property.furnished ||
            property.feesPayer) && (
            <dl className="text-[13px] leading-[1.9] text-stone mb-8">
              {property.landSurface > 0 && (
                <Row label="Terrain" value={`${property.landSurface} m²`} />
              )}
              {property.furnished && <Row label="Meublé" value={property.furnished} />}
              {property.dpeLetter && (
                <Row
                  label="DPE"
                  value={property.dpeValue ? `${property.dpeLetter} (${property.dpeValue})` : property.dpeLetter}
                />
              )}
              {property.gesLetter && (
                <Row
                  label="GES"
                  value={property.gesValue ? `${property.gesLetter} (${property.gesValue})` : property.gesLetter}
                />
              )}
              {property.transaction === "location" && property.charges > 0 && (
                <Row label="Charges" value={`${property.charges.toLocaleString("fr-FR")} €`} />
              )}
              {property.feesPayer && (
                <Row label="Honoraires" value={`à la charge du ${property.feesPayer}`} />
              )}
            </dl>
          )}

          {property.description && (
            <p className="text-[15px] leading-[1.8] text-stone mb-10 whitespace-pre-line">
              {property.description}
            </p>
          )}

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

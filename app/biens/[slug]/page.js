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

const SITE_URL = "https://www.lyatimmo.com";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** "Le Robert" -> "au Robert" | "Les Trois-Îlets" -> "aux Trois-Îlets" | sinon "à X". */
function auLieu(commune) {
  if (!commune) return "";
  if (/^les\s+/i.test(commune)) return `aux ${commune.replace(/^les\s+/i, "")}`;
  if (/^le\s+/i.test(commune)) return `au ${commune.replace(/^le\s+/i, "")}`;
  return `à ${commune}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getListingBySlug(slug);
  if (!property) {
    return { title: "Bien introuvable | LYAT IMMO", robots: { index: false, follow: false } };
  }

  const url = `${SITE_URL}/biens/${slug}`;
  const verbe = property.transaction === "location" ? "à louer" : "à vendre";
  const lieu = auLieu(property.commune);

  // Caracteristique forte du titre : surface pour un terrain, nb de pieces sinon.
  const carac = property.isLand
    ? property.landSurface || property.surface
      ? `${property.landSurface || property.surface} m²`
      : null
    : property.pieces
    ? `${property.pieces} pièce${property.pieces > 1 ? "s" : ""}`
    : property.surface
    ? `${property.surface} m²`
    : null;

  // Format unique pour toutes les fiches : "<Type> <verbe> <lieu>[, <carac>] | LYAT IMMO".
  const base = [property.type || "Bien", verbe, lieu].filter(Boolean).join(" ");
  const title = carac ? `${base}, ${carac} | LYAT IMMO` : `${base} | LYAT IMMO`;

  // Description : uniquement des donnees reelles du bien.
  const prix =
    property.price > 0
      ? property.transaction === "location"
        ? `${property.price.toLocaleString("fr-FR")} € / mois`
        : `${property.price.toLocaleString("fr-FR")} €`
      : null;
  const faits = [
    property.isLand
      ? property.landSurface
        ? `terrain de ${property.landSurface} m²`
        : null
      : property.surface
      ? `${property.surface} m²`
      : null,
    !property.isLand && property.pieces ? `${property.pieces} pièces` : null,
    !property.isLand && property.chambres
      ? `${property.chambres} chambre${property.chambres > 1 ? "s" : ""}`
      : null,
    prix,
  ].filter(Boolean);

  let description = `${property.type || "Bien"} ${verbe} ${lieu}`.trim();
  description += faits.length ? ` : ${faits.join(", ")}.` : ".";
  if (property.description && description.length < 150) {
    description += ` ${property.description}`;
  }
  description = description.replace(/\s+/g, " ").trim();
  if (description.length > 200) description = `${description.slice(0, 197).trimEnd()}…`;

  // og:image = 1re photo reelle du bien (URL absolue publique Transactimo).
  // Fallback institutionnel UNIQUEMENT si le bien n'a aucune photo.
  const photo =
    Array.isArray(property.photos) && typeof property.photos[0] === "string"
      ? property.photos[0]
      : null;
  const images = photo
    ? [{ url: photo, alt: property.title || title }]
    : [{ url: OG_IMAGE, width: 1200, height: 630, alt: "LYAT IMMO" }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "LYAT IMMO",
      locale: "fr_FR",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
    robots: { index: true, follow: true },
  };
}

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

  // Caracteristiques complementaires (bloc <dl>), selon le type et la transaction.
  const isLoc = property.transaction === "location";
  const euro = (n) => `${Number(n).toLocaleString("fr-FR")} €`;
  const specs = [];
  if (!property.isLand && property.landSurface > 0) specs.push(["Terrain", `${property.landSurface} m²`]);
  if (!property.isLand && property.floor) specs.push(["Étage", property.floor]);
  if (!property.isLand && property.bathrooms > 0)
    specs.push([property.bathrooms > 1 ? "Salles de bain" : "Salle de bain", property.bathrooms]);
  if (!property.isLand && property.showerRooms > 0)
    specs.push([property.showerRooms > 1 ? "Salles d'eau" : "Salle d'eau", property.showerRooms]);
  if (property.furnished) specs.push(["Meublé", property.furnished]);
  if (isLoc && property.charges > 0) specs.push(["Charges", euro(property.charges)]);
  if (isLoc && property.depotGarantie > 0) specs.push(["Dépôt de garantie", euro(property.depotGarantie)]);
  if (property.feesPayer || property.fees > 0)
    specs.push([
      "Honoraires",
      [
        property.fees > 0 ? `${euro(property.fees)} TTC` : null,
        property.feesPayer ? `à la charge du ${property.feesPayer}` : null,
      ]
        .filter(Boolean)
        .join(", "),
    ]);

  // Mention légale — par agent (RSAC) si le profil est rapproché, sinon générique.
  const legalMention =
    extras.agentRsacNumero && (extras.agentPrenom || extras.agentNom)
      ? `Ce bien est présenté par ${[extras.agentPrenom, extras.agentNom]
          .filter(Boolean)
          .join(" ")}, agent commercial (EI)${
          extras.agentRsacLieu ? ` inscrit au RSAC de ${extras.agentRsacLieu}` : ""
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
                title={`Visite virtuelle | ${property.title}`}
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
            {[
              [property.codePostal, property.commune].filter(Boolean).join(" "),
              property.secteur,
              property.type,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
          <h1 className="font-serif text-[32px] md:text-[42px] font-medium mb-4">
            {property.title}
          </h1>
          {property.accroche && property.accroche !== property.title && (
            <p className="text-stone text-[14px] leading-[1.7] mb-6 max-w-[46ch]">
              {property.accroche}
            </p>
          )}
          <div className="text-2xl font-serif text-gold mb-8">{priceLabel}</div>

          <div
            className={`grid ${
              property.isLand ? "grid-cols-1" : "grid-cols-3"
            } border-t border-b border-line py-6 mb-8`}
          >
            {(property.isLand
              ? [
                  {
                    label: "Surface du terrain",
                    value:
                      property.landSurface || property.surface
                        ? `${property.landSurface || property.surface} m²`
                        : "-",
                  },
                ]
              : [
                  { label: "Surface", value: property.surface ? `${property.surface} m²` : "-" },
                  { label: "Pièces", value: property.pieces || "-" },
                  { label: "Chambres", value: property.chambres || "-" },
                ]
            ).map((m) => (
              <Metric key={m.label} label={m.label} value={m.value} />
            ))}
          </div>

          {specs.length > 0 && (
            <dl className="text-[13px] leading-[1.9] text-stone mb-8">
              {specs.map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}
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

import Link from "next/link";
import Image from "next/image";

export default function PropertyCard({ property }) {
  const priceLabel =
    property.price > 0
      ? property.transaction === "location"
        ? `${property.price.toLocaleString("fr-FR")} € / mois`
        : `${property.price.toLocaleString("fr-FR")} €`
      : "Prix sur demande";

  const photo = Array.isArray(property.photos) ? property.photos[0] : null;

  // Un terrain n'a ni pieces ni chambres : on montre sa surface foncière.
  const meta = property.isLand
    ? property.landSurface
      ? `${property.landSurface} m² de terrain`
      : ""
    : [
        property.surface ? `${property.surface} m²` : null,
        property.chambres ? `${property.chambres} ch.` : null,
      ]
        .filter(Boolean)
        .join(" · ");

  return (
    <Link href={`/biens/${property.slug}`} className="group block">
      <div
        className="relative w-full overflow-hidden bg-paper-deep"
        style={{ aspectRatio: "4 / 3" }}
      >
        {photo ? (
          <Image
            src={photo}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : null}
        <div className="absolute inset-[18px] border border-ink/10 flex items-end p-5">
          <span className="text-[10px] tracking-[0.16em] text-gold bg-paper px-3 py-1.5">
            {property.tag}
          </span>
        </div>
      </div>
      <div className="pt-6 pb-2">
        <div className="text-[11px] tracking-[0.14em] text-stone mb-2 uppercase">
          {property.commune}
        </div>
        <h3 className="font-serif text-xl mb-2.5 group-hover:text-gold transition-colors">
          {property.title}
        </h3>
        <div className="text-sm">
          {priceLabel}
          {meta && <span className="text-stone text-xs ml-1.5">· {meta}</span>}
        </div>
      </div>
    </Link>
  );
}

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

  return (
    <Link href={`/biens/${property.slug}`} className="group block">
      <div className="aspect-[4/5] bg-paper-deep relative overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
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
          {priceLabel}{" "}
          <span className="text-stone text-xs ml-1.5">
            · {property.surface} m² · {property.chambres} ch.
          </span>
        </div>
      </div>
    </Link>
  );
}

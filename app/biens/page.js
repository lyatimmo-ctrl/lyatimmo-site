"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SearchCard from "@/components/SearchCard";
import PropertyCard from "@/components/PropertyCard";
import { properties, propertyTypes, communes } from "@/data/properties";

function BiensContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    transaction: searchParams.get("transaction") || "",
    type: searchParams.get("type") || "",
    commune: searchParams.get("commune") || "",
    piecesMin: searchParams.get("piecesMin") || "",
    budgetMax: searchParams.get("budgetMax") || "",
  }));

  const results = useMemo(() => {
    return properties.filter((p) => {
      if (filters.transaction && p.transaction !== filters.transaction) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (
        filters.commune &&
        !p.commune.toLowerCase().includes(filters.commune.toLowerCase())
      )
        return false;
      if (filters.piecesMin && p.pieces < Number(filters.piecesMin)) return false;
      if (filters.budgetMax && p.price > Number(filters.budgetMax)) return false;
      return true;
    });
  }, [filters]);

  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-10">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Nos biens
        </span>
        <h1 className="font-serif text-[34px] md:text-[52px] font-medium max-w-[640px]">
          {results.length} bien{results.length > 1 ? "s" : ""} correspondant
          {results.length > 1 ? "ent" : ""} à votre recherche
        </h1>
      </section>

      <div className="px-6 md:px-14 pb-10 flex flex-wrap gap-3">
        <select
          value={filters.transaction}
          onChange={(e) => setFilters((f) => ({ ...f, transaction: e.target.value }))}
          className="border border-line px-4 py-2.5 text-[13px] bg-paper"
        >
          <option value="">Vente &amp; Location</option>
          <option value="vente">Vente</option>
          <option value="location">Location</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="border border-line px-4 py-2.5 text-[13px] bg-paper"
        >
          <option value="">Tous types</option>
          {propertyTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={filters.commune}
          onChange={(e) => setFilters((f) => ({ ...f, commune: e.target.value }))}
          className="border border-line px-4 py-2.5 text-[13px] bg-paper"
        >
          <option value="">Toutes communes</option>
          {communes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.piecesMin}
          onChange={(e) => setFilters((f) => ({ ...f, piecesMin: e.target.value }))}
          className="border border-line px-4 py-2.5 text-[13px] bg-paper"
        >
          <option value="">Pièces mini</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ pièces
            </option>
          ))}
        </select>
        {(filters.transaction || filters.type || filters.commune || filters.piecesMin || filters.budgetMax) && (
          <button
            onClick={() =>
              setFilters({ transaction: "", type: "", commune: "", piecesMin: "", budgetMax: "" })
            }
            className="text-[12px] tracking-[0.1em] text-gold underline underline-offset-4 px-2"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <section className="px-6 md:px-14 pb-28">
        {results.length === 0 ? (
          <p className="text-stone text-[15px] py-16 text-center">
            Aucun bien ne correspond à ces critères pour le moment. Élargissez votre recherche
            ou contactez-nous directement - de nouvelles annonces arrivent régulièrement.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-14">
            {results.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default function BiensPage() {
  return (
    <Suspense fallback={null}>
      <BiensContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { propertyTypes } from "@/data/properties";

export default function SearchCard() {
  const router = useRouter();
  const [transaction, setTransaction] = useState("vente");
  const [showMore, setShowMore] = useState(false);
  const [form, setForm] = useState({
    type: "",
    commune: "",
    piecesMin: "",
    piecesMax: "",
    chambresMin: "",
    budgetMin: "",
    budgetMax: "",
    surfaceMin: "",
    surfaceMax: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams({ transaction, ...form });
    for (const [key, value] of [...params.entries()]) {
      if (!value) params.delete(key);
    }
    router.push(`/biens?${params.toString()}`);
  }

  return (
    <div className="relative max-w-[1040px] mx-auto px-4 md:px-6 md:translate-y-1/2 translate-y-6 z-20">
      <div className="bg-paper border border-line shadow-[0_24px_60px_-20px_rgba(22,21,19,0.18)] px-5 md:px-8 pt-7 pb-6">
        <div className="flex gap-0 mb-5">
          {["vente", "location"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTransaction(t)}
              className={`text-[11px] tracking-[0.16em] uppercase pb-3 mr-8 border-b-2 transition-colors ${
                transaction === t
                  ? "text-ink border-gold"
                  : "text-stone border-transparent"
              }`}
            >
              {t === "vente" ? "Vente" : "Location"}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_1fr_1fr_auto] gap-4 md:gap-0 items-end"
        >
          <Field label="Type de bien" borderless>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full bg-transparent text-[14px] focus:outline-none"
            >
              <option value="">Tous types</option>
              {propertyTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Secteur / commune">
            <input
              type="text"
              placeholder="Ex. Le Lamentin, Schœlcher…"
              value={form.commune}
              onChange={(e) => update("commune", e.target.value)}
              className="w-full bg-transparent text-[14px] focus:outline-none placeholder:text-stone/70"
            />
          </Field>
          <Field label="Pièces mini">
            <select
              value={form.piecesMin}
              onChange={(e) => update("piecesMin", e.target.value)}
              className="w-full bg-transparent text-[14px] focus:outline-none"
            >
              <option value="">Indifférent</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                  {n === 5 ? "+" : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Budget max">
            <input
              type="text"
              inputMode="numeric"
              placeholder="€"
              value={form.budgetMax}
              onChange={(e) => update("budgetMax", e.target.value)}
              className="w-full bg-transparent text-[14px] focus:outline-none placeholder:text-stone/70"
            />
          </Field>
          <button
            type="submit"
            className="bg-ink text-paper px-8 py-4 text-[11px] tracking-[0.16em] uppercase whitespace-nowrap md:ml-5 hover:opacity-90 transition-opacity"
          >
            Rechercher
          </button>
        </form>

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="mt-4 flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-gold"
        >
          {showMore ? "Moins de critères" : "Plus de critères"}
          <svg
            viewBox="0 0 10 6"
            fill="none"
            className={`w-2.5 h-1.5 transition-transform ${showMore ? "rotate-180" : ""}`}
          >
            <path d="M1 1L5 5L9 1" stroke="#C6963E" strokeWidth="1.4" />
          </svg>
        </button>

        {showMore && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-5 mt-4 border-t border-line">
            <Field label="Pièces maxi" borderless>
              <select
                value={form.piecesMax}
                onChange={(e) => update("piecesMax", e.target.value)}
                className="w-full bg-transparent text-[14px] focus:outline-none"
              >
                <option value="">Indifférent</option>
                {[2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                    {n === 5 ? "+" : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Chambres mini" borderless>
              <select
                value={form.chambresMin}
                onChange={(e) => update("chambresMin", e.target.value)}
                className="w-full bg-transparent text-[14px] focus:outline-none"
              >
                <option value="">Indifférent</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                    {n === 4 ? "+" : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Surface (m²)" borderless>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min"
                  value={form.surfaceMin}
                  onChange={(e) => update("surfaceMin", e.target.value)}
                  className="w-full bg-transparent text-[14px] focus:outline-none placeholder:text-stone/70"
                />
                <span className="text-stone text-xs">—</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max"
                  value={form.surfaceMax}
                  onChange={(e) => update("surfaceMax", e.target.value)}
                  className="w-full bg-transparent text-[14px] focus:outline-none placeholder:text-stone/70"
                />
              </div>
            </Field>
            <Field label="Budget min (€)" borderless>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={form.budgetMin}
                onChange={(e) => update("budgetMin", e.target.value)}
                className="w-full bg-transparent text-[14px] focus:outline-none placeholder:text-stone/70"
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, borderless }) {
  return (
    <div className={`px-0 md:px-5 ${borderless ? "" : "md:border-l md:border-line"} first:md:pl-0 first:md:border-none`}>
      <label className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

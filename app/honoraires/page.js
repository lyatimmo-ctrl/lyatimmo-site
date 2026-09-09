import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { HONORAIRES } from "@/lib/honoraires";

export const metadata = {
  title: "LYAT IMMO | Barème d'honoraires",
  description:
    "Barème d'honoraires maximums TTC de LYAT IMMO : honoraires de vente par tranche de prix (non cumulatif), à la charge du vendeur, et honoraires de location. Applicable au 1er septembre 2026.",
};

const { titre, applicable, vente, location, conditions, identite } = HONORAIRES;

export default function HonorairesPage() {
  return (
    <>
      <Nav />

      <main className="pt-36 md:pt-40 pb-24 px-6 md:px-14">
        <div className="max-w-[820px] mx-auto">
          {/* En-tête */}
          <span className="block text-[11px] tracking-[0.28em] text-gold uppercase mb-4">
            Barème officiel
          </span>
          <h1 className="font-serif text-[34px] md:text-[46px] font-medium text-ink leading-[1.15]">
            Barème d&apos;honoraires
          </h1>
          <p className="mt-4 text-[12px] tracking-[0.14em] uppercase text-stone">
            {titre} · {applicable}
          </p>
          <p className="mt-8 text-[15px] leading-[1.75] text-stone max-w-[640px]">
            Les honoraires ci-dessous sont exprimés <strong className="text-ink font-medium">TTC</strong> et,
            pour les ventes, à la <strong className="text-ink font-medium">charge du vendeur</strong>. Le
            barème de vente fonctionne <strong className="text-ink font-medium">par tranche de prix, de
            façon non cumulative</strong> : le taux de la tranche dans laquelle se situe le prix de vente
            s&apos;applique à la totalité de ce prix. Il ne s&apos;agit pas d&apos;un calcul progressif ni
            marginal.
          </p>

          {/* ─────────────── VENTE ─────────────── */}
          <section className="mt-16 pt-10 border-t border-line">
            <h2 className="font-serif text-[24px] md:text-[28px] font-medium text-ink">Vente</h2>

            <p className="mt-5 text-[14px] leading-[1.7] text-ink border-l-2 border-gold pl-4">
              {vente.regle}
            </p>

            <div className="mt-8">
              <div className="flex items-end justify-between gap-6 pb-3 border-b border-ink/60">
                <span className="text-[10px] tracking-[0.14em] uppercase text-stone">
                  {vente.colonnes.plage}
                </span>
                <span className="text-[10px] tracking-[0.14em] uppercase text-stone text-right">
                  {vente.colonnes.taux}
                </span>
              </div>
              <dl>
                {vente.tranches.map((t) => (
                  <div
                    key={t.plage}
                    className="flex items-baseline justify-between gap-6 py-4 border-b border-line"
                  >
                    <dt className="text-[15px] md:text-[16px] text-ink">{t.plage}</dt>
                    <dd className="font-serif text-[20px] md:text-[24px] text-gold-deep leading-none whitespace-nowrap">
                      {t.taux}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="mt-6 text-[13px] leading-[1.7] text-stone">{vente.forfait}</p>
            <p className="mt-3 text-[13px] leading-[1.7] text-stone">
              <span className="text-gold-deep font-medium">Exemple · </span>
              {vente.exemple}
            </p>
          </section>

          {/* ─────────────── LOCATION ─────────────── */}
          <section className="mt-16 pt-10 border-t border-line">
            <h2 className="font-serif text-[24px] md:text-[28px] font-medium text-ink">Location</h2>

            {/* Desktop : tableau 3 colonnes */}
            <div className="mt-8 hidden md:block">
              <div className="grid grid-cols-[minmax(0,1fr)_140px_140px] gap-6 pb-3 border-b border-ink/60">
                <span className="text-[10px] tracking-[0.14em] uppercase text-stone">
                  {location.colonnes.prestation}
                </span>
                <span className="text-[10px] tracking-[0.14em] uppercase text-stone">
                  {location.colonnes.bailleur}
                </span>
                <span className="text-[10px] tracking-[0.14em] uppercase text-stone">
                  {location.colonnes.locataire}
                </span>
              </div>
              {location.lignes.map((l) => (
                <div
                  key={l.prestation}
                  className="grid grid-cols-[minmax(0,1fr)_140px_140px] gap-6 py-4 border-b border-line"
                >
                  <span className="text-[14px] leading-[1.5] text-ink">{l.prestation}</span>
                  <span className="text-[14px] text-ink">
                    {l.bailleur ?? <span className="text-stone">–</span>}
                  </span>
                  <span className="text-[14px] text-ink">
                    {l.locataire ?? <span className="text-stone">–</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile : liste empilée, sans débordement */}
            <div className="mt-8 md:hidden border-t border-ink/60">
              {location.lignes.map((l) => (
                <div key={l.prestation} className="py-4 border-b border-line">
                  <p className="text-[14px] leading-[1.5] text-ink">{l.prestation}</p>
                  <p className="mt-2 text-[13px] text-stone">
                    {location.colonnes.bailleur} : <span className="text-ink">{l.bailleur ?? "–"}</span>
                  </p>
                  <p className="text-[13px] text-stone">
                    {location.colonnes.locataire} : <span className="text-ink">{l.locataire ?? "–"}</span>
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[13px] leading-[1.7] text-stone">{location.note}</p>
          </section>

          {/* ─────────────── CONDITIONS D'APPLICATION ─────────────── */}
          <section className="mt-16 pt-10 border-t border-line">
            <h2 className="font-serif text-[22px] md:text-[26px] font-medium text-ink">
              Conditions d&apos;application
            </h2>
            <div className="mt-5 space-y-4">
              {conditions.map((c, i) => (
                <p key={i} className="text-[14px] leading-[1.75] text-stone">
                  {c}
                </p>
              ))}
            </div>
          </section>

          {/* Identité de l'agence (barème officiel) */}
          <div className="mt-16 pt-8 border-t border-line space-y-1">
            {identite.map((line, i) => (
              <p key={i} className="text-[11px] leading-[1.7] text-stone">
                {line}
              </p>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

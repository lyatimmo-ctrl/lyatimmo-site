import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookiePreferences from "@/components/consent/CookiePreferences";
import { servicesByCategory } from "@/lib/consent/config";

export const metadata = {
  title: "Gestion des cookies | LYAT IMMO",
  description:
    "Consultez et modifiez à tout moment votre choix concernant les cookies et technologies similaires utilisés sur lyatimmo.com.",
};

function H2({ children, first }) {
  return (
    <h2
      className={`font-serif text-[20px] md:text-[22px] font-medium text-ink mb-4 ${
        first ? "" : "border-t border-line pt-10 mt-10"
      }`}
    >
      {children}
    </h2>
  );
}

export default function CookiesPage() {
  const necessary = servicesByCategory("necessary");
  const analytics = servicesByCategory("analytics").filter((s) => s.active);
  const external = servicesByCategory("external").filter((s) => s.active);

  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-24 max-w-[760px] mx-auto">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Cookies
        </span>
        <h1 className="font-serif text-[34px] md:text-[48px] font-medium mb-10">
          Gestion des cookies
        </h1>

        <p className="text-stone text-[15px] leading-[1.8]">
          LYAT IMMO utilise des cookies et technologies similaires nécessaires au
          fonctionnement de son site et peut, avec votre accord, utiliser d’autres
          technologies pour mesurer l’utilisation du site, améliorer ses
          communications ou afficher certains contenus et services externes.
        </p>
        <p className="text-stone text-[15px] leading-[1.8] mt-3">
          Les technologies nécessitant un consentement ne sont activées qu’après votre
          accord.
        </p>

        <CookiePreferences />

        <div className="text-stone text-[15px] leading-[1.8]">
          {/* — Strictement nécessaires — */}
          <H2 first>Cookies strictement nécessaires</H2>
          <p>
            Certaines technologies sont nécessaires au fonctionnement, à la sécurité ou
            à la mémorisation de vos choix sur le site. Lorsqu’elles sont strictement
            nécessaires, elles ne sont pas soumises au consentement préalable.
          </p>
          {necessary
            .filter((s) => s.doc && s.doc.name)
            .map((s) => (
              <div key={s.id} className="border border-line p-5 mt-4 text-[14px] leading-[1.7]">
                <p className="text-ink">{s.doc.name}</p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <span className="text-ink">Finalité :</span> {s.doc.finalite}
                  </li>
                  <li>
                    <span className="text-ink">Durée :</span> {s.doc.duree}
                  </li>
                  <li>
                    <span className="text-ink">Origine :</span> {s.doc.origine}
                  </li>
                  <li>
                    <span className="text-ink">Contenu :</span> {s.doc.contenu}
                  </li>
                  <li>
                    <span className="text-ink">Sécurité :</span> {s.doc.securite}
                  </li>
                </ul>
              </div>
            ))}

          {/* — Mesure d'audience et publicité — */}
          <H2>Mesure d’audience et publicité</H2>
          <p>
            Avec votre accord, LYAT IMMO peut utiliser des technologies permettant de
            mesurer l’utilisation du site, d’évaluer l’efficacité de ses communications
            et de ses campagnes ou d’améliorer la pertinence de ses actions
            publicitaires.
          </p>
          {analytics.length === 0 ? (
            <p className="mt-3">
              Aucun outil de mesure d’audience ou de publicité soumis au consentement
              n’est actuellement actif.
            </p>
          ) : (
            <ul className="list-disc pl-5 space-y-2 mt-3">
              {analytics.map((s) => (
                <li key={s.id}>
                  <span className="text-ink">{s.name}</span> - {s.provider}. {s.purpose}
                  {s.doc?.transfer ? ` Transfert : ${s.doc.transfer}` : ""}
                </li>
              ))}
            </ul>
          )}

          {/* — Contenus et services externes — */}
          <H2>Contenus et services externes</H2>
          <p>
            Certaines pages de LYAT IMMO peuvent intégrer des contenus ou services
            fournis par des plateformes tierces, notamment des vidéos ou des visites
            virtuelles. Ces services peuvent entraîner la transmission de données
            techniques ou l’utilisation de traceurs. Lorsqu’un consentement est requis,
            ils ne sont chargés qu’après votre accord.
          </p>
          {external.length === 0 ? (
            <p className="mt-3">
              Aucun service externe soumis au consentement n’est actuellement actif.
            </p>
          ) : (
            <ul className="list-disc pl-5 space-y-2 mt-3">
              {external.map((s) => (
                <li key={s.id}>
                  <span className="text-ink">{s.name}</span> - {s.provider}. {s.purpose}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

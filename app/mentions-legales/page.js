import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Mentions légales | LYAT IMMO",
  description:
    "Mentions légales du site LYAT IMMO : éditeur, informations professionnelles, hébergement, responsabilité civile professionnelle et informations réglementaires.",
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

export default function MentionsLegalesPage() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-24 max-w-[760px] mx-auto">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Informations légales
        </span>
        <h1 className="font-serif text-[34px] md:text-[48px] font-medium mb-10">
          Mentions légales
        </h1>

        <div className="text-stone text-[15px] leading-[1.8]">
          {/* ─── Éditeur du site ─── */}
          <H2 first>Éditeur du site</H2>
          <p className="mb-4">Le site lyatimmo.com est édité par :</p>
          <div className="space-y-1">
            <p className="text-ink">LYAT IMMO</p>
            <p>
              Société à responsabilité limitée à associé unique au capital de
              1 000 euros
            </p>
            <p>
              Siège social : MBE – 551 Mangot Vulcin, 97232 Le Lamentin,
              Martinique
            </p>
            <p>RCS Fort-de-France : 107 987 687</p>
            <p>SIREN : 107 987 687</p>
            <p>SIRET : 107 987 687 00012</p>
            <p>TVA intracommunautaire : FR48107987687</p>
            <p>
              Téléphone :{" "}
              <a href="tel:+596696335811" className="hover:text-ink">
                0696 33 58 11
              </a>
            </p>
            <p>
              E-mail :{" "}
              <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
                contact@lyatimmo.com
              </a>
            </p>
          </div>

          {/* ─── Directeur de la publication ─── */}
          <H2>Directeur de la publication</H2>
          <p>
            Le directeur de la publication est Miguel ATTELLY, en qualité de
            gérant de LYAT IMMO.
          </p>

          {/* ─── Activités ─── */}
          <H2>Activités</H2>
          <p>
            LYAT IMMO exerce notamment des activités de transaction sur immeubles
            et fonds de commerce, d’expertise et d’estimation immobilière, ainsi
            que de conseil et d’accompagnement en immobilier.
          </p>

          {/*
            ════════════════════════════════════════════════════════════════
            À COMPLÉTER ULTÉRIEUREMENT (1/2) — NUMÉRO DE CARTE PROFESSIONNELLE
            Dès délivrance de la carte professionnelle (Carte T) par la CCIM,
            remplacer le paragraphe « en cours de traitement » ci-dessous par
            le numéro de la carte et les mentions réglementaires associées.
            NE JAMAIS inventer ni deviner ce numéro.
            ════════════════════════════════════════════════════════════════
          */}
          <H2>Carte professionnelle</H2>
          <div className="space-y-4">
            <p>
              L’activité de transaction immobilière est soumise aux dispositions
              de la loi n° 70-9 du 2 janvier 1970, dite « loi Hoguet », et de son
              décret d’application.
            </p>
            <p>
              La demande de carte professionnelle de LYAT IMMO est actuellement
              en cours de traitement auprès de la Chambre de Commerce et
              d’Industrie de la Martinique (CCIM).
            </p>
            <p>
              Les présentes mentions seront actualisées dès la délivrance de la
              carte professionnelle afin d’y faire figurer son numéro et les
              mentions réglementaires correspondantes.
            </p>
          </div>

          {/* ─── Absence de détention de fonds ─── */}
          <H2>Absence de détention de fonds et de garantie financière</H2>
          <div className="space-y-4">
            <p>
              LYAT IMMO déclare ne recevoir ni détenir, directement ou
              indirectement, d’autres fonds, effets ou valeurs que ceux
              représentatifs de sa rémunération ou de sa commission au titre de
              l’activité de transaction sur immeubles et fonds de commerce.
            </p>
            <p>À ce titre, LYAT IMMO ne souscrit pas de garantie financière.</p>
          </div>

          {/* ─── Responsabilité civile professionnelle ─── */}
          <H2>Responsabilité civile professionnelle</H2>
          <p className="mb-4">
            LYAT IMMO est assurée au titre de sa responsabilité civile
            professionnelle auprès de :
          </p>
          <div className="space-y-1">
            <p className="text-ink">GALIAN-SMABTP</p>
            <p>89 rue La Boétie</p>
            <p>75008 Paris</p>
            <p>Contrat n° RCP_01_511461L</p>
          </div>
          <p className="mt-4">
            La garantie couvre l’activité de Transactions sur immeubles et fonds
            de commerce.
          </p>

          {/*
            ════════════════════════════════════════════════════════════════
            À COMPLÉTER ULTÉRIEUREMENT (2/2) — MÉDIATION DE LA CONSOMMATION
            Dès réception de l’attestation d’adhésion ANM Consommation,
            remplacer le paragraphe provisoire ci-dessous par les
            coordonnées réglementaires définitives du médiateur
            (dénomination, adresse postale, site internet / URL de saisine).
            NE PAS publier de coordonnées, d’adresse ou d’URL non vérifiées.
            ════════════════════════════════════════════════════════════════
          */}
          <H2>Médiation de la consommation</H2>
          <div className="space-y-4">
            <p>LYAT IMMO est en cours d’adhésion auprès de :</p>
            <p className="text-ink">ANM Consommation</p>
            <p>
              L’attestation d’adhésion et les informations définitives
              nécessaires à la médiation seront communiquées prochainement.
            </p>
          </div>

          {/* ─── Hébergement ─── */}
          {/* Adresse vérifiée le 27/08/2026 sur https://vercel.com/legal/privacy-policy */}
          <H2>Hébergement</H2>
          <p className="mb-4">Le site est hébergé par :</p>
          <div className="space-y-1">
            <p className="text-ink">Vercel Inc.</p>
            <p>440 N Barranca Avenue #4133</p>
            <p>Covina, CA 91723</p>
            <p>États-Unis</p>
          </div>

          {/* ─── Propriété intellectuelle ─── */}
          <H2>Propriété intellectuelle</H2>
          <div className="space-y-4">
            <p>
              Le site lyatimmo.com, sa structure, son identité visuelle ainsi que
              les textes, photographies, illustrations, éléments graphiques,
              logos et autres contenus qui le composent sont protégés par les
              dispositions applicables en matière de propriété intellectuelle.
            </p>
            <p>
              Sauf mention contraire, ces éléments sont la propriété de LYAT IMMO
              ou sont utilisés avec l’autorisation de leurs titulaires.
            </p>
            <p>
              Toute reproduction, représentation, adaptation, modification,
              diffusion ou exploitation, totale ou partielle, de ces éléments
              sans autorisation préalable est interdite, sous réserve des
              exceptions prévues par la loi.
            </p>
          </div>

          {/* ─── Données personnelles ─── */}
          <H2>Données personnelles</H2>
          <div className="space-y-4">
            <p>
              LYAT IMMO peut être amenée à collecter et traiter des données à
              caractère personnel notamment à l’occasion des demandes de contact,
              d’estimation, de projet de vente, d’expertise immobilière ou de
              demande d’information relative au réseau LYAT IMMO.
            </p>
            <p>
              Les modalités de collecte et de traitement de ces données ainsi que
              les droits dont disposent les personnes concernées sont détaillés
              dans la{" "}
              <Link
                href="/confidentialite"
                className="underline underline-offset-2 hover:text-ink"
              >
                Politique de confidentialité
              </Link>{" "}
              du site.
            </p>
          </div>

          {/* ─── Cookies et traceurs ─── */}
          <H2>Cookies et traceurs</H2>
          <div className="space-y-4">
            <p>
              Le site peut utiliser des cookies ou autres traceurs nécessaires à
              son fonctionnement ainsi que, selon les services effectivement
              utilisés et les choix de l’utilisateur, d’autres traceurs soumis
              aux règles applicables en matière de consentement.
            </p>
            <p>
              Les informations relatives aux cookies et aux moyens permettant de
              gérer les préférences sont accessibles depuis la rubrique{" "}
              <Link
                href="/cookies"
                className="underline underline-offset-2 hover:text-ink"
              >
                Gestion des cookies
              </Link>{" "}
              du site.
            </p>
          </div>

          {/* ─── Barème d'honoraires ─── */}
          <H2>Barème d’honoraires</H2>
          <p>
            Le barème d’honoraires applicable aux prestations de transaction
            immobilière proposées par LYAT IMMO est accessible à tout moment
            depuis le lien{" "}
            <Link
              href="/honoraires"
              className="underline underline-offset-2 hover:text-ink"
            >
              Barème d’honoraires
            </Link>{" "}
            présent sur le site.
          </p>

          {/* ─── Droit applicable ─── */}
          <H2>Droit applicable</H2>
          <div className="space-y-4">
            <p>
              Le présent site et ses mentions légales sont soumis au droit
              français.
            </p>
            <p>
              Sous réserve des dispositions légales impératives applicables, tout
              litige relatif à l’utilisation du site relève des juridictions
              françaises compétentes.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

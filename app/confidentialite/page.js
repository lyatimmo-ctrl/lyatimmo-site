import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Politique de confidentialité | LYAT IMMO",
  description:
    "Comment LYAT IMMO collecte, utilise, conserve et protège les données personnelles transmises via lyatimmo.com : finalités, bases juridiques, destinataires, durées de conservation et droits des personnes.",
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

export default function ConfidentialitePage() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-24 max-w-[760px] mx-auto">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Protection des données
        </span>
        <h1 className="font-serif text-[34px] md:text-[48px] font-medium mb-3">
          Politique de confidentialité
        </h1>
        <p className="text-[13px] text-stone mb-10">Dernière mise à jour : 27 août 2026</p>

        <p className="text-stone text-[15px] leading-[1.8]">
          Cette politique explique comment LYAT IMMO traite les données personnelles
          transmises via le site lyatimmo.com, en particulier au travers du formulaire
          de contact (projet de vente, estimation, expertise immobilière, demande relative
          au réseau LYAT IMMO ou autre demande). Elle décrit le fonctionnement réel du site
          à la date ci-dessus.
        </p>

        <div className="text-stone text-[15px] leading-[1.8]">
          {/* 1 */}
          <H2 first>1. Qui est responsable de vos données ?</H2>
          <p className="mb-4">
            Le responsable du traitement des données collectées pour ses propres
            finalités via lyatimmo.com est :
          </p>
          <div className="space-y-1">
            <p className="text-ink">LYAT IMMO</p>
            <p>SARL à associé unique au capital de 1 000 euros</p>
            <p>RCS Fort-de-France : 107 987 687</p>
            <p>Siège social : MBE - 551 Mangot Vulcin, 97232 Le Lamentin, Martinique</p>
            <p>
              E-mail :{" "}
              <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
                contact@lyatimmo.com
              </a>
            </p>
            <p>
              Téléphone :{" "}
              <a href="tel:+596696335811" className="hover:text-ink">
                0696 33 58 11
              </a>
            </p>
          </div>
          <p className="mt-4">
            LYAT IMMO n’a pas désigné de délégué à la protection des données. Pour toute
            question relative à vos données, écrivez à{" "}
            <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
              contact@lyatimmo.com
            </a>
            .
          </p>

          {/* 2 */}
          <H2>2. Dans quels cas collectons-nous vos données ?</H2>
          <p>
            Nous collectons des données uniquement lorsque vous nous les transmettez
            volontairement, essentiellement en remplissant et en envoyant le formulaire
            de contact du site. Les champs affichés s’adaptent au motif que vous
            sélectionnez : nous ne recueillons que les informations correspondant à ce
            motif. Aucun compte n’est créé sur ce site.
          </p>

          {/* 3 */}
          <H2>3. Quelles données collectons-nous ?</H2>
          <p className="mb-2">Selon votre demande, nous pouvons collecter :</p>
          <p className="text-ink mt-4">Identification et contact (tous les motifs)</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>nom et prénom ;</li>
            <li>adresse e-mail ;</li>
            <li>numéro de téléphone.</li>
          </ul>
          <p className="text-ink mt-4">
            Projet de vente et estimation
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>type de bien ;</li>
            <li>commune ou secteur ;</li>
            <li>adresse du bien, lorsque vous la renseignez ;</li>
            <li>surface approximative ;</li>
            <li>nombre de pièces ;</li>
            <li>informations relatives à votre projet et, pour un projet de vente, échéance envisagée ;</li>
            <li>contenu libre du message.</li>
          </ul>
          <p className="text-ink mt-4">Expertise immobilière</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>type de bien ;</li>
            <li>localisation et, lorsque vous la renseignez, adresse du bien ;</li>
            <li>
              contexte de la demande (par exemple succession, divorce ou séparation,
              donation ou partage, contentieux, valeur locative, expertise judiciaire,
              déclaration patrimoniale, acquisition ou cession) ;
            </li>
            <li>délai souhaité ;</li>
            <li>contenu libre du message.</li>
          </ul>
          <p className="mt-3">
            Le choix du contexte peut indirectement renseigner sur votre situation
            personnelle. Le formulaire se limite volontairement au contexte général et
            aux éléments nécessaires à la prise de contact. Les documents éventuellement
            nécessaires à une mission sont demandés plus tard, séparément, avec des
            mesures adaptées.
          </p>
          <p className="text-ink mt-4">Demande relative au réseau LYAT IMMO</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>identité et coordonnées ;</li>
            <li>situation professionnelle ;</li>
            <li>expérience dans l’immobilier ;</li>
            <li>secteur géographique d’activité ;</li>
            <li>nature de la demande ;</li>
            <li>contenu libre du message.</li>
          </ul>
          <p className="mt-3">
            À ce stade, nous ne demandons pas de revenus, de chiffre d’affaires, de
            données bancaires, de pièce d’identité ni de documents sans rapport avec
            l’examen initial de la demande.
          </p>
          <p className="text-ink mt-4">Consentement à une prospection commerciale ultérieure</p>
          <p className="mt-2">
            Pour les demandes de projet de vente, d’estimation et d’expertise, une case
            à cocher facultative, décochée par défaut, vous permet d’accepter d’être
            recontacté ultérieurement au sujet des services de LYAT IMMO. Lorsque vous
            la cochez, nous enregistrons : le statut du consentement, sa date et son
            heure, le contexte de collecte et le texte de la mention qui vous a été
            présentée (voir la section 11).
          </p>
          <p className="text-ink mt-4">Données techniques</p>
          <p className="mt-2">
            Comme tout site web, lyatimmo.com génère des données techniques nécessaires
            à son fonctionnement et à sa sécurité (notamment adresse IP, type de
            navigateur, pages consultées), traitées dans les journaux de notre
            hébergeur.
          </p>

          {/* 4 */}
          <H2>4. Pourquoi utilisons-nous vos données ?</H2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="text-ink">Traiter votre demande</span> : recevoir votre
              demande, y répondre et reprendre contact avec vous dans le cadre de
              celle-ci.
            </li>
            <li>
              <span className="text-ink">Projet de vente</span> : comprendre votre
              projet, apprécier la nature de votre demande et organiser les échanges
              nécessaires à un éventuel accompagnement.
            </li>
            <li>
              <span className="text-ink">Estimation</span> : traiter votre demande,
              recueillir les informations initiales sur le bien et reprendre contact à
              ce sujet.
            </li>
            <li>
              <span className="text-ink">Expertise immobilière</span> : analyser la
              demande, comprendre le contexte de la mission, apprécier les premiers
              éléments utiles à sa prise en charge et reprendre contact avec vous.
            </li>
            <li>
              <span className="text-ink">Rejoindre LYAT IMMO</span> : répondre aux
              demandes d’information sur le réseau, apprécier le profil professionnel et
              le projet du demandeur, et organiser un éventuel échange sur une
              intégration.
            </li>
            <li>
              <span className="text-ink">Gestion de la relation</span> : conserver
              l’historique des échanges, assurer le suivi administratif d’une demande ou
              d’une relation engagée et traiter les demandes relatives à vos droits.
            </li>
            <li>
              <span className="text-ink">Prospection commerciale ultérieure</span> :
              uniquement si vous y avez consenti, vous recontacter au sujet des services
              immobiliers de LYAT IMMO, dans le périmètre du consentement recueilli.
            </li>
            <li>
              <span className="text-ink">Sécurité</span> : assurer le bon
              fonctionnement du site et prévenir les usages abusifs du formulaire.
            </li>
          </ul>
          <p className="mt-3">
            Le simple envoi d’une demande via le formulaire ne vaut pas autorisation
            générale de prospection commerciale.
          </p>

          {/* 5 */}
          <H2>5. Sur quelles bases juridiques ?</H2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="text-ink">Demandes de projet de vente, d’estimation,
              d’expertise, de contact ou relatives au réseau</span> : l’exécution de
              mesures précontractuelles prises à votre demande et, selon le cas,
              l’intérêt légitime de LYAT IMMO à répondre aux sollicitations qui lui sont
              adressées.
            </li>
            <li>
              <span className="text-ink">Relation contractuelle</span> (mission ou
              mandat confié) : l’exécution du contrat ou de mesures précontractuelles.
            </li>
            <li>
              <span className="text-ink">Obligations comptables, fiscales et légales</span>{" "}
              : le respect d’une obligation légale.
            </li>
            <li>
              <span className="text-ink">Prospection commerciale ultérieure</span> :
              votre consentement. Son refus ou son retrait n’empêche pas le traitement
              de la demande que vous avez adressée, qui repose sur une autre base
              juridique.
            </li>
            <li>
              <span className="text-ink">Conservation de la preuve du consentement,
              sécurité et journaux techniques</span> : l’intérêt légitime de LYAT IMMO
              et, s’agissant de la preuve du consentement, le respect de ses obligations.
            </li>
          </ul>

          {/* 6 */}
          <H2>6. Quelles informations sont obligatoires ?</H2>
          <p>
            Les champs signalés comme obligatoires sont nécessaires au traitement de
            votre demande : nom et prénom, e-mail, téléphone et motif, ainsi que,
            selon le motif, le type de bien et la commune (projet de vente, estimation,
            expertise), le contexte (expertise) ou la situation, l’expérience et le
            secteur (réseau). Le message n’est obligatoire que pour le motif « Autre
            demande ». Les autres champs sont facultatifs.
          </p>
          <p className="mt-3">
            L’absence d’une information obligatoire peut nous empêcher de traiter
            correctement votre demande. En revanche, refuser la prospection commerciale
            ultérieure n’empêche jamais l’envoi de votre demande.
          </p>

          {/* 7 */}
          <H2>7. Qui peut accéder à vos données ou les recevoir ?</H2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              les personnes habilitées au sein de LYAT IMMO qui ont besoin d’y accéder
              pour traiter votre demande ;
            </li>
            <li>
              le conseiller LYAT IMMO chargé de traiter votre demande : lorsque cela est
              nécessaire, votre demande lui est transmise individuellement, avec les
              seules informations utiles à sa prise en charge. Les conseillers ne
              disposent pas d’un accès général à l’ensemble des demandes reçues ;
            </li>
            <li>
              nos prestataires techniques, qui agissent pour le compte de LYAT IMMO et
              selon ses instructions (voir la section 8) ;
            </li>
            <li>
              les autorités administratives ou judiciaires, lorsque la loi l’impose ;
            </li>
            <li>
              lorsqu’une opération immobilière se concrétise, les professionnels qui y
              interviennent (par exemple notaire, diagnostiqueurs) lorsque la
              transmission est nécessaire et justifiée. Ces traitements, propres à la
              relation immobilière, sont distincts de la simple prise de contact via le
              site.
            </li>
          </ul>
          <p className="mt-3">
            Lorsqu’un projet se concrétise et qu’un dossier est ouvert, LYAT IMMO utilise
            des outils métier spécialisés, notamment MyNotary (rédaction et gestion de
            documents immobiliers) et TransactImmo (commercialisation immobilière). Ces
            outils ne reçoivent pas automatiquement les données du formulaire de contact :
            ils n’interviennent que si un dossier est effectivement créé. Une information
            spécifique est alors fournie aux personnes concernées.
          </p>
          <p className="mt-3">
            LYAT IMMO ne vend pas les données personnelles collectées via son site. Les
            transmissions décrites ci-dessus correspondent soit au recours à des
            sous-traitants techniques, soit à des communications imposées par la loi,
            soit aux nécessités d’une opération engagée à votre demande.
          </p>

          {/* 8 */}
          <H2>8. Nos prestataires techniques</H2>
          <p className="text-ink mt-2">Vercel Inc. (États-Unis) - hébergement du site</p>
          <p className="mt-1">
            Le site et la fonction serveur qui reçoit le formulaire sont hébergés par
            Vercel (offre Pro). Vercel traite des données techniques (dont l’adresse IP
            et les métadonnées de requête) et assure le transit - sans conservation
            durable - du contenu du formulaire au moment de son envoi. Les journaux
            d’exécution sont conservés par Vercel pendant 1 jour sur l’offre Pro,
            conformément à sa documentation.
          </p>
          <p className="text-ink mt-4">Resend, Inc. (États-Unis) - envoi de l’e-mail</p>
          <p className="mt-1">
            Le contenu de votre demande est transmis par e-mail à{" "}
            <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
              contact@lyatimmo.com
            </a>{" "}
            via Resend, qui agit en qualité de sous-traitant. Les données transmises à
            Resend sont celles figurant dans cet e-mail. Resend traite ces données aux
            États-Unis, recourt à des prestataires d’infrastructure cloud (liste
            disponible sur son site) et supprime les données au plus tard 90 jours après
            la clôture du compte.
          </p>
          <p className="text-ink mt-4">
            Google (Google Workspace / Gmail, États-Unis) - messagerie
          </p>
          <p className="mt-1">
            L’adresse{" "}
            <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
              contact@lyatimmo.com
            </a>{" "}
            est hébergée sur Google Workspace. Les demandes reçues sont donc conservées
            dans cette messagerie. Google agit en qualité de sous-traitant. Il peut
            arriver qu’une demande soit ensuite transférée par e-mail au conseiller
            chargé de son traitement.
          </p>
          <p className="mt-4">
            Les polices de caractères du site sont hébergées directement sur le domaine
            de lyatimmo.com : aucun appel n’est effectué vers un service tiers de
            polices, et votre adresse IP n’est pas transmise à ce titre.
          </p>
          <p className="mt-3">
            Aucun outil de mesure d’audience, de publicité ou de suivi comportemental
            n’est utilisé sur le site.
          </p>

          {/* 9 */}
          <H2>9. Transferts en dehors de l’Espace économique européen</H2>
          <p>
            Vercel, Resend et Google traitent des données aux États-Unis. Ces transferts
            sont encadrés par des garanties appropriées :
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <span className="text-ink">Vercel</span> : clauses contractuelles types
              de la Commission européenne et certification au titre du Data Privacy
              Framework UE-États-Unis ;
            </li>
            <li>
              <span className="text-ink">Resend</span> : clauses contractuelles types et
              certification au titre du Data Privacy Framework UE-États-Unis (et de son
              extension britannique) ;
            </li>
            <li>
              <span className="text-ink">Google</span> : clauses contractuelles types et
              inscription au registre du Data Privacy Framework UE-États-Unis.
            </li>
          </ul>
          <p className="mt-3">
            Une copie des garanties applicables peut être demandée à{" "}
            <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
              contact@lyatimmo.com
            </a>
            .
          </p>

          {/* 10 */}
          <H2>10. Combien de temps conservons-nous vos données ?</H2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="text-ink">Demande sans suite</span> : 3 ans à compter du
              dernier contact ou de la dernière manifestation d’intérêt de votre part.
            </li>
            <li>
              <span className="text-ink">Prospect ayant consenti à la prospection</span>{" "}
              : 3 ans à compter du dernier contact ou de la dernière manifestation
              d’intérêt, sous réserve d’un retrait antérieur du consentement.
            </li>
            <li>
              <span className="text-ink">Demande d’expertise sans suite</span> : 3 ans à
              compter du dernier contact. Lorsqu’une mission est confiée, les données
              sont conservées pendant la durée de la relation contractuelle, puis
              archivées le temps nécessaire au respect des obligations applicables et à
              la défense des droits de LYAT IMMO.
            </li>
            <li>
              <span className="text-ink">Professionnel n’intégrant pas le réseau</span>{" "}
              : 2 ans à compter du dernier échange, sauf opposition ou demande
              d’effacement recevable avant ce terme.
            </li>
            <li>
              <span className="text-ink">Clients</span> : les données sont utilisées
              pendant la durée de la relation, puis conservées séparément selon leur
              nature - obligations comptables et fiscales (généralement 10 ans),
              archivage nécessaire à la défense des droits (durées de prescription
              applicables) et documents immobiliers soumis à des obligations propres
              (par exemple registre des mandats). Aucune durée unique n’est appliquée
              indistinctement à toutes les données d’un client.
            </li>
            <li>
              <span className="text-ink">Preuve du consentement commercial</span> :
              conservée pendant la durée du traitement fondé sur ce consentement, puis
              le temps nécessaire à la démonstration du respect de nos obligations.
            </li>
            <li>
              <span className="text-ink">Journaux techniques</span> : conservés par
              l’hébergeur pour une durée courte (1 jour pour les journaux d’exécution
              sur l’offre Vercel Pro).
            </li>
          </ul>
          <p className="mt-3">
            Les demandes reçues sont conservées dans la messagerie Google Workspace de
            LYAT IMMO. La suppression n’y est pas automatique : LYAT IMMO procède aux
            suppressions et archivages nécessaires pour appliquer les durées ci-dessus.
          </p>

          {/* 11 */}
          <H2>11. Prospection commerciale et consentement</H2>
          <p>
            Pour les demandes de projet de vente, d’estimation et d’expertise, le
            formulaire comporte la case facultative suivante, décochée par défaut :
          </p>
          <p className="mt-3 pl-4 border-l-2 border-line italic">
            « J’accepte que LYAT IMMO utilise mes coordonnées pour me recontacter
            ultérieurement au sujet de ses services immobiliers et de mon projet,
            notamment par téléphone, e-mail ou SMS. »
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-3">
            <li>
              <span className="text-ink">Finalité</span> : vous adresser des
              sollicitations relatives aux services immobiliers de LYAT IMMO et à votre
              projet.
            </li>
            <li>
              <span className="text-ink">Base juridique</span> : votre consentement.
            </li>
            <li>
              <span className="text-ink">Moyens concernés</span> : téléphone, e-mail,
              SMS.
            </li>
          </ul>
          <p className="mt-3">
            Aucun outil d’automatisation de campagnes (e-mailing, SMS) n’est
            actuellement mis en œuvre. Cette case n’est pas présentée pour les motifs
            « Rejoindre LYAT IMMO » et « Autre demande ». Cocher la case ne conditionne
            pas l’envoi de votre demande, et vous n’êtes jamais inscrit automatiquement
            à une newsletter.
          </p>
          <p className="mt-3">
            Vous pouvez retirer votre consentement à tout moment, sans justification, en
            écrivant à{" "}
            <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
              contact@lyatimmo.com
            </a>
            . Toute communication commerciale électronique comportera par ailleurs un
            moyen simple de s’y opposer. Le retrait vaut pour les sollicitations futures
            et ne remet pas en cause la licéité des traitements réalisés avant celui-ci.
          </p>
          <p className="mt-3 text-[13px]">
            À ce jour, le statut de ce consentement (accordé ou non), sa date et son
            heure, son contexte et le texte présenté figurent dans l’e-mail reçu par
            LYAT IMMO. Il n’existe pas encore de registre de consentement structuré
            distinct ; un tel dispositif sera mis en place si LYAT IMMO se dote d’un
            outil de gestion de la relation client.
          </p>

          {/* 12 */}
          <H2>12. Décisions automatisées et profilage</H2>
          <p>
            Le formulaire adapte les champs affichés au motif que vous choisissez, mais
            aucune décision produisant des effets juridiques ou vous affectant de
            manière significative n’est prise de façon entièrement automatisée, et
            aucun profilage n’est réalisé.
          </p>

          {/* 13 */}
          <H2>13. Zone de message libre</H2>
          <p>
            Les champs « Message » vous permettent d’écrire librement. Nous vous
            invitons à n’y communiquer que les informations utiles au traitement de
            votre demande. LYAT IMMO ne demande pas, au stade du formulaire, de
            coordonnées bancaires, de mots de passe, de pièces d’identité, d’informations
            médicales, de décisions de justice, de documents successoraux ou d’autres
            éléments sans rapport avec la demande.
          </p>

          {/* 14 */}
          <H2>14. Données des mineurs</H2>
          <p>
            Le site et les services de LYAT IMMO ne sont pas destinés aux mineurs. Nous
            ne collectons pas sciemment de données relatives à des mineurs lorsqu’elles
            ne sont pas nécessaires et ne mettons pas en place de vérification d’âge.
          </p>

          {/* 15 */}
          <H2>15. Quels sont vos droits ?</H2>
          <p className="mb-2">
            Selon le traitement concerné et sa base juridique, vous disposez des droits
            suivants :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>droit d’accès à vos données ;</li>
            <li>droit de rectification ;</li>
            <li>droit à l’effacement ;</li>
            <li>droit à la limitation du traitement ;</li>
            <li>droit d’opposition, notamment à la prospection ;</li>
            <li>droit à la portabilité, lorsqu’il est applicable ;</li>
            <li>
              droit de retirer votre consentement à tout moment lorsqu’un traitement
              repose sur celui-ci.
            </li>
          </ul>
          <p className="mt-3">
            Le retrait du consentement ne remet pas en cause la licéité des traitements
            effectués avant ce retrait.
          </p>

          {/* 16 */}
          <H2>16. Comment exercer vos droits ?</H2>
          <p>
            Adressez votre demande à{" "}
            <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
              contact@lyatimmo.com
            </a>
            . En cas de doute raisonnable sur votre identité, LYAT IMMO peut vous
            demander des informations complémentaires permettant de la vérifier ; la
            transmission d’une copie de pièce d’identité n’est pas exigée de façon
            systématique.
          </p>

          {/* 17 */}
          <H2>17. Réclamation auprès de la CNIL</H2>
          <p>
            Vous pouvez introduire une réclamation auprès de la Commission nationale de
            l’informatique et des libertés (CNIL) :
          </p>
          <div className="space-y-1 mt-2">
            <p>3 Place de Fontenoy - TSA 80715 - 75334 Paris Cedex 07</p>
            <p>Téléphone : 01 53 73 22 22</p>
            <p>
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-ink"
              >
                www.cnil.fr
              </a>
            </p>
          </div>

          {/* 18 */}
          <H2>18. Cookies et traceurs</H2>
          <p>
            Le site dépose un cookie de préférence (« lyat_consent ») dont l’unique
            objet est de mémoriser votre choix en matière de cookies ; il ne contient
            aucune donnée personnelle. Les technologies soumises au consentement
            (mesure d’audience, publicité, contenus externes) ne sont chargées
            qu’après votre acceptation via le bandeau prévu à cet effet. En l’état
            actuel, aucun outil de mesure d’audience ni de ciblage publicitaire n’est
            actif.
          </p>
          <p className="mt-3">
            Le détail des technologies utilisées et la possibilité de modifier votre
            choix à tout moment sont présentés dans la rubrique{" "}
            <Link href="/cookies" className="underline underline-offset-2 hover:text-ink">
              Gestion des cookies
            </Link>{" "}
            du site.
          </p>

          {/* 19 */}
          <H2>19. Sécurité de vos données</H2>
          <p>
            LYAT IMMO met en œuvre des mesures techniques et organisationnelles adaptées
            pour protéger les données contre l’accès non autorisé, la perte,
            l’altération, la divulgation et la destruction. Aucune transmission ou
            conservation de données ne peut toutefois être garantie comme totalement
            infaillible.
          </p>
          <p className="mt-3">
            En pratique : les secrets techniques sont conservés côté serveur et ne sont
            jamais exposés au navigateur, les données du formulaire sont validées côté
            serveur, seules les informations utiles au motif choisi sont transmises,
            aucune donnée personnelle n’est placée dans les adresses (URL) ni transmise
            à un outil de mesure d’audience, et l’envoi du formulaire est protégé contre
            les usages abusifs par des moyens proportionnés (champ piège et limitation
            du nombre d’envois par origine, sans traceur ni profilage).
          </p>

          {/* 20 */}
          <H2>20. Liens et services tiers</H2>
          <p>
            Le site comporte des liens vers des services externes, notamment la page
            d’avis Google de l’agence et l’Espace Conseiller (app.lyatimmo.com).
            L’utilisation de ces services relève de leurs propres politiques de
            confidentialité. Cette mention n’exonère pas LYAT IMMO de ses
            responsabilités pour les services qu’elle intègre elle-même à son site.
          </p>

          {/* 21 */}
          <H2>21. Évolution de la présente politique</H2>
          <p>
            La présente politique peut évoluer afin de refléter les modifications
            réglementaires, l’évolution des services, l’ajout ou le retrait de
            prestataires, ou les changements apportés aux traitements réalisés. La date
            de dernière mise à jour figure en haut de la page.
          </p>

          {/* 22 */}
          <H2>22. Nous contacter</H2>
          <div className="space-y-1">
            <p className="text-ink">LYAT IMMO</p>
            <p>MBE - 551 Mangot Vulcin, 97232 Le Lamentin, Martinique</p>
            <p>
              <a href="mailto:contact@lyatimmo.com" className="hover:text-ink">
                contact@lyatimmo.com
              </a>
            </p>
            <p>
              <a href="tel:+596696335811" className="hover:text-ink">
                0696 33 58 11
              </a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

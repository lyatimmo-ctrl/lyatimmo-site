"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// `statuts` (grille de rémunération) est fourni par le Server Component parent
// (app/nous-rejoindre/page.js), qui le lit de la vue publique
// v_bareme_remuneration_public (ISR). Source de vérité unique = config Supabase.
export default function NousRejoindreClient({ statuts = [] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── 2. Pourquoi LYAT ────────────────────────────────────────────────
  const pourquoi = [
    {
      t: "Autonomie",
      d: "Vous organisez votre activité et développez votre propre portefeuille. Nous privilégions la responsabilisation plutôt qu'un fonctionnement fondé sur le contrôle permanent.",
    },
    {
      t: "Un cadre",
      d: "Méthodes de travail, documents, règles communes et accompagnement permettent à chacun d'exercer dans un environnement professionnel structuré.",
    },
    {
      t: "Une technologie",
      d: "Un espace de pilotage, des outils métier, une application mobile et un mini-site professionnel réunis dans un seul environnement, tenu à jour par le réseau.",
    },
    {
      t: "Un collectif",
      d: "L'indépendance n'autorise pas l'individualisme. Les relations entre conseillers reposent sur le respect, la loyauté, l'entraide et des règles connues de tous.",
    },
  ];

  // ── 3. Espace Conseiller ────────────────────────────────────────────
  const espaceCards = [
    {
      t: "Pilotage",
      d: "Production réalisée, objectif, palier atteint, prochain seuil et chiffre d'affaires prévisionnel, mis à jour au fil de vos affaires.",
    },
    {
      t: "Affaires et échéances",
      d: "Chaque dossier suit ses jalons datés (offre, compromis, conditions, acte) et ses échéances, avec des alertes à l'approche des dates clés.",
    },
    {
      t: "Prospection",
      d: "Vos prospects vendeurs et acquéreurs, leurs prochaines actions et vos relances à faire, à venir ou en retard.",
    },
  ];

  // ── 4. Outils métier ────────────────────────────────────────────────
  const outilAutres = [
    {
      t: "Calculateur d'honoraires",
      d: "Calculez les honoraires d'une vente dans les deux sens, du net vendeur au prix affiché comme du prix affiché au net vendeur, avec la TVA applicable à votre territoire.",
    },
    {
      t: "Simulateur de rémunération",
      d: "Estimez votre rémunération sur une nouvelle affaire en fonction de votre statut et de votre production déjà réalisée dans l'année.",
    },
    {
      t: "Simulateur de capacité de financement",
      d: "Un outil indicatif d'aide à l'analyse pour situer le budget d'un acquéreur. Il ne remplace ni l'étude d'une banque, ni celle d'un courtier, ni un accord de financement.",
    },
  ];

  // ── 5. Mobilité / PWA ───────────────────────────────────────────────
  const pwa = [
    {
      ic: "install",
      t: "Une application installable",
      d: "Depuis l'Espace Conseiller, ajoutez LYAT IMMO à l'écran d'accueil de votre téléphone. L'application s'ouvre ensuite en plein écran.",
    },
    {
      ic: "devices",
      t: "Ordinateur et mobile",
      d: "Le même environnement et la même connexion, que vous soyez au bureau sur ordinateur ou en déplacement sur téléphone.",
    },
    {
      ic: "sync",
      t: "Toujours à jour",
      d: "L'application récupère automatiquement la dernière version en ligne à chaque ouverture. Une connexion internet reste nécessaire.",
    },
  ];

  // Pictogrammes PWA : SVG sobres, tracé unique, héritent de currentColor.
  const PwaIcon = ({ name }) => {
    const p = {
      install: (
        <>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M12 7v7" />
          <path d="m9 11 3 3 3-3" />
        </>
      ),
      devices: (
        <>
          <rect x="2" y="4" width="14" height="10" rx="1" />
          <path d="M7 18h6M9.5 14v4" />
          <rect x="17" y="9" width="5" height="11" rx="1" />
        </>
      ),
      sync: (
        <>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </>
      ),
    };
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {p[name]}
      </svg>
    );
  };

  // ── 6. Coach LYAT ───────────────────────────────────────────────────
  const coach = [
    {
      t: "Préparer",
      d: "Préparation d'un rendez-vous d'estimation, d'un second rendez-vous, d'une présentation d'offre : trame, questions utiles, points de vigilance.",
    },
    {
      t: "Argumenter",
      d: "Traitement des objections courantes, formulation d'un message clair, posture commerciale.",
    },
    {
      t: "Débriefer et organiser",
      d: "Retour sur un rendez-vous, identification d'un blocage, prochaine action concrète, organisation de l'activité.",
    },
  ];

  // ── 7. Formation ────────────────────────────────────────────────────
  const formation = [
    {
      t: "Modules vidéo",
      d: "Des modules vidéo sur les pratiques du réseau, accessibles depuis l'Espace Conseiller.",
    },
    {
      t: "Suivi de visionnage",
      d: "Vous repérez d'un coup d'œil les modules déjà consultés et ceux qui restent à voir.",
    },
  ];

  // ── 9. Commercialisation ────────────────────────────────────────────
  const commercial = [
    {
      t: "Plateforme de commercialisation",
      d: "Une plateforme de commercialisation pour gérer les biens, les mandats et les annonces.",
    },
    {
      t: "Diffusion",
      d: "Vos annonces sont diffusées sur les portails intégrés au dispositif de commercialisation. Vous restez libre de compléter votre diffusion par vos propres abonnements, à votre charge.",
    },
    {
      t: "Documents juridiques",
      d: "Une plateforme juridique permet de préparer et de rédiger les mandats, avenants et documents nécessaires aux transactions.",
    },
    {
      t: "Cadre administratif",
      d: "Une organisation commune accompagne les opérations jusqu'à leur aboutissement.",
    },
  ];

  // ── 11. Progression ─────────────────────────────────────────────────
  const progression = [
    {
      t: "Partenaire",
      d: "Développer son activité avec l'accompagnement d'un Team Leader et une rémunération progressive.",
    },
    {
      t: "Confirmé",
      d: "Exercer de manière autonome et accéder au mécanisme permettant d'atteindre 100 % sur sa production personnelle après le cap annuel.",
    },
    {
      t: "Team Leader",
      d: "Continuer à produire personnellement tout en accompagnant d'autres conseillers dans leur développement.",
    },
  ];

  // ── 13. Développer votre réseau ─────────────────────────────────────
  const developpement = [
    {
      t: "Transmission",
      d: "Vous présentez LYAT IMMO à des professionnels de votre entourage qui partagent la même exigence du métier.",
    },
    {
      t: "Un parrainage tracé",
      d: "Dès la candidature, la personne peut indiquer qui lui a fait connaître le réseau. Ce lien de parrainage est enregistré selon les règles de LYAT IMMO.",
    },
    {
      t: "Une organisation qui se construit",
      d: "Accompagner d'autres conseillers permet de constituer progressivement une organisation au sein du réseau.",
    },
  ];

  // ── 14. Synthèse de valeur ──────────────────────────────────────────
  const synthese = [
    {
      t: "Pilotage",
      items: [
        "Tableau de bord de production",
        "Suivi des affaires et des échéances",
        "Prospection et relances",
        "Alertes",
      ],
    },
    {
      t: "Outils métier",
      items: [
        "Outil d'évaluation (PDF et Word)",
        "Calculateur d'honoraires",
        "Simulateur de rémunération",
        "Simulateur de capacité de financement",
      ],
    },
    {
      t: "Accompagnement",
      items: [
        "Coach LYAT",
        "Accompagnement par un Team Leader",
        "Formation du réseau",
      ],
    },
    {
      t: "Visibilité",
      items: [
        "Mini-site professionnel à votre nom",
        "Témoignages clients vérifiés",
        "Distinctions du réseau",
      ],
    },
    {
      t: "Commercialisation",
      items: [
        "Plateforme de commercialisation",
        "Diffusion sur les portails intégrés",
        "Rédaction des documents juridiques",
      ],
    },
    {
      t: "Ressources",
      items: [
        "Médiathèque du réseau",
        "Application mobile installable",
        "Annuaire de sites métier",
      ],
    },
  ];

  // ── 16. Culture ─────────────────────────────────────────────────────
  const culture = [
    {
      t: "L'intérêt du client",
      d: "Nous plaçons l'intérêt du client avant la recherche d'une commission. Conseiller signifie parfois savoir déconseiller, expliquer une difficulté ou refuser de promettre ce que nous ne pouvons pas garantir.",
    },
    {
      t: "L'honnêteté",
      d: "Nous attendons de chaque conseiller une information sincère, claire et loyale. Une difficulté connue ne se dissimule pas et une promesse commerciale ne doit jamais remplacer la réalité.",
    },
    {
      t: "Le respect",
      d: "Clients, confrères, partenaires et autres conseillers du réseau doivent être considérés avec le même respect. La manière dont nous parlons aux personnes fait partie intégrante de notre professionnalisme.",
    },
    {
      t: "La loyauté entre conseillers",
      d: "L'autonomie de chacun s'exerce dans le respect du travail des autres. Appropriation d'un client, concurrence déloyale interne, rétention volontaire d'information ou comportement destiné à nuire à un autre conseiller n'ont pas leur place chez LYAT IMMO.",
    },
    {
      t: "L'entraide",
      d: "Partager une expérience, répondre à une question ou aider un autre conseiller lorsque cela est possible contribue à la qualité du réseau. La réussite individuelle n'exige pas l'échec des autres.",
    },
    {
      t: "La responsabilité",
      d: "Chaque conseiller est responsable de ses engagements, de la qualité de son travail, de la confidentialité des informations qui lui sont confiées et du respect du cadre légal et déontologique de la profession.",
    },
  ];

  // ── 17. FAQ ─────────────────────────────────────────────────────────
  const faq = [
    {
      q: "Puis-je rejoindre LYAT IMMO si je suis déjà conseiller ailleurs ?",
      a: "Oui. Selon votre expérience et votre autonomie, vous pouvez intégrer le réseau comme Conseiller Confirmé, ou comme Conseiller Partenaire si vous souhaitez être accompagné dans une première étape. Un professionnel expérimenté peut, sous réserve des critères d'admission, intégrer directement un niveau correspondant à son parcours.",
    },
    {
      q: "Quelle autonomie je conserve ?",
      a: "Vous restez indépendant : vous organisez votre activité, votre agenda et votre prospection, et vous développez votre propre portefeuille. LYAT IMMO apporte un cadre commun, des outils et un accompagnement, sans fonctionnement fondé sur le contrôle permanent.",
    },
    {
      q: "Que comprend l'abonnement de 59 € TTC par mois ?",
      a: "L'abonnement donne accès à l'environnement LYAT : l'Espace Conseiller et son pilotage, les outils métier, l'application mobile, le mini-site professionnel, la formation du réseau et les plateformes de commercialisation. Certains services ou actes peuvent faire l'objet de frais distincts, selon les conditions applicables. Les modalités complètes sont présentées lors de l'intégration.",
    },
    {
      q: "Comment fonctionne l'accompagnement ?",
      a: "Le Conseiller Partenaire est accompagné par un Team Leader. Tous les conseillers disposent de Coach LYAT, un appui métier intégré pour préparer un rendez-vous, travailler une objection, débriefer une visite ou organiser leur activité, ainsi que de la formation du réseau.",
    },
    {
      q: "Comment fonctionne la progression Partenaire, Confirmé, Team Leader ?",
      a: "Le parcours est linéaire. Le Conseiller Partenaire fait évoluer sa rémunération avec son chiffre d'affaires annuel. Le Conseiller Confirmé exerce en autonomie et accède au mécanisme permettant d'atteindre 100 % sur sa production personnelle après le cap annuel. Le Team Leader conserve ce modèle sur sa production personnelle et accompagne d'autres conseillers. Les conditions d'accès à chaque statut sont présentées lors des entretiens d'intégration.",
    },
    {
      q: "Puis-je développer mon propre réseau ?",
      a: "Oui. Vous pouvez faire connaître LYAT IMMO autour de vous et accompagner l'arrivée de nouveaux conseillers. Dès la candidature, une personne peut indiquer qui lui a fait connaître le réseau, et ce lien de parrainage est enregistré selon les règles de LYAT IMMO. Le fonctionnement détaillé est présenté lors des entretiens.",
    },
    {
      q: "Comment se déroule l'intégration ?",
      a: "En quatre temps : découvrir le fonctionnement et le modèle du réseau ; échanger lors d'un entretien individuel ; vérifier ensemble que nous pouvons travailler ensemble, l'adhésion aux principes professionnels comptant autant que la capacité à produire ; puis définir le statut et le cadre contractuel avant le démarrage.",
    },
  ];

  // ── 18. Processus ──────────────────────────────────────────────────
  const processus = [
    {
      n: "01",
      t: "Découvrir LYAT IMMO",
      d: "Présentation du fonctionnement, du modèle économique et de la philosophie du réseau.",
    },
    {
      n: "02",
      t: "Échanger",
      d: "Un entretien individuel permet de parler du parcours, des attentes et du projet professionnel du candidat.",
    },
    {
      n: "03",
      t: "Vérifier que nous pouvons travailler ensemble",
      d: "L'intégration ne repose pas uniquement sur la capacité à produire du chiffre d'affaires. L'adhésion aux principes professionnels du réseau compte également.",
    },
    {
      n: "04",
      t: "Intégrer le réseau",
      d: "Lorsque les deux parties souhaitent avancer ensemble, le statut, les conditions et le cadre contractuel sont définis avant le démarrage.",
    },
  ];

  return (
    <>
      {/* HEADER */}
      <header className={scrolled ? "ly-header scrolled" : "ly-header"}>
        <Link href="/" className="ly-logo">
          <span className="ly-logo-name">LYAT IMMO</span>
          <span className="ly-logo-sub">Transaction &amp; Expertise</span>
        </Link>
        <nav className="ly-nav">
          <Link href="/biens">Biens</Link>
          <Link href="/#agence">Notre agence</Link>
          <Link href="/#services">Nos services</Link>
          <Link href="/nous-rejoindre">Nous rejoindre</Link>
          <Link href="/contact">Contact</Link>
          <a href="/contact?motif=estimation" className="ly-nav-cta">Estimer mon bien</a>
        </nav>
        <button className="ly-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* MENU MOBILE */}
      <div className={mobileOpen ? "ly-mobile-nav open" : "ly-mobile-nav"}>
        <Link href="/biens" onClick={() => setMobileOpen(false)}>Biens</Link>
        <Link href="/#agence" onClick={() => setMobileOpen(false)}>Notre agence</Link>
        <Link href="/#services" onClick={() => setMobileOpen(false)}>Nos services</Link>
        <Link href="/nous-rejoindre" onClick={() => setMobileOpen(false)}>Nous rejoindre</Link>
        <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
        <a href="/contact?motif=estimation" onClick={() => setMobileOpen(false)} className="ly-or">Estimer mon bien</a>
        <a href="https://app.lyatimmo.com" target="_blank" rel="noreferrer">Espace Conseiller</a>
      </div>

      {/* ESPACES */}
      <div className="ly-espaces">
        <a href="https://app.lyatimmo.com" className="ly-esp-btn" target="_blank" rel="noreferrer">Espace Conseiller</a>
      </div>

      {/* SECTION 1 - HERO */}
      <section className="ly-hero" id="top">
        <div
          className="ly-hero-img"
          style={{ backgroundImage: "url('/nous-rejoindre/hero.jpg')" }}
        />
        <div className="ly-hero-inner">
          <p className="ly-hero-tag">Rejoindre LYAT IMMO</p>
          <h1 className="ly-hero-title">
            Exercer l&apos;immobilier<br />
            <em>autrement.</em>
          </h1>
          <p className="ly-hero-body">
            Votre indépendance mérite mieux qu&apos;une simple boîte à outils. LYAT IMMO réunit technologie, accompagnement, visibilité et outils métier dans un environnement pensé pour vous permettre d&apos;exercer avec autonomie et exigence.
          </p>
          <div className="ly-hero-ctas">
            <a href="#reseau" className="ly-btn-primary">Découvrir l&apos;environnement</a>
            <Link href="/contact?motif=reseau" className="ly-btn-secondary">Présenter ma candidature</Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 - POURQUOI LYAT */}
      <section className="ly-section ly-bg-blanc" id="reseau">
        <div className="ly-nr-manifest">
          <div>
            <div className="ly-section-label">Le réseau</div>
            <h2 className="ly-section-title">L&apos;indépendance,<br />avec une structure<br />derrière vous.</h2>
            <div className="ly-divider" />
            <p className="ly-section-intro">
              Chez LYAT IMMO, l&apos;autonomie du conseiller n&apos;exclut ni le cadre, ni les outils, ni le collectif. Chacun développe son activité et construit sa clientèle, tout en exerçant au sein d&apos;une organisation commune.
            </p>
          </div>
          <div>
            {pourquoi.map((m, i) => (
              <div key={m.t} className="ly-nr-mrow">
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="mt">{m.t}</p>
                  <p className="md">{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO 1 - le métier, sur le terrain */}
      <div className="ly-nr-photo">
        <Image
          src="/nous-rejoindre/terrain.jpg"
          alt="Conseillère LYAT IMMO en visite dans une villa contemporaine, tablette en main"
          fill
          sizes="100vw"
          className="ly-nr-photo-el"
        />
      </div>

      {/* SECTION 3 - ESPACE CONSEILLER / PILOTAGE */}
      <section className="ly-section ly-bg-creme" id="espace-conseiller">
        <div className="ly-nr-head">
          <div className="ly-section-label">Votre environnement de travail</div>
          <h2 className="ly-section-title">Un seul endroit pour piloter votre activité.</h2>
          <div className="ly-divider" />
          <p className="ly-section-intro">
            L&apos;Espace Conseiller réunit au même endroit le pilotage de votre activité et vos outils de travail : votre production, vos affaires, votre prospection et vos échéances, suivies sans dispersion.
          </p>
        </div>

        <div className="ly-nr-preview" aria-hidden="true">
          <div className="ly-nr-pv-bar">
            <i /><i /><i />
            <span>Tableau de bord</span>
          </div>
          <div className="ly-nr-pv-body">
            <div className="ly-nr-kpis">
              <div className="ly-nr-kpi">
                <div className="k">Production réalisée</div>
                <div className="v">84 200 €</div>
                <div className="s">sur l&apos;année</div>
              </div>
              <div className="ly-nr-kpi">
                <div className="k">Objectif annuel</div>
                <div className="v">120 000 €</div>
                <div className="ly-nr-track"><i style={{ width: "70%" }} /></div>
                <div className="s">70 % atteint</div>
              </div>
              <div className="ly-nr-kpi">
                <div className="k">Palier atteint</div>
                <div className="v">80 %</div>
                <div className="s">prochain seuil : 90 000 €</div>
              </div>
              <div className="ly-nr-kpi">
                <div className="k">CA prévisionnel</div>
                <div className="v">31 500 €</div>
                <div className="s">compromis en cours</div>
              </div>
            </div>
            <div className="ly-nr-rows">
              <div className="ly-nr-row">
                <span className="lbl">Levée des conditions · 12 rue des Alizés</span>
                <span className="ly-nr-tag-s o">J-6</span>
              </div>
              <div className="ly-nr-row">
                <span className="lbl">Expiration de mandat · Villa Case-Pilote</span>
                <span className="ly-nr-tag-s o">J-13</span>
              </div>
              <div className="ly-nr-row">
                <span className="lbl">Acte authentique · Appartement Schœlcher</span>
                <span className="ly-nr-tag-s g">J-24</span>
              </div>
            </div>
          </div>
        </div>
        <p className="ly-nr-cap">Aperçu illustratif. Données fictives.</p>

        <div className="ly-nr-lines">
          {espaceCards.map((c) => (
            <div key={c.t} className="ly-nr-line">
              <p className="lh">{c.t}</p>
              <p className="ld">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 - OUTILS MÉTIER */}
      <section className="ly-section ly-bg-blanc" id="outils">
        <div className="ly-nr-head">
          <div className="ly-section-label">Au quotidien</div>
          <h2 className="ly-section-title">Les outils pour exercer, pas pour s&apos;éparpiller.</h2>
          <div className="ly-divider" />
          <p className="ly-section-intro">
            LYAT IMMO met à disposition un ensemble d&apos;outils qui couvrent les moments clés du métier, de l&apos;estimation à la négociation.
          </p>
        </div>
        <div className="ly-nr-feature">
          <div className="ly-nr-feature-main">
            <p className="ly-nr-tag">L&apos;outil d&apos;évaluation</p>
            <p className="fh">Vous réalisez votre estimation.</p>
            <p className="fd">
              L&apos;outil vous permet de renseigner les informations du bien, de structurer votre analyse et de générer un document d&apos;estimation professionnel à remettre au client, au format PDF ou Word.
            </p>
          </div>
          <div className="ly-nr-lines" style={{ marginTop: 0 }}>
            {outilAutres.map((o) => (
              <div key={o.t} className="ly-nr-line">
                <p className="lh">{o.t}</p>
                <p className="ld">{o.d}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="ly-nr-note">
          Ces outils produisent des estimations et des documents de travail. Ils n&apos;engagent ni le réseau, ni un tiers.
        </p>
      </section>

      {/* SECTION 5 - MOBILITÉ / PWA */}
      <section className="ly-section ly-bg-blanc" id="mobile">
        <div className="ly-section-label">Sur le terrain</div>
        <h2 className="ly-section-title">Au bureau comme en rendez-vous.</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">
          L&apos;Espace Conseiller s&apos;installe sur votre téléphone depuis votre navigateur, sans passer par un magasin d&apos;applications.
        </p>
        <div className="ly-nr-pwa">
          {pwa.map((b) => (
            <div key={b.t}>
              <div className="ic"><PwaIcon name={b.ic} /></div>
              <h4>{b.t}</h4>
              <p>{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO 2 - la relation client */}
      <div className="ly-nr-photo">
        <Image
          src="/nous-rejoindre/accompagnement.jpg"
          alt="Conseillère LYAT IMMO en rendez-vous avec un client autour d'un dossier"
          fill
          sizes="100vw"
          className="ly-nr-photo-el"
        />
      </div>

      {/* SECTION 6 - COACH LYAT */}
      <div className="ly-bloc-noir" id="coach">
        <div className="ly-bn-inner ly-bn-single">
          <div>
            <p className="ly-section-label">Accompagnement</p>
            <h2 className="ly-bn-title">Un appui métier, au moment où vous en avez besoin.</h2>
            <p className="ly-bn-text">
              Coach LYAT est un accompagnement métier intégré à l&apos;Espace Conseiller. Il aide à préparer un rendez-vous, à travailler une objection, à construire un argumentaire, à débriefer une visite ou à organiser sa semaine.
            </p>
            <div className="ly-bn-pillars" style={{ marginTop: 40 }}>
              {coach.map((c) => (
                <div key={c.t} className="ly-pillar">
                  <p className="ly-pillar-name">{c.t}</p>
                  <p className="ly-pillar-desc">{c.d}</p>
                </div>
              ))}
            </div>
            <p className="ly-bn-text" style={{ marginTop: 40, fontSize: 12 }}>
              Coach LYAT est un outil d&apos;aide à la réflexion. Il ne fournit pas de conseil juridique personnalisé : chaque situation reste à vérifier au dossier.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 7 - FORMATION */}
      <section className="ly-section ly-bg-blanc" id="formation">
        <div className="ly-nr-head">
          <div className="ly-section-label">Se former</div>
          <h2 className="ly-section-title">Un socle de formation qui s&apos;enrichit.</h2>
          <div className="ly-divider" />
          <p className="ly-section-intro">
            L&apos;espace de formation du réseau réunit des modules vidéo et le suivi de votre visionnage. Il est en cours de constitution et s&apos;étoffe progressivement.
          </p>
        </div>
        <div className="ly-nr-lines">
          {formation.map((f) => (
            <div key={f.t} className="ly-nr-line">
              <p className="lh">{f.t}</p>
              <p className="ld">{f.d}</p>
            </div>
          ))}
        </div>
        <p className="ly-nr-note">
          Les contenus de formation s&apos;enrichissent progressivement. Le programme complet sera présenté au fil de sa mise en ligne.
        </p>
      </section>

      {/* SECTION 8 - MINI-SITE / VISIBILITÉ */}
      <section className="ly-section ly-bg-creme" id="mini-site">
        <div className="ly-nr-head">
          <div className="ly-section-label">Votre visibilité</div>
          <h2 className="ly-section-title">Votre visibilité se construit aussi sous votre propre nom.</h2>
          <div className="ly-divider" />
          <p className="ly-section-intro">
            Chaque conseiller dispose d&apos;une page professionnelle publiée sur le site LYAT IMMO, à son nom : lyatimmo.com/conseillers/votre-nom.
          </p>
        </div>

        <div className="ly-nr-msite">
          <div>
            <div className="ly-nr-mini" aria-hidden="true">
              <div className="ly-nr-mini-hd">
                <div className="ph" />
                <div>
                  <div className="st">Conseiller Partenaire · Schœlcher · Fort-de-France</div>
                  <div className="nm">Camille Rivière</div>
                  <div className="ac">Votre projet immobilier dans le Nord Caraïbe, mené avec méthode.</div>
                </div>
              </div>
              <div className="ly-nr-mini-stats">
                <span><b>18</b> transactions accompagnées</span>
                <span><b>6</b> biens à la vente</span>
                <span><b>9</b> témoignages clients</span>
              </div>
              <div className="ly-nr-mini-body">
                <div className="lb">Domaines</div>
                <div className="ly-nr-chips">
                  <span>Résidentiel</span><span>Première acquisition</span><span>Investissement locatif</span>
                </div>
                <div className="lb">Secteurs</div>
                <div className="ly-nr-chips">
                  <span>Schœlcher</span><span>Fort-de-France</span><span>Case-Pilote</span>
                </div>
              </div>
            </div>
            <p className="ly-nr-cap">Aperçu illustratif. Données fictives.</p>
          </div>
          <div>
            <div className="ly-nr-line">
              <p className="lh">Vous renseignez</p>
              <p className="ld">Accroche, présentation, secteurs, domaines d&apos;accompagnement, réseaux sociaux.</p>
            </div>
            <div className="ly-nr-line">
              <p className="lh">Le réseau gère</p>
              <p className="ld">Photo, statut, mentions RSAC, distinctions et compteurs d&apos;activité.</p>
            </div>
            <div className="ly-nr-line">
              <p className="lh">La page réunit</p>
              <p className="ld">Vos biens à la vente, vos réalisations récentes présentées sans montant, les témoignages clients vérifiés et un formulaire de contact direct.</p>
            </div>
            <p className="ly-nr-relance">
              Vous vous reconnaissez dans cette manière de travailler ?{" "}
              <Link href="/contact?motif=reseau">Présenter ma candidature</Link>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9 - COMMERCIALISATION */}
      <section className="ly-section ly-bg-blanc" id="commercialisation">
        <div className="ly-nr-head">
          <div className="ly-section-label">Commercialiser</div>
          <h2 className="ly-section-title">Une diffusion organisée, des actes cadrés.</h2>
          <div className="ly-divider" />
          <p className="ly-section-intro">
            La commercialisation de vos biens s&apos;appuie sur les outils du réseau et sur un cadre commun jusqu&apos;à la signature.
          </p>
        </div>
        <div className="ly-nr-split">
          <div className="ly-nr-split-media">
            <Image
              src="/nous-rejoindre/commercialisation.jpg"
              alt="Conseiller LYAT IMMO photographiant un séjour contemporain pour une annonce"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="ly-nr-photo-el"
            />
          </div>
          <div className="ly-nr-split-body">
            {commercial.map((o) => (
              <div key={o.t} className="ly-nr-line">
                <p className="lh">{o.t}</p>
                <p className="ld">{o.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 - RESSOURCES */}
      <section className="ly-section ly-bg-creme" id="ressources">
        <div className="ly-nr-head">
          <div className="ly-section-label">Ressources</div>
          <h2 className="ly-section-title">Vos ressources, au même endroit.</h2>
          <div className="ly-divider" />
          <p className="ly-section-intro">
            L&apos;Espace Conseiller regroupe les ressources documentaires du réseau et les accès aux sites métier utiles au quotidien.
          </p>
        </div>
        <div className="ly-nr-lines">
          <div className="ly-nr-line">
            <p className="lh">Médiathèque</p>
            <p className="ld">Les documents du réseau : barèmes, trames et supports professionnels, aux formats PDF ou Word.</p>
          </div>
          <div className="ly-nr-line">
            <p className="lh">Liens utiles</p>
            <p className="ld">Un accès rapide aux ressources professionnelles externes : Géoportail, Cadastre, Géoportail de l&apos;urbanisme, Géorisques, DVF, Légifrance et autres sites publics de référence.</p>
          </div>
          <div className="ly-nr-line">
            <p className="lh">Barèmes et trames</p>
            <p className="ld">Le barème d&apos;honoraires du réseau et les trames de documents, prêts à l&apos;emploi depuis l&apos;Espace Conseiller.</p>
          </div>
        </div>
      </section>

      {/* SECTION 11 - PROGRESSION */}
      <section className="ly-section ly-bg-blanc" id="evolution">
        <span id="profil" aria-hidden="true" />
        <div className="ly-section-label">Évolution</div>
        <h2 className="ly-section-title">Un parcours professionnel qui évolue avec vous.</h2>
        <div className="ly-divider" />
        <div className="ly-typologies-row" style={{ alignItems: "center" }}>
          <span className="ly-typologie-pill">Partenaire</span>
          <span aria-hidden="true" className="ly-or">→</span>
          <span className="ly-typologie-pill">Confirmé</span>
          <span aria-hidden="true" className="ly-or">→</span>
          <span className="ly-typologie-pill">Team Leader</span>
        </div>
        <div className="ly-methode-grid" style={{ marginTop: 40 }}>
          {progression.map((e) => (
            <div key={e.t} className="ly-methode-step">
              <p className="ly-step-name">{e.t}</p>
              <p className="ly-step-desc">{e.d}</p>
            </div>
          ))}
        </div>
        <p className="ly-section-intro" style={{ marginTop: 32 }}>
          Un professionnel expérimenté venant d&apos;une autre structure peut, sous réserve des critères d&apos;admission de LYAT IMMO, intégrer directement le réseau à un niveau correspondant à son expérience. Nous accordons autant d&apos;importance à la manière de travailler qu&apos;aux performances commerciales.
        </p>
      </section>

      {/* SECTION 12 - RÉMUNÉRATION */}
      <div className="ly-bloc-noir" id="remuneration">
        <div className="ly-bn-inner ly-bn-single">
          <div>
            <p className="ly-section-label">Rémunération</p>
            <h2 className="ly-bn-title">Une rémunération qui évolue avec votre activité.</h2>
            <p className="ly-bn-text">
              Notre modèle rémunère la production, reconnaît la progression et permet aux professionnels les plus autonomes de conserver une part croissante du chiffre d&apos;affaires qu&apos;ils génèrent.
            </p>

            <div className="ly-bn-pillars" style={{ marginTop: 40 }}>
              {statuts.map((s) => (
                <div key={s.nom} className="ly-pillar">
                  <p className="ly-pillar-num">{s.nom}</p>
                  <p className="ly-nr-borne">{s.valeur}</p>
                  <p className="ly-pillar-desc">{s.texte}</p>
                  {s.viz && s.viz.length > 0 && (
                    <div className="ly-nr-pbars">
                      {s.viz.map((p) => (
                        <div key={p.de} className="ly-nr-pbar">
                          <div className="ly-nr-pbar-t">
                            <span style={{ width: `${Math.round(p.taux * 100)}%` }} />
                          </div>
                          <div className="ly-nr-pbar-l">
                            <span>{p.a ? `de ${p.de} à ${p.a}` : `au-delà de ${p.de}`}</span>
                            <b>{Math.round(p.taux * 100)} %</b>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {s.accompagnement && (
                    <div className="ly-nr-tl">
                      <div>
                        <h4>Votre production</h4>
                        <p>{s.accompagnement.production}</p>
                      </div>
                      <div>
                        <h4>Votre accompagnement</h4>
                        <p>{s.accompagnement.reseau}</p>
                      </div>
                    </div>
                  )}
                  {s.note && (
                    <p className="ly-pillar-desc" style={{ marginTop: 12 }}>{s.note}</p>
                  )}
                </div>
              ))}
            </div>

            <p className="ly-bn-text" style={{ marginTop: 40, fontSize: 12 }}>
              Paliers calculés en marginal sur la production annuelle (honoraires HT), remis à zéro au 1<sup>er</sup> janvier. Les conditions d&apos;accès aux différents statuts et le fonctionnement du cap sont présentés avant toute intégration au réseau et précisés contractuellement.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 13 - DÉVELOPPER VOTRE RÉSEAU */}
      <section className="ly-section ly-bg-creme" id="developpement">
        <div className="ly-nr-head">
          <div className="ly-section-label">Transmettre</div>
          <h2 className="ly-section-title">Développer votre réseau.</h2>
          <div className="ly-divider" />
          <p className="ly-section-intro">
            LYAT IMMO réunit des professionnels indépendants qui exercent chacun pour leur compte. Un conseiller peut faire connaître le réseau autour de lui et accompagner l&apos;arrivée de nouveaux professionnels, dans le respect de standards communs.
          </p>
        </div>
        <div className="ly-nr-split rev">
          <div className="ly-nr-split-media">
            <Image
              src="/nous-rejoindre/reseau.jpg"
              alt="Trois conseillers LYAT IMMO échangeant autour d'un dossier sur une terrasse"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="ly-nr-photo-el"
            />
          </div>
          <div className="ly-nr-split-body">
            {developpement.map((o) => (
              <div key={o.t} className="ly-nr-line">
                <p className="lh">{o.t}</p>
                <p className="ld">{o.d}</p>
              </div>
            ))}
            <p className="ly-nr-note" style={{ marginTop: 20 }}>
              Le fonctionnement détaillé du parrainage et ses modalités sont présentés lors des entretiens d&apos;intégration.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 14 - SYNTHÈSE DE VALEUR */}
      <div className="ly-bloc-noir" id="synthese">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="ly-section-label">L&apos;environnement LYAT IMMO</p>
          <h2 className="ly-bn-title">Tout ce que comprend votre environnement.</h2>
          <div className="ly-nr-synth">
            {synthese.map((c) => (
              <div key={c.t}>
                <p className="t">{c.t}</p>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 15 - ABONNEMENT */}
      <section className="ly-section ly-bg-blanc" id="abonnement">
        <div className="ly-section-label">L&apos;abonnement</div>
        <h2 className="ly-section-title">Un environnement. Un abonnement.</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">
          Un seul abonnement conseiller donne accès à l&apos;environnement LYAT IMMO et à ce qu&apos;il réunit pour exercer, développer son activité et présenter une image professionnelle.
        </p>
        <div className="ly-nr-price">
          <p className="lead">L&apos;accès à l&apos;environnement LYAT IMMO</p>
          <p className="amt">59 € <small>TTC / mois</small></p>
          <p className="sub">Abonnement conseiller</p>
          <p className="desc">
            Il donne accès à l&apos;Espace Conseiller, aux outils métier, à l&apos;application mobile, au mini-site professionnel, à la formation du réseau et aux plateformes de commercialisation. Certains services ou actes peuvent faire l&apos;objet de frais distincts, selon les conditions applicables. Les modalités complètes sont présentées lors de l&apos;intégration.
          </p>
        </div>
      </section>

      {/* SECTION 16 - CULTURE */}
      <section className="ly-section ly-bg-creme" id="culture">
        <div className="ly-section-label">Notre culture</div>
        <h2 className="ly-section-title">Nous ne cherchons pas à être les plus nombreux.</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">
          Un réseau ne se construit pas uniquement avec des outils et un modèle de rémunération. Il se construit aussi autour d&apos;une certaine manière d&apos;exercer le métier et de travailler ensemble.
        </p>
        <div className="ly-methode-grid">
          {culture.map((c) => (
            <div key={c.t} className="ly-methode-step">
              <p className="ly-step-name">{c.t}</p>
              <p className="ly-step-desc">{c.d}</p>
            </div>
          ))}
        </div>
        <p className="ly-temo-quote" style={{ marginTop: 40, maxWidth: 720 }}>
          Rejoindre LYAT IMMO implique l&apos;adhésion à notre charte éthique, à notre charte de conduite professionnelle et au cadre déontologique applicable aux professionnels de l&apos;immobilier.
        </p>
      </section>

      {/* SECTION 17 - FAQ */}
      <section className="ly-section ly-bg-blanc" id="faq">
        <div className="ly-section-label">Questions fréquentes</div>
        <h2 className="ly-section-title">Les réponses aux questions les plus courantes.</h2>
        <div className="ly-divider" />
        <div className="ly-nr-faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* SECTION 18 - PROCESSUS */}
      <section className="ly-section ly-bg-creme" id="processus">
        <div className="ly-section-label">Nous rejoindre</div>
        <h2 className="ly-section-title">D&apos;abord nous découvrir. Ensuite décider.</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">
          Avant toute intégration, nous souhaitons que chacun puisse comprendre précisément le fonctionnement de LYAT IMMO, sa rémunération, ses outils, ses règles et sa culture. Et nous souhaitons, de notre côté, apprendre à connaître la personne qui envisage de nous rejoindre.
        </p>
        <div className="ly-methode-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {processus.map((p) => (
            <div key={p.n} className="ly-methode-step">
              <p className="ly-step-num">{p.n}</p>
              <p className="ly-step-name">{p.t}</p>
              <p className="ly-step-desc">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 19 - CTA FINAL */}
      <div className="ly-cta-section" id="rejoindre">
        <p className="ly-section-label" style={{ color: "var(--or)", marginBottom: "16px" }}>
          Vous êtes professionnel de l&apos;immobilier ?
        </p>
        <h2 className="ly-cta-title">
          Et si votre prochaine étape<br />
          se construisait avec nous ?
        </h2>
        <p className="ly-cta-text">
          Quelques minutes pour nous parler de votre parcours et de votre projet professionnel.
        </p>
        <Link href="/contact?motif=reseau&demande=infos" className="ly-btn-cta">Présenter ma candidature</Link>
      </div>

      {/* FOOTER */}
      <footer id="contact" className="ly-footer">
        <div className="ly-footer-grid">
          <div>
            <div className="ly-footer-logo-name">LYAT IMMO</div>
            <div className="ly-footer-logo-sub">Transaction &amp; Expertise Immobilière</div>
            <div className="ly-footer-cfei">Un expert certifié CFEI® appartenant au réseau LYAT IMMO.</div>
            <p className="ly-footer-desc">Nous mettons une approche rigoureuse au service de la valeur de chaque bien et de l&apos;exigence de chaque vendeur.</p>
            <a href="mailto:contact@lyatimmo.com" className="ly-footer-email">contact@lyatimmo.com</a>
            <a href="tel:+596696335811" className="ly-footer-email">0696 33 58 11</a>
          </div>
          <div className="ly-footer-col">
            <p className="ly-footer-col-title">Navigation</p>
            <Link href="/biens">Nos biens</Link>
            <a href="/contact?motif=estimation">Estimer mon bien</a>
          </div>
          <div className="ly-footer-col">
            <p className="ly-footer-col-title">Informations</p>
            <a href="/honoraires">Barème d&apos;honoraires</a>
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Politique de confidentialité</a>
            <a href="/cookies">Gestion des cookies</a>
          </div>
          <div className="ly-footer-col">
            <p className="ly-footer-col-title">Espaces</p>
            <a href="https://app.lyatimmo.com" target="_blank" rel="noreferrer">Espace Conseiller</a>
          </div>
        </div>
        <div className="ly-footer-legal">
          <p className="ly-legal-text">LYAT IMMO SARLU - Activité de transaction immobilière exercée sous couvert de la carte professionnelle délivrée par la CCI conformément à la loi n° 70-9 du 2 janvier 1970 (loi Hoguet). Responsabilité civile professionnelle et garantie financière conformes aux dispositions légales en vigueur.</p>
          <div className="ly-footer-links">
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Confidentialité</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </footer>
    </>
  );
}

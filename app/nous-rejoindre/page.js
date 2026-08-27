"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NousRejoindrePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const modele = [
    {
      t: "Autonomie",
      d: "Vous organisez votre activité et développez votre propre portefeuille. Nous privilégions la responsabilisation plutôt qu’un fonctionnement fondé sur le contrôle permanent.",
    },
    {
      t: "Un cadre",
      d: "Méthodes de travail, documents, règles communes et accompagnement permettent à chacun d’exercer dans un environnement professionnel structuré.",
    },
    {
      t: "Un collectif",
      d: "L’indépendance n’autorise pas l’individualisme. Les relations entre conseillers reposent sur le respect, la loyauté, l’entraide et des règles connues de tous.",
    },
  ];

  const statuts = [
    {
      nom: "Conseiller Partenaire",
      valeur: "65 → 90 %",
      texte:
        "Un parcours progressif permettant de faire évoluer sa rémunération avec son chiffre d’affaires annuel.",
      paliers: [
        "de 0 à 15 000 € HT : 65 %",
        "de 15 000 à 25 000 € HT : 68 %",
        "de 25 000 à 40 000 € HT : 70 %",
        "de 40 000 à 65 000 € HT : 74 %",
        "à partir de 65 000 € HT : 90 %",
      ],
      note: "Le Conseiller Partenaire est accompagné par un Team Leader.",
    },
    {
      nom: "Conseiller Confirmé",
      valeur: "80 → 100 %",
      texte:
        "80 % de rémunération jusqu’à 90 000 € HT de production personnelle annuelle. Au-delà de ce seuil, le conseiller conserve 100 % de sa rémunération sur sa production personnelle jusqu’au renouvellement annuel du cap.",
      paliers: [],
      note: "",
    },
    {
      nom: "Team Leader",
      valeur: "80 → 100 % + 10 %",
      texte:
        "Le Team Leader bénéficie du même modèle sur sa production personnelle qu’un Conseiller Confirmé et perçoit 10 % sur chaque vente réalisée par les Conseillers Partenaires qu’il accompagne.",
      paliers: [],
      note: "",
    },
  ];

  const evolution = [
    {
      t: "Partenaire",
      d: "Développer son activité tout en bénéficiant de l’accompagnement d’un Team Leader et d’une rémunération progressive.",
    },
    {
      t: "Confirmé",
      d: "Exercer de manière autonome et accéder au mécanisme permettant d’atteindre 100 % sur sa production personnelle après franchissement du cap annuel.",
    },
    {
      t: "Team Leader",
      d: "Continuer à produire personnellement tout en accompagnant d’autres professionnels dans leur développement.",
    },
  ];

  const outils = [
    {
      t: "Documents juridiques",
      d: "Accès à un logiciel permettant notamment la rédaction des mandats, avenants et autres documents nécessaires à l’activité.",
    },
    {
      t: "Commercialisation",
      d: "Accès au logiciel immobilier utilisé par le réseau pour gérer et commercialiser les biens.",
    },
    {
      t: "Diffusion",
      d: "Diffusion automatique des annonces sur les plateformes prises en charge par LYAT IMMO. Chaque conseiller reste libre de compléter sa diffusion sur les portails de son choix, à sa charge.",
    },
    {
      t: "Compromis",
      d: "LYAT IMMO peut assurer la rédaction du compromis selon les modalités tarifaires du réseau. Le conseiller conserve également la possibilité de confier cette rédaction au notaire.",
    },
    {
      t: "Cadre administratif",
      d: "Une organisation commune accompagne les opérations jusqu’à leur aboutissement et permet au conseiller de travailler dans un environnement structuré.",
    },
    {
      t: "Accès aux plateformes",
      d: "L’abonnement LYAT IMMO est actuellement fixé à 59 € TTC par mois et couvre l’accès aux différentes plateformes prévues par le réseau.",
    },
  ];

  const culture = [
    {
      t: "L’intérêt du client",
      d: "Nous plaçons l’intérêt du client avant la recherche d’une commission. Conseiller signifie parfois savoir déconseiller, expliquer une difficulté ou refuser de promettre ce que nous ne pouvons pas garantir.",
    },
    {
      t: "L’honnêteté",
      d: "Nous attendons de chaque conseiller une information sincère, claire et loyale. Une difficulté connue ne se dissimule pas et une promesse commerciale ne doit jamais remplacer la réalité.",
    },
    {
      t: "Le respect",
      d: "Clients, confrères, partenaires et autres conseillers du réseau doivent être considérés avec le même respect. La manière dont nous parlons aux personnes fait partie intégrante de notre professionnalisme.",
    },
    {
      t: "La loyauté entre conseillers",
      d: "L’autonomie de chacun s’exerce dans le respect du travail des autres. Appropriation d’un client, concurrence déloyale interne, rétention volontaire d’information ou comportement destiné à nuire à un autre conseiller n’ont pas leur place chez LYAT IMMO.",
    },
    {
      t: "L’entraide",
      d: "Partager une expérience, répondre à une question ou aider un autre conseiller lorsque cela est possible contribue à la qualité du réseau. La réussite individuelle n’exige pas l’échec des autres.",
    },
    {
      t: "La responsabilité",
      d: "Chaque conseiller est responsable de ses engagements, de la qualité de son travail, de la confidentialité des informations qui lui sont confiées et du respect du cadre légal et déontologique de la profession.",
    },
  ];

  const profils = [
    {
      t: "Vous êtes déjà expérimenté",
      d: "Votre expérience et votre niveau d’autonomie peuvent vous permettre d’intégrer directement LYAT IMMO comme Conseiller Confirmé ou, lorsque votre parcours et votre projet s’y prêtent, comme Team Leader.",
    },
    {
      t: "Vous souhaitez être accompagné",
      d: "Le statut de Conseiller Partenaire permet de développer son activité avec l’accompagnement d’un Team Leader, puis d’évoluer vers davantage d’autonomie lorsque les critères requis sont atteints.",
    },
  ];

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
      d: "L’intégration ne repose pas uniquement sur la capacité à produire du chiffre d’affaires. L’adhésion aux principes professionnels du réseau compte également.",
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

      {/* SECTION 1 — HERO */}
      <section className="ly-hero" id="top">
        {/* IMAGE HERO */}
        <div
          className="ly-hero-img"
          style={{ backgroundImage: "url('/nous-rejoindre/hero.jpg')" }}
        />
        <div className="ly-hero-inner">
          <p className="ly-hero-tag">Rejoindre LYAT IMMO</p>
          <h1 className="ly-hero-title">
            Exercer l’immobilier<br />
            <em>autrement.</em>
          </h1>
          <p className="ly-hero-body">
            Être indépendant ne devrait pas signifier être seul. LYAT IMMO réunit des professionnels qui souhaitent développer leur activité avec autonomie, tout en bénéficiant d’un cadre, d’outils et d’un réseau fondé sur une même exigence du métier.
          </p>
          <div className="ly-hero-ctas">
            <a href="#reseau" className="ly-btn-primary">Découvrir le réseau</a>
            <Link href="/contact?motif=reseau" className="ly-btn-secondary">Nous contacter</Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — LE MODÈLE LYAT IMMO */}
      <section className="ly-section ly-bg-blanc" id="reseau">
        <div className="ly-section-label">Le réseau</div>
        <h2 className="ly-section-title">L’indépendance, avec une structure derrière vous.</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">
          Chez LYAT IMMO, l’autonomie du conseiller n’exclut ni le cadre, ni les outils, ni le collectif. Chacun développe son activité et construit sa clientèle, tout en exerçant au sein d’une organisation commune.
        </p>
        <div className="ly-methode-grid">
          {modele.map((m) => (
            <div key={m.t} className="ly-methode-step">
              <p className="ly-step-name">{m.t}</p>
              <p className="ly-step-desc">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — RÉMUNÉRATION */}
      <div className="ly-bloc-noir" id="remuneration">
        <div className="ly-bn-inner ly-bn-single">
          <div>
            <p className="ly-section-label">Rémunération</p>
            <h2 className="ly-bn-title">Une rémunération qui évolue avec votre activité.</h2>
            <p className="ly-bn-text">
              Notre modèle est conçu pour rémunérer la production, reconnaître la progression et permettre aux professionnels les plus autonomes de conserver une part croissante du chiffre d’affaires qu’ils génèrent.
            </p>

            <div className="ly-bn-pillars" style={{ marginTop: 40 }}>
              {statuts.map((s) => (
                <div key={s.nom} className="ly-pillar">
                  <p className="ly-pillar-num">{s.nom}</p>
                  <p className="ly-bn-title" style={{ margin: "4px 0 14px" }}>{s.valeur}</p>
                  <p className="ly-pillar-desc">{s.texte}</p>
                  {s.paliers.length > 0 && (
                    <ul className="ly-pillar-desc" style={{ listStyle: "none", padding: 0, marginTop: 14 }}>
                      {s.paliers.map((p) => (
                        <li key={p} style={{ padding: "3px 0" }}>{p}</li>
                      ))}
                    </ul>
                  )}
                  {s.note && (
                    <p className="ly-pillar-desc" style={{ marginTop: 12 }}>{s.note}</p>
                  )}
                </div>
              ))}
            </div>

            <p className="ly-bn-text" style={{ marginTop: 40, fontSize: 12 }}>
              Les modalités détaillées de rémunération, les conditions d’accès aux différents statuts et le fonctionnement des caps sont présentés avant toute intégration au réseau et précisés contractuellement.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4 — ÉVOLUTION */}
      <section className="ly-section ly-bg-creme" id="evolution">
        <div className="ly-section-label">Évolution</div>
        <h2 className="ly-section-title">Un parcours qui évolue avec vous.</h2>
        <div className="ly-divider" />
        <div className="ly-typologies-row" style={{ alignItems: "center" }}>
          <span className="ly-typologie-pill">Partenaire</span>
          <span aria-hidden="true" className="ly-or">→</span>
          <span className="ly-typologie-pill">Confirmé</span>
          <span aria-hidden="true" className="ly-or">→</span>
          <span className="ly-typologie-pill">Team Leader</span>
        </div>
        <div className="ly-methode-grid" style={{ marginTop: 40 }}>
          {evolution.map((e) => (
            <div key={e.t} className="ly-methode-step">
              <p className="ly-step-name">{e.t}</p>
              <p className="ly-step-desc">{e.d}</p>
            </div>
          ))}
        </div>
        <p className="ly-section-intro" style={{ marginTop: 32 }}>
          Un professionnel expérimenté venant d’une autre structure peut, sous réserve des critères d’admission de LYAT IMMO, intégrer directement le réseau à un niveau correspondant à son expérience.
        </p>
        {/* IMAGE ÉVOLUTION */}
        <div className="ly-service-img" style={{ maxWidth: 520, aspectRatio: "4 / 5", marginTop: 40 }}>
          <Image
            src="/nous-rejoindre/evolution.jpg"
            alt="Deux professionnels de LYAT IMMO échangeant autour d’un dossier"
            fill
            sizes="(max-width: 768px) 100vw, 520px"
            className="ly-service-img-el"
          />
        </div>
      </section>

      {/* SECTION 5 — OUTILS ET FONCTIONNEMENT */}
      <section className="ly-section ly-bg-blanc" id="outils">
        <div className="ly-section-label">Au quotidien</div>
        <h2 className="ly-section-title">Les outils pour exercer.</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">
          LYAT IMMO met à disposition de ses conseillers un environnement professionnel permettant de gérer les principales étapes de leur activité sans multiplier inutilement les outils.
        </p>
        <div className="ly-methode-grid">
          {outils.map((o) => (
            <div key={o.t} className="ly-methode-step">
              <p className="ly-step-name">{o.t}</p>
              <p className="ly-step-desc">{o.d}</p>
            </div>
          ))}
        </div>
        <p className="ly-section-intro" style={{ marginTop: 32 }}>
          Des frais administratifs de 180 € HT sont prélevés par acte authentique. La rédaction d’un compromis par LYAT IMMO est facturée 220 € TTC lorsqu’elle est demandée.
        </p>
      </section>

      {/* SECTION 6 — CULTURE LYAT IMMO */}
      {/* IMAGE CULTURE */}
      <div
        className="ly-service-img"
        style={{ width: "100%", height: "clamp(300px, 40vw, 480px)", aspectRatio: "auto" }}
      >
        <Image
          src="/nous-rejoindre/culture.jpg"
          alt="Plusieurs professionnels de LYAT IMMO en situation de travail"
          fill
          sizes="100vw"
          className="ly-service-img-el"
        />
      </div>
      <section className="ly-section ly-bg-creme" id="culture">
        <div className="ly-section-label">Notre culture</div>
        <h2 className="ly-section-title">Nous ne cherchons pas à être les plus nombreux.</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">
          Un réseau ne se construit pas uniquement avec des outils et un modèle de rémunération. Il se construit aussi autour d’une certaine manière d’exercer le métier et de travailler ensemble.
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
          Rejoindre LYAT IMMO implique l’adhésion à notre charte éthique, à notre charte de conduite professionnelle et au cadre déontologique applicable aux professionnels de l’immobilier.
        </p>
      </section>

      {/* SECTION 7 — PROFIL */}
      <section className="ly-section ly-bg-blanc" id="profil">
        <div className="ly-section-label">Profil</div>
        <h2 className="ly-section-title">Une même exigence, des parcours différents.</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">
          LYAT IMMO peut accueillir des professionnels expérimentés comme des conseillers souhaitant encore consolider leur pratique. Le niveau d’intégration et l’accompagnement dépendent de l’expérience, de l’autonomie et du parcours de chacun.
        </p>
        <div className="ly-methode-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {profils.map((p) => (
            <div key={p.t} className="ly-methode-step">
              <p className="ly-step-name">{p.t}</p>
              <p className="ly-step-desc">{p.d}</p>
            </div>
          ))}
        </div>
        <p className="ly-section-intro" style={{ marginTop: 32 }}>
          Dans les deux cas, nous accordons autant d’importance à la manière de travailler qu’aux performances commerciales.
        </p>
      </section>

      {/* SECTION 8 — PROCESSUS */}
      <section className="ly-section ly-bg-creme" id="processus">
        <div className="ly-section-label">Nous rejoindre</div>
        <h2 className="ly-section-title">D’abord nous découvrir. Ensuite décider.</h2>
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

      {/* SECTION 9 — CTA FINAL */}
      <div className="ly-cta-section" id="rejoindre">
        <p className="ly-section-label" style={{ color: "var(--or)", marginBottom: "16px" }}>
          Vous êtes professionnel de l’immobilier ?
        </p>
        <h2 className="ly-cta-title">
          Et si votre prochaine étape<br />
          se construisait avec nous ?
        </h2>
        <p className="ly-cta-text">
          Découvrez le fonctionnement de LYAT IMMO et échangeons sur votre projet professionnel.
        </p>
        <Link href="/contact?motif=reseau&demande=infos" className="ly-btn-cta">Échanger avec LYAT IMMO</Link>
      </div>

      {/* FOOTER */}
      <footer id="contact" className="ly-footer">
        <div className="ly-footer-grid">
          <div>
            <div className="ly-footer-logo-name">LYAT IMMO</div>
            <div className="ly-footer-logo-sub">Transaction &amp; Expertise Immobilière</div>
            <div className="ly-footer-cfei">CFEI®</div>
            <p className="ly-footer-desc">Nous mettons une approche rigoureuse au service de la valeur de chaque bien et de l’exigence de chaque vendeur.</p>
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

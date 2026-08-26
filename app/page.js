"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const biens = [
    {badge:"Exclusivité",commune:"Sainte-Anne",type:"Villa vue mer",prix:"Sur demande",meta:"250 m² · 4 ch. · Piscine"},
    {badge:"Nouveau",commune:"Les Trois-Îlets",type:"Maison avec jardin",prix:"Sur demande",meta:"140 m² · 3 ch. · Terrain 600 m²"},
    {badge:null,commune:"Fort-de-France",type:"Appartement T3",prix:"Sur demande",meta:"75 m² · 2 ch. · Balcon"},
  ];

  const steps = [
    {n:"01",t:"Estimer",d:"Comprendre le bien, son environnement et sa valeur pour établir un prix juste, argumenté et défendable."},
    {n:"02",t:"Préparer",d:"Réunir les informations, documents et éléments nécessaires à une commercialisation maîtrisée."},
    {n:"03",t:"Révéler",d:"Mettre le bien en valeur par une présentation, des photographies et des contenus soignés."},
    {n:"04",t:"Commercialiser",d:"Diffuser le bien sur les bons canaux et qualifier rigoureusement les acquéreurs potentiels."},
    {n:"05",t:"Négocier",d:"Présenter les offres et accompagner le vendeur avec clarté dans chaque décision."},
    {n:"06",t:"Accompagner",d:"Suivre la transaction de l'offre acceptée jusqu'à l'acte authentique, sans zone d'ombre."},
  ];

  const temoignages = [
    {q:"Un accompagnement sérieux et discret, du début à la fin. Notre bien a été vendu dans des conditions que nous n'espérions pas aussi favorables.",a:"Marie-Christine L.",d:"Vente d'une villa - Sainte-Anne"},
    {q:"L'estimation était rigoureuse et argumentée. Pas de chiffre sorti du chapeau. On a compris pourquoi ce prix, et le bien a trouvé preneur rapidement.",a:"Jean-Philippe M.",d:"Vente d'un appartement - Fort-de-France"},
    {q:"Ce qui m'a frappé, c'est la disponibilité et la clarté à chaque étape. On sait exactement où en est le dossier.",a:"Sandrine B.",d:"Vente d'une maison - Le Lamentin"},
  ];

  return (
    <>
      {/* HEADER */}
      <header className={scrolled ? "ly-header scrolled" : "ly-header"}>
        <a href="#" className="ly-logo">
          <span className="ly-logo-name">LYAT IMMO</span>
          <span className="ly-logo-sub">Transaction &amp; Expertise</span>
        </a>
        <nav className="ly-nav">
          <a href="#biens">Biens</a>
          <a href="#agence">Notre agence</a>
          <a href="#services">Nos services</a>
          <a href="#contact">Contact</a>
          <a href="#estimation" className="ly-nav-cta">Estimer mon bien</a>
        </nav>
        <button className="ly-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* MENU MOBILE */}
      <div className={mobileOpen ? "ly-mobile-nav open" : "ly-mobile-nav"}>
        <a href="#biens" onClick={() => setMobileOpen(false)}>Biens</a>
        <a href="#agence" onClick={() => setMobileOpen(false)}>Notre agence</a>
        <a href="#services" onClick={() => setMobileOpen(false)}>Nos services</a>
        <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
        <a href="#estimation" onClick={() => setMobileOpen(false)} className="ly-or">Estimer mon bien</a>
        <a href="https://app.lyatimmo.com" target="_blank" rel="noreferrer">Espace Conseiller</a>
      </div>

      {/* ESPACES */}
      <div className="ly-espaces">
        <a href="https://app.lyatimmo.com" className="ly-esp-btn" target="_blank" rel="noreferrer">Espace Conseiller</a>
      </div>

      {/* HERO */}
      <section className="ly-hero" id="hero">
        <div className="ly-hero-img" />
        <div className="ly-hero-inner">
          <p className="ly-hero-tag">Transaction &amp; Expertise Immobilière</p>
          <h1 className="ly-hero-title">L&apos;art de vendre<br/>avec <em>exigence</em></h1>
          <p className="ly-hero-body">Chaque bien mérite plus qu&apos;une annonce. Une estimation réfléchie, une mise en valeur soignée et une stratégie de vente pensée jusqu&apos;à la signature.</p>
          <div className="ly-hero-ctas">
            <a href="#estimation" className="ly-btn-primary">Estimer mon bien</a>
            <a href="#biens" className="ly-btn-secondary">Voir la sélection</a>
          </div>
        </div>
      </section>

      {/* RECHERCHE */}
      <div className="ly-search-section">
        <div className="ly-search-inner">
          <p className="ly-search-title">Rechercher un bien à vendre</p>
          <div className="ly-search-grid">
            <div className="ly-search-field"><label>Type de bien</label>
              <select><option>Tous types</option><option>Appartement</option><option>Maison</option><option>Villa</option><option>Immeuble</option><option>Terrain</option><option>Local commercial</option><option>Bureau</option></select>
            </div>
            <div className="ly-search-field"><label>Secteur / Commune</label>
              <select><option>Tous secteurs</option><option>Fort-de-France</option><option>Le Lamentin</option><option>Schoelcher</option><option>Saint-Joseph</option><option>Le François</option><option>Sainte-Anne</option><option>Le Marin</option><option>Les Trois-Îlets</option></select>
            </div>
            <div className="ly-search-field"><label>Pièces minimum</label>
              <select><option>Indifférent</option><option>2+</option><option>3+</option><option>4+</option><option>5+</option></select>
            </div>
            <div className="ly-search-field"><label>Budget maximum</label>
              <input type="text" placeholder="Ex. 350 000 EUR" />
            </div>
            <div className="ly-search-field">
              <label style={{visibility:"hidden"}}>Rechercher</label>
              <button className="ly-search-btn">Rechercher</button>
            </div>
          </div>
        </div>
      </div>

      {/* BIENS */}
      <section id="biens" className="ly-section ly-bg-creme">
        <div className="ly-section-label">Sélection</div>
        <h2 className="ly-section-title">Des biens choisis,<br/>présentés avec <em>exigence</em></h2>
        <div className="ly-divider" />
        <div className="ly-biens-grid">
          {biens.map((b,i) => (
            <div key={i} className="ly-bien-card">
              <div className="ly-bien-img">
                <div className="ly-bien-img-ph" />
                {b.badge && <span className="ly-bien-badge">{b.badge}</span>}
              </div>
              <div className="ly-bien-body">
                <p className="ly-bien-commune">{b.commune}</p>
                <p className="ly-bien-type">{b.type}</p>
                <p className="ly-bien-prix">{b.prix}</p>
                <p className="ly-bien-meta">{b.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOC NOIR */}
      <div className="ly-bloc-noir" id="agence">
        <div className="ly-bn-inner">
          <div className="ly-bn-left">
            <p className="ly-section-label">Positionnement</p>
            <h2 className="ly-bn-title">Vendre n&apos;est pas<br/>seulement <em>transiger.</em></h2>
            <p className="ly-bn-text">LYAT IMMO accompagne chaque vendeur avec une conviction simple : un bien mérite une estimation rigoureuse, une présentation à la hauteur de sa valeur et un suivi sans zone d&apos;ombre jusqu&apos;à la signature.</p>
            <p className="ly-bn-text" style={{marginTop:"16px"}}>Une solide formation en droit immobilier, une méthode éprouvée et un principe essentiel : accompagner chaque décision avec clarté.</p>
            <div className="ly-cfei">
              <div className="ly-cfei-badge">CFEI®</div>
              <div className="ly-cfei-label">Expertise immobilière</div>
            </div>
          </div>
          <div className="ly-bn-pillars">
            {[
              {num:"Estimation",name:"Une valeur argumentée",desc:"Analyse du bien, de son environnement et du marché pour établir une valeur juste et défendable."},
              {num:"Mise en valeur",name:"Chaque bien soigneusement présenté",desc:"Photographies, rédaction et diffusion pensées pour valoriser ce que le bien a de singulier."},
              {num:"Accompagnement",name:"Jusqu'à l'acte authentique",desc:"Suivi complet de la première visite jusqu'à la signature, sans zone d'ombre."},
            ].map((p,i) => (
              <div key={i} className="ly-pillar">
                <p className="ly-pillar-num">{p.num}</p>
                <p className="ly-pillar-name">{p.name}</p>
                <p className="ly-pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* METHODE */}
      <section className="ly-section ly-bg-blanc" id="methode">
        <div className="ly-section-label">Méthode</div>
        <h2 className="ly-section-title">Une méthode pensée<br/>pour <em>vendre.</em></h2>
        <div className="ly-divider" />
        <div className="ly-methode-grid">
          {steps.map((s,i) => (
            <div key={i} className="ly-methode-step">
              <p className="ly-step-num">{s.n} - {s.t}</p>
              <p className="ly-step-name">{s.t}</p>
              <p className="ly-step-desc">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="ly-section ly-bg-creme">
        <div className="ly-section-label">Nos services</div>
        <h2 className="ly-section-title">Ce que nous faisons,<br/>et comment nous le <em>faisons.</em></h2>
        <div className="ly-divider" />
        <div className="ly-services-grid">
          <div className="ly-service-main">
            <p className="ly-service-num">01</p>
            <p className="ly-service-name">Transaction Immobilière</p>
            <p className="ly-service-body">Estimation, stratégie de commercialisation, mise en valeur, diffusion, qualification des acquéreurs et négociation jusqu&apos;à la signature.</p>
          </div>
          <div className="ly-service-main">
            <p className="ly-service-num">02</p>
            <p className="ly-service-name">Expertise Immobilière</p>
            <p className="ly-service-body">Détermination argumentée de la valeur d&apos;un bien dans le cadre de situations patrimoniales, successorales ou familiales.</p>
          </div>
        </div>
        <div className="ly-service-secondary">
          <p className="ly-service-label-or">Complémentaire</p>
          <p className="ly-service-name" style={{fontSize:"16px",margin:"6px 0 10px"}}>Mise en location</p>
          <p className="ly-service-body" style={{fontSize:"12px"}}>LYAT IMMO accompagne également certains propriétaires dans la recherche de locataires et la mise en location de leur bien.</p>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="ly-section ly-bg-blanc">
        <div className="ly-section-label">Témoignages</div>
        <h2 className="ly-section-title">Ce que disent<br/>nos <em>clients.</em></h2>
        <div className="ly-divider" />
        <div className="ly-temoignages-grid">
          {temoignages.map((t,i) => (
            <div key={i} className="ly-temoignage">
              <p className="ly-temo-quote">« {t.q} »</p>
              <div className="ly-temo-line" />
              <p className="ly-temo-author">{t.a}</p>
              <p className="ly-temo-detail">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="ly-cta-section" id="estimation">
        <p className="ly-section-label" style={{color:"var(--or)",marginBottom:"16px"}}>Vous vendez ?</p>
        <h2 className="ly-cta-title">Parlons de votre bien.</h2>
        <p className="ly-cta-sub">Estimation sur place, sans engagement.</p>
        <a href="#contact" className="ly-btn-cta">Demander une estimation</a>
      </div>

      {/* FOOTER */}
      <footer id="contact" className="ly-footer">
        <div className="ly-footer-grid">
          <div>
            <div className="ly-footer-logo-name">LYAT IMMO</div>
            <div className="ly-footer-logo-sub">Transaction &amp; Expertise Immobilière</div>
            <p className="ly-footer-desc">Une approche rigoureuse de l&apos;immobilier, pensée autour de la valeur de chaque bien et de l&apos;exigence de chaque vendeur.</p>
          </div>
          <div className="ly-footer-col">
            <p className="ly-footer-col-title">Navigation</p>
            <a href="#biens">Nos biens</a><a href="#agence">Notre agence</a>
            <a href="#services">Nos services</a><a href="#estimation">Estimation</a>
          </div>
          <div className="ly-footer-col">
            <p className="ly-footer-col-title">Informations</p>
            <a href="/honoraires">Honoraires</a>
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Confidentialité</a>
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
          </div>
        </div>
      </footer>
    </>
  );
}

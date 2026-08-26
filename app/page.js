"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { propertyTypes } from "@/data/properties";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState({
    commune: "",
    type: "",
    piecesMin: "",
    chambresMin: "",
    budgetMax: "",
    surfaceMin: "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function updateSearch(field, value) {
    setSearch((s) => ({ ...s, [field]: value }));
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams({ transaction: "vente", ...search });
    for (const [key, value] of [...params.entries()]) {
      if (!value) params.delete(key);
    }
    router.push(`/biens?${params.toString()}`);
  }

  const biens = [
    {badge:"Exclusivité",commune:"Sainte-Anne",type:"Villa vue mer",prix:"Sur demande",meta:"250 m² · 4 ch. · Piscine"},
    {badge:"Nouveau",commune:"Les Trois-Îlets",type:"Maison avec jardin",prix:"Sur demande",meta:"140 m² · 3 ch. · Terrain 600 m²"},
    {badge:null,commune:"Fort-de-France",type:"Appartement T3",prix:"Sur demande",meta:"75 m² · 2 ch. · Balcon"},
  ];

  const steps = [
    {n:"01",t:"Comprendre et évaluer",d:"Nous commençons par comprendre le bien, son environnement, ses qualités, ses contraintes et le projet du propriétaire. L’étude du marché et des références disponibles nous permet ensuite de déterminer un positionnement cohérent."},
    {n:"02",t:"Préparer le dossier",d:"Une vente peut être retardée par un document manquant ou une difficulté découverte trop tard. Nous réunissons les pièces nécessaires, anticipons les diagnostics et identifions en amont les points qui doivent être clarifiés."},
    {n:"03",t:"Révéler le bien",d:"Photographies, visite virtuelle, présentation des espaces et rédaction de l’annonce : chaque élément est travaillé pour montrer le bien avec justesse, sans le dénaturer ni masquer ses particularités."},
    {n:"04",t:"Sélectionner les acquéreurs",d:"Toutes les demandes ne conduisent pas à une visite. Nous vérifions l’adéquation du bien avec le projet de l’acquéreur, sa motivation et la cohérence de son financement afin de privilégier des visites réellement utiles."},
    {n:"05",t:"Défendre les intérêts du vendeur",d:"Nous analysons chaque offre au-delà du prix proposé : financement, apport, conditions suspensives, calendrier et solidité globale du projet. Nous conseillons ensuite le vendeur et conduisons la négociation dans son intérêt."},
    {n:"06",t:"Rester présent jusqu’à l’acte",d:"Notre accompagnement ne s’arrête pas à l’acceptation d’une offre. Nous préparons la suite de la vente, coordonnons les échanges avec les différents intervenants et restons présents jusqu’à la signature de l’acte authentique et la remise des clés."},
  ];

  const valeurs = [
    {t:"L’équilibre des intérêts",d:"Nous croyons aux affaires gagnant-gagnant. Une transaction réussie ne doit pas laisser derrière elle un vendeur lésé ou un acquéreur trompé. Elle doit permettre à chacun d’avancer avec le sentiment d’avoir été entendu, respecté et correctement accompagné."},
    {t:"Faire ce qui est juste",d:"Nous faisons ce qui est juste, même lorsque personne ne regarde. Cela signifie dire la vérité sur la valeur d’un bien, reconnaître une difficulté lorsqu’elle existe et ne pas promettre ce que nous ne sommes pas certains de pouvoir tenir."},
    {t:"L’intérêt du client avant le nôtre",d:"Nous plaçons l’intérêt du client au-dessus du nôtre. Parfois, cela signifie déconseiller une décision, refuser un prix irréaliste ou prendre davantage de temps avant de mettre un bien sur le marché."},
    {t:"Un engagement réel",d:"Lorsque nous acceptons un dossier, nous nous y engageons pleinement. Chaque vente mérite de l’attention, de la préparation et une présence réelle, quelle que soit la valeur du bien."},
    {t:"Comprendre avant de conseiller",d:"Nous cherchons d’abord à comprendre. Comprendre le bien, mais aussi la personne qui le vend, son histoire, ses contraintes et ce qu’elle souhaite construire après la vente."},
    {t:"L’honnêteté comme fondement",d:"Nous ne concevons pas la confiance sans honnêteté. Elle est la base de nos relations, de nos conseils et de chacune de nos décisions."},
  ];

  const typologies = [
    {label:"Appartement",icon:"appartement"},
    {label:"Maison",icon:"maison"},
    {label:"Villa",icon:"villa"},
    {label:"Immeuble",icon:"immeuble"},
    {label:"Local commercial",icon:"local-commercial"},
    {label:"Bureau",icon:"bureau"},
    {label:"Terrain",icon:"terrain"},
  ];

  const services = [
    {
      key:"transaction",
      titre:"Transaction immobilière",
      texte:"Vendre un bien demande davantage qu’une mise en ligne. Nous accompagnons les propriétaires dans l’évaluation, la préparation, la présentation et la commercialisation de maisons, appartements, villas, immeubles, locaux professionnels et terrains, jusqu’à la signature de l’acte authentique.",
      img:"/images/services/transaction.jpg",
    },
    {
      key:"expertise",
      titre:"Expertise immobilière",
      texte:"Nous déterminons la valeur d’un bien à partir de ses caractéristiques juridiques, techniques et économiques, de son environnement et des données du marché. Selon la nature de la mission, notre intervention peut prendre la forme d’un avis de valeur ou d’un rapport d’expertise détaillé.",
      img:"/images/services/expertise.jpg",
    },
  ];

  // Avis reels, issus de Google (tous notes 5/5) — ne pas reformuler ni en ajouter sans confirmation.
  const temoignages = [
    {q:"Je recommande vivement Miguel pour son professionnalisme et la qualité de son accompagnement.",a:"Elodie E."},
    {q:"Tout a été clair dès le départ, fluide, sans ambiguïté, avec une communication effective et efficiente.",a:"Régine R."},
    {q:"M. Attely est bien plus qu’un agent immobilier, c’est un véritable allié !",a:"Claude D."},
    {q:"Une communication comme il y en a peu, avec un souci de transparence des procédures et différentes étapes du parcours de vente.",a:"Christelle D."},
    {q:"C’est avec un grand professionnalisme, l’utilisation d’outils modernes, et un suivi impeccable qu’il s’est attaché à remplir avec succès et efficacité sa mission.",a:"Jean Michel D."},
    {q:"Disponibilité, réactivité, humilité, professionnalisme et humour : cocktail parfait.",a:"Jean-David B."},
  ];
  const googleReviewsUrl = "https://www.google.com/maps?cid=17709286108777591380";

  return (
    <>
      {/* HEADER */}
      <header className={scrolled ? "ly-header scrolled" : "ly-header"}>
        <a href="#" className="ly-logo">
          <span className="ly-logo-name">LYAT IMMO</span>
          <span className="ly-logo-sub">Transaction &amp; Expertise</span>
        </a>
        <nav className="ly-nav">
          <Link href="/biens">Biens</Link>
          <a href="#agence">Notre agence</a>
          <a href="#services">Nos services</a>
          <a href="#contact">Contact</a>
          <a href="/contact" className="ly-nav-cta">Estimer mon bien</a>
        </nav>
        <button className="ly-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* MENU MOBILE */}
      <div className={mobileOpen ? "ly-mobile-nav open" : "ly-mobile-nav"}>
        <Link href="/biens" onClick={() => setMobileOpen(false)}>Biens</Link>
        <a href="#agence" onClick={() => setMobileOpen(false)}>Notre agence</a>
        <a href="#services" onClick={() => setMobileOpen(false)}>Nos services</a>
        <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
        <a href="/contact" onClick={() => setMobileOpen(false)} className="ly-or">Estimer mon bien</a>
        <a href="https://app.lyatimmo.com" target="_blank" rel="noreferrer">Espace Conseiller</a>
      </div>

      {/* ESPACES */}
      <div className="ly-espaces">
        <a href="https://app.lyatimmo.com" className="ly-esp-btn" target="_blank" rel="noreferrer">Espace Conseiller</a>
      </div>

      {/* SECTION 1 — HERO */}
      <section className="ly-hero" id="hero">
        <div className="ly-hero-img" />
        <div className="ly-hero-inner">
          <p className="ly-hero-tag">Transaction &amp; Expertise Immobilière</p>
          <h1 className="ly-hero-title">L&apos;art de vendre<br/>avec <em>exigence</em></h1>
          <p className="ly-hero-body">Bien vendre ne consiste pas seulement à publier une annonce. Il faut comprendre le bien, défendre sa valeur, préparer chaque étape et savoir à qui le présenter. C’est cette exigence que nous mettons au service de votre projet.</p>
          <div className="ly-hero-ctas">
            <a href="/contact" className="ly-btn-primary">Estimer mon bien</a>
            <a href="#biens" className="ly-btn-secondary">Découvrir nos biens</a>
          </div>
        </div>
      </section>

      {/* SECTION 2 — MOTEUR DE RECHERCHE (biens à vendre uniquement) */}
      <div className="ly-search-section">
        <div className="ly-search-inner">
          <p className="ly-search-title">Trouvez le bien qui correspond à votre projet.</p>
          <form className="ly-search-grid" onSubmit={handleSearchSubmit}>
            <div className="ly-search-field">
              <label>Localisation</label>
              <input
                type="text"
                placeholder="Ex. Le Lamentin, Schœlcher…"
                value={search.commune}
                onChange={(e) => updateSearch("commune", e.target.value)}
              />
            </div>
            <div className="ly-search-field">
              <label>Type de bien</label>
              <select value={search.type} onChange={(e) => updateSearch("type", e.target.value)}>
                <option value="">Tous types</option>
                {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="ly-search-field">
              <label>Pièces</label>
              <select value={search.piecesMin} onChange={(e) => updateSearch("piecesMin", e.target.value)}>
                <option value="">Indifférent</option>
                {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div className="ly-search-field">
              <label>Chambres</label>
              <select value={search.chambresMin} onChange={(e) => updateSearch("chambresMin", e.target.value)}>
                <option value="">Indifférent</option>
                {[1,2,3,4].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div className="ly-search-field">
              <label>Budget</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ex. 350 000 €"
                value={search.budgetMax}
                onChange={(e) => updateSearch("budgetMax", e.target.value)}
              />
            </div>
            <div className="ly-search-field">
              <label>Surface minimale</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ex. 80 m²"
                value={search.surfaceMin}
                onChange={(e) => updateSearch("surfaceMin", e.target.value)}
              />
            </div>
            <div className="ly-search-field">
              <label style={{visibility:"hidden"}}>Rechercher</label>
              <button type="submit" className="ly-search-btn">Rechercher</button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 3 — SÉLECTION DE BIENS */}
      <section id="biens" className="ly-section ly-bg-creme">
        <div className="ly-section-label">Sélection</div>
        <h2 className="ly-section-title">Une sélection exigeante</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">Nous ne mettons pas simplement des biens en ligne. Nous sélectionnons ceux que nous souhaitons vous faire découvrir, pour leur emplacement, leur potentiel, leur singularité ou la qualité du projet qu’ils peuvent accueillir. Retrouvez également l’ensemble de nos biens grâce au moteur de recherche.</p>
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

      {/* SECTION 4 — POSITIONNEMENT */}
      <div className="ly-bloc-noir" id="agence">
        <div className="ly-bn-inner ly-bn-single">
          <div>
            <p className="ly-section-label">Positionnement</p>
            <h2 className="ly-bn-title">Notre métier ne s’arrête pas à la mise en vente</h2>
            <p className="ly-bn-text">Un bien immobilier ne se résume ni à une surface ni à un prix au mètre carré. Il possède une situation, des caractéristiques techniques, un potentiel, parfois des contraintes, et toujours une histoire qu’il faut savoir comprendre.</p>
            <p className="ly-bn-text" style={{marginTop:"16px"}}>Notre rôle est d’analyser l’ensemble de ces éléments pour déterminer une valeur cohérente, construire une stratégie de commercialisation adaptée et défendre les intérêts de notre client jusqu’à l’aboutissement de la vente.</p>
            <p className="ly-bn-text" style={{marginTop:"16px"}}>Nous ne promettons pas de vendre à n’importe quel prix ni dans un délai irréaliste. Nous préférons une recommandation sincère à une promesse séduisante, parce qu’une vente réussie commence toujours par un positionnement juste et un dossier bien préparé.</p>
            <p className="ly-bn-text" style={{marginTop:"16px"}}>Les acquéreurs qui se positionnent sur les biens qui nous sont confiés bénéficient, eux aussi, d’informations claires et d’un accompagnement attentif. Une bonne transaction est celle dans laquelle chacun sait ce qu’il achète, ce qu’il vend et dans quelles conditions il s’engage.</p>
          </div>
        </div>
      </div>

      {/* SECTION 5 — MÉTHODE */}
      <section className="ly-section ly-bg-blanc" id="methode">
        <div className="ly-section-label">Méthode</div>
        <h2 className="ly-section-title">Une méthode, six étapes</h2>
        <div className="ly-divider" />
        <p className="ly-section-intro">De la préparation du bien à la signature chez le notaire, chaque étape est conduite avec la même exigence.</p>
        <div className="ly-methode-grid">
          {steps.map((s,i) => (
            <div key={i} className="ly-methode-step">
              <p className="ly-step-name">{s.t}</p>
              <p className="ly-step-desc">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — VALEURS */}
      <section className="ly-section ly-bg-creme" id="valeurs">
        <div className="ly-section-label">Valeurs</div>
        <h2 className="ly-section-title">Ce que nous défendons</h2>
        <div className="ly-divider" />
        <div className="ly-methode-grid">
          {valeurs.map((v,i) => (
            <div key={i} className="ly-methode-step">
              <p className="ly-step-name">{v.t}</p>
              <p className="ly-step-desc">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — SERVICES */}
      <section id="services" className="ly-section ly-bg-blanc">
        <div className="ly-section-label">Services</div>
        <h2 className="ly-section-title">Nos services</h2>
        <div className="ly-divider" />
        <div className="ly-services-grid">
          {services.map((s) => (
            <div key={s.key} className="ly-service-main">
              <div className="ly-service-img">
                <Image src={s.img} alt={s.titre} fill sizes="(max-width: 768px) 100vw, 50vw" className="ly-service-img-el" />
              </div>
              <div className="ly-service-body-wrap">
                <p className="ly-service-name">{s.titre}</p>
                <p className="ly-service-body">{s.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8 — TYPOLOGIES DE BIENS */}
      <section className="ly-section ly-bg-creme">
        <div className="ly-section-label">Typologies</div>
        <h2 className="ly-section-title">Tous types de biens</h2>
        <div className="ly-divider" />
        <div className="ly-typologies-row">
          {typologies.map((t) => (
            <a key={t.label} href={`/biens?transaction=vente&type=${encodeURIComponent(t.label)}`} className="ly-typologie-pill">
              <Image src={`/images/typologies/${t.icon}.png`} alt="" width={20} height={20} className="ly-typologie-icon" aria-hidden="true" />
              {t.label}
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 9 — TÉMOIGNAGES */}
      <section className="ly-section ly-bg-blanc">
        <div className="ly-section-label">Témoignages</div>
        <h2 className="ly-section-title">Ils nous ont fait confiance</h2>
        <div className="ly-divider" />
        <div className="ly-temoignages-grid">
          {temoignages.map((t,i) => (
            <div key={i} className="ly-temoignage">
              <div className="ly-temo-top">
                <div className="ly-temo-avatar" aria-hidden="true">{t.a.charAt(0)}</div>
                <div>
                  <div className="ly-temo-stars" aria-label="Note 5 sur 5 étoiles">★★★★★</div>
                  <div className="ly-temo-badge">
                    <svg viewBox="0 0 18 18" width="12" height="12" aria-hidden="true">
                      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                    Avis Google
                  </div>
                </div>
              </div>
              <p className="ly-temo-quote">« {t.q} »</p>
              <div className="ly-temo-line" />
              <p className="ly-temo-author">{t.a}</p>
            </div>
          ))}
        </div>
        {googleReviewsUrl && (
          <a href={googleReviewsUrl} target="_blank" rel="noreferrer" className="ly-temo-cta">Voir tous nos avis Google</a>
        )}
      </section>

      {/* SECTION 10 — APPEL À L’ACTION FINAL */}
      <div className="ly-cta-section" id="estimation">
        <p className="ly-section-label" style={{color:"var(--or)",marginBottom:"16px"}}>Vous vendez ?</p>
        <h2 className="ly-cta-title">Une vente réussie commence bien avant la première visite</h2>
        <p className="ly-cta-text">Vous envisagez de vendre un bien ? Prenons d’abord le temps d’en comprendre la valeur, les particularités et les conditions de commercialisation.</p>
        <a href="/contact" className="ly-btn-cta">Estimer mon bien</a>
      </div>

      {/* SECTION 11 — FOOTER */}
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
            <a href="/contact">Estimer mon bien</a>
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

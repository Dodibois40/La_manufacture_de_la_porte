import './index.css'

export default function Home() {
  const handleGoToConfig = () => {
    location.hash = '#config'
  }

  return (
    <div className="home">
      <nav className="nav container">
        <div className="brand">
          <div className="brand-mark" />
          <span>LA MANUFACTURE DE LA PORTE</span>
        </div>
        <div className="nav-actions">
          <a className="btn btn-ghost" href="#config">Aperçu configurateur</a>
          <button className="btn btn-primary" onClick={handleGoToConfig}>Commencer mon projet</button>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-inner">
          <div className="hero-left">
            <h1>
              Portes toute hauteur<br />sur mesure
            </h1>
            <p className="hero-sub">Fabriquées au Pays Basque • Qualité atelier</p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={handleGoToConfig}>Personnaliser maintenant</button>
              <a className="btn btn-ghost" href="#config">Voir un exemple</a>
            </div>
            <div className="hero-badges">
              <span>Placage de qualité</span>
              <span>Finitions premium</span>
              <span>Délais maîtrisés</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="door-card">
              <div className="door-slab" />
              <div className="door-info">
                <div>
                  <strong>2100</strong>
                  <span>hauteur</span>
                </div>
                <div>
                  <strong>900</strong>
                  <span>largeur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="features container">
        <div className="feature">
          <div className="ico" />
          <h3>Fabrication locale</h3>
          <p>Assemblage et contrôle dans notre atelier, traçabilité totale.</p>
        </div>
        <div className="feature">
          <div className="ico" />
          <h3>Savoir‑faire artisanal</h3>
          <p>Usinage précis, ajustements fins et finitions haut de gamme.</p>
        </div>
        <div className="feature">
          <div className="ico" />
          <h3>Configurateur 2D</h3>
          <p>Vos cotes en direct, export SVG modifiable, prêt pour la prod.</p>
        </div>
      </section>

      <section className="materials container">
        <div className="section-head">
          <h2>Matières & finitions</h2>
          <p>Une sélection durable aux teintes intemporelles.</p>
        </div>
        <div className="swatches">
          <div className="swatch-card">
            <div className="swatch-chip" style={{ background:'#A8845A' }} />
            <h4>Chêne</h4>
          </div>
          <div className="swatch-card">
            <div className="swatch-chip" style={{ background:'#5C4436' }} />
            <h4>Noyer</h4>
          </div>
          <div className="swatch-card">
            <div className="swatch-chip" style={{ background:'#8C6A3F' }} />
            <h4>Plaqué</h4>
          </div>
          <div className="swatch-card">
            <div className="swatch-chip" style={{ background:'#B59A7A' }} />
            <h4>Chêne clair</h4>
          </div>
        </div>
      </section>

      <section className="steps container">
        <div className="step">
          <span className="step-num">01</span>
          <div>
            <h3>Personnalisez</h3>
            <p>Renseignez vos cotes et options en temps réel.</p>
          </div>
        </div>
        <div className="step">
          <span className="step-num">02</span>
          <div>
            <h3>Validez</h3>
            <p>Exportez un plan SVG pour validation et archivage.</p>
          </div>
        </div>
        <div className="step">
          <span className="step-num">03</span>
          <div>
            <h3>Nous fabriquons</h3>
            <p>Votre porte est produite et contrôlée dans notre atelier.</p>
          </div>
        </div>
      </section>

      <footer className="footer container">
        <div className="foot-left">
          <span className="muted">© La Manufacture de la porte</span>
        </div>
        <div className="foot-right">
          <a href="#config" className="btn btn-primary">Lancer le configurateur</a>
        </div>
      </footer>
    </div>
  )
}

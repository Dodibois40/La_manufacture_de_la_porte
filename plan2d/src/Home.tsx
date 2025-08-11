import { useState } from 'react'
import './index.css'

export default function Home() {
  const [goToConfig, setGoToConfig] = useState(false)
  if (goToConfig) {
    location.hash = '#config'
  }
  return (
    <div className="home">
      <header className="app-header">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:24, height:24, border:'1px solid var(--border)', borderRadius:999 }} />
          <span>LA MANUFACTURE DE LA PORTE</span>
        </div>
        <button onClick={() => setGoToConfig(true)}>COMMENCER MON PROJET</button>
      </header>

      <section className="hero">
        <div className="hero-left">
          <h1>PORTES TOUTE HAUTEUR SUR MESURE</h1>
          <p>Fabriquées au Pays Basque</p>
          <button onClick={() => setGoToConfig(true)}>PERSONNALISER</button>
        </div>
        <div className="hero-right">
          <div className="door-frame" />
        </div>
      </section>

      <section className="materials">
        <h2>MATIÈRES & FINITIONS</h2>
        <div className="swatches">
          <div className="swatch" style={{ background:'#A8845A' }}><span>Chêne</span></div>
          <div className="swatch" style={{ background:'#5C4436' }}><span>Noyer</span></div>
          <div className="swatch" style={{ background:'#8C6A3F' }}><span>Plaqué</span></div>
        </div>
      </section>

      <section className="reasons">
        <h2>POURQUOI CHOISIR LA MANUFACTURE DE LA PORTE ?</h2>
        <ul>
          <li>Savoir‑faire artisanal</li>
          <li>Fabrication locale</li>
          <li>Placage de qualité</li>
        </ul>
      </section>
    </div>
  )
}

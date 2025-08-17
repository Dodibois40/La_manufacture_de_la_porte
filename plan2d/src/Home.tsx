import './index.css'
import { useState, useEffect } from 'react'
import logoImg from '../logo_transparent.png'

export default function Home() {
  const [showMenu, setShowMenu] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleGoToConfig = () => {
    location.hash = '#config'
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="home-gaming">
      {/* Parallax Background */}
      <div className="parallax-bg" style={{
        transform: `translate(${mousePos.x * -0.01}px, ${mousePos.y * -0.01}px)`
      }}></div>
      
      {/* Logo with hover menu */}
      <div className="logo-container" 
           onMouseEnter={() => setShowMenu(true)}
           onMouseLeave={() => setShowMenu(false)}>
        <img src={logoImg} alt="La Manufacture de la Porte" className="logo-img" />
        
        {/* Gaming Menu */}
        <nav className={`gaming-menu ${showMenu ? 'active' : ''}`}>
          <div className="menu-item" onClick={handleGoToConfig}>
            <span className="menu-icon">⚙</span>
            <span>Configurateur</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">◉</span>
            <span>Catalogue</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">◈</span>
            <span>Réalisation</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">◇</span>
            <span>Garantie</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">◎</span>
            <span>Qui sommes nous</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">◐</span>
            <span>Contact</span>
          </div>
        </nav>
      </div>

      {/* Central Gaming Interface */}
      <div className="gaming-interface">
        <div className="central-hub">
          <div className="slogan-container">
            <h1 className="main-slogan">
              Configurez votre porte,<br />
              <span className="accent-text" data-text="nous la façonnons">nous la façonnons</span>
            </h1>
            <p className="sub-slogan typewriter">
              <span className="typewriter-text">La Manufacture de la Porte • Fabrication artisanale • Pays Basque</span>
            </p>
          </div>
          
          {/* Animation de porte qui se dessine */}
          <div className="door-animation-container">
            <svg viewBox="0 0 260 500">
              {/* Montant gauche */}
              <rect className="draw-line montant-left" x="20" y="30" width="15" height="450" />
              
              {/* Montant droit */}
              <rect className="draw-line montant-right" x="225" y="30" width="15" height="450" />
              
              {/* Traverse haute */}
              <rect className="draw-line traverse-top" x="35" y="30" width="190" height="15" />
              
              {/* Porte */}
              <rect className="draw-line door" x="38" y="48" width="184" height="429" />
              
              {/* Poignée */}
              <line className="draw-line handle" x1="55" y1="260" x2="75" y2="260" />
            </svg>
          </div>
          
          <button className="cta-gaming" onClick={handleGoToConfig}>
            <div className="cta-inner">
              <span className="cta-text">Configurer ma porte</span>
              <div className="cta-glow"></div>
            </div>
          </button>
          
          <div className="gaming-badges">
            <div className="badge">Sur mesure</div>
            <div className="badge">Bois noble</div>
            <div className="badge">Artisanal</div>
          </div>
        </div>
      </div>

      {/* Subtle footer */}
      <div className="gaming-footer">
        <span>© La Manufacture de la Porte 2025</span>
      </div>
    </div>
  )
}

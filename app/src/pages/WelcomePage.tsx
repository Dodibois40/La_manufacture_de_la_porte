import { useState, useEffect } from 'react'
import logoImg from '@assets/images/logo_transparent.png'
import LogoutButton from '../components/LogoutButton'
import { getCurrentUser } from '../utils/auth'

export default function WelcomePage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const userInfo = getCurrentUser()
    setUser(userInfo)
    
    // Animation d'apparition du contenu
    setTimeout(() => setShowContent(true), 500)
  }, [])

  const handleGoToTutorial = () => {
    // Pour l'instant, rediriger vers la page d'accueil
    window.location.hash = '#home'
  }

  const handleGoToConfig = () => {
    // Pour l'instant, rediriger vers la page d'accueil  
    window.location.hash = '#home'
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑'
      case 'partner': return '🏢'
      default: return '👤'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur'
      case 'partner': return 'Partenaire'
      default: return 'Visiteur'
    }
  }

  return (
    <div className="welcome-page">
      <LogoutButton />
      
      {/* Fond avec effet parallax */}
      <div className="welcome-background"></div>
      
      {/* Header avec logo */}
      <header className="welcome-header">
        <img src={logoImg} alt="La Manufacture de la Porte" className="welcome-logo" />
      </header>

      {/* Contenu principal */}
      <main className={`welcome-content ${showContent ? 'visible' : ''}`}>
        <div className="welcome-container">
          
          {/* Salutation personnalisée */}
          <div className="greeting-section">
            <div className="user-badge">
              <span className="user-icon">{getRoleIcon(user?.role || 'guest')}</span>
              <span className="user-role">{getRoleLabel(user?.role || 'guest')}</span>
            </div>
            
            <h1 className="greeting-title">
              Bonjour <span className="user-name">{user?.name || 'Visiteur'}</span>
            </h1>
            
            <h2 className="welcome-subtitle">
              Bienvenue sur La Manufacture de la Porte
            </h2>
          </div>

          {/* Description */}
          <div className="description-section">
            <p className="welcome-description">
              Sur ce site tu vas pouvoir <span className="highlight">paramétrer tes blocs porte en bois sur mesure</span> et les commander.
            </p>
            
            <p className="welcome-description">
              Nos portes sont fabriquées artisanalement au <span className="highlight">Pays Basque</span> avec des bois nobles sélectionnés.
            </p>
          </div>

          {/* Choix d'action */}
          <div className="action-section">
            <h3 className="action-title">Que veux-tu faire ?</h3>
            
            <div className="action-buttons">
              <button className="action-btn tutorial-btn" onClick={handleGoToTutorial}>
                <div className="btn-icon">📚</div>
                <div className="btn-content">
                  <div className="btn-title">Tutoriel de commande</div>
                  <div className="btn-subtitle">Apprendre à utiliser l'outil</div>
                </div>
              </button>

              <button className="action-btn config-btn" onClick={handleGoToConfig}>
                <div className="btn-icon">⚙️</div>
                <div className="btn-content">
                  <div className="btn-title">Outil de configuration</div>
                  <div className="btn-subtitle">Configurer directement ma porte</div>
                </div>
              </button>
            </div>
          </div>

          {/* Animation de porte décorative */}
          <div className="decorative-door">
            <svg viewBox="0 0 120 200" className="door-svg">
              <rect className="door-frame" x="10" y="10" width="100" height="180" />
              <rect className="door-panel" x="15" y="15" width="90" height="170" />
              <circle className="door-handle" cx="85" cy="100" r="3" />
              <line className="door-detail" x1="20" y1="40" x2="95" y2="40" />
              <line className="door-detail" x1="20" y1="160" x2="95" y2="160" />
            </svg>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="welcome-footer">
        <p>© La Manufacture de la Porte 2025 • Fabrication artisanale • Pays Basque</p>
      </footer>
    </div>
  )
}

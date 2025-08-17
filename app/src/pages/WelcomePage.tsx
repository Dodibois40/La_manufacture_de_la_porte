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

          {/* Animation de porte - lignes ultra fines */}
          <div className="door-container">
            <svg viewBox="0 0 260 500">
              {/* Montant gauche */}
              <rect className="line-thin montant-left" x="20" y="30" width="15" height="450" />
              
              {/* Montant droit */}
              <rect className="line-thin montant-right" x="225" y="30" width="15" height="450" />
              
              {/* Traverse haute */}
              <rect className="line-thin traverse-top" x="35" y="30" width="190" height="15" />
              
              {/* Porte */}
              <rect className="line-thin door" x="38" y="48" width="184" height="429" />
              
              {/* Poignée */}
              <line className="line-thin handle" x1="55" y1="260" x2="75" y2="260" />
            </svg>
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
        </div>
      </main>

      {/* Footer */}
      <footer className="welcome-footer">
        <p>© La Manufacture de la Porte 2025 • Fabrication artisanale • Pays Basque</p>
      </footer>
    </div>
  )
}

import logoImg from '@assets/images/logo_transparent.png'
import LogoutButton from '../components/LogoutButton'
import { getCurrentUser } from '../utils/auth'

export default function TutorialPage() {
  const user = getCurrentUser()

  const handleGoToConfig = () => {
    window.location.hash = '#config'
  }

  const handleGoHome = () => {
    window.location.hash = '#home'
  }

  return (
    <div className="tutorial-page">
      <LogoutButton />
      
      <header className="tutorial-header">
        <img src={logoImg} alt="La Manufacture de la Porte" className="tutorial-logo" />
        <h1>Tutoriel de Commande</h1>
      </header>

      <main className="tutorial-content">
        <div className="tutorial-container">
          
          <div className="tutorial-intro">
            <h2>Comment configurer ta porte sur mesure ?</h2>
            <p>Salut {user?.name} ! Voici un guide rapide pour utiliser notre configurateur.</p>
          </div>

          <div className="tutorial-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Charger le gabarit</h3>
                <p>Clique sur "Ouvrir le gabarit intégré" pour charger le plan de porte.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Modifier les cotations</h3>
                <p>Ajuste les valeurs (largeur, hauteur, épaisseur) selon tes besoins.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Appliquer les changements</h3>
                <p>Clique sur "Appliquer" pour voir les modifications sur le plan.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Télécharger ton plan</h3>
                <p>Une fois satisfait, télécharge ton plan personnalisé en SVG.</p>
              </div>
            </div>
          </div>

          <div className="tutorial-actions">
            <button className="tutorial-btn primary" onClick={handleGoToConfig}>
              🚀 Commencer la configuration
            </button>
            
            <button className="tutorial-btn secondary" onClick={handleGoHome}>
              🏠 Retour à l'accueil
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

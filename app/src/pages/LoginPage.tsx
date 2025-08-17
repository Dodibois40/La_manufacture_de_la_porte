import { useState } from 'react'
import logoImg from '@assets/images/logo_transparent.png'

export default function LoginPage() {
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Code d'accès temporaire (à configurer)
  const VALID_ACCESS_CODE = 'MANUFACTURE2025'

  const handleLogoClick = () => {
    setShowCodeInput(true)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulation d'une vérification
    setTimeout(() => {
      if (accessCode.toUpperCase() === VALID_ACCESS_CODE) {
        // Sauvegarder l'accès dans le localStorage
        localStorage.setItem('manufacture_access', 'granted')
        localStorage.setItem('manufacture_access_time', Date.now().toString())
        
        // Rediriger vers la page d'accueil
        window.location.hash = ''
        window.location.reload()
      } else {
        setError('Code d\'accès incorrect')
        setAccessCode('')
      }
      setIsLoading(false)
    }, 800)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value.toUpperCase())
    setError('')
  }

  return (
    <div className="login-page">
      {/* Fond avec effet parallax subtil */}
      <div className="login-background"></div>
      
      {/* Container principal centré */}
      <div className="login-container">
        {/* Logo cliquable */}
        <div 
          className={`logo-wrapper ${showCodeInput ? 'logo-clicked' : ''}`}
          onClick={!showCodeInput ? handleLogoClick : undefined}
        >
          <img 
            src={logoImg} 
            alt="La Manufacture de la Porte" 
            className="login-logo"
          />
        </div>

        {/* Formulaire de code d'accès */}
        {showCodeInput && (
          <div className="access-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={accessCode}
                  onChange={handleCodeChange}
                  className={`access-input ${error ? 'error' : ''}`}
                  placeholder="Entrez votre code"
                  autoFocus
                  maxLength={20}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className={`access-button ${isLoading ? 'loading' : ''}`}
                disabled={!accessCode.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Accéder au site'
                )}
              </button>
            </form>

            <button 
              className="back-button"
              onClick={() => {
                setShowCodeInput(false)
                setAccessCode('')
                setError('')
              }}
              disabled={isLoading}
            >
              ← Retour
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

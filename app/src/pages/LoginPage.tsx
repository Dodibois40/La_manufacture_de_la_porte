import { useState } from 'react'
import logoImg from '@assets/images/logo_transparent.png'
import { verifyAccessCode, saveUserInfo } from '../utils/auth'

export default function LoginPage() {
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)



  const handleLogoClick = () => {
    setShowCodeInput(true)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Vérification du code d'accès
    setTimeout(() => {
      const result = verifyAccessCode(accessCode)
      
      if (result.valid && result.user) {
        // Sauvegarder l'accès et les infos utilisateur
        localStorage.setItem('manufacture_access', 'granted')
        localStorage.setItem('manufacture_access_time', Date.now().toString())
        saveUserInfo(result.user)
        
        // Rediriger vers la page de bienvenue
        window.location.hash = '#welcome'
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
                  className={`access-input ${error ? 'error' : ''} ${isLoading ? 'loading' : ''}`}
                  placeholder="Entrez votre code"
                  autoFocus
                  maxLength={20}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && accessCode.trim()) {
                      handleSubmit(e)
                    }
                  }}
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
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

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import ConfigPage from './pages/ConfigPage.tsx'
import Home from './pages/Home.tsx'
import LoginPage from './pages/LoginPage.tsx'
import { hasAccess } from './utils/auth'
import './styles/index.css'
import './styles/login.css'

function Root() {
  const [hash, setHash] = useState<string>(location.hash)
  const [userHasAccess, setUserHasAccess] = useState<boolean>(hasAccess())

  useEffect(() => {
    const onHash = () => setHash(location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    // Vérifier l'accès périodiquement
    const checkAccess = () => setUserHasAccess(hasAccess())
    const interval = setInterval(checkAccess, 60000) // Vérifier chaque minute
    return () => clearInterval(interval)
  }, [])

  // Si pas d'accès, afficher la page de login
  if (!userHasAccess) {
    return <LoginPage />
  }

  // Si accès accordé, router normalement
  if (hash === '#config') return <ConfigPage />
  return <Home />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)

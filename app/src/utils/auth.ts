// 🔐 Utilitaires d'Authentification Simple - La Manufacture de la Porte

// Codes d'accès valides avec informations utilisateur
const ACCESS_CODES = {
  'MANUFACTURE2025': { name: 'Visiteur', role: 'guest' },
  'DORIAN': { name: 'Dorian', role: 'admin' },
  'THIBAUD': { name: 'Thibaud', role: 'partner' }
}

// Durée de validité de l'accès (24 heures)
const ACCESS_DURATION = 24 * 60 * 60 * 1000

// 🔍 Vérifier si l'utilisateur a accès
export function hasAccess(): boolean {
  try {
    const access = localStorage.getItem('manufacture_access')
    const accessTime = localStorage.getItem('manufacture_access_time')
    
    if (!access || !accessTime) {
      return false
    }
    
    // Vérifier que l'accès n'a pas expiré
    const timeGranted = parseInt(accessTime)
    const now = Date.now()
    
    if (now - timeGranted > ACCESS_DURATION) {
      // Accès expiré, nettoyer
      clearAccess()
      return false
    }
    
    return access === 'granted'
  } catch (error) {
    return false
  }
}

// ✅ Accorder l'accès
export function grantAccess(): void {
  localStorage.setItem('manufacture_access', 'granted')
  localStorage.setItem('manufacture_access_time', Date.now().toString())
}

// 🚫 Révoquer l'accès
export function clearAccess(): void {
  localStorage.removeItem('manufacture_access')
  localStorage.removeItem('manufacture_access_time')
}

// 🔐 Vérifier le code d'accès et retourner les infos utilisateur
export function verifyAccessCode(code: string): { valid: boolean; user?: { name: string; role: string } } {
  const upperCode = code.toUpperCase().trim()
  const userInfo = ACCESS_CODES[upperCode as keyof typeof ACCESS_CODES]
  
  if (userInfo) {
    return { valid: true, user: userInfo }
  }
  
  return { valid: false }
}

// 🔍 Obtenir les informations de l'utilisateur connecté
export function getCurrentUser(): { name: string; role: string } | null {
  try {
    const userInfo = localStorage.getItem('manufacture_user')
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    return null
  }
}

// 👤 Sauvegarder les informations utilisateur
export function saveUserInfo(user: { name: string; role: string }): void {
  localStorage.setItem('manufacture_user', JSON.stringify(user))
}

// ⏰ Obtenir le temps restant avant expiration (en millisecondes)
export function getTimeUntilExpiration(): number {
  try {
    const accessTime = localStorage.getItem('manufacture_access_time')
    if (!accessTime) return 0
    
    const timeGranted = parseInt(accessTime)
    const now = Date.now()
    const timeElapsed = now - timeGranted
    
    return Math.max(0, ACCESS_DURATION - timeElapsed)
  } catch (error) {
    return 0
  }
}

// 📅 Obtenir la date d'expiration
export function getExpirationDate(): Date | null {
  try {
    const accessTime = localStorage.getItem('manufacture_access_time')
    if (!accessTime) return null
    
    const timeGranted = parseInt(accessTime)
    return new Date(timeGranted + ACCESS_DURATION)
  } catch (error) {
    return null
  }
}

// 🔄 Prolonger l'accès (renouveler le timer)
export function renewAccess(): void {
  if (hasAccess()) {
    localStorage.setItem('manufacture_access_time', Date.now().toString())
  }
}

// 📊 Obtenir les informations d'accès
export function getAccessInfo() {
  const hasValidAccess = hasAccess()
  const timeRemaining = getTimeUntilExpiration()
  const expirationDate = getExpirationDate()
  
  return {
    hasAccess: hasValidAccess,
    timeRemaining,
    expirationDate,
    timeRemainingFormatted: formatTimeRemaining(timeRemaining)
  }
}

// 🕐 Formater le temps restant
function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Expiré'
  
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`
  } else {
    return `${minutes}min`
  }
}

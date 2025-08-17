// 🚪 Composant Bouton de Déconnexion - La Manufacture de la Porte
import { clearAccess } from '../utils/auth'

export default function LogoutButton() {
  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      clearAccess()
      window.location.reload()
    }
  }

  return (
    <button 
      onClick={handleLogout}
      className="logout-button"
      title="Se déconnecter"
    >
      🚪
    </button>
  )
}

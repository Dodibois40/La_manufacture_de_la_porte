// 🛣️ Routes de Configurations - La Manufacture de la Porte
import { Router } from 'express'
import { ConfigController } from '@controllers/config.controller'
import { authenticateToken, requireOwnership, logActivity } from '@middleware/auth.middleware'

const router = Router()

// 📋 Récupérer toutes les configurations de l'utilisateur
router.get('/',
  authenticateToken,
  logActivity('list_configurations', 'configuration'),
  ConfigController.getConfigurations
)

// 📄 Récupérer une configuration spécifique
router.get('/:id',
  authenticateToken,
  requireOwnership(),
  logActivity('view_configuration', 'configuration'),
  ConfigController.getConfiguration
)

// ✨ Créer une nouvelle configuration
router.post('/',
  authenticateToken,
  logActivity('create_configuration', 'configuration'),
  ConfigController.createConfiguration
)

// 📝 Mettre à jour une configuration
router.put('/:id',
  authenticateToken,
  requireOwnership(),
  logActivity('update_configuration', 'configuration'),
  ConfigController.updateConfiguration
)

// 🗑️ Supprimer une configuration
router.delete('/:id',
  authenticateToken,
  requireOwnership(),
  logActivity('delete_configuration', 'configuration'),
  ConfigController.deleteConfiguration
)

// 📤 Dupliquer une configuration
router.post('/:id/duplicate',
  authenticateToken,
  requireOwnership(),
  logActivity('duplicate_configuration', 'configuration'),
  ConfigController.duplicateConfiguration
)

// 🔗 Générer un lien de partage
router.post('/:id/share',
  authenticateToken,
  requireOwnership(),
  logActivity('share_configuration', 'configuration'),
  ConfigController.shareConfiguration
)

// 🌐 Accès public à une configuration partagée
router.get('/shared/:token',
  logActivity('view_shared_configuration', 'configuration'),
  ConfigController.getSharedConfiguration
)

// 🏥 Health check
router.get('/health', (req, res) => {
  res.json({
    service: 'configurations',
    status: 'OK',
    timestamp: new Date().toISOString()
  })
})

export { router as configRoutes }

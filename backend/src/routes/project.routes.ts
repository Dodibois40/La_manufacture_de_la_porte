// 🛣️ Routes de Projets - La Manufacture de la Porte
import { Router } from 'express'
import { ProjectController } from '@controllers/project.controller'
import { authenticateToken, requireRole, requireOwnership, logActivity } from '@middleware/auth.middleware'

const router = Router()

// 📋 Récupérer tous les projets du partenaire
router.get('/',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  logActivity('list_projects', 'project'),
  ProjectController.getProjects
)

// 📄 Récupérer un projet spécifique
router.get('/:id',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  requireOwnership(),
  logActivity('view_project', 'project'),
  ProjectController.getProject
)

// ✨ Créer un nouveau projet
router.post('/',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  logActivity('create_project', 'project'),
  ProjectController.createProject
)

// 📝 Mettre à jour un projet
router.put('/:id',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  requireOwnership(),
  logActivity('update_project', 'project'),
  ProjectController.updateProject
)

// 🗑️ Supprimer un projet
router.delete('/:id',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  requireOwnership(),
  logActivity('delete_project', 'project'),
  ProjectController.deleteProject
)

// ⚙️ Ajouter une configuration à un projet
router.post('/:id/configurations',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  requireOwnership(),
  logActivity('add_config_to_project', 'project'),
  ProjectController.addConfigurationToProject
)

// 🗑️ Retirer une configuration d'un projet
router.delete('/:projectId/configurations/:configId',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  requireOwnership(),
  logActivity('remove_config_from_project', 'project'),
  ProjectController.removeConfigurationFromProject
)

// 💰 Générer un devis pour un projet
router.get('/:id/quote',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  requireOwnership(),
  logActivity('generate_quote', 'project'),
  ProjectController.generateQuote
)

// 📊 Statistiques des projets du partenaire
router.get('/stats/summary',
  authenticateToken,
  requireRole('PARTNER', 'ADMIN'),
  logActivity('view_project_stats'),
  ProjectController.getProjectStats
)

// 🏥 Health check
router.get('/health', (req, res) => {
  res.json({
    service: 'projects',
    status: 'OK',
    timestamp: new Date().toISOString()
  })
})

export { router as projectRoutes }

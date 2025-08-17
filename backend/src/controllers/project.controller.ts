// 🏢 Contrôleur de Projets - La Manufacture de la Porte
import { Response, NextFunction } from 'express'
import { ProjectService } from '@services/project.service'
import { projectSchema, paginationSchema, idParamSchema } from '@utils/validation.utils'
import { AuthenticatedRequest } from '@types/index'

export class ProjectController {
  // 📋 Liste des projets du partenaire
  static async getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const { error, value } = paginationSchema.validate(req.query)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      const result = await ProjectService.getPartnerProjects(req.user.id, value)

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // 📄 Récupérer un projet spécifique
  static async getProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const { error, value } = idParamSchema.validate(req.params)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      const project = await ProjectService.getProjectById(value.id, req.user.id)

      res.json({
        success: true,
        data: project
      })
    } catch (error) {
      next(error)
    }
  }

  // ✨ Créer un nouveau projet
  static async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const { error, value } = projectSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      const project = await ProjectService.createProject(req.user.id, value)

      res.status(201).json({
        success: true,
        data: project,
        message: 'Projet créé avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // 📝 Mettre à jour un projet
  static async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const { error: idError, value: idValue } = idParamSchema.validate(req.params)
      if (idError) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: idError.details[0].message
        })
      }

      const project = await ProjectService.updateProject(idValue.id, req.user.id, req.body)

      res.json({
        success: true,
        data: project,
        message: 'Projet mis à jour avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // 🗑️ Supprimer un projet
  static async deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const { error, value } = idParamSchema.validate(req.params)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      await ProjectService.deleteProject(value.id, req.user.id)

      res.json({
        success: true,
        message: 'Projet supprimé avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // ⚙️ Ajouter une configuration à un projet
  static async addConfigurationToProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const projectId = parseInt(req.params.id)
      const { configurationId, quantity = 1, unitPrice } = req.body

      if (!configurationId) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_CONFIG_ID',
          message: 'ID de configuration manquant'
        })
      }

      const result = await ProjectService.addConfigurationToProject(
        projectId,
        configurationId,
        req.user.id,
        { quantity, unitPrice }
      )

      res.status(201).json({
        success: true,
        data: result,
        message: 'Configuration ajoutée au projet'
      })
    } catch (error) {
      next(error)
    }
  }

  // 🗑️ Retirer une configuration d'un projet
  static async removeConfigurationFromProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const projectId = parseInt(req.params.projectId)
      const configId = parseInt(req.params.configId)

      await ProjectService.removeConfigurationFromProject(projectId, configId, req.user.id)

      res.json({
        success: true,
        message: 'Configuration retirée du projet'
      })
    } catch (error) {
      next(error)
    }
  }

  // 💰 Générer un devis
  static async generateQuote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const { error, value } = idParamSchema.validate(req.params)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      const quote = await ProjectService.generateQuote(value.id, req.user.id)

      res.json({
        success: true,
        data: quote,
        message: 'Devis généré avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // 📊 Statistiques des projets
  static async getProjectStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      const stats = await ProjectService.getPartnerStats(req.user.id)

      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      next(error)
    }
  }
}

// ⚙️ Contrôleur de Configurations - La Manufacture de la Porte
import { Response, NextFunction } from 'express'
import { ConfigService } from '@services/config.service'
import { 
  configurationSchema, 
  paginationSchema,
  idParamSchema 
} from '@utils/validation.utils'
import { AuthenticatedRequest } from '@types/index'

export class ConfigController {
  // 📋 Liste des configurations de l'utilisateur
  static async getConfigurations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      // Validation des paramètres de pagination
      const { error, value } = paginationSchema.validate(req.query)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      const result = await ConfigService.getUserConfigurations(req.user.id, value)

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

  // 📄 Récupérer une configuration spécifique
  static async getConfiguration(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

      const configuration = await ConfigService.getConfigurationById(value.id, req.user.id)

      res.json({
        success: true,
        data: configuration
      })
    } catch (error) {
      next(error)
    }
  }

  // ✨ Créer une nouvelle configuration
  static async createConfiguration(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      // Validation des données
      const { error, value } = configurationSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message,
          details: error.details
        })
      }

      const configuration = await ConfigService.createConfiguration(req.user.id, value)

      res.status(201).json({
        success: true,
        data: configuration,
        message: 'Configuration créée avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // 📝 Mettre à jour une configuration
  static async updateConfiguration(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      // Validation de l'ID
      const { error: idError, value: idValue } = idParamSchema.validate(req.params)
      if (idError) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: idError.details[0].message
        })
      }

      // Validation des données (partielle pour update)
      const updateSchema = configurationSchema.fork(['name', 'svgModified', 'parameters'], (schema) => schema.optional())
      const { error, value } = updateSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      const configuration = await ConfigService.updateConfiguration(idValue.id, req.user.id, value)

      res.json({
        success: true,
        data: configuration,
        message: 'Configuration mise à jour avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // 🗑️ Supprimer une configuration
  static async deleteConfiguration(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

      await ConfigService.deleteConfiguration(value.id, req.user.id)

      res.json({
        success: true,
        message: 'Configuration supprimée avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // 📤 Dupliquer une configuration
  static async duplicateConfiguration(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

      const configuration = await ConfigService.duplicateConfiguration(value.id, req.user.id)

      res.status(201).json({
        success: true,
        data: configuration,
        message: 'Configuration dupliquée avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // 🔗 Partager une configuration (lien public temporaire)
  static async shareConfiguration(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

      const shareData = await ConfigService.generateShareLink(value.id, req.user.id)

      res.json({
        success: true,
        data: shareData,
        message: 'Lien de partage généré'
      })
    } catch (error) {
      next(error)
    }
  }

  // 🌐 Accès public à une configuration partagée
  static async getSharedConfiguration(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_TOKEN',
          message: 'Token de partage manquant'
        })
      }

      const configuration = await ConfigService.getSharedConfiguration(token)

      res.json({
        success: true,
        data: configuration
      })
    } catch (error) {
      next(error)
    }
  }
}

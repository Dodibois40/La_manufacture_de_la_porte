// 🎮 Contrôleur d'Authentification - La Manufacture de la Porte
import { Request, Response, NextFunction } from 'express'
import { AuthService } from '@services/auth.service'
import { 
  registerSchema, 
  loginSchema, 
  resetPasswordSchema, 
  newPasswordSchema 
} from '@utils/validation.utils'
import { AuthenticatedRequest } from '@types/index'

export class AuthController {
  // 📝 Inscription
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validation des données
      const { error, value } = registerSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message,
          details: error.details
        })
      }

      // Inscription via le service
      const result = await AuthService.register(value)

      res.status(201).json({
        success: true,
        data: result,
        message: 'Compte créé avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // 🔑 Connexion
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validation des données
      const { error, value } = loginSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      // Connexion via le service
      const result = await AuthService.login(
        value,
        req.ip,
        req.get('User-Agent')
      )

      res.json({
        success: true,
        data: result,
        message: 'Connexion réussie'
      })
    } catch (error) {
      next(error)
    }
  }

  // 🚪 Déconnexion
  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      await AuthService.logout(token)

      res.json({
        success: true,
        message: 'Déconnexion réussie'
      })
    } catch (error) {
      next(error)
    }
  }

  // 👤 Profil utilisateur actuel
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilisateur non authentifié'
        })
      }

      // Récupérer les infos complètes de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          company: true,
          phone: true,
          createdAt: true,
          lastLogin: true,
          emailVerified: true
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Utilisateur non trouvé'
        })
      }

      res.json({
        success: true,
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  // 📧 Demande de réinitialisation de mot de passe
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = resetPasswordSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      await AuthService.requestPasswordReset(value.email)

      res.json({
        success: true,
        message: 'Si un compte avec cet email existe, un lien de réinitialisation a été envoyé'
      })
    } catch (error) {
      next(error)
    }
  }

  // 🔄 Réinitialisation de mot de passe
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = newPasswordSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.details[0].message
        })
      }

      await AuthService.resetPassword(value.token, value.newPassword)

      res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // ✅ Vérification d'email
  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_TOKEN',
          message: 'Token de vérification manquant'
        })
      }

      await AuthService.verifyEmail(token)

      res.json({
        success: true,
        message: 'Email vérifié avec succès'
      })
    } catch (error) {
      next(error)
    }
  }
}

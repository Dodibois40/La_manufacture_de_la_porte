// 🔐 Middleware d'Authentification - La Manufacture de la Porte
import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@config/env'
import { prisma } from '@config/database'
import { AuthenticatedRequest, UserPayload } from '@types/index'
import { errors } from '@middleware/error.middleware'

// 🛡️ Middleware principal d'authentification
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Récupérer le token depuis l'header Authorization
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Format: "Bearer TOKEN"

    if (!token) {
      throw errors.unauthorized('Token d\'authentification manquant')
    }

    // Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload
    
    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true
      }
    })

    if (!user) {
      throw errors.unauthorized('Utilisateur non trouvé')
    }

    if (!user.isActive) {
      throw errors.forbidden('Compte désactivé')
    }

    if (!user.emailVerified) {
      throw errors.forbidden('Email non vérifié')
    }

    // Vérifier que la session existe (sécurité renforcée)
    const tokenHash = require('crypto')
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const session = await prisma.userSession.findFirst({
      where: {
        userId: user.id,
        tokenHash,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!session) {
      throw errors.unauthorized('Session expirée ou invalide')
    }

    // Ajouter les infos utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    next()
  } catch (error) {
    next(error)
  }
}

// 🎭 Middleware de vérification de rôle
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(errors.unauthorized('Authentification requise'))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(errors.forbidden(`Accès réservé aux rôles: ${allowedRoles.join(', ')}`))
    }

    next()
  }
}

// 👥 Middleware pour vérifier la propriété d'une ressource
export function requireOwnership(resourceField: string = 'userId') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(errors.unauthorized('Authentification requise'))
      }

      const resourceId = req.params.id
      if (!resourceId) {
        return next(errors.badRequest('ID de ressource manquant'))
      }

      // Les admins ont accès à tout
      if (req.user.role === 'ADMIN') {
        return next()
      }

      // Vérifier selon le type de ressource
      let resource = null
      const path = req.route?.path || req.path

      if (path.includes('/configurations')) {
        resource = await prisma.configuration.findUnique({
          where: { id: parseInt(resourceId) },
          select: { userId: true }
        })
      } else if (path.includes('/projects')) {
        resource = await prisma.project.findUnique({
          where: { id: parseInt(resourceId) },
          select: { partnerId: true }
        })
        // Pour les projets, vérifier partnerId au lieu de userId
        if (resource && resource.partnerId !== req.user.id) {
          return next(errors.forbidden('Accès interdit à ce projet'))
        }
        return next()
      }

      if (!resource) {
        return next(errors.notFound('Ressource non trouvée'))
      }

      if (resource.userId !== req.user.id) {
        return next(errors.forbidden('Accès interdit à cette ressource'))
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

// 📊 Middleware de logging d'activité
export function logActivity(action: string, resourceType?: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        await prisma.activityLog.create({
          data: {
            userId: req.user.id,
            action,
            resourceType,
            resourceId: req.params.id ? parseInt(req.params.id) : null,
            details: {
              method: req.method,
              path: req.path,
              body: req.method !== 'GET' ? req.body : undefined
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
          }
        })
      }
      next()
    } catch (error) {
      // Ne pas bloquer la requête si le logging échoue
      console.error('Erreur de logging d\'activité:', error)
      next()
    }
  }
}

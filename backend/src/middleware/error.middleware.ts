// 🚨 Middleware de Gestion d'Erreurs - La Manufacture de la Porte
import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { logger } from '@utils/logger.utils'

// 🎯 Interface d'erreur personnalisée
export interface AppError extends Error {
  statusCode?: number
  code?: string
  isOperational?: boolean
}

// 🔥 Gestionnaire d'erreurs principal
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log de l'erreur
  logger.error('Erreur API:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // 🗄️ Erreurs Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error, res)
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides',
      message: 'Les données fournies ne respectent pas le format attendu'
    })
  }

  // 🔐 Erreurs JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token invalide',
      message: 'Le token d\'authentification est invalide'
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expiré',
      message: 'Le token d\'authentification a expiré'
    })
  }

  // 📦 Erreurs de validation JSON
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'JSON invalide',
      message: 'Le format JSON de la requête est invalide'
    })
  }

  // 🎯 Erreurs personnalisées
  if (error.isOperational) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.code || 'OPERATIONAL_ERROR',
      message: error.message
    })
  }

  // 🚨 Erreurs inconnues (ne pas exposer les détails en production)
  const isDev = process.env.NODE_ENV === 'development'
  
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Une erreur interne s\'est produite',
    ...(isDev && { 
      details: error.message,
      stack: error.stack 
    })
  })
}

// 🗄️ Gestionnaire d'erreurs Prisma spécifique
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError, res: Response) {
  switch (error.code) {
    case 'P2002':
      // Violation de contrainte unique
      const field = error.meta?.target as string[] | undefined
      return res.status(409).json({
        success: false,
        error: 'DUPLICATE_ENTRY',
        message: `${field?.[0] || 'Cette valeur'} existe déjà`
      })

    case 'P2025':
      // Enregistrement non trouvé
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Ressource non trouvée'
      })

    case 'P2003':
      // Violation de clé étrangère
      return res.status(400).json({
        success: false,
        error: 'FOREIGN_KEY_VIOLATION',
        message: 'Référence invalide vers une ressource'
      })

    case 'P2014':
      // Violation de relation
      return res.status(400).json({
        success: false,
        error: 'RELATION_VIOLATION',
        message: 'Impossible de supprimer: des éléments dépendent de cette ressource'
      })

    default:
      return res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Erreur de base de données'
      })
  }
}

// 🎯 Créateur d'erreurs personnalisées
export function createError(
  message: string,
  statusCode: number = 500,
  code: string = 'GENERIC_ERROR'
): AppError {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.code = code
  error.isOperational = true
  return error
}

// 🚫 Erreurs courantes prédéfinies
export const errors = {
  notFound: (resource: string = 'Ressource') => 
    createError(`${resource} non trouvée`, 404, 'NOT_FOUND'),
    
  unauthorized: (message: string = 'Non autorisé') =>
    createError(message, 401, 'UNAUTHORIZED'),
    
  forbidden: (message: string = 'Accès interdit') =>
    createError(message, 403, 'FORBIDDEN'),
    
  badRequest: (message: string = 'Requête invalide') =>
    createError(message, 400, 'BAD_REQUEST'),
    
  conflict: (message: string = 'Conflit de données') =>
    createError(message, 409, 'CONFLICT'),
    
  tooManyRequests: (message: string = 'Trop de requêtes') =>
    createError(message, 429, 'TOO_MANY_REQUESTS')
}

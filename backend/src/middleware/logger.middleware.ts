// 📊 Middleware de Logging - La Manufacture de la Porte
import { Request, Response, NextFunction } from 'express'
import { logger } from '@utils/logger.utils'

// 📝 Middleware de logging des requêtes
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now()
  
  // Capturer la fin de la réponse
  const originalSend = res.send
  res.send = function(body) {
    const duration = Date.now() - startTime
    
    // Informations de la requête
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentLength: res.get('Content-Length') || body?.length || 0
    }

    // Log selon le niveau de status
    if (res.statusCode >= 500) {
      logger.error('Requête échouée', logData)
    } else if (res.statusCode >= 400) {
      logger.warn('Requête avec erreur client', logData)
    } else {
      logger.info('Requête réussie', logData)
    }

    return originalSend.call(this, body)
  }

  next()
}

// 🚦 Middleware de logging des erreurs de rate limiting
export function rateLimitLogger(req: Request, res: Response, next: NextFunction) {
  if (res.statusCode === 429) {
    logger.warn('Rate limit dépassé', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent')
    })
  }
  next()
}

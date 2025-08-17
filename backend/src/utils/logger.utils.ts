// 📊 Utilitaire de Logging - La Manufacture de la Porte
import winston from 'winston'
import { config } from '@config/env'

// 🎨 Format personnalisé pour les logs
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
)

// 🎯 Format pour la console (développement)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}] ${message}`
    
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`
    }
    
    return log
  })
)

// 📋 Configuration du logger
export const logger = winston.createLogger({
  level: config.logging.level,
  format: customFormat,
  defaultMeta: {
    service: 'manufacture-porte-api',
    version: '1.0.0'
  },
  transports: [
    // 📁 Fichier pour tous les logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // 📁 Fichier pour tous les niveaux
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // 🚨 Gestion des exceptions non capturées
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  
  // 🔄 Gestion des rejections de promesses
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
})

// 🖥️ Console pour le développement
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }))
}

// 📊 Méthodes utilitaires
export const logUtils = {
  // 🔐 Log de connexion utilisateur
  logUserLogin: (userId: number, email: string, ip?: string) => {
    logger.info('Connexion utilisateur', {
      userId,
      email,
      ip,
      timestamp: new Date().toISOString()
    })
  },

  // 🚪 Log de déconnexion utilisateur
  logUserLogout: (userId: number, email: string) => {
    logger.info('Déconnexion utilisateur', {
      userId,
      email,
      timestamp: new Date().toISOString()
    })
  },

  // ⚙️ Log de création de configuration
  logConfigCreated: (userId: number, configId: number, configName: string) => {
    logger.info('Configuration créée', {
      userId,
      configId,
      configName,
      timestamp: new Date().toISOString()
    })
  },

  // 🏢 Log de création de projet
  logProjectCreated: (partnerId: number, projectId: number, projectName: string) => {
    logger.info('Projet créé', {
      partnerId,
      projectId,
      projectName,
      timestamp: new Date().toISOString()
    })
  },

  // 🚨 Log d'erreur de sécurité
  logSecurityEvent: (event: string, details: any, ip?: string) => {
    logger.warn('Événement de sécurité', {
      event,
      details,
      ip,
      timestamp: new Date().toISOString()
    })
  }
}

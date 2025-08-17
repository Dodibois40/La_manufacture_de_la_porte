// 🚀 Point d'entrée principal - La Manufacture de la Porte Backend
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Import des routes
import { authRoutes } from '@routes/auth.routes'
import { configRoutes } from '@routes/config.routes'
import { projectRoutes } from '@routes/project.routes'

// Import des middlewares
import { errorHandler } from '@middleware/error.middleware'
import { requestLogger } from '@middleware/logger.middleware'

// Configuration
dotenv.config()

// Initialisation
const app = express()
const port = process.env.PORT || 3001
export const prisma = new PrismaClient()

// 🛡️ Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// 🌐 CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// 🚦 Rate Limiting Global
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(globalLimiter)

// 📝 Logging des requêtes
app.use(requestLogger)

// 📦 Parsing JSON (limite élevée pour les SVG)
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Vérification basique du JSON
    try {
      JSON.parse(buf.toString())
    } catch (e) {
      throw new Error('JSON invalide')
    }
  }
}))

app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 🏥 Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  })
})

// 📋 Routes API
app.use('/api/auth', authRoutes)
app.use('/api/configurations', configRoutes)
app.use('/api/projects', projectRoutes)

// 🎯 Route par défaut
app.get('/', (req, res) => {
  res.json({
    message: '🚪 La Manufacture de la Porte - API Backend',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  })
})

// 🚫 Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  })
})

// 🔥 Gestionnaire d'erreurs global
app.use(errorHandler)

// 🚀 Démarrage du serveur
async function startServer() {
  try {
    // Test de connexion à la base de données
    await prisma.$connect()
    console.log('✅ Connexion à la base de données réussie')

    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur le port ${port}`)
      console.log(`🌐 URL: http://localhost:${port}`)
      console.log(`🏥 Health check: http://localhost:${port}/health`)
      console.log(`📊 Environnement: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    console.error('❌ Erreur de démarrage:', error)
    process.exit(1)
  }
}

// 🔄 Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('🛑 Arrêt du serveur...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('🛑 Arrêt du serveur...')
  await prisma.$disconnect()
  process.exit(0)
})

// Démarrage
startServer()

export default app

// 🛣️ Routes d'Authentification - La Manufacture de la Porte
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { AuthController } from '@controllers/auth.controller'
import { authenticateToken } from '@middleware/auth.middleware'
import { logActivity } from '@middleware/auth.middleware'
import { config } from '@config/env'

const router = Router()

// 🚦 Rate limiting spécifique pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.security.rateLimitLoginMax, // 5 tentatives max
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// 📝 Inscription
router.post('/register', 
  authLimiter,
  logActivity('user_register'),
  AuthController.register
)

// 🔑 Connexion
router.post('/login',
  authLimiter,
  logActivity('user_login'),
  AuthController.login
)

// 🚪 Déconnexion (protégée)
router.post('/logout',
  authenticateToken,
  logActivity('user_logout'),
  AuthController.logout
)

// 👤 Profil utilisateur (protégé)
router.get('/profile',
  authenticateToken,
  AuthController.getProfile
)

// 📧 Mot de passe oublié
router.post('/forgot-password',
  authLimiter,
  logActivity('password_reset_request'),
  AuthController.forgotPassword
)

// 🔄 Réinitialisation mot de passe
router.post('/reset-password',
  authLimiter,
  logActivity('password_reset'),
  AuthController.resetPassword
)

// ✅ Vérification email
router.get('/verify-email/:token',
  logActivity('email_verification'),
  AuthController.verifyEmail
)

// 🏥 Health check pour l'auth
router.get('/health', (req, res) => {
  res.json({
    service: 'auth',
    status: 'OK',
    timestamp: new Date().toISOString()
  })
})

export { router as authRoutes }

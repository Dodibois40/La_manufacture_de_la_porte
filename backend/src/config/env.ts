// 🌍 Configuration Environnement - La Manufacture de la Porte
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

// 🔍 Validation des variables obligatoires
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Variable d'environnement manquante: ${envVar}`)
  }
}

// 📋 Configuration exportée
export const config = {
  // 🔧 Application
  app: {
    port: parseInt(process.env.PORT || '3001'),
    env: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  },

  // 🗄️ Base de données
  database: {
    url: process.env.DATABASE_URL!
  },

  // 🔐 JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // 🛡️ Sécurité
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    rateLimitLoginMax: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '5')
  },

  // 📧 Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'noreply@manufacture-porte.com'
  },

  // 📊 Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  }
}

// 🔍 Validation de la configuration
export function validateConfig() {
  const errors: string[] = []

  // Vérifier le secret JWT (minimum 32 caractères)
  if (config.jwt.secret.length < 32) {
    errors.push('JWT_SECRET doit faire au moins 32 caractères')
  }

  // Vérifier l'URL de la base de données
  if (!config.database.url.startsWith('postgresql://')) {
    errors.push('DATABASE_URL doit être une URL PostgreSQL valide')
  }

  // Vérifier le port
  if (isNaN(config.app.port) || config.app.port < 1 || config.app.port > 65535) {
    errors.push('PORT doit être un nombre entre 1 et 65535')
  }

  if (errors.length > 0) {
    throw new Error(`❌ Erreurs de configuration:\n${errors.join('\n')}`)
  }

  console.log('✅ Configuration validée avec succès')
}

// 📊 Affichage de la configuration (sans secrets)
export function logConfig() {
  console.log('📋 Configuration de l\'application:')
  console.log(`   🔧 Port: ${config.app.port}`)
  console.log(`   🌍 Environnement: ${config.app.env}`)
  console.log(`   🌐 Frontend URL: ${config.app.frontendUrl}`)
  console.log(`   🗄️ Base de données: ${config.database.url.split('@')[1] || 'configurée'}`)
  console.log(`   🔐 JWT expire dans: ${config.jwt.expiresIn}`)
  console.log(`   📧 Email configuré: ${config.email.user ? 'Oui' : 'Non'}`)
}

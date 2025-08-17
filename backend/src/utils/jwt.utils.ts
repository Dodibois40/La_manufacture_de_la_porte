// 🎟️ Utilitaires JWT - La Manufacture de la Porte
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { config } from '@config/env'
import { prisma } from '@config/database'
import { UserPayload } from '@types/index'

// 🔐 Génération de token JWT
export async function generateTokens(user: { id: number; email: string; role: string }) {
  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role as any
  }

  // Token principal
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'manufacture-porte-api',
    audience: 'manufacture-porte-frontend'
  })

  // Token de rafraîchissement
  const refreshToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'manufacture-porte-api',
    audience: 'manufacture-porte-frontend'
  })

  return { accessToken, refreshToken }
}

// 💾 Sauvegarder une session en base
export async function saveSession(
  userId: number,
  token: string,
  ipAddress?: string,
  userAgent?: string
) {
  // Hash du token pour la sécurité
  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  // Calculer la date d'expiration
  const decoded = jwt.decode(token) as any
  const expiresAt = new Date(decoded.exp * 1000)

  // Sauvegarder en base
  const session = await prisma.userSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      ipAddress,
      userAgent
    }
  })

  return session
}

// 🗑️ Supprimer une session
export async function removeSession(token: string) {
  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  await prisma.userSession.deleteMany({
    where: { tokenHash }
  })
}

// 🧹 Nettoyer les sessions expirées d'un utilisateur
export async function cleanupUserSessions(userId: number) {
  const result = await prisma.userSession.deleteMany({
    where: {
      userId,
      expiresAt: {
        lt: new Date()
      }
    }
  })

  return result.count
}

// 🔍 Vérifier la validité d'un token
export function verifyToken(token: string): UserPayload {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expiré')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token invalide')
    } else {
      throw new Error('Erreur de vérification du token')
    }
  }
}

// 🔄 Rafraîchir un token
export async function refreshToken(oldToken: string, ipAddress?: string, userAgent?: string) {
  try {
    // Vérifier l'ancien token (même s'il est expiré)
    const decoded = jwt.verify(oldToken, config.jwt.secret, { ignoreExpiration: true }) as UserPayload
    
    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      throw new Error('Utilisateur non valide')
    }

    // Supprimer l'ancienne session
    await removeSession(oldToken)

    // Générer nouveaux tokens
    const tokens = await generateTokens(user)
    
    // Sauvegarder la nouvelle session
    await saveSession(user.id, tokens.accessToken, ipAddress, userAgent)

    return tokens
  } catch (error) {
    throw new Error('Impossible de rafraîchir le token')
  }
}

// 🔐 Extraire le token depuis l'header Authorization
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.split(' ')[1]
}

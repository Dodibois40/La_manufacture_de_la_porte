// 🔐 Service d'Authentification - La Manufacture de la Porte
import { prisma } from '@config/database'
import { hashPassword, verifyPassword, generateSecureToken } from '@utils/password.utils'
import { generateTokens, saveSession, removeSession } from '@utils/jwt.utils'
import { logUtils } from '@utils/logger.utils'
import { errors } from '@middleware/error.middleware'
import { RegisterRequest, LoginRequest, AuthResponse } from '@types/index'

export class AuthService {
  // 📝 Inscription d'un nouvel utilisateur
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const { email, password, displayName, role = 'CLIENT', company, phone } = data

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      throw errors.conflict('Un compte avec cet email existe déjà')
    }

    // Hacher le mot de passe
    const passwordHash = await hashPassword(password)

    // Générer un token de vérification email
    const verificationToken = generateSecureToken()

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        displayName,
        role: role as any,
        company: company || null,
        phone: phone || null,
        verificationToken
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        company: true
      }
    })

    // Générer les tokens JWT
    const tokens = await generateTokens(user)

    // Log de l'inscription
    logUtils.logUserLogin(user.id, user.email)

    return {
      user,
      token: tokens.accessToken,
      expiresIn: '24h'
    }
  }

  // 🔑 Connexion d'un utilisateur
  static async login(
    data: LoginRequest, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<AuthResponse> {
    const { email, password } = data

    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        displayName: true,
        role: true,
        company: true,
        isActive: true,
        emailVerified: true
      }
    })

    if (!user) {
      throw errors.unauthorized('Email ou mot de passe incorrect')
    }

    // Vérifier que le compte est actif
    if (!user.isActive) {
      throw errors.forbidden('Compte désactivé')
    }

    // Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      throw errors.unauthorized('Email ou mot de passe incorrect')
    }

    // Générer les tokens
    const tokens = await generateTokens(user)

    // Sauvegarder la session
    await saveSession(user.id, tokens.accessToken, ipAddress, userAgent)

    // Mettre à jour la date de dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Log de la connexion
    logUtils.logUserLogin(user.id, user.email, ipAddress)

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        company: user.company
      },
      token: tokens.accessToken,
      expiresIn: '24h'
    }
  }

  // 🚪 Déconnexion d'un utilisateur
  static async logout(token?: string): Promise<void> {
    if (!token) {
      throw errors.badRequest('Token manquant')
    }

    // Supprimer la session
    await removeSession(token)

    // Log de la déconnexion
    try {
      const decoded = require('jsonwebtoken').decode(token) as any
      if (decoded?.id) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { email: true }
        })
        if (user) {
          logUtils.logUserLogout(decoded.id, user.email)
        }
      }
    } catch (error) {
      // Ignorer les erreurs de décodage pour la déconnexion
    }
  }

  // 📧 Demande de réinitialisation de mot de passe
  static async requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return
    }

    // Générer un token de réinitialisation
    const resetToken = generateSecureToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

    // Sauvegarder le token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt
      }
    })

    // TODO: Envoyer l'email de réinitialisation
    // await EmailService.sendPasswordReset(user.email, resetToken)

    logUtils.logSecurityEvent('password_reset_requested', { userId: user.id })
  }

  // 🔄 Réinitialisation de mot de passe
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    // Chercher le token de réinitialisation
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    })

    if (!resetToken) {
      throw errors.badRequest('Token de réinitialisation invalide ou expiré')
    }

    // Hacher le nouveau mot de passe
    const passwordHash = await hashPassword(newPassword)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    })

    // Marquer le token comme utilisé
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    })

    // Supprimer toutes les sessions actives de l'utilisateur
    await prisma.userSession.deleteMany({
      where: { userId: resetToken.userId }
    })

    logUtils.logSecurityEvent('password_reset_completed', { 
      userId: resetToken.userId 
    })
  }

  // ✅ Vérification d'email
  static async verifyEmail(token: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    })

    if (!user) {
      throw errors.badRequest('Token de vérification invalide')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    })

    logUtils.logSecurityEvent('email_verified', { userId: user.id })
  }
}

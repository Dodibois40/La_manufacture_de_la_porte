// 🔒 Utilitaires de Mot de Passe - La Manufacture de la Porte
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { config } from '@config/env'

// 🔐 Hacher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(config.security.bcryptRounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (error) {
    throw new Error('Erreur lors du hachage du mot de passe')
  }
}

// ✅ Vérifier un mot de passe
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    throw new Error('Erreur lors de la vérification du mot de passe')
  }
}

// 🎲 Générer un token aléatoire sécurisé
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

// 🔍 Validation de la force du mot de passe
export interface PasswordStrength {
  isValid: boolean
  score: number // 0-4
  errors: string[]
  suggestions: string[]
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const errors: string[] = []
  const suggestions: string[] = []
  let score = 0

  // Longueur minimum
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères')
  } else {
    score += 1
  }

  // Caractères minuscules
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule')
    suggestions.push('Ajoutez des lettres minuscules')
  } else {
    score += 1
  }

  // Caractères majuscules
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule')
    suggestions.push('Ajoutez des lettres majuscules')
  } else {
    score += 1
  }

  // Chiffres
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre')
    suggestions.push('Ajoutez des chiffres')
  } else {
    score += 1
  }

  // Caractères spéciaux
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial')
    suggestions.push('Ajoutez des caractères spéciaux (!@#$%^&*)')
  } else {
    score += 1
  }

  // Longueur optimale
  if (password.length >= 12) {
    score += 1
  } else {
    suggestions.push('Utilisez au moins 12 caractères pour plus de sécurité')
  }

  // Mots de passe courants
  const commonPasswords = [
    'password', '123456', 'qwerty', 'azerty', 'admin', 'root',
    'password123', '123456789', 'motdepasse'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Ce mot de passe est trop courant')
    suggestions.push('Évitez les mots de passe courants')
    score = Math.max(0, score - 2)
  }

  // Répétitions
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Évitez les répétitions de caractères')
    suggestions.push('Variez les caractères')
    score = Math.max(0, score - 1)
  }

  return {
    isValid: errors.length === 0 && score >= 4,
    score: Math.min(5, score),
    errors,
    suggestions
  }
}

// 🎯 Générer un mot de passe temporaire
export function generateTemporaryPassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'
  
  const allChars = lowercase + uppercase + numbers + symbols
  
  let password = ''
  
  // Garantir au moins un caractère de chaque type
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Compléter avec des caractères aléatoires
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Mélanger les caractères
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

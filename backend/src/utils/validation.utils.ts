// ✅ Utilitaires de Validation - La Manufacture de la Porte
import Joi from 'joi'
import { UserRole } from '@prisma/client'

// 🔐 Schéma de validation pour l'inscription
export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'L\'email est obligatoire'
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.max': 'Le mot de passe ne peut pas dépasser 128 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial',
      'any.required': 'Le mot de passe est obligatoire'
    }),

  displayName: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'string.pattern.base': 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes',
      'any.required': 'Le nom est obligatoire'
    }),

  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default('CLIENT')
    .messages({
      'any.only': 'Rôle invalide'
    }),

  company: Joi.string()
    .min(2)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Le nom de l\'entreprise doit contenir au moins 2 caractères',
      'string.max': 'Le nom de l\'entreprise ne peut pas dépasser 200 caractères'
    }),

  phone: Joi.string()
    .pattern(/^(?:\+33|0)[1-9](?:[0-9]{8})$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Format de téléphone français invalide'
    })
})

// 🔑 Schéma de validation pour la connexion
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'L\'email est obligatoire'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Le mot de passe est obligatoire'
    })
})

// ⚙️ Schéma de validation pour les configurations
export const configurationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 3 caractères',
      'string.max': 'Le nom ne peut pas dépasser 200 caractères',
      'any.required': 'Le nom est obligatoire'
    }),

  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La description ne peut pas dépasser 1000 caractères'
    }),

  svgOriginal: Joi.string()
    .optional()
    .allow(''),

  svgModified: Joi.string()
    .required()
    .messages({
      'any.required': 'Le SVG modifié est obligatoire'
    }),

  parameters: Joi.object({
    OUVERTURE_L: Joi.string().optional(),
    PORTE_L: Joi.string().optional(),
    PASSAGE_L: Joi.string().optional(),
    CLOISON_E: Joi.string().optional(),
    COUVRE_JOINT_L: Joi.string().optional(),
    COUVRE_JOINT_E: Joi.string().optional(),
    CADRE_E: Joi.string().optional()
  }).unknown(true) // Permettre d'autres paramètres
    .required()
    .messages({
      'any.required': 'Les paramètres sont obligatoires'
    }),

  tags: Joi.array()
    .items(Joi.string().max(50))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Maximum 10 tags autorisés',
      'string.max': 'Chaque tag ne peut pas dépasser 50 caractères'
    })
})

// 🏢 Schéma de validation pour les projets
export const projectSchema = Joi.object({
  clientName: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Le nom du client doit contenir au moins 2 caractères',
      'string.max': 'Le nom du client ne peut pas dépasser 200 caractères',
      'any.required': 'Le nom du client est obligatoire'
    }),

  clientEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .allow('')
    .messages({
      'string.email': 'Format d\'email invalide'
    }),

  clientPhone: Joi.string()
    .pattern(/^(?:\+33|0)[1-9](?:[0-9]{8})$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Format de téléphone français invalide'
    }),

  clientAddress: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'L\'adresse ne peut pas dépasser 500 caractères'
    }),

  projectName: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Le nom du projet doit contenir au moins 3 caractères',
      'string.max': 'Le nom du projet ne peut pas dépasser 200 caractères',
      'any.required': 'Le nom du projet est obligatoire'
    }),

  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La description ne peut pas dépasser 1000 caractères'
    })
})

// 📧 Schéma de validation pour reset password
export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'L\'email est obligatoire'
    })
})

export const newPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Le token est obligatoire'
    }),

  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.max': 'Le mot de passe ne peut pas dépasser 128 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial',
      'any.required': 'Le nouveau mot de passe est obligatoire'
    })
})

// 🔍 Validation d'ID numérique
export const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'L\'ID doit être un nombre',
      'number.integer': 'L\'ID doit être un nombre entier',
      'number.positive': 'L\'ID doit être positif',
      'any.required': 'L\'ID est obligatoire'
    })
})

// 📄 Validation de pagination
export const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'La page doit être un nombre',
      'number.integer': 'La page doit être un nombre entier',
      'number.min': 'La page doit être supérieure à 0'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'La limite doit être un nombre',
      'number.integer': 'La limite doit être un nombre entier',
      'number.min': 'La limite doit être supérieure à 0',
      'number.max': 'La limite ne peut pas dépasser 100'
    }),

  search: Joi.string()
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La recherche ne peut pas dépasser 200 caractères'
    }),

  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'name')
    .default('createdAt')
    .messages({
      'any.only': 'Tri invalide'
    }),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Ordre de tri invalide'
    })
})

// 🛡️ Sanitisation des données
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprimer les balises HTML basiques
    .substring(0, 1000) // Limiter la longueur
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

// 📊 Validation des paramètres de cotation
export const cotationParametersSchema = Joi.object({
  OUVERTURE_L: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
  PORTE_L: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
  PASSAGE_L: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
  CLOISON_E: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
  COUVRE_JOINT_L: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
  COUVRE_JOINT_E: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
  CADRE_E: Joi.string().pattern(/^\d+(\.\d+)?$/).optional()
}).unknown(true).messages({
  'string.pattern.base': 'Les valeurs de cotation doivent être numériques'
})

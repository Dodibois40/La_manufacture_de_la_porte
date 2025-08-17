// ⚙️ Service de Configurations - La Manufacture de la Porte
import { prisma } from '@config/database'
import { errors } from '@middleware/error.middleware'
import { logUtils } from '@utils/logger.utils'
import { generateSecureToken } from '@utils/password.utils'
import { 
  ConfigurationRequest, 
  ConfigurationResponse, 
  PaginatedResponse,
  SearchFilters 
} from '@types/index'

export class ConfigService {
  // 📋 Récupérer les configurations d'un utilisateur avec pagination
  static async getUserConfigurations(
    userId: number, 
    filters: SearchFilters
  ): Promise<PaginatedResponse<ConfigurationResponse>> {
    const { page = 1, limit = 10, search, tags, sortBy = 'createdAt', sortOrder = 'desc' } = filters

    // Construire les conditions de recherche
    const where: any = { userId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags }
    }

    // Compter le total
    const total = await prisma.configuration.count({ where })

    // Récupérer les configurations
    const configurations = await prisma.configuration.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        parameters: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        isPublic: true,
        isTemplate: true
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    })

    const totalPages = Math.ceil(total / limit)

    return {
      data: configurations,
      total,
      page,
      limit,
      totalPages
    }
  }

  // 📄 Récupérer une configuration par ID
  static async getConfigurationById(id: number, userId: number) {
    const configuration = await prisma.configuration.findFirst({
      where: { 
        id, 
        OR: [
          { userId }, // Propriétaire
          { isPublic: true } // Ou publique
        ]
      },
      include: {
        user: {
          select: {
            displayName: true,
            company: true
          }
        }
      }
    })

    if (!configuration) {
      throw errors.notFound('Configuration non trouvée')
    }

    return configuration
  }

  // ✨ Créer une nouvelle configuration
  static async createConfiguration(userId: number, data: ConfigurationRequest) {
    const configuration = await prisma.configuration.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        svgOriginal: data.svgOriginal,
        svgModified: data.svgModified,
        parameters: data.parameters,
        tags: data.tags || []
      },
      include: {
        user: {
          select: {
            displayName: true
          }
        }
      }
    })

    // Log de création
    logUtils.logConfigCreated(userId, configuration.id, configuration.name)

    return configuration
  }

  // 📝 Mettre à jour une configuration
  static async updateConfiguration(id: number, userId: number, data: Partial<ConfigurationRequest>) {
    // Vérifier que la configuration existe et appartient à l'utilisateur
    const existing = await prisma.configuration.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      throw errors.notFound('Configuration non trouvée')
    }

    // Mettre à jour
    const configuration = await prisma.configuration.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.svgOriginal && { svgOriginal: data.svgOriginal }),
        ...(data.svgModified && { svgModified: data.svgModified }),
        ...(data.parameters && { parameters: data.parameters }),
        ...(data.tags && { tags: data.tags }),
        updatedAt: new Date()
      }
    })

    return configuration
  }

  // 🗑️ Supprimer une configuration
  static async deleteConfiguration(id: number, userId: number) {
    // Vérifier que la configuration existe et appartient à l'utilisateur
    const existing = await prisma.configuration.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      throw errors.notFound('Configuration non trouvée')
    }

    // Supprimer
    await prisma.configuration.delete({
      where: { id }
    })
  }

  // 📤 Dupliquer une configuration
  static async duplicateConfiguration(id: number, userId: number) {
    // Récupérer la configuration originale
    const original = await prisma.configuration.findFirst({
      where: { 
        id,
        OR: [
          { userId }, // Propriétaire
          { isPublic: true } // Ou publique
        ]
      }
    })

    if (!original) {
      throw errors.notFound('Configuration non trouvée')
    }

    // Créer la copie
    const duplicate = await prisma.configuration.create({
      data: {
        userId,
        name: `${original.name} (Copie)`,
        description: original.description,
        svgOriginal: original.svgOriginal,
        svgModified: original.svgModified,
        parameters: original.parameters,
        tags: original.tags,
        isPublic: false,
        isTemplate: false
      }
    })

    return duplicate
  }

  // 🔗 Générer un lien de partage temporaire
  static async generateShareLink(id: number, userId: number) {
    // Vérifier que la configuration existe et appartient à l'utilisateur
    const configuration = await prisma.configuration.findFirst({
      where: { id, userId }
    })

    if (!configuration) {
      throw errors.notFound('Configuration non trouvée')
    }

    // Générer un token de partage sécurisé
    const shareToken = generateSecureToken(48)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours

    // TODO: Sauvegarder le token de partage en base (nouvelle table)
    // Pour l'instant, on retourne juste le token
    
    return {
      shareUrl: `${process.env.FRONTEND_URL}/shared/${shareToken}`,
      token: shareToken,
      expiresAt
    }
  }

  // 🌐 Récupérer une configuration partagée
  static async getSharedConfiguration(token: string) {
    // TODO: Vérifier le token de partage en base
    // Pour l'instant, retourner une erreur
    throw errors.notFound('Fonctionnalité de partage en cours de développement')
  }

  // 📊 Statistiques des configurations d'un utilisateur
  static async getUserStats(userId: number) {
    const stats = await prisma.configuration.groupBy({
      by: ['isPublic', 'isTemplate'],
      where: { userId },
      _count: true
    })

    const totalConfigs = await prisma.configuration.count({ where: { userId } })
    const recentConfigs = await prisma.configuration.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
        }
      }
    })

    return {
      total: totalConfigs,
      recent: recentConfigs,
      public: stats.find(s => s.isPublic)?._count || 0,
      templates: stats.find(s => s.isTemplate)?._count || 0
    }
  }
}

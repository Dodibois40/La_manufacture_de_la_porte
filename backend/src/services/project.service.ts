// 🏢 Service de Projets - La Manufacture de la Porte
import { prisma } from '@config/database'
import { errors } from '@middleware/error.middleware'
import { logUtils } from '@utils/logger.utils'
import { ProjectRequest, PaginatedResponse, ProjectFilters } from '@types/index'
import { ProjectStatus } from '@prisma/client'

export class ProjectService {
  // 📋 Récupérer les projets d'un partenaire
  static async getPartnerProjects(
    partnerId: number,
    filters: ProjectFilters
  ): Promise<PaginatedResponse<any>> {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      clientName, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = filters

    // Construire les conditions de recherche
    const where: any = { partnerId }

    if (status) {
      where.status = status
    }

    if (clientName) {
      where.clientName = { contains: clientName, mode: 'insensitive' }
    }

    // Compter le total
    const total = await prisma.project.count({ where })

    // Récupérer les projets avec leurs configurations
    const projects = await prisma.project.findMany({
      where,
      include: {
        configurations: {
          include: {
            configuration: {
              select: {
                id: true,
                name: true,
                parameters: true
              }
            }
          }
        },
        _count: {
          select: {
            configurations: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    })

    const totalPages = Math.ceil(total / limit)

    return {
      data: projects,
      total,
      page,
      limit,
      totalPages
    }
  }

  // 📄 Récupérer un projet par ID
  static async getProjectById(id: number, partnerId: number) {
    const project = await prisma.project.findFirst({
      where: { id, partnerId },
      include: {
        configurations: {
          include: {
            configuration: true
          }
        },
        partner: {
          select: {
            displayName: true,
            company: true,
            email: true
          }
        }
      }
    })

    if (!project) {
      throw errors.notFound('Projet non trouvé')
    }

    return project
  }

  // ✨ Créer un nouveau projet
  static async createProject(partnerId: number, data: ProjectRequest) {
    const project = await prisma.project.create({
      data: {
        partnerId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
        projectName: data.projectName,
        description: data.description
      },
      include: {
        partner: {
          select: {
            displayName: true,
            company: true
          }
        }
      }
    })

    // Log de création
    logUtils.logProjectCreated(partnerId, project.id, project.projectName)

    return project
  }

  // 📝 Mettre à jour un projet
  static async updateProject(id: number, partnerId: number, data: any) {
    // Vérifier que le projet existe et appartient au partenaire
    const existing = await prisma.project.findFirst({
      where: { id, partnerId }
    })

    if (!existing) {
      throw errors.notFound('Projet non trouvé')
    }

    // Mettre à jour
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(data.clientName && { clientName: data.clientName }),
        ...(data.clientEmail !== undefined && { clientEmail: data.clientEmail }),
        ...(data.clientPhone !== undefined && { clientPhone: data.clientPhone }),
        ...(data.clientAddress !== undefined && { clientAddress: data.clientAddress }),
        ...(data.projectName && { projectName: data.projectName }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.quotedPrice !== undefined && { quotedPrice: data.quotedPrice }),
        ...(data.finalPrice !== undefined && { finalPrice: data.finalPrice }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.deadline && { deadline: new Date(data.deadline) }),
        updatedAt: new Date()
      }
    })

    return project
  }

  // 🗑️ Supprimer un projet
  static async deleteProject(id: number, partnerId: number) {
    const existing = await prisma.project.findFirst({
      where: { id, partnerId }
    })

    if (!existing) {
      throw errors.notFound('Projet non trouvé')
    }

    await prisma.project.delete({
      where: { id }
    })
  }

  // ⚙️ Ajouter une configuration à un projet
  static async addConfigurationToProject(
    projectId: number,
    configurationId: number,
    partnerId: number,
    options: { quantity?: number; unitPrice?: number }
  ) {
    // Vérifier que le projet appartient au partenaire
    const project = await prisma.project.findFirst({
      where: { id: projectId, partnerId }
    })

    if (!project) {
      throw errors.notFound('Projet non trouvé')
    }

    // Vérifier que la configuration existe et est accessible
    const configuration = await prisma.configuration.findFirst({
      where: {
        id: configurationId,
        OR: [
          { userId: partnerId }, // Configuration du partenaire
          { isPublic: true },    // Ou configuration publique
          { isTemplate: true }   // Ou template
        ]
      }
    })

    if (!configuration) {
      throw errors.notFound('Configuration non trouvée ou non accessible')
    }

    // Vérifier que la configuration n'est pas déjà dans le projet
    const existing = await prisma.projectConfiguration.findFirst({
      where: { projectId, configurationId }
    })

    if (existing) {
      throw errors.conflict('Cette configuration est déjà dans le projet')
    }

    // Ajouter la configuration au projet
    const projectConfig = await prisma.projectConfiguration.create({
      data: {
        projectId,
        configurationId,
        quantity: options.quantity || 1,
        unitPrice: options.unitPrice
      },
      include: {
        configuration: {
          select: {
            name: true,
            parameters: true
          }
        }
      }
    })

    return projectConfig
  }

  // 🗑️ Retirer une configuration d'un projet
  static async removeConfigurationFromProject(
    projectId: number,
    configurationId: number,
    partnerId: number
  ) {
    // Vérifier que le projet appartient au partenaire
    const project = await prisma.project.findFirst({
      where: { id: projectId, partnerId }
    })

    if (!project) {
      throw errors.notFound('Projet non trouvé')
    }

    // Supprimer la relation
    const result = await prisma.projectConfiguration.deleteMany({
      where: { projectId, configurationId }
    })

    if (result.count === 0) {
      throw errors.notFound('Configuration non trouvée dans ce projet')
    }
  }

  // 💰 Générer un devis pour un projet
  static async generateQuote(projectId: number, partnerId: number) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, partnerId },
      include: {
        configurations: {
          include: {
            configuration: {
              select: {
                name: true,
                parameters: true
              }
            }
          }
        }
      }
    })

    if (!project) {
      throw errors.notFound('Projet non trouvé')
    }

    // Calculer le prix total
    let totalPrice = 0
    const items = project.configurations.map(pc => {
      const itemTotal = (pc.unitPrice || 0) * pc.quantity
      totalPrice += Number(itemTotal)
      
      return {
        configurationName: pc.configuration.name,
        quantity: pc.quantity,
        unitPrice: pc.unitPrice,
        totalPrice: itemTotal,
        parameters: pc.configuration.parameters
      }
    })

    const quote = {
      project: {
        id: project.id,
        name: project.projectName,
        client: project.clientName,
        description: project.description
      },
      items,
      totalPrice,
      generatedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
    }

    // Mettre à jour le prix du projet
    await prisma.project.update({
      where: { id: projectId },
      data: { quotedPrice: totalPrice }
    })

    return quote
  }

  // 📊 Statistiques du partenaire
  static async getPartnerStats(partnerId: number) {
    const stats = await prisma.project.groupBy({
      by: ['status'],
      where: { partnerId },
      _count: true,
      _sum: {
        quotedPrice: true,
        finalPrice: true
      }
    })

    const totalProjects = await prisma.project.count({ where: { partnerId } })
    const recentProjects = await prisma.project.count({
      where: {
        partnerId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })

    return {
      total: totalProjects,
      recent: recentProjects,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count
        return acc
      }, {} as Record<string, number>),
      totalQuoted: stats.reduce((sum, stat) => sum + Number(stat._sum.quotedPrice || 0), 0),
      totalCompleted: stats.reduce((sum, stat) => sum + Number(stat._sum.finalPrice || 0), 0)
    }
  }
}

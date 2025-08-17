// 🗄️ Configuration Base de Données - La Manufacture de la Porte
import { PrismaClient } from '@prisma/client'

// Instance Prisma globale
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  errorFormat: 'pretty'
})

// 🔄 Connexion à la base de données
export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Connexion PostgreSQL établie')
    
    // Test de la connexion
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Test de requête réussi')
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error)
    throw error
  }
}

// 🔌 Déconnexion propre
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    console.log('✅ Déconnexion PostgreSQL propre')
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error)
  }
}

// 🧹 Nettoyage des sessions expirées (à exécuter périodiquement)
export async function cleanupExpiredSessions() {
  try {
    const result = await prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    
    if (result.count > 0) {
      console.log(`🧹 ${result.count} sessions expirées supprimées`)
    }
    
    return result.count
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des sessions:', error)
    return 0
  }
}

// 📊 Statistiques de la base de données
export async function getDatabaseStats() {
  try {
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.configuration.count(),
      prisma.project.count(),
      prisma.userSession.count(),
      prisma.activityLog.count()
    ])

    return {
      users: stats[0],
      configurations: stats[1],
      projects: stats[2],
      activeSessions: stats[3],
      activityLogs: stats[4]
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats:', error)
    return null
  }
}

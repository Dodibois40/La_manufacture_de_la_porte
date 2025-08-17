// 🌱 Données de Test - La Manufacture de la Porte
import { PrismaClient, UserRole } from '@prisma/client'
import { hashPassword } from '../src/utils/password.utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // 🧹 Nettoyer les données existantes (optionnel)
  await prisma.activityLog.deleteMany()
  await prisma.projectConfiguration.deleteMany()
  await prisma.project.deleteMany()
  await prisma.configuration.deleteMany()
  await prisma.userSession.deleteMany()
  await prisma.user.deleteMany()

  // 👤 Créer des utilisateurs de test
  const adminPassword = await hashPassword('Admin123!')
  const clientPassword = await hashPassword('Client123!')
  const partnerPassword = await hashPassword('Partner123!')

  const admin = await prisma.user.create({
    data: {
      email: 'admin@manufacture-porte.com',
      passwordHash: adminPassword,
      displayName: 'Administrateur',
      role: UserRole.ADMIN,
      emailVerified: true,
      isActive: true
    }
  })

  const client = await prisma.user.create({
    data: {
      email: 'client@test.com',
      passwordHash: clientPassword,
      displayName: 'Jean Dupont',
      role: UserRole.CLIENT,
      phone: '0123456789',
      address: '123 Rue de la Paix, 64000 Pau',
      emailVerified: true,
      isActive: true
    }
  })

  const partner = await prisma.user.create({
    data: {
      email: 'partenaire@test.com',
      passwordHash: partnerPassword,
      displayName: 'Marie Martin',
      role: UserRole.PARTNER,
      company: 'Menuiserie Martin SARL',
      phone: '0987654321',
      address: '456 Avenue du Bois, 64100 Bayonne',
      emailVerified: true,
      isActive: true
    }
  })

  console.log('✅ Utilisateurs créés:', { admin: admin.id, client: client.id, partner: partner.id })

  // ⚙️ Créer des configurations de test
  const config1 = await prisma.configuration.create({
    data: {
      userId: client.id,
      name: 'Porte Salon Standard',
      description: 'Configuration standard pour porte de salon',
      parameters: {
        OUVERTURE_L: '902',
        PORTE_L: '816',
        PASSAGE_L: '790',
        CLOISON_E: '74',
        COUVRE_JOINT_L: '70',
        COUVRE_JOINT_E: '20',
        CADRE_E: '114'
      },
      tags: ['salon', 'standard'],
      svgModified: '<svg><!-- SVG de test --></svg>'
    }
  })

  const config2 = await prisma.configuration.create({
    data: {
      userId: partner.id,
      name: 'Porte Chambre Premium',
      description: 'Configuration premium pour porte de chambre',
      parameters: {
        OUVERTURE_L: '832',
        PORTE_L: '746',
        PASSAGE_L: '720',
        CLOISON_E: '100',
        COUVRE_JOINT_L: '80',
        COUVRE_JOINT_E: '25',
        CADRE_E: '150'
      },
      tags: ['chambre', 'premium'],
      isTemplate: true,
      svgModified: '<svg><!-- SVG de test premium --></svg>'
    }
  })

  console.log('✅ Configurations créées:', { config1: config1.id, config2: config2.id })

  // 🏢 Créer un projet de test
  const project = await prisma.project.create({
    data: {
      partnerId: partner.id,
      clientName: 'Pierre Durand',
      clientEmail: 'pierre.durand@email.com',
      clientPhone: '0147258369',
      projectName: 'Rénovation Maison Durand',
      description: 'Remplacement de 3 portes intérieures',
      status: 'DRAFT'
    }
  })

  // Ajouter des configurations au projet
  await prisma.projectConfiguration.create({
    data: {
      projectId: project.id,
      configurationId: config1.id,
      quantity: 2,
      unitPrice: 450.00
    }
  })

  await prisma.projectConfiguration.create({
    data: {
      projectId: project.id,
      configurationId: config2.id,
      quantity: 1,
      unitPrice: 650.00
    }
  })

  console.log('✅ Projet créé:', project.id)

  // 📊 Créer quelques logs d'activité
  await prisma.activityLog.createMany({
    data: [
      {
        userId: client.id,
        action: 'user_login',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Browser'
      },
      {
        userId: client.id,
        action: 'create_configuration',
        resourceType: 'configuration',
        resourceId: config1.id,
        details: { configName: config1.name }
      },
      {
        userId: partner.id,
        action: 'create_project',
        resourceType: 'project',
        resourceId: project.id,
        details: { projectName: project.projectName }
      }
    ]
  })

  console.log('✅ Logs d\'activité créés')

  console.log('🎉 Seeding terminé avec succès!')
  console.log('')
  console.log('👤 Comptes de test créés:')
  console.log('   Admin: admin@manufacture-porte.com / Admin123!')
  console.log('   Client: client@test.com / Client123!')
  console.log('   Partenaire: partenaire@test.com / Partner123!')
  console.log('')
  console.log('🚀 Vous pouvez maintenant tester l\'API!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

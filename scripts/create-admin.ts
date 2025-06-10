import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const admin = await prisma.user.create({
      data: {
        name: 'admin',
        role: 'ADMIN',
        icon: '👑'
      }
    })
    console.log('Admin créé avec succès:', admin)
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

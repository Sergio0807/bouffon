import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

try {
  const updated = await prisma.user.updateMany({
    where: {
      name: 'admin'
    },
    data: {
      role: 'ADMIN'
    }
  })
  console.log('Utilisateur admin mis à jour')
} catch (error) {
  console.error('Erreur:', error)
} finally {
  await prisma.$disconnect()
}

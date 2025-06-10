import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const updated = await prisma.$executeRaw`UPDATE User SET role = 'ADMIN' WHERE name = 'admin';`
  console.log('Utilisateur admin mis à jour')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

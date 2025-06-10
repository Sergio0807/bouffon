import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const groups = await prisma.group.findMany()
  console.log('Groupes trouvés:', groups)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

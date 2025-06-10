import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Trouver l'utilisateur admin
    const admin = await prisma.user.findFirst({
      where: {
        name: 'admin'
      }
    });

    if (!admin) {
      console.error('Utilisateur admin non trouvé');
      return;
    }

    // Mettre à jour son rôle
    const updatedAdmin = await prisma.user.update({
      where: {
        id: admin.id
      },
      data: {
        role: 'ADMIN'
      }
    });

    console.log('Admin mis à jour avec succès:', updatedAdmin);
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

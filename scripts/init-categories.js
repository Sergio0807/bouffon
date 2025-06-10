const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'Fruits et Légumes', icon: '🥬' },
  { name: 'Viandes et Poissons', icon: '🥩' },
  { name: 'Produits Laitiers', icon: '🧀' },
  { name: 'Boissons', icon: '🥤' },
  { name: 'Épicerie Sucrée', icon: '🍪' },
  { name: 'Épicerie Salée', icon: '🥨' },
  { name: 'Surgelés', icon: '🧊' },
  { name: 'Hygiène et Beauté', icon: '🧴' },
  { name: 'Entretien', icon: '🧹' },
  { name: 'Autres', icon: '📦' }
];

async function main() {
  console.log('Début de l\'initialisation des catégories...');

  for (const category of categories) {
    try {
      await prisma.category.upsert({
        where: { name: category.name },
        update: { icon: category.icon },
        create: {
          name: category.name,
          icon: category.icon
        }
      });
      console.log(`Catégorie "${category.name}" ${category.icon} créée/mise à jour avec succès`);
    } catch (error) {
      console.error(`Erreur lors de la création/mise à jour de la catégorie "${category.name}":`, error);
    }
  }

  console.log('Initialisation des catégories terminée !');
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

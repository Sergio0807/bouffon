import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Fruits et Légumes', icon: '🥦' },     // Carotte
  { name: 'Viandes et Poissons', icon: '🥩' },    // Steak
  { name: 'Produits Laitiers', icon: '🥛' },      // Verre de lait
  { name: 'Épicerie', icon: '🥔' },           // Pain
  { name: 'Boissons', icon: '🍹' },               // Boisson tropicale
  { name: 'Hygiène', icon: '🧴' },              // Savon
  { name: 'Entretien', icon: '🧼' },             // Balai
  { name: 'Surgelés', icon: '❄️' },             // Flocon
  { name: 'Snacks', icon: '🍟' },                // Frites
  { name: 'Boulangerie Patisserie', icon: '🍰' }, // Gâteau
  { name: 'Autres', icon: '📦' },                // Paquet
];

async function main() {
  console.log('Création des catégories par défaut...');

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { icon: category.icon },
      create: { name: category.name, icon: category.icon },
    });
  }

  console.log('Catégories créées avec succès !');

  console.log('Création de l\'utilisateur admin par défaut...');

  await prisma.user.upsert({
    where: { name: 'admin' },
    update: { role: 'ADMIN' },
    create: {
      name: 'admin',
      role: 'ADMIN',
      icon: '👑' // Couronne
    },
  });

  console.log('Utilisateur admin créé avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileClientPage from './client-page';

export default async function ProfilePage() {
  console.log('Démarrage de ProfilePage');
  try {
    // Vérifier la session
    const sessionUser = await getUser();
    console.log('Session user:', sessionUser);

    if (!sessionUser?.id) {
      console.error('Session non trouvée');
      redirect('/login');
      return null; // Pour TypeScript
    }

    // Charger les données de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { 
        id: sessionUser.id 
      },
      select: {
        id: true,
        name: true,
        icon: true,
        role: true,
        createdAt: true,
        groups: {
          select: {
            id: true,
            name: true,
            inviteCode: true,
            createdAt: true
          }
        },
        createdItems: {
          select: {
            id: true,
            name: true,
            price: true,
            category: {
              select: {
                name: true
              }
            },
            group: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    console.log('Données utilisateur brutes:', user);

    if (!user || !user.id) {
      console.error('Utilisateur non trouvé');
      redirect('/login');
      return null; // Pour TypeScript
    }

    // S'assurer que les tableaux sont initialisés
    const userData = {
      ...user,
      groups: user.groups || [],
      createdItems: user.createdItems || []
    };

    console.log('Données utilisateur formatées:', userData);

    return <ProfileClientPage initialData={userData} />;
  } catch (error) {
    console.error('Erreur dans ProfilePage:', error);
    redirect('/login');
    return null; // Pour TypeScript
  }
}

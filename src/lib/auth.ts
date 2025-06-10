import { cookies } from 'next/headers';
import { prisma } from './prisma';

// Options de cookie communes
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// Générer un ID de session unique
function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Récupérer l'utilisateur connecté
export async function getUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    console.log('Session ID from cookie:', sessionId);

    if (!sessionId || typeof sessionId !== 'string' || !sessionId.trim()) {
      console.log('Pas de session valide dans le cookie');
      return null;
    }

    // Vérifier si la session existe dans la base
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        expiresAt: true,
        user: {
          select: {
            id: true,
            name: true,
            icon: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    console.log('Session trouvée:', session);

    if (!session?.user) {
      console.log('Session sans utilisateur valide');
      await clearSession();
      return null;
    }

    // Vérifier si la session n'est pas expirée
    if (new Date(session.expiresAt) < new Date()) {
      console.log('Session expirée');
      await clearSession();
      return null;
    }

    console.log('Utilisateur trouvé:', session.user);
    return session.user;
  } catch (error) {
    console.error('Erreur dans getUser:', error);
    return null;
  }
}

// Créer un cookie de session
export async function createSession(userId: string) {
  try {
    const sessionId = generateSessionId();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 jours

    // Créer la session en base
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: userId,
        expiresAt: expiresAt
      }
    });

    // Définir le cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionId, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 // 30 jours
    });
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    throw error;
  }
}

// Supprimer le cookie de session
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    throw new Error('Non autorisé');
  }
  return user;
}

export async function clearSession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (sessionId) {
      // Supprimer la session de la base
      await prisma.session.delete({
        where: { id: sessionId }
      }).catch(() => {}); // Ignorer l'erreur si la session n'existe pas
    }

    // Supprimer le cookie
    cookieStore.set('session', '', {
      ...cookieOptions,
      maxAge: 0
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la session:', error);
  }
}

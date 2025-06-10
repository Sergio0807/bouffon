import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  // Récupérer le cookie de session
  const sessionId = cookies().get('session')?.value;

  if (!sessionId) {
    return null;
  }

  // Trouver l'utilisateur par son ID de session
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      icon: true,
      role: true
    }
  });

  return user;
}

export async function isUserAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

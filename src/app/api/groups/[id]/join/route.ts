import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si le groupe existe
    const group = await prisma.group.findUnique({
      where: { id: params.id },
    });

    if (!group) {
      return new NextResponse('Groupe non trouvé', { status: 404 });
    }

    // Utilisateur temporaire pour le moment
    const user = await prisma.user.findFirst();
    if (!user) {
      return new NextResponse('Utilisateur non trouvé', { status: 404 });
    }

    // Vérifier si l'utilisateur est déjà membre du groupe
    const existingMembership = await prisma.group.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });

    if (existingMembership) {
      return new NextResponse('Vous êtes déjà membre de ce groupe', { status: 400 });
    }

    // Ajouter l'utilisateur au groupe
    await prisma.group.update({
      where: { id: params.id },
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la tentative de rejoindre le groupe:', error);
    return new NextResponse('Une erreur est survenue', { status: 500 });
  }
}

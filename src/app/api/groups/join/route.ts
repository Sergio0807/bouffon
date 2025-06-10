import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { inviteCode } = await request.json();

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Code d\'invitation requis' },
        { status: 400 }
      );
    }

    // Trouver le groupe par code d'invitation (insensible à la casse)
    const groups = await prisma.group.findMany({
      where: {
        inviteCode: {
          contains: inviteCode
        }
      }
    });

    // Trouver le groupe qui correspond exactement (insensible à la casse)
    const group = groups.find(g => g.inviteCode.toLowerCase() === inviteCode.toLowerCase());

    if (!group) {
      return NextResponse.json(
        { error: 'Groupe non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'utilisateur de la session
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est déjà membre du groupe
    const existingMembership = await prisma.group.findFirst({
      where: {
        id: group.id,
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'Vous êtes déjà membre de ce groupe' },
        { status: 400 }
      );
    }

    // Ajouter l'utilisateur au groupe
    await prisma.group.update({
      where: { id: group.id },
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la tentative de rejoindre le groupe:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

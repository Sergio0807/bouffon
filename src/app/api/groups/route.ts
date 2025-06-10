import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom du groupe est requis' },
        { status: 400 }
      );
    }

    // Générer un code d'invitation unique
    const inviteCode = randomBytes(4).toString('hex');

    // Récupérer l'utilisateur connecté
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name,
        inviteCode,
        users: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        items: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Récupérer l'utilisateur connecté
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }

    const groups = await prisma.group.findMany({
      where: {
        users: {
          some: {
            id: user.id
          }
        }
      },
      include: {
        items: true,
        users: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    
    if (error instanceof Error && error.message === 'Session invalide ou expirée') {
      return NextResponse.json(
        { error: 'Session invalide ou expirée. Veuillez vous reconnecter.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des groupes' },
      { status: 500 }
    );
  }
}

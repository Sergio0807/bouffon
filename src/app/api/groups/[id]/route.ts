import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import type { Prisma } from '@prisma/client';

type GroupWithRelations = {
  id: string;
  name: string;
  inviteCode: string;
  items: {
    id: string;
    name: string;
    price: number | null;
    isChecked: boolean;
    category: {
      id: string;
      name: string;
    } | null;
    user: {
      id: string;
      name: string;
      icon: string | null;
    } | null;
  }[];
  users: {
    id: string;
    name: string;
    icon: string | null;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET /api/groups/[id] - Début');
    
    // Vérifier l'authentification
    const user = await getUser();
    if (!user) {
      console.log('GET /api/groups/[id] - Utilisateur non authentifié');
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }
    console.log('GET /api/groups/[id] - Utilisateur authentifié:', user.id);
    
    // Récupérer le groupe
    const group = await prisma.group.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: user.id
          }
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        items: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            category: true
          }
        }
      }
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Groupe non trouvé ou accès non autorisé' },
        { status: 404 }
      );
    }

    console.log('GET /api/groups/[id] - Succès');
    return NextResponse.json(group);
  } catch (error) {
    console.error('GET /api/groups/[id] - Erreur:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    const sessionUser = await getUser();
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }

    console.log('Récupération du profil pour:', sessionUser.id);
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
    console.log('Données utilisateur trouvées:', user);

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Début de la création du profil');
    const body = await request.json();
    console.log('Body reçu:', body);
    const { name, icon } = body;

    console.log('Vérification si le nom existe:', name);
    // Vérifier si le nom d'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: { name },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur est déjà pris' },
        { status: 400 }
      );
    }

    console.log('Création du nouvel utilisateur');
    // Créer le nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        icon,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Erreur lors de la création du profil' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { name, icon } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur de la session
    const sessionUser = await getUser();
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }
    
    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: sessionUser.id }
    });
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le nom est déjà pris par un autre utilisateur
    const userWithSameName = await prisma.user.findFirst({
      where: {
        name,
        id: { not: existingUser.id }
      }
    });

    if (userWithSameName) {
      return NextResponse.json(
        { error: 'Ce nom est déjà pris par un autre utilisateur' },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: { name, icon },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}

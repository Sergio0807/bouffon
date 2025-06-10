import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    console.log('Tentative de connexion pour:', name);

    if (!name || typeof name !== 'string' || !name.trim()) {
      console.log('Nom invalide:', name);
      return NextResponse.json(
        { error: 'Le nom est requis et doit être une chaîne de caractères valide' },
        { status: 400 }
      );
    }

    // Vérifier d'abord si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { name: name.trim() },
      select: {
        id: true,
        name: true,
        icon: true,
        role: true
      }
    });

    console.log('Utilisateur existant:', existingUser);

    if (!existingUser) {
      console.log('Création d\'un nouvel utilisateur');
      return NextResponse.json(
        { error: 'Utilisateur non trouvé. Veuillez créer un compte.' },
        { status: 404 }
      );
    }

    // Vérifier que l'ID est valide
    if (!existingUser.id.match(/^[a-zA-Z0-9]+$/)) {
      console.error('ID utilisateur invalide:', existingUser.id);
      return NextResponse.json(
        { error: 'ID utilisateur invalide' },
        { status: 500 }
      );
    }

    try {
      // Créer le cookie de session
      await createSession(existingUser.id);
      console.log('Session créée avec succès pour:', existingUser.name);
    } catch (sessionError) {
      console.error('Erreur lors de la création de la session:', sessionError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: existingUser
    });
  } catch (error) {
    console.error('Erreur dans /api/auth/login:', error);
    // Erreur plus détaillée pour le débogage
    return NextResponse.json(
      { 
        error: 'Erreur lors de la connexion',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

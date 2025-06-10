import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    console.log('Tentative de création de compte pour:', name);

    if (!name || typeof name !== 'string' || !name.trim()) {
      console.log('Nom invalide:', name);
      return NextResponse.json(
        { error: 'Le nom est requis et doit être une chaîne de caractères valide' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { name: name.trim() }
    });

    if (existingUser) {
      console.log('Utilisateur existe déjà:', name);
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur est déjà pris' },
        { status: 409 }
      );
    }

    // Créer le nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        icon: '😄',
        role: 'USER'
      }
    });

    console.log('Nouvel utilisateur créé:', newUser.name);

    try {
      // Créer la session pour le nouvel utilisateur
      await createSession(newUser.id);
      console.log('Session créée avec succès pour:', newUser.name);
    } catch (sessionError) {
      console.error('Erreur lors de la création de la session:', sessionError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        icon: newUser.icon,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Erreur dans /api/auth/register:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création du compte',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

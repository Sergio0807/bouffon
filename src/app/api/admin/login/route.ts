import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur requis' },
        { status: 400 }
      );
    }

    const { name } = body;

    // Vérifier si l'utilisateur existe et est admin
    const user = await prisma.user.findFirst({
      where: {
        name,
        role: 'ADMIN'
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non autorisé' },
        { status: 401 }
      );
    }

    // Définir le cookie d'authentification
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 heures
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

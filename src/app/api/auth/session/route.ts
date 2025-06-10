import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'Session invalide ou expirée'
      }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        icon: user.icon,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur vérification session:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Récupérer l'utilisateur connecté d'abord
    const sessionUser = await getUser();
    if (!sessionUser) {
      console.error('Utilisateur non authentifié');
      return NextResponse.json(
        { error: 'Vous devez être connecté pour ajouter un article' },
        { status: 401 }
      );
    }

    const { name, groupId, categoryId } = await request.json();
    console.log('Données reçues:', { name, groupId, categoryId, userId: sessionUser.id });

    if (!name || !groupId || !categoryId) {
      return NextResponse.json(
        { error: 'Le nom, l\'ID du groupe et la catégorie sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que le groupe existe
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Groupe introuvable' },
        { status: 400 }
      );
    }

    // Vérifier que la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const item = await prisma.item.create({
      data: {
        name: name.trim(),
        groupId,
        categoryId,
        userId: sessionUser.id,
        checked: false
      },
      include: {
        category: true,
        group: true,
        user: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'item' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, checked, price, checkedById } = await request.json();
    console.log('Données reçues:', { id, checked, price, checkedById });

    const currentUser = await getUser();
    if (!currentUser) {
      console.error('Utilisateur non authentifié');
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    const item = await prisma.item.update({
      where: { id },
      data: { 
        checked,
        checkedAt: checked ? new Date() : null,
        checkedById: checked ? checkedById || currentUser.id : null,
        price: checked ? price : null
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        checkedBy: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    );
  }
}

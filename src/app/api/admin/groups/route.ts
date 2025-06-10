import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom du groupe est requis' },
        { status: 400 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name,
        inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase()
      }
    });

    revalidatePath('/admin/groups');
    return NextResponse.json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      select: {
        id: true,
        name: true,
        inviteCode: true,
        _count: {
          select: {
            users: true
          }
        }
      }
    });
    
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { checked, price, checkedById } = await request.json();
    const user = await requireUser();

    const item = await prisma.item.update({
      where: { id: params.id },
      data: { 
        checked,
        checkedById: checked ? checkedById : null,
        price: checked ? price : null,
        checkedAt: checked ? new Date() : null
      }
    });

    revalidatePath(`/groups/${item.groupId}`);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update item' },
      { status: 500 }
    );
  }
}

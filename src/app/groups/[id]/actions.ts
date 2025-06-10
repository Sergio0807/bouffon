'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';

export async function addItem(groupId: string, formData: FormData) {
  const user = await getUser();
  if (!user) {
    throw new Error('Session invalide ou expirée');
  }

  const name = formData.get('name') as string;
  const price = formData.get('price');
  const categoryId = formData.get('categoryId') as string;

  if (!name || !categoryId) {
    throw new Error('Nom et catégorie requis');
  }

  const item = await prisma.item.create({
    data: {
      name,
      price: price ? parseFloat(price as string) : undefined,
      categoryId,
      groupId,
      userId: user.id,
    },
  });
  revalidatePath(`/groups/${groupId}`);
  return item;
}

export async function toggleItem(formData: FormData) {
  const user = await getUser();
  if (!user) {
    throw new Error('Session invalide ou expirée');
  }

  const itemId = formData.get('itemId');
  const isChecked = formData.get('isChecked') === 'true';

  if (!itemId || typeof itemId !== 'string') {
    throw new Error('ID de l\'article manquant');
  }

  const item = await prisma.item.update({
    where: { id: itemId },
    data: { isChecked },
  });

  revalidatePath(`/groups/${item.groupId}`);
}

export async function deleteItem(itemId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error('Session invalide ou expirée');
  }

  const item = await prisma.item.delete({
    where: { id: itemId },
  });
  revalidatePath(`/groups/${item.groupId}`);
  return item;
}

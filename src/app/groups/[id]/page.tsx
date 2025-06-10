import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AddItemForm from '@/components/AddItemForm';
import GroupContent from '@/components/GroupContent';
import { addItem, toggleItem } from './actions';
import { getUser } from '@/lib/auth';

async function getGroup(id: string) {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              icon: true
            }
          }
        }
      },
      users: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
  });

  if (!group) notFound();
  return group;
}


import GroupClientPage from './client-page';

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const group = await getGroup(params.id);

  return <GroupClientPage groupId={params.id} initialData={group} />;
}

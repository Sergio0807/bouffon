import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ShoppingList from '@/components/ShoppingList';
import { addItem, toggleItem, deleteItem } from '../actions';
import Link from 'next/link';

async function getGroup(id: string) {
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      items: {
        where: {
          checked: false
        },
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

export default async function ToBuyPage({
  params,
}: {
  params: { id: string };
}) {
  const group = await getGroup(params.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{group.name} - À acheter</h1>
            <Link 
              href={`/groups/${params.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Retour au groupe
            </Link>
          </div>
        </header>

        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <ShoppingList
            items={group.items}
            onItemDelete={deleteItem}
          />
        </div>
      </div>
    </main>
  );
}

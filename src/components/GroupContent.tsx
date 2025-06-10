'use client';

import { useTransition } from 'react';
import type { Item } from '@/types';
import ShoppingList from './ShoppingList';
import AddItemForm from './AddItemForm';
import Link from 'next/link';

type GroupContentProps = {
  name: string;
  inviteCode: string;
  items: Item[];
  groupId: string;
  users: {
    id: string;
    name: string;
    icon: string;
  }[];
  onItemDelete: (itemId: string) => void;
};

export default function GroupContent({
  name,
  inviteCode,
  items,
  groupId,
  users,
  onItemDelete,
}: GroupContentProps) {


  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">{name}</h1>
        <p className="text-center text-gray-600">
          Code d&apos;invitation : <span className="font-mono">{inviteCode}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Liste de courses</h2>
            <div className="space-x-4">
              <Link 
                href={`/groups/${groupId}/to-buy`}
                className="text-blue-600 hover:text-blue-800"
              >
                À acheter
              </Link>
              <Link 
                href={`/groups/${groupId}/bought`}
                className="text-blue-600 hover:text-blue-800"
              >
                Articles achetés
              </Link>
            </div>
          </div>
          <ShoppingList
            items={items}
            onItemDelete={onItemDelete}
          />
        </div>

        <div className="md:col-span-1 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Membres</h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-4">
              <ul className="space-y-2">
                {users.map((user) => (
                  <li key={user.id} className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-label="Icône utilisateur">
                      {user.icon}
                    </span>
                    <span>{user.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Ajouter un article</h2>
            <AddItemForm groupId={groupId} />
          </div>
        </div>
      </div>
    </div>
  );
}

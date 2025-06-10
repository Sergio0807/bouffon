'use client';

import { useEffect, useState } from 'react';
import type { ExtendedItem, User } from '@/types';
import AddItemForm from '@/components/AddItemForm';
import ShoppingList from '@/components/ShoppingList';

type GroupData = {
  id: string;
  name: string;
  inviteCode: string;
  items: ExtendedItem[];
  users: User[];
  createdAt: string;
  updatedAt: string;
};

export default function GroupClientPage({
  groupId,
  initialData
}: {
  groupId: string;
  initialData: GroupData;
}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);

  const handleAddItem = async (newItem: Item) => {
    // Mise à jour optimiste
    setData(prev => ({
      ...prev,
      items: [newItem, ...prev.items]
    }));
  };

  // Fonction pour recharger les données du groupe
  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'same-origin',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.log('Session invalide, redirection vers login...');
        window.location.replace('/login');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur vérification session:', error);
      return false;
    }
  };

  const refreshGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        credentials: 'same-origin'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error(data.error || 'Erreur lors de la mise à jour du groupe');
      }
      
      // Vérifier que les données sont valides
      if (!data || typeof data !== 'object') {
        throw new Error('Format de réponse invalide');
      }

      // Vérifier les champs requis
      if (!data.id || !data.name || !Array.isArray(data.items) || !Array.isArray(data.users)) {
        throw new Error('Données du groupe incomplètes');
      }
      
      setError(null);
      setData(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  // Écouter les événements de mise à jour
  useEffect(() => {
    window.addEventListener('groupUpdate', refreshGroup);
    return () => window.removeEventListener('groupUpdate', refreshGroup);
  }, [groupId]);

  // Rafraîchir les données au montage
  useEffect(() => {
    refreshGroup();
  }, []);

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
        {data.name}
      </h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Liste de courses</h2>
          </div>
          <ShoppingList
            items={data.items}
            users={data.users}
            onItemDelete={handleDeleteItem}
          />
        </div>

        <div className="md:col-span-1 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Membres</h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-4">
              <ul className="space-y-2">
                {data.users.map((user: User) => (
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
            <AddItemForm groupId={groupId} onItemAdded={handleAddItem} />
          </div>
        </div>
      </div>
    </main>
  );
}

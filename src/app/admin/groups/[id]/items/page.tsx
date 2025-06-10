'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddItem from './AddItem';

type Item = {
  id: string;
  name: string;
  checked: boolean;
  groupId: string;
};

type Group = {
  id: string;
  name: string;
  userId: string;
  user: {
    name: string;
    icon: string;
  };
};

async function deleteItem(itemId: string) {
  const response = await fetch(`/api/items/${itemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete item');
  }
}

async function toggleItem(itemId: string, checked: boolean) {
  const response = await fetch(`/api/items/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checked }),
  });

  if (!response.ok) {
    throw new Error('Failed to update item');
  }
}

export default function GroupItemsPage({ params }: { params: { id: string } }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchGroupAndItems();
  }, [params.id]);

  const fetchGroupAndItems = async () => {
    try {
      // Charger le groupe
      const groupResponse = await fetch(`/api/groups/${params.id}`);
      const groupData = await groupResponse.json();
      
      if (!groupResponse.ok) {
        throw new Error(groupData.error || 'Failed to fetch group');
      }
      
      setGroup(groupData);

      // Charger les items
      const itemsResponse = await fetch(`/api/groups/${params.id}/items`);
      const itemsData = await itemsResponse.json();
      
      if (!itemsResponse.ok) {
        throw new Error(itemsData.error || 'Failed to fetch items');
      }
      
      setItems(itemsData);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      await fetchGroupAndItems();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggle = async (itemId: string, checked: boolean) => {
    try {
      await toggleItem(itemId, checked);
      await fetchGroupAndItems();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!group) {
    return <div className="p-4 text-red-500">Groupe non trouvé</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Items du groupe : {group.name}</h1>
        <div className="ml-4 flex items-center text-sm text-gray-500">
          <span className="text-2xl mr-2">{group.user.icon}</span>
          <span>{group.user.name}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {group.name} - Items
          </h2>
        </div>

        <div className="mb-6">
          <AddItem groupId={group.id} />
        </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                État
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.id}</div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(item.id, !item.checked)}
                    className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-full ${
                      item.checked
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.checked ? '✓ Fait' : '○ À faire'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center px-2 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                  >
                    <span className="mr-1">🗑️</span>
                    <span>Supprimer</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

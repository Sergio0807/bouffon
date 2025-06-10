'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Group = {
  id: string;
  name: string;
  inviteCode: string;
  _count?: {
    users: number;
  };
};

async function deleteGroup(groupId: string) {
  const response = await fetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete group');
  }
}

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/admin/groups');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch groups');
      }
      
      setGroups(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des groupes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      await fetchGroups(); // Recharger la liste
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Administration des groupes</h1>
      
      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/groups/create"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Créer un groupe
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom du groupe
              </th>

              <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group: Group) => (
              <tr key={group.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{group.name}</div>
                  <div className="text-sm text-gray-500 mb-2">Code d'accès : {group.inviteCode}</div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/groups/${group.id}/edit`}
                      className="inline-flex items-center px-2 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                    >
                      <span className="mr-1">✏️</span>
                      <span>Modifier</span>
                    </Link>
                    <Link
                      href={`/admin/groups/${group.id}/items`}
                      className="inline-flex items-center px-2 py-1 text-xs text-green-600 bg-green-50 hover:bg-green-100 rounded border border-green-200"
                    >
                      <span className="mr-1">📝</span>
                      <span>Items</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(group.id)}
                      className="inline-flex items-center px-2 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                    >
                      <span className="mr-1">🗑️</span>
                      <span>Supprimer</span>
                    </button>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {group._count?.users ?? 0} utilisateurs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

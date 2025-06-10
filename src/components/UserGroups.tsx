'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Group } from '@/types';

export default function UserGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/groups');
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          // Rediriger vers la page de login si la session est invalide
          window.location.href = '/login';
          return;
        }
        throw new Error(data.error || 'Erreur lors de la récupération des groupes');
      }
      
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Charger les groupes au démarrage
    fetchGroups();

    // Écouter l'événement de mise à jour des groupes
    const handleGroupUpdate = () => {
      fetchGroups();
    };
    window.addEventListener('groupUpdate', handleGroupUpdate);

    return () => {
      window.removeEventListener('groupUpdate', handleGroupUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6">Vos groupes</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6">Vos groupes</h2>
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold mb-6">Vos groupes</h2>
      {groups.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Vous n&apos;avez pas encore rejoint de groupe.
          <br />
          <Link href="/join" className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block">
            Rejoindre un groupe
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">{group.name}</h3>
                <span className="text-sm text-gray-500">
                  {group.items?.length || 0} articles
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

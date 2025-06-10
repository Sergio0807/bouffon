'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [stats, setStats] = useState({ users: 0, groups: 0, items: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Utilisateurs</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.users}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Groupes</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.groups}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Items</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.items}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        <Link 
          href="/admin/users" 
          className="block p-4 hover:bg-gray-50"
        >
          <h3 className="text-lg font-medium text-gray-900">
            Gestion des utilisateurs
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Voir, modifier et supprimer les utilisateurs
          </p>
        </Link>
      </div>
    </div>
  );
}

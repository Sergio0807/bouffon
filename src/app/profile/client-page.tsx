'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import FooterMenu from '@/components/FooterMenu';

type Group = {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: Date;
};

type Item = {
  id: string;
  name: string;
  price: number | null;
  category: { name: string };
  group: { name: string };
};

type UserData = {
  id: string;
  name: string;
  icon: string;
  role: string;
  createdAt: string;
  groups: Group[];
  createdItems: Item[];
};

export default function ProfileClientPage({ initialData }: { initialData: UserData }) {
  console.log('Rendu ProfileClientPage avec initialData:', initialData);
  const [data, setData] = useState<UserData>(initialData);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la récupération du profil');
      }

      const newData = await response.json();
      console.log('Nouvelles données profil:', newData);

      if (!newData || !newData.id) {
        throw new Error('Données de profil invalides');
      }

      setData({
        ...newData,
        groups: newData.groups || [],
        createdItems: newData.createdItems || []
      });
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
      window.location.href = '/login';
    }
  }

  useEffect(() => {
    console.log('useEffect ProfileClientPage');
    try {
      refreshProfile();
    } catch (error) {
      console.error('Erreur dans useEffect:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-4">
            Une erreur est survenue lors du chargement de votre profil.
          </p>
          <Link 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // Calculer le total des prix
  const totalPrice = data.createdItems.reduce(
    (acc, item) => acc + (item.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{data.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
                <p className="text-gray-500">Membre depuis {new Date(data.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/profile/edit"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Modifier
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900">Groupes</h2>
            <p className="text-3xl font-bold text-green-600">{data.groups?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900">Articles</h2>
            <p className="text-3xl font-bold text-blue-600">{data.createdItems?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900">Total dépensé</h2>
            <p className="text-3xl font-bold text-purple-600">{totalPrice.toFixed(2)} €</p>
          </div>
        </div>

        {/* Liste des groupes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes groupes</h2>
          {data.groups?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.groups.map((group) => (
                <Link 
                  href={`/groups/${group.id}`} 
                  key={group.id} 
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <div className="text-sm text-gray-500">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Vous n'avez pas encore rejoint de groupes.</p>
          )}
        </div>

        {/* Liste des items */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            Mes achats ({data.createdItems.length})
          </h2>
          <ul className="space-y-2">
            {data.createdItems.map((item) => (
              <li
                key={item.id}
                className="p-2 hover:bg-gray-50 rounded flex justify-between items-center"
              >
                <span className="flex-1">{item.name}</span>
                <span className="text-sm text-gray-500">
                  {item.price ? `${item.price.toFixed(2)} €` : '-'}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="font-bold">Total</span>
            <span className="text-lg font-bold text-green-600">
              {totalPrice.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>
      <div className="pb-20">
        <FooterMenu />
      </div>
    </div>
  );
}

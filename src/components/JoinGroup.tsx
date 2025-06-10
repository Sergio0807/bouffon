'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinGroup() {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la tentative de rejoindre le groupe');
      }

      // Attendre un court instant pour que la base de données soit à jour
      await new Promise(resolve => setTimeout(resolve, 500));

      // Déclencher les événements de mise à jour
      window.dispatchEvent(new CustomEvent('groupUpdate'));
      window.dispatchEvent(new CustomEvent('profileUpdate'));
      
      // Rafraîchir l'interface
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la tentative de rejoindre le groupe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Rejoindre un groupe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
            Code du groupe
          </label>
          <input
            type="text"
            id="inviteCode"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: ABC123"
            required
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Recherche...' : 'Rejoindre le groupe'}
        </button>
      </form>
    </div>
  );
}

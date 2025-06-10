'use client';

import { useState } from 'react';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: groupName }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du groupe');
      }

      const data = await response.json();
      // Rediriger vers la page du groupe
      window.location.href = `/groups/${data.id}`;
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du groupe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
          Nom du groupe
        </label>
        <input
          type="text"
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full input"
          placeholder="Ex: Courses familiales"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full btn btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Création...' : 'Créer le groupe'}
      </button>
    </form>
  );
}

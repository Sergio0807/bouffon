'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AVAILABLE_ICONS = [
  // Avatars basiques
  '👤', '🧑', '👩', '👨', '👶', '👧', '🧒', '👦', '👩‍🦰', '👨‍🦰',
  // Cuisine et nourriture
  '👩‍🍳', '👨‍🍳', '🧑‍🍳', '🍳', '🥘', '🍲', '🥗', '🥪', '🥖', '🧀',
  // Courses et shopping
  '🛒', '🛍️', '🧺', '📝', '📋', '✅', '💰', '💳', '🏪', '🏬',
  // Expressions
  '😊', '😎', '🤔', '🤓', '😋', '🤗', '😄', '🥳', '😌', '🤩'
];

type ProfileProps = {
  initialName: string;
  initialIcon: string;
};

export default function Profile({ initialName, initialIcon }: ProfileProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
        <span className="text-2xl">{icon}</span>
        <span className="font-medium">{name}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="ml-auto text-sm text-blue-600 hover:text-blue-700"
        >
          Modifier
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icône
          </label>
          <div className="grid grid-cols-10 gap-2">
            {AVAILABLE_ICONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`
                  w-10 h-10 text-xl flex items-center justify-center rounded
                  ${emoji === icon ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'}
                `}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            disabled={isUpdating}
          >
            Annuler
          </button>
          <button
            type="submit"
            className={`
              px-4 py-2 text-sm text-white bg-blue-600 rounded-md
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={isUpdating}
          >
            {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  );
}

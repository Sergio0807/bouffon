'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AVAILABLE_ICONS = [
  // Avatars basiques
  '👤', '🧑', '👩', '👨', '👶', '👧', '🧒', '👦', '👩‍🦰', '👨‍🦰',
  // Cuisine et nourriture
  '👩‍🍳', '👨‍🍳', '🧑‍🍳', '🍳', '🥘', '🍲', '🥗', '🥪', '🥖', '🧀',
];

export default function OnboardingProfile() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('👤');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon }),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      router.refresh();
      router.push('/groups');
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenue sur Bouffon !
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Pour commencer, créez votre profil
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Votre nom
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Choisissez votre icône
              </label>
              <div className="mt-2 grid grid-cols-10 gap-2">
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

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !name}
                className={`
                  w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${isSubmitting || !name
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }
                `}
              >
                {isSubmitting ? 'Création...' : 'Créer mon profil'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // D'abord, supprimer le cookie
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la déconnexion');
      }

      // Émettre l'événement de déconnexion
      window.dispatchEvent(new CustomEvent('userLogout'));

      // Attendre un peu pour que l'événement soit traité
      await new Promise(resolve => setTimeout(resolve, 100));

      // Rediriger vers la page de login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Se déconnecter
    </button>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; icon: string; role?: 'USER' | 'ADMIN' } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'same-origin'
      });

      // Vérifier d'abord si la requête a réussi
      if (!response.ok) {
        console.error('Erreur de requête:', response.status, response.statusText);
        setUser(null);
        return;
      }

      // Vérifier si la réponse contient du contenu
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Réponse non-JSON reçue');
        setUser(null);
        return;
      }

      // Récupérer le texte de la réponse pour le debug si nécessaire
      const text = await response.text();
      if (!text) {
        console.error('Réponse vide reçue');
        setUser(null);
        return;
      }

      // Parser le JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError, '\nContenu reçu:', text);
        setUser(null);
        return;
      }

      if (data.authenticated && data.user && data.user.id) {
        setUser(data.user);
      } else {
        console.log('Session non authentifiée ou données utilisateur invalides:', data);
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification utilisateur:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier l'utilisateur au chargement initial
    checkUser();

    // Écouter l'événement de connexion
    const handleLogin = (event: CustomEvent) => {
      setUser(event.detail);
    };

    // Écouter l'événement de mise à jour du profil
    const handleProfileUpdate = () => {
      checkUser();
    };

    // Écouter l'événement de changement de focus
    const handleFocus = () => {
      // Vérifier la session uniquement si l'utilisateur est connecté
      if (user) {
        checkUser();
      }
    };

    window.addEventListener('userLogin', handleLogin as EventListener);
    window.addEventListener('profileUpdate', handleProfileUpdate);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('userLogin', handleLogin as EventListener);
      window.removeEventListener('profileUpdate', handleProfileUpdate);
      window.removeEventListener('focus', handleFocus);
    };
  }, [router, user]);


  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        setUser(null);
        // Déclencher l'événement de déconnexion
        window.dispatchEvent(new Event('userLogout'));
        router.push('/login');
      } else {
        throw new Error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      checkUser();
    }
  };

  const renderLogo = () => (
    <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2 hover:opacity-80 transition-opacity">
      <span>🛒</span>
      <span>🥖</span>
      <span>💝</span>
      <span>Bouffon !</span>
    </Link>
  );

  const renderUserMenu = () => {
    if (isLoading) {
      return <div className="w-32 h-8 bg-gray-100 animate-pulse rounded-lg" />;
    }

    if (!user) {
      return (
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Se connecter
        </button>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
        >
          <span className="text-xl">{user.icon}</span>
          <span className="text-gray-700 font-medium">{user.name}</span>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu">
              <button
                onClick={() => {
                  router.push('/profile');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Profil
              </button>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  Administration
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                role="menuitem"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-2 flex justify-between items-center">
      {renderLogo()}
      {renderUserMenu()}
    </div>
  );
}

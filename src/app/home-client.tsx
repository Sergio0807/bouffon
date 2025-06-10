'use client';

import CreateGroup from '@/components/CreateGroup';
import UserGroups from '@/components/UserGroups';
import JoinGroup from '@/components/JoinGroup';
import FooterMenu from '@/components/FooterMenu';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomeClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'same-origin'
        });
        const data = await response.json();
        
        if (isMounted) {
          setIsAuthenticated(data.authenticated);
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    // Vérifier l'authentification au chargement initial
    checkAuth();

    // Écouter l'événement de déconnexion
    const handleLogout = () => {
      if (isMounted) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    window.addEventListener('userLogout', handleLogout);

    return () => {
      isMounted = false;
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []);
  return (
    <main className="min-h-screen flex flex-col relative bg-gradient-to-br from-green-50 to-blue-50">
      {/* Images de fond en filigrane */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {/* Panier */}
          <svg
            className="absolute top-1/4 left-1/4 w-64 h-64 text-green-600 transform -rotate-12"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17 18C15.89 18 15 18.89 15 20C15 21.11 15.89 22 17 22C18.11 22 19 21.11 19 20C19 18.89 18.11 18 17 18M1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.11 5.89 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.5C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2M7 18C5.89 18 5 18.89 5 20C5 21.11 5.89 22 7 22C8.11 22 9 21.11 9 20C9 18.89 8.11 18 7 18Z" />
          </svg>
          {/* Pain */}
          <svg
            className="absolute bottom-1/4 right-1/4 w-48 h-48 text-yellow-600 transform rotate-45"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12,2C17.5,2 22,5.36 22,9.5C22,11.19 21.26,12.75 20,14V22H4V14C2.74,12.75 2,11.19 2,9.5C2,5.36 6.5,2 12,2M18,13.14C19.24,12.17 20,10.89 20,9.5C20,6.46 16.42,4 12,4C7.58,4 4,6.46 4,9.5C4,10.89 4.76,12.17 6,13.14V20H18V13.14M8,18V14H12V18H8Z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="relative max-w-2xl mx-auto space-y-8">
          <h1 className="text-center mb-8">
            <span className="text-7xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
              Bouffon !
            </span>
            <span className="block text-2xl font-medium text-green-600 mt-4">
              Gérez vos courses en commun en toute simplicité !
            </span>
          </h1>
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl space-y-6">
            <p className="text-base text-gray-600 text-center">
              Créez des listes de courses et partagez-les avec vos proches.
              <br />
              Simplifiez vos achats en groupe !
            </p>

          </div>

          {isAuthenticated === null ? (
            // État de chargement
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UserGroups />
              <div className="space-y-8">
                <CreateGroup />
                <JoinGroup />
              </div>
            </div>
          ) : (
            <div className="flex justify-center space-x-4 mt-8">
              <a
                href="/login"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Se connecter
              </a>
              <a
                href="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                S'inscrire
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-20">
        <div className="py-4 px-4 text-center text-sm text-gray-500">
          Application mobile Friendly développée avec appétit par{' '}
          <a 
            href="https://www.delbuc.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Delbuc Solutions
          </a>{' '}
          <span className="inline-block ml-1 transform hover:scale-110 transition-transform" role="img" aria-label="coeur">
            ❤️
          </span>
        </div>
        <FooterMenu />
      </footer>
    </main>
  );
}

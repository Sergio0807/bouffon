'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Empêcher le défilement du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Navigation mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60]">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === '/' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Accueil</span>
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex flex-col items-center justify-center w-full h-full ${isOpen ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            <span className="text-xs mt-1">{isOpen ? 'Fermer' : 'Menu'}</span>
          </button>

          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === '/profile' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Profil</span>
          </Link>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-[55]"
            onClick={() => setIsOpen(false)}
          />
          {/* Menu content */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-xl p-4 z-[58] max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              <Link
                href="/create-group"
                className="flex items-center space-x-2 px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Créer un groupe</span>
              </Link>
              <Link
                href="/join"
                className="flex items-center space-x-2 px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Rejoindre un groupe</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Navigation desktop */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Bouffon !
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/create-group"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Créer un groupe
              </Link>
              <Link
                href="/join"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Rejoindre un groupe
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Profil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

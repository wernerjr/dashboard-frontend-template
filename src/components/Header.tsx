'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthData } from '@/utils/auth';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();

  const handleLogout = () => {
    clearAuthData();
    router.push('/login');
  };

  const handleViewProfile = () => {
    setIsMenuOpen(false);
    router.push('/profile');
  };

  if (isLoading) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="px-6">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-blue-600 text-xl font-bold">TM</span>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </span>
              </div>
            </button>

            {isMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button
                    onClick={handleViewProfile}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Ver perfil
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 
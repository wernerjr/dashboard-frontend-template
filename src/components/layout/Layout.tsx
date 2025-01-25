'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <main className="w-full">
        {children}
      </main>
    </div>
  );
} 
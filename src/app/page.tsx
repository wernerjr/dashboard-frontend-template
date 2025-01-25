'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { getStoredToken } from '@/utils/auth';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-6">
          <div className="h-full max-w-[2100px] mx-auto w-full">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Bem-vindo ao Team Management
            </h1>
            <p className="text-gray-600">
              Este é seu painel de controle. Aqui você poderá gerenciar sua equipe e projetos.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

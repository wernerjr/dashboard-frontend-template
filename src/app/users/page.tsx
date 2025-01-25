'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken, getStoredUser } from '@/utils/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  success: true;
  data: {
    users: User[];
  };
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Você não tem permissão para acessar esta página');
        }
        throw new Error('Falha ao carregar usuários');
      }

      const data: UsersResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Falha ao carregar usuários');
      }

      setUsers(data.data.users);
    } catch (err) {
      console.error('Users error:', err);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar a lista de usuários');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleDelete = async (user: User) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const token = getStoredToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir usuário');
      }

      // Atualiza a lista de usuários removendo o usuário excluído
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500">Carregando...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-red-500">{error}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-mail
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Função
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Criado em
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última atualização
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.name[0].toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={user.role === 'ADMIN' || user.id === getStoredUser()?.id}
                            title={
                              user.role === 'ADMIN' 
                                ? 'Não é possível excluir administradores' 
                                : user.id === getStoredUser()?.id
                                ? 'Não é possível excluir sua própria conta'
                                : 'Excluir usuário'
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de confirmação */}
      {userToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir o usuário <span className="font-medium">{userToDelete.name}</span>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
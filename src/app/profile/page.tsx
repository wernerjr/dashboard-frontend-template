'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '@/utils/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { toast, Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  success: true;
  data: {
    user: User;
  };
}

interface ValidationError {
  status: 'error';
  message: string;
  errors: {
    validation: string;
    code: string;
    message: string;
    path: string[];
  }[];
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface DeleteErrorResponse {
  success: false;
  error: {
    code: number;
    type: string;
    message: string;
  };
}

interface PasswordChangeResponse {
  success: true;
  data: {
    message: string;
  };
}

interface PasswordChangeError {
  status: 'error';
  message: string;
  errors: {
    code: string;
    expected: string;
    received: string;
    path: string[];
    message: string;
  }[];
}

interface PasswordChangeErrorResponse {
  success: false;
  error: {
    code: number;
    type: string;
    message: string;
    details: {
      field: string;
      message: string;
    }[];
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar perfil');
      }

      const data: ProfileResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Falha ao carregar perfil');
      }

      setProfile(data.data.user);
      setEditData({ name: data.data.user.name, email: data.data.user.email });
    } catch (err) {
      console.error('Profile error:', err);
      setError('Não foi possível carregar as informações do perfil');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = getStoredToken();
      if (!token) {
        router.push('/login');
        return;
      }

      // Só envia os campos que foram alterados
      const changes: { name?: string; email?: string } = {};
      if (editData.name !== profile?.name) changes.name = editData.name;
      if (editData.email !== profile?.email) changes.email = editData.email;

      // Se nada foi alterado, apenas sai do modo de edição
      if (Object.keys(changes).length === 0) {
        setEditMode(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changes),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ValidationError;
        throw new Error(errorData.errors?.[0]?.message || errorData.message || 'Erro ao atualizar perfil');
      }

      if (!data.success) {
        throw new Error('Falha ao atualizar perfil');
      }

      setProfile(data.data.user);
      setEditMode(false);
      setError('');
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('A senha não pode estar vazia');
      return errors;
    }

    if (password.length < 8) {
      errors.push('A senha deve ter no mínimo 8 caracteres');
    }

    if (password.length > 30) {
      errors.push('A senha deve ter no máximo 30 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }

    if (!/[@$!%?&]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial (@$!%?&)');
    }

    return errors;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validar senha vazia
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('As senhas não podem estar vazias');
      return;
    }

    // Validar confirmação de senha
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    // Validar se a nova senha é igual à senha atual
    if (passwordData.newPassword === passwordData.currentPassword) {
      toast.error('A nova senha não pode ser igual à senha atual');
      return;
    }

    // Validar regras de complexidade da senha
    const passwordErrors = validatePassword(passwordData.newPassword);
    if (passwordErrors.length > 0) {
      passwordErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      setIsChangingPassword(true);
      const token = getStoredToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorData = data as PasswordChangeErrorResponse;
        
        // Mostrar todas as mensagens de erro em toasts separados
        if (errorData.error?.details?.length > 0) {
          errorData.error.details.forEach(error => {
            toast.error(error.message);
          });
        } else {
          throw new Error(errorData.error?.message || 'Falha ao alterar a senha');
        }
        return;
      }

      // Reset form and show success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
      toast.success('Senha alterada com sucesso!');
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(err instanceof Error ? err.message : 'Erro ao alterar a senha');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;
    
    try {
      setIsDeleting(true);
      const token = getStoredToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/users/${profile.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorData = data as DeleteErrorResponse;
        throw new Error(errorData.error?.message || 'Falha ao excluir conta');
      }

      // Limpar token e redirecionar para login
      localStorage.removeItem('token');
      toast.success('Conta excluída com sucesso');
      router.push('/login');
    } catch (err) {
      console.error('Delete account error:', err);
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir conta');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-right" />
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
        <Toaster position="top-right" />
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
      <Toaster position="top-right" />
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Meu Perfil</h1>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Editar
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditData({ name: profile?.name || '', email: profile?.email || '' });
                        setError('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-500"
                      disabled={isSaving}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {profile && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-3xl font-medium">
                        {profile.name[0].toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="mt-1 p-3 bg-gray-50 rounded-md">
                          {profile.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">E-mail</label>
                      {editMode ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="mt-1 p-3 bg-gray-50 rounded-md">
                          {profile.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Função</label>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {profile.role}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Membro desde </span>
                        <span className="text-gray-900">{formatDate(profile.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Password Change Section */}
            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Alterar Senha</h2>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {showPasswordChange ? 'Cancelar' : 'Alterar'}
                </button>
              </div>

              {showPasswordChange && (
                <div className="px-6 py-4">
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        minLength={8}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais (@$!%?&).
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isChangingPassword ? 'Alterando...' : 'Salvar Nova Senha'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Account Deletion Section */}
            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Excluir Conta</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Uma vez excluída, todos os dados da sua conta serão permanentemente removidos.
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="px-6 py-4">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Excluir minha conta
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão da conta</h3>
            <p className="text-sm text-gray-500 mb-4">
              Você tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão permanentemente removidos.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Sim, excluir minha conta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
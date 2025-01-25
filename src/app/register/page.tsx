'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

// Get the API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface SuccessResponse {
  success: true;
  data: {
    user: User;
    token: string;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: number;
    type: string;
    message: string;
  };
}

type RegisterResponse = SuccessResponse | ErrorResponse;

const getErrorMessage = (message: string): string => {
  switch (message) {
    case 'Email already registered':
      return 'Este e-mail já está registrado';
    default:
      return message;
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

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validar senha
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      passwordErrors.forEach(error => toast.error(error));
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Por favor, insira um email válido');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }),
      });

      const data: RegisterResponse = await response.json();

      if (!data.success) {
        throw new Error(getErrorMessage(data.error.message));
      }

      // Registration successful - store in sessionStorage
      const { user, token } = data.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Conta criada com sucesso!');
      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err instanceof Error ? err.message : 'Falha no registro. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing again
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 relative">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">TM</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Criar nova conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha seus dados para se registrar
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={3}
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <p className="mt-1 text-sm text-gray-500">
                A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais (@$!%?&).
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 
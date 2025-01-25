export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const storeAuthData = (token: string, user: User, rememberMe: boolean) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('token', token);
  storage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}; 
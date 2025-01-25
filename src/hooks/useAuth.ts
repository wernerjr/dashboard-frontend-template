'use client';

import { useState, useEffect } from 'react';
import { getStoredUser, User } from '@/utils/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading
  };
} 
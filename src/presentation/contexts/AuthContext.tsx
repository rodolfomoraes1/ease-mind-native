import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { authRepository } from '@/infrastructure/repositories/authRepository';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithEmail(email: string, password: string): Promise<void>;
  registerWithEmail(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return authRepository.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    await authRepository.loginWithEmail(email, password);
  }, []);

  const registerWithEmail = useCallback(async (email: string, password: string) => {
    await authRepository.registerWithEmail(email, password);
  }, []);

  const logout = useCallback(async () => {
    await authRepository.logout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

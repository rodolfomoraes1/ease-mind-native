import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { userRepository } from '@/infrastructure/repositories/userRepository';
import type { UserInfo, CognitivePreferences } from '@/shared/types/user';
import { useAuth } from './AuthContext';

interface UserInfoContextValue {
  userInfo: UserInfo | null;
  loading: boolean;
  updateCognitivePrefs(prefs: Partial<CognitivePreferences>): Promise<void>;
  updateUserInfo(data: Partial<UserInfo>): Promise<void>;
  refetch(): void;
}

const UserInfoContext = createContext<UserInfoContextValue | null>(null);

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    if (!user) { setUserInfo(null); return; }
    let cancelled = false;
    setLoading(true);
    userRepository.getUserInfo(user.uid)
      .then((data) => { if (!cancelled) setUserInfo(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, fetchCount]);

  const refetch = useCallback(() => setFetchCount((c) => c + 1), []);

  const updateCognitivePrefs = useCallback(
    async (prefs: Partial<CognitivePreferences>) => {
      if (!user || !userInfo) return;
      const updated = { ...userInfo.cognitivePreferences, ...prefs };
      setUserInfo((prev) => prev ? { ...prev, cognitivePreferences: updated } : prev);
      await userRepository.updateCognitivePrefs(user.uid, prefs);
    },
    [user, userInfo],
  );

  const updateUserInfo = useCallback(
    async (data: Partial<UserInfo>) => {
      if (!user) return;
      setUserInfo((prev) => prev ? { ...prev, ...data } : prev);
      await userRepository.updateUserInfo(user.uid, data);
    },
    [user],
  );

  return (
    <UserInfoContext.Provider value={{ userInfo, loading, updateCognitivePrefs, updateUserInfo, refetch }}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo(): UserInfoContextValue {
  const ctx = useContext(UserInfoContext);
  if (!ctx) throw new Error('useUserInfo deve ser usado dentro de UserInfoProvider');
  return ctx;
}

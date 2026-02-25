import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import type { UserInfo, CognitivePreferences } from '@/shared/types/user';
import { defaultCognitivePreferences } from '@/shared/types/user';

export interface IUserRepository {
  getUserInfo(userId: string): Promise<UserInfo>;
  createUserInfo(userId: string, data: Partial<UserInfo> & { name: string; email: string }): Promise<UserInfo>;
  updateCognitivePrefs(userId: string, prefs: Partial<CognitivePreferences>): Promise<void>;
  updateUserInfo(userId: string, data: Partial<UserInfo>): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async getUserInfo(userId: string): Promise<UserInfo> {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserInfo;
    }
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    return this.createUserInfo(userId, {
      name: currentUser.displayName ?? 'Usuário',
      email: currentUser.email ?? '',
      avatarUrl: currentUser.photoURL ?? '',
    });
  }

  async createUserInfo(
    userId: string,
    data: Partial<UserInfo> & { name: string; email: string },
  ): Promise<UserInfo> {
    const newUser: UserInfo = {
      id: userId,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl ?? '',
      navigationProfile: data.navigationProfile ?? 'beginner',
      specificNeeds: data.specificNeeds ?? [],
      studyRoutine: data.studyRoutine ?? '',
      workRoutine: data.workRoutine ?? '',
      cognitivePreferences: {
        ...defaultCognitivePreferences,
        ...data.cognitivePreferences,
      },
    };
    await setDoc(doc(db, 'users', userId), { ...newUser, createdAt: serverTimestamp() });
    return newUser;
  }

  async updateCognitivePrefs(userId: string, prefs: Partial<CognitivePreferences>): Promise<void> {
    const snap = await getDoc(doc(db, 'users', userId));
    if (!snap.exists()) return;
    const current = (snap.data() as UserInfo).cognitivePreferences;
    await updateDoc(doc(db, 'users', userId), {
      cognitivePreferences: { ...current, ...prefs },
      updatedAt: serverTimestamp(),
    });
  }

  async updateUserInfo(userId: string, data: Partial<UserInfo>): Promise<void> {
    await updateDoc(doc(db, 'users', userId), { ...data, updatedAt: serverTimestamp() });
  }
}

export const userRepository = new UserRepository();

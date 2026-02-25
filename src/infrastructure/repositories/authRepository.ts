import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { formatAuthError } from '@/shared/utils/helpers';

export interface IAuthRepository {
  loginWithEmail(email: string, password: string): Promise<void>;
  registerWithEmail(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe;
  getCurrentUser(): User | null;
}

export class AuthRepository implements IAuthRepository {
  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      throw new Error(formatAuthError((error as { code?: string }).code ?? ''));
    }
  }

  async registerWithEmail(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      throw new Error(formatAuthError((error as { code?: string }).code ?? ''));
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export const authRepository = new AuthRepository();

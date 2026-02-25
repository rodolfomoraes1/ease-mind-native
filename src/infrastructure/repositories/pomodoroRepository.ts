import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import type { PomodoroSession } from '@/shared/types/task';

export interface IPomodoroRepository {
  startSession(userId: string, taskId: string, type: PomodoroSession['type']): Promise<string>;
  completeSession(sessionId: string, duration: number): Promise<void>;
  getUserSessions(userId: string): Promise<PomodoroSession[]>;
}

export class PomodoroRepository implements IPomodoroRepository {
  async startSession(
    userId: string,
    taskId: string,
    type: PomodoroSession['type'],
  ): Promise<string> {
    const ref = await addDoc(collection(db, 'pomodoroSessions'), {
      userId,
      taskId,
      type,
      startTime: serverTimestamp(),
      completed: false,
      duration: 0,
    });
    return ref.id;
  }

  async completeSession(sessionId: string, duration: number): Promise<void> {
    await updateDoc(doc(db, 'pomodoroSessions', sessionId), {
      endTime: serverTimestamp(),
      duration,
      completed: true,
    });
  }

  async getUserSessions(userId: string): Promise<PomodoroSession[]> {
    const q = query(collection(db, 'pomodoroSessions'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const sessions = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PomodoroSession));
    return sessions.sort((a, b) => {
      const tA = a.startTime instanceof Date ? a.startTime.getTime() : (a.startTime as any)?.toMillis?.() ?? 0;
      const tB = b.startTime instanceof Date ? b.startTime.getTime() : (b.startTime as any)?.toMillis?.() ?? 0;
      return tB - tA;
    });
  }
}

export const pomodoroRepository = new PomodoroRepository();

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Task, TaskStatus, Subtask } from '@/shared/types/task';

export interface ITaskRepository {
  getUserTasks(userId: string): Promise<Task[]>;
  createTask(userId: string, task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>): Promise<Task>;
  updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
  moveTask(taskId: string, newStatus: TaskStatus, newOrder: number): Promise<void>;
  reorderTasks(tasks: { id: string; order: number }[]): Promise<void>;
  incrementPomodoro(taskId: string, current: number): Promise<void>;
  updateSubtasks(taskId: string, subtasks: Subtask[]): Promise<void>;
}

export class TaskRepository implements ITaskRepository {
  async getUserTasks(userId: string): Promise<Task[]> {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
    const statusOrder: Record<string, number> = { todo: 0, doing: 1, done: 2 };
    return tasks.sort((a, b) => {
      const diff = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
      return diff !== 0 ? diff : (a.order ?? 0) - (b.order ?? 0);
    });
  }

  async createTask(
    userId: string,
    task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>,
  ): Promise<Task> {
    const ref = await addDoc(collection(db, 'tasks'), {
      ...task,
      userId,
      completedPomodoros: 0,
      createdAt: serverTimestamp(),
    });
    return { ...task, id: ref.id, userId, completedPomodoros: 0, createdAt: new Date() };
  }

  async updateTask(
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>,
  ): Promise<void> {
    await updateDoc(doc(db, 'tasks', taskId), { ...updates, updatedAt: serverTimestamp() });
  }

  async deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(db, 'tasks', taskId));
  }

  async moveTask(taskId: string, newStatus: TaskStatus, newOrder: number): Promise<void> {
    await updateDoc(doc(db, 'tasks', taskId), {
      status: newStatus,
      order: newOrder,
      updatedAt: serverTimestamp(),
    });
  }

  async reorderTasks(tasks: { id: string; order: number }[]): Promise<void> {
    const batch = writeBatch(db);
    tasks.forEach(({ id, order }) => batch.update(doc(db, 'tasks', id), { order }));
    await batch.commit();
  }

  async incrementPomodoro(taskId: string, current: number): Promise<void> {
    await updateDoc(doc(db, 'tasks', taskId), {
      completedPomodoros: current + 1,
      updatedAt: serverTimestamp(),
    });
  }

  async updateSubtasks(taskId: string, subtasks: Subtask[]): Promise<void> {
    await updateDoc(doc(db, 'tasks', taskId), { subtasks, updatedAt: serverTimestamp() });
  }
}

export const taskRepository = new TaskRepository();

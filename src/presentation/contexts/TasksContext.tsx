import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { taskRepository } from '@/infrastructure/repositories/taskRepository';
import type { Task, TaskStatus, Subtask } from '@/shared/types/task';
import { useAuth } from './AuthContext';

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask(task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>): Promise<void>;
  moveTaskTo(taskId: string, newStatus: TaskStatus): Promise<void>;
  editTask(taskId: string, updates: Partial<Task>): Promise<void>;
  removeTask(taskId: string): Promise<void>;
  addCompletedPomodoro(taskId: string): Promise<void>;
  setSubtasks(taskId: string, subtasks: Subtask[]): Promise<void>;
  refetch(): void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    if (!user) { setTasks([]); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    taskRepository.getUserTasks(user.uid)
      .then((data) => { if (!cancelled) setTasks(data); })
      .catch(() => { if (!cancelled) setError('Não foi possível carregar as tarefas.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, fetchCount]);

  const refetch = useCallback(() => setFetchCount((c) => c + 1), []);

  const addTask = useCallback(
    async (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>) => {
      if (!user) return;
      const optimistic: Task = {
        ...task, id: `opt-${Date.now()}`, userId: user.uid,
        completedPomodoros: 0, createdAt: new Date(),
      };
      setTasks((prev) => [...prev, optimistic]);
      try {
        const created = await taskRepository.createTask(user.uid, task);
        setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? created : t)));
      } catch {
        setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
        throw new Error('Erro ao criar tarefa.');
      }
    },
    [user],
  );

  const moveTaskTo = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      const newOrder = tasks.filter((t) => t.status === newStatus).length;
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, order: newOrder } : t)));
      await taskRepository.moveTask(taskId, newStatus, newOrder).catch(refetch);
    },
    [tasks, refetch],
  );

  const editTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
      try {
        await taskRepository.updateTask(taskId, updates);
      } catch {
        refetch();
        throw new Error('Erro ao atualizar tarefa.');
      }
    },
    [refetch],
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      const snapshot = tasks;
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      await taskRepository.deleteTask(taskId).catch(() => setTasks(snapshot));
    },
    [tasks],
  );

  const addCompletedPomodoro = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const next = task.completedPomodoros + 1;
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completedPomodoros: next } : t)));
      await taskRepository.incrementPomodoro(taskId, task.completedPomodoros).catch(refetch);
    },
    [tasks, refetch],
  );

  const setSubtasks = useCallback(
    async (taskId: string, subtasks: Subtask[]) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, subtasks } : t)));
      await taskRepository.updateSubtasks(taskId, subtasks).catch(refetch);
    },
    [refetch],
  );

  return (
    <TasksContext.Provider value={{ tasks, loading, error, addTask, moveTaskTo, editTask, removeTask, addCompletedPomodoro, setSubtasks, refetch }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks deve ser usado dentro de TasksProvider');
  return ctx;
}

import { Timestamp } from 'firebase/firestore';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskStatus = 'todo' | 'doing' | 'done';
export type CognitiveLoad = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  estimatedPomodoros: number;
  completedPomodoros: number;
  tags: string[];
  cognitiveLoad: CognitiveLoad;
  subtasks: Subtask[];
  createdAt: Timestamp | Date;
  dueDate?: Timestamp | Date;
  order: number;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  taskId: string;
  startTime: Timestamp | Date;
  endTime?: Timestamp | Date;
  duration: number;
  completed: boolean;
  type: 'focus' | 'shortBreak' | 'longBreak';
}

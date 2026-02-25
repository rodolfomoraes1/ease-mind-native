import type { CognitiveLoad, TaskStatus, PomodoroSession } from '../types/task';

export const POMODORO_DURATIONS: Record<PomodoroSession['type'], number> = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

export const COGNITIVE_LOAD_COLORS: Record<CognitiveLoad, string> = {
  low: '#4ECDC4',
  medium: '#FFD93D',
  high: '#FF6B6B',
};

export const COGNITIVE_LOAD_LABELS: Record<CognitiveLoad, string> = {
  low: 'Leve',
  medium: 'Moderada',
  high: 'Intensa',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'A Fazer',
  doing: 'Em Andamento',
  done: 'Concluído',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  todo: '#667EEA',
  doing: '#F6AD55',
  done: '#68D391',
};

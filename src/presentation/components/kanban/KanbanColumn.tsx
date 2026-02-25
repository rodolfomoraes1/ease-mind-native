import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import type { Task, TaskStatus } from '@/shared/types/task';
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '@/shared/constants/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  maxTasks?: number;
  onTaskPress(task: Task): void;
  onStartPomodoro(task: Task): void;
  onAddTask?(): void;
}

export function KanbanColumn({ status, tasks, maxTasks, onTaskPress, onStartPomodoro, onAddTask }: KanbanColumnProps) {
  const label = TASK_STATUS_LABELS[status];
  const colorHex = TASK_STATUS_COLORS[status];
  const isAtLimit = maxTasks !== undefined && tasks.length >= maxTasks;

  return (
    <View style={{ width: 300, marginRight: 14, flexShrink: 0 }}>
      {/* Header do estilo web: card branco com border-top colorida */}
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 10,
        borderTopWidth: 4, borderTopColor: colorHex,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
        borderWidth: 1, borderColor: '#F0F0F0',
        paddingHorizontal: 14, paddingVertical: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colorHex }} />
          <Text style={{ fontWeight: '700', color: '#1F2937', fontSize: 15 }}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ backgroundColor: `${colorHex}22`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colorHex }}>
              {tasks.length}{maxTasks ? `/${maxTasks}` : ''}
            </Text>
          </View>
          {onAddTask && !isAtLimit && (
            <TouchableOpacity
              onPress={onAddTask}
              style={{
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: colorHex,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '300', marginTop: -1 }}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isAtLimit && (
        <View style={{
          backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FCD34D',
          borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10,
        }}>
          <Text style={{ color: '#92400E', fontSize: 12, fontWeight: '500' }}>⚠️ Limite atingido para esta coluna</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {tasks.length === 0 && (
          <View style={{
            backgroundColor: '#F9FAFB',
            borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB',
            borderRadius: 16, paddingVertical: 36, alignItems: 'center',
          }}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>📋</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Nenhuma tarefa</Text>
          </View>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() => onTaskPress(task)}
            onStartPomodoro={() => onStartPomodoro(task)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

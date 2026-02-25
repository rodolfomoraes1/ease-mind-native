import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Task } from '@/shared/types/task';
import { COGNITIVE_LOAD_COLORS } from '@/shared/constants/task';

interface TaskCardProps {
  task: Task;
  onPress?(): void;
  onStartPomodoro?(): void;
  onMoveLeft?(): void;
  onMoveRight?(): void;
  rightAction?: React.ReactNode;
}

export function TaskCard({ task, onPress, onStartPomodoro, onMoveLeft, onMoveRight, rightAction }: TaskCardProps) {
  const loadColor = COGNITIVE_LOAD_COLORS[task.cognitiveLoad];
  const pomodoroProgress = task.estimatedPomodoros > 0
    ? Math.min((task.completedPomodoros / task.estimatedPomodoros) * 100, 100)
    : 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white rounded-2xl mb-3 shadow-sm overflow-hidden"
      style={{ borderLeftWidth: 4, borderLeftColor: loadColor }}
    >
      <View className="h-1 bg-gray-100">
        <View style={{ width: `${pomodoroProgress}%`, height: 4, backgroundColor: loadColor }} />
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <Text
            className="flex-1 font-semibold text-base text-gray-800 mr-2"
            numberOfLines={2}
            style={{ textDecorationLine: task.status === 'done' ? 'line-through' : 'none' }}
          >
            {task.title}
          </Text>
          {rightAction}
        </View>

        {task.description ? (
          <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>{task.description}</Text>
        ) : null}

        {task.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mt-2">
            {task.tags.slice(0, 3).map((tag) => (
              <View key={tag} className="bg-gray-100 rounded-full px-2 py-0.5">
                <Text className="text-xs text-gray-600">{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="flex-row justify-between items-center mt-3">
          <TouchableOpacity
            onPress={onStartPomodoro}
            className="flex-row items-center bg-indigo-50 rounded-lg px-3 py-1.5"
          >
            <Text className="text-xs text-indigo-600 font-medium">
              ⏱ {task.completedPomodoros}/{task.estimatedPomodoros}
            </Text>
          </TouchableOpacity>

          <View style={{ backgroundColor: `${loadColor}22`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ color: loadColor, fontSize: 11, fontWeight: '600' }}>
              {task.cognitiveLoad === 'low' ? 'Leve' : task.cognitiveLoad === 'medium' ? 'Moderada' : 'Intensa'}
            </Text>
          </View>
        </View>

        {/* Botões de mover entre colunas */}
        {(onMoveLeft || onMoveRight) && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 6, marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
            {onMoveLeft && (
              <TouchableOpacity
                onPress={onMoveLeft}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}
              >
                <Ionicons name="arrow-back" size={13} color="#6B7280" />
                <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '600' }}>Voltar</Text>
              </TouchableOpacity>
            )}
            {onMoveRight && (
              <TouchableOpacity
                onPress={onMoveRight}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#667EEA', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}
              >
                <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600' }}>Avançar</Text>
                <Ionicons name="arrow-forward" size={13} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

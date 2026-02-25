import React from 'react';
import { View, Text } from 'react-native';
import type { Task } from '@/shared/types/task';
import { COGNITIVE_LOAD_COLORS, TASK_STATUS_LABELS } from '@/shared/constants/task';

interface TaskCardProps {
  task: Task;
  onPress?(): void;
  onStartPomodoro?(): void;
  rightAction?: React.ReactNode;
}

import { TouchableOpacity } from 'react-native';

export function TaskCard({ task, onPress, onStartPomodoro, rightAction }: TaskCardProps) {
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
      </View>
    </TouchableOpacity>
  );
}

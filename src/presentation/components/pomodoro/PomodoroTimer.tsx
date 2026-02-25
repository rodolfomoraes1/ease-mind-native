import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface PomodoroTimerProps {
  phase: 'focus' | 'shortBreak' | 'longBreak';
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  pomodoroCount: number;
  taskTitle?: string;
  onStart(): void;
  onPause(): void;
  onReset(): void;
  onComplete(): void;
}

const PHASE_LABELS: Record<string, string> = {
  focus: 'Foco',
  shortBreak: 'Pausa Curta',
  longBreak: 'Pausa Longa',
};

const PHASE_COLORS: Record<string, string> = {
  focus: '#667EEA',
  shortBreak: '#4ECDC4',
  longBreak: '#48BB78',
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function PomodoroTimer({
  phase,
  secondsLeft,
  totalSeconds,
  isRunning,
  pomodoroCount,
  taskTitle,
  onStart,
  onPause,
  onReset,
  onComplete,
}: PomodoroTimerProps) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const color = PHASE_COLORS[phase];

  return (
    <View className="items-center">
      {taskTitle && (
        <Text className="text-gray-500 text-sm mb-1 px-6 text-center" numberOfLines={1}>
          🎯 {taskTitle}
        </Text>
      )}

      <Text className="font-bold text-base mb-4" style={{ color }}>
        {PHASE_LABELS[phase]}
      </Text>

      <View className="relative items-center justify-center mb-6">
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View className="absolute items-center">
          <Text className="text-5xl font-bold text-gray-800 tabular-nums">
            {pad(minutes)}:{pad(seconds)}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            🍅 ×{pomodoroCount}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-4 mb-4">
        <TouchableOpacity
          onPress={onReset}
          className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
        >
          <Text className="text-xl">↺</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isRunning ? onPause : onStart}
          className="w-16 h-16 rounded-full items-center justify-center shadow-md"
          style={{ backgroundColor: color }}
        >
          <Text className="text-3xl text-white">{isRunning ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        {phase === 'focus' && (
          <TouchableOpacity
            onPress={onComplete}
            className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
          >
            <Text className="text-xl">✅</Text>
          </TouchableOpacity>
        )}
        {phase !== 'focus' && <View className="w-12 h-12" />}
      </View>
    </View>
  );
}

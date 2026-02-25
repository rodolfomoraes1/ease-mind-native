import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTasks } from '@/presentation/contexts/TasksContext';
import { usePomodoro } from '@/presentation/hooks/usePomodoro';
import { PomodoroTimer } from '@/presentation/components/pomodoro/PomodoroTimer';
import type { MainTabsParamList } from '@/presentation/navigation/AppNavigator';
import { COGNITIVE_LOAD_COLORS } from '@/shared/constants/task';

type PomodoroRoute = RouteProp<MainTabsParamList, 'Pomodoro'>;

export function PomodoroScreen() {
  const route = useRoute<PomodoroRoute>();
  const { tasks, addCompletedPomodoro } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(route.params?.taskId ?? null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const {
    phase,
    secondsLeft,
    totalSeconds,
    isRunning,
    pomodoroCount,
    start,
    pause,
    reset,
    complete,
  } = usePomodoro({
    taskId: selectedTaskId ?? undefined,
    onPomodoroComplete: (completedTaskId?: string) => {
      if (completedTaskId) addCompletedPomodoro(completedTaskId);
    },
  });

  const activeTasks = tasks.filter((t) => t.status !== 'done');

  const phaseColors: Record<string, [string, string]> = {
    focus:       ['#667EEA', '#764BA2'],
    shortBreak:  ['#48BB78', '#38A169'],
    longBreak:   ['#4299E1', '#2B6CB0'],
  };
  const gradientColors = phaseColors[phase] ?? phaseColors.focus;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header gradiente muda cor por fase */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500' }}>Sessão de Foco</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>Pomodoro 🍅</Text>
          {selectedTask && (
            <View style={{
              marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
              alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
            }}>
              <View style={{
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: COGNITIVE_LOAD_COLORS[selectedTask.cognitiveLoad],
              }} />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }} numberOfLines={1}>
                {selectedTask.title}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Timer card */}
        <View style={{
          marginHorizontal: 16, marginTop: -1,
          backgroundColor: '#fff', borderRadius: 24,
          paddingVertical: 28, paddingHorizontal: 16,
          alignItems: 'center',
          shadowColor: '#667EEA', shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
          borderWidth: 1, borderColor: '#EEF2FF',
        }}>
          <PomodoroTimer
            phase={phase}
            secondsLeft={secondsLeft}
            totalSeconds={totalSeconds}
            isRunning={isRunning}
            pomodoroCount={pomodoroCount}
            taskTitle={selectedTask?.title}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onComplete={complete}
          />
        </View>

        {/* Seletor de tarefa */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontWeight: '700', color: '#374151', fontSize: 14 }}>
              {selectedTaskId ? '📌 Tarefa associada' : '🎯 Associar a uma tarefa'}
            </Text>
            {selectedTaskId && (
              <TouchableOpacity onPress={() => setSelectedTaskId(null)}>
                <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600' }}>Remover</Text>
              </TouchableOpacity>
            )}
          </View>

          {activeTasks.length === 0 ? (
            <View style={{
              backgroundColor: '#F9FAFB', borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB',
              borderRadius: 16, paddingVertical: 24, alignItems: 'center',
            }}>
              <Text style={{ fontSize: 28, marginBottom: 6 }}>📋</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Nenhuma tarefa ativa</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10, paddingBottom: 4 }}>
                {activeTasks.map((task) => {
                  const selected = task.id === selectedTaskId;
                  const loadColor = COGNITIVE_LOAD_COLORS[task.cognitiveLoad];
                  return (
                    <TouchableOpacity
                      key={task.id}
                      onPress={() => setSelectedTaskId(selected ? null : task.id)}
                      style={{
                        maxWidth: 200,
                        paddingHorizontal: 14, paddingVertical: 12,
                        borderRadius: 16, borderWidth: 2,
                        backgroundColor: selected ? '#667EEA' : '#fff',
                        borderColor: selected ? '#667EEA' : '#E5E7EB',
                        shadowColor: selected ? '#667EEA' : 'transparent',
                        shadowOpacity: 0.25, shadowRadius: 8, elevation: selected ? 4 : 0,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: selected ? 'rgba(255,255,255,0.7)' : loadColor }} />
                        <Text
                          style={{ fontSize: 13, fontWeight: '700', color: selected ? '#fff' : '#1F2937' }}
                          numberOfLines={1}
                        >
                          {task.title}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 11, color: selected ? 'rgba(255,255,255,0.75)' : '#9CA3AF' }}>
                        🍅 {task.completedPomodoros}/{task.estimatedPomodoros}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
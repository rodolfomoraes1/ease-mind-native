import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTasks } from '@/presentation/contexts/TasksContext';
import { useUserInfo } from '@/presentation/contexts/UserInfoContext';
import { KanbanColumn } from '@/presentation/components/kanban/KanbanColumn';
import { TaskModal } from '@/presentation/components/kanban/TaskModal';
import { getProfileConfig } from '@/shared/constants/navigationProfile';
import type { Task, TaskStatus } from '@/shared/types/task';
import type { MainTabsParamList } from '@/presentation/navigation/AppNavigator';

type NavProp = BottomTabNavigationProp<MainTabsParamList, 'Kanban'>;

const ALL_STATUSES: TaskStatus[] = ['todo', 'doing', 'done'];

export function KanbanScreen() {
  const { tasks, addTask, editTask, removeTask } = useTasks();
  const { userInfo } = useUserInfo();
  const navigation = useNavigation<NavProp>();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Task | undefined>(undefined);
  const [defaultStatus, setDefaultStatus] = React.useState<TaskStatus>('todo');

  const profile = userInfo?.navigationProfile ?? 'beginner';
  const config = getProfileConfig(profile);
  const visibleStatuses = config.simplifiedKanban ? ALL_STATUSES.slice(0, 2) : ALL_STATUSES;

  const tasksByStatus = React.useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], doing: [], done: [] };
    tasks.forEach((t) => map[t.status]?.push(t));
    return map;
  }, [tasks]);

  const handleAddTask = (status: TaskStatus) => {
    setEditTarget(undefined);
    setDefaultStatus(status);
    setModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditTarget(task);
    setModalVisible(true);
  };

  const handleLongPress = (task: Task) => {
    Alert.alert(task.title, 'O que deseja fazer?', [
      { text: 'Editar', onPress: () => handleEditTask(task) },
      { text: 'Excluir', style: 'destructive', onPress: () => removeTask(task.id) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSubmit = async (data: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>) => {
    if (editTarget) {
      await editTask(editTarget.id, data);
    } else {
      await addTask({ ...data, status: defaultStatus });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }} edges={['top']}>
      {/* Header gradiente igual ao web */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500' }}>Organização</Text>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>Quadro Kanban</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleAddTask('todo')}
            style={{
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '300', marginTop: -2 }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Chips de contagem */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          {visibleStatuses.map((status) => {
            const colors: Record<TaskStatus, string> = { todo: '#A78BFA', doing: '#FCD34D', done: '#6EE7B7' };
            const labels: Record<TaskStatus, string> = { todo: 'A Fazer', doing: 'Andamento', done: 'Concluído' };
            return (
              <View key={status} style={{
                flexDirection: 'row', alignItems: 'center', gap: 5,
                backgroundColor: 'rgba(255,255,255,0.15)',
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
              }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors[status] }} />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                  {labels[status]} · {tasksByStatus[status].length}
                </Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 16, paddingTop: 16 }}
        style={{ flex: 1 }}
      >
        {visibleStatuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            maxTasks={status === 'doing' ? config.maxTasksInDoing : undefined}
            onTaskPress={handleEditTask}
            onStartPomodoro={(task) => navigation.navigate('Pomodoro', { taskId: task.id })}
            onAddTask={() => handleAddTask(status)}
          />
        ))}
      </ScrollView>

      <TaskModal
        visible={modalVisible}
        initialData={editTarget}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}
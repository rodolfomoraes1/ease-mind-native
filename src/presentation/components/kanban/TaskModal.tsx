import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Task, TaskStatus, CognitiveLoad, Subtask } from '@/shared/types/task';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { generateId } from '@/shared/utils/helpers';

interface TaskFormState {
  title: string;
  description: string;
  cognitiveLoad: CognitiveLoad;
  estimatedPomodoros: number;
  tags: string;
  status: TaskStatus;
  subtasks: Subtask[];
}

interface TaskModalProps {
  visible: boolean;
  initialData?: Task;
  onClose(): void;
  onSubmit(data: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completedPomodoros'>): Promise<void>;
}

const LOAD_OPTIONS: { value: CognitiveLoad; label: string; color: string }[] = [
  { value: 'low', label: 'Leve', color: '#4ECDC4' },
  { value: 'medium', label: 'Moderada', color: '#FFD93D' },
  { value: 'high', label: 'Intensa', color: '#FF6B6B' },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'A Fazer' },
  { value: 'doing', label: 'Em Andamento' },
  { value: 'done', label: 'Concluído' },
];

export function TaskModal({ visible, initialData, onClose, onSubmit }: TaskModalProps) {
  const [form, setForm] = React.useState<TaskFormState>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    cognitiveLoad: initialData?.cognitiveLoad ?? 'medium',
    estimatedPomodoros: initialData?.estimatedPomodoros ?? 2,
    tags: initialData?.tags.join(', ') ?? '',
    status: initialData?.status ?? 'todo',
    subtasks: initialData?.subtasks ?? [],
  });
  const [loading, setLoading] = React.useState(false);
  const [newSubtask, setNewSubtask] = React.useState('');

  React.useEffect(() => {
    if (visible) {
      setForm({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        cognitiveLoad: initialData?.cognitiveLoad ?? 'medium',
        estimatedPomodoros: initialData?.estimatedPomodoros ?? 2,
        tags: initialData?.tags.join(', ') ?? '',
        status: initialData?.status ?? 'todo',
        subtasks: initialData?.subtasks ?? [],
      });
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        cognitiveLoad: form.cognitiveLoad,
        estimatedPomodoros: form.estimatedPomodoros,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: form.status,
        subtasks: form.subtasks,
        order: 0,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setForm((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: generateId(), title: newSubtask.trim(), completed: false }],
    }));
    setNewSubtask('');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#F8F9FE' }}>
        {/* Header gradiente */}
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                paddingHorizontal: 14, paddingVertical: 6,
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>
              {initialData ? '✏️ Editar Tarefa' : '✨ Nova Tarefa'}
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={{
                paddingHorizontal: 14, paddingVertical: 6,
                backgroundColor: loading ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)',
                borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{loading ? '...' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
          {/* Título */}
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Título *</Text>
            <TextInput
              value={form.title}
              onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
              placeholder="Nome da tarefa"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
                fontSize: 15, color: '#1F2937',
                borderWidth: 1, borderColor: '#E5E7EB',
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
              }}
            />
          </View>

          {/* Descrição */}
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Descrição</Text>
            <TextInput
              value={form.description}
              onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
              placeholder="Opcional"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
                fontSize: 14, color: '#1F2937', minHeight: 72, textAlignVertical: 'top',
                borderWidth: 1, borderColor: '#E5E7EB',
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
              }}
            />
          </View>

          {/* Carga Cognitiva */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Carga Cognitiva</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {LOAD_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setForm((p) => ({ ...p, cognitiveLoad: opt.value }))}
                style={{
                  flex: 1, borderWidth: 2, borderColor: opt.color,
                  backgroundColor: form.cognitiveLoad === opt.value ? opt.color : '#fff',
                  borderRadius: 12, paddingVertical: 10, alignItems: 'center',
                  shadowColor: form.cognitiveLoad === opt.value ? opt.color : 'transparent',
                  shadowOpacity: 0.3, shadowRadius: 6, elevation: form.cognitiveLoad === opt.value ? 3 : 0,
                }}
              >
                <Text style={{ color: form.cognitiveLoad === opt.value ? '#fff' : opt.color, fontWeight: '700', fontSize: 13 }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pomodoros */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            🍅 Pomodoros: {form.estimatedPomodoros}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setForm((p) => ({ ...p, estimatedPomodoros: n }))}
                style={{
                  width: 42, height: 42, borderRadius: 21,
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: form.estimatedPomodoros === n ? '#667EEA' : '#fff',
                  borderWidth: 2, borderColor: form.estimatedPomodoros === n ? '#667EEA' : '#E5E7EB',
                }}
              >
                <Text style={{ color: form.estimatedPomodoros === n ? '#fff' : '#6B7280', fontWeight: '700' }}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags */}
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Tags (separadas por vírgula)</Text>
            <TextInput
              value={form.tags}
              onChangeText={(v) => setForm((p) => ({ ...p, tags: v }))}
              placeholder="estudo, react, urgente"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
                fontSize: 14, color: '#1F2937',
                borderWidth: 1, borderColor: '#E5E7EB',
              }}
            />
          </View>

          {/* Status */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Status</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setForm((p) => ({ ...p, status: opt.value }))}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 2,
                  backgroundColor: form.status === opt.value ? '#667EEA' : '#fff',
                  borderColor: form.status === opt.value ? '#667EEA' : '#E5E7EB',
                }}
              >
                <Text style={{ color: form.status === opt.value ? '#fff' : '#6B7280', fontWeight: '600', fontSize: 13 }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Subtarefas */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Subtarefas</Text>
          {form.subtasks.map((sub) => (
            <View key={sub.id} style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6,
              borderWidth: 1, borderColor: '#F3F4F6',
            }}>
              <TouchableOpacity
                onPress={() =>
                  setForm((p) => ({ ...p, subtasks: p.subtasks.map((s) => s.id === sub.id ? { ...s, completed: !s.completed } : s) }))
                }
                style={{ marginRight: 10 }}
              >
                <Text style={{ fontSize: 18 }}>{sub.completed ? '✅' : '⬜'}</Text>
              </TouchableOpacity>
              <Text style={{ flex: 1, fontSize: 14, color: sub.completed ? '#9CA3AF' : '#374151', textDecorationLine: sub.completed ? 'line-through' : 'none' }}>
                {sub.title}
              </Text>
              <TouchableOpacity onPress={() => setForm((p) => ({ ...p, subtasks: p.subtasks.filter((s) => s.id !== sub.id) }))}>
                <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '700' }}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
            <TextInput
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder="Nova subtarefa"
              placeholderTextColor="#9CA3AF"
              style={{
                flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
                fontSize: 14, color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB',
              }}
              onSubmitEditing={addSubtask}
            />
            <TouchableOpacity
              onPress={addSubtask}
              style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: '#667EEA', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '300', marginTop: -2 }}>+</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
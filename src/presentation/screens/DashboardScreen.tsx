import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useUserInfo } from '@/presentation/contexts/UserInfoContext';
import { useTasks } from '@/presentation/contexts/TasksContext';
import type { MainTabsParamList } from '@/presentation/navigation/AppNavigator';

type NavProp = BottomTabNavigationProp<MainTabsParamList, 'Dashboard'>;

const PROFILE_LABEL: Record<string, { text: string }> = {
  beginner:     { text: 'Iniciante 🌱' },
  intermediate: { text: 'Intermediário 🌿' },
  advanced:     { text: 'Avançado 🌳' },
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <View style={{
      flex: 1, backgroundColor: '#fff', borderRadius: 16,
      paddingVertical: 14, paddingHorizontal: 6,
      alignItems: 'center', marginHorizontal: 4,
      shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color }}>{value}</Text>
      <Text style={{ fontSize: 10, color: '#6B7280', marginTop: 3, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

function QuickAction({ emoji, title, subtitle, onPress }: { emoji: string; title: string; subtitle: string; onPress(): void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#fff', borderRadius: 16,
        paddingHorizontal: 20, paddingVertical: 16,
        flexDirection: 'row', alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
        borderWidth: 1, borderColor: '#F3F4F6',
      }}
    >
      <Text style={{ fontSize: 26, marginRight: 16 }}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', color: '#1F2937', fontSize: 15 }}>{title}</Text>
        <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 1 }}>{subtitle}</Text>
      </View>
      <Text style={{ color: '#D1D5DB', fontSize: 22, fontWeight: '300' }}>›</Text>
    </TouchableOpacity>
  );
}

export function DashboardScreen() {
  const { user, logout } = useAuth();
  const { userInfo } = useUserInfo();
  const { tasks } = useTasks();
  const navigation = useNavigation<NavProp>();

  const todoCount  = tasks.filter((t) => t.status === 'todo').length;
  const doingCount = tasks.filter((t) => t.status === 'doing').length;
  const doneCount  = tasks.filter((t) => t.status === 'done').length;
  const totalPomodoros = tasks.reduce((sum, t) => sum + (t.completedPomodoros ?? 0), 0);
  const highLoad = tasks.filter((t) => t.cognitiveLoad === 'high' && t.status !== 'done').length;

  const displayName = userInfo?.name ?? user?.email?.split('@')[0] ?? 'Usuário';
  const profile = userInfo?.navigationProfile ?? 'beginner';
  const profileBadge = PROFILE_LABEL[profile];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header gradiente igual ao web */}
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 72, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: 'rgba(255,255,255,0.25)',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
              }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>{getInitials(displayName)}</Text>
              </View>
              <View>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Olá 👋</Text>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }} numberOfLines={1}>{displayName}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={logout}
              style={{ paddingHorizontal: 14, paddingVertical: 7, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Sair</Text>
            </TouchableOpacity>
          </View>
          <View style={{
            marginTop: 14,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
            alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
          }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{profileBadge.text}</Text>
          </View>
        </LinearGradient>

        {/* Stats flutuando sobre o header */}
        <View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: -36, marginBottom: 20 }}>
          <StatCard label="A Fazer" value={todoCount} color="#667EEA" />
          <StatCard label="Andamento" value={doingCount} color="#F6AD55" />
          <StatCard label="Concluídas" value={doneCount} color="#48BB78" />
          <StatCard label="🍅 Foco" value={totalPomodoros} color="#EF4444" />
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {/* UserInfo card estilo web — left border #667EEA */}
          <View style={{
            backgroundColor: '#fff', borderRadius: 16,
            padding: 18, marginBottom: 20,
            borderLeftWidth: 4, borderLeftColor: '#667EEA',
            borderWidth: 1, borderColor: '#E5E7EB',
            shadowColor: '#667EEA', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2,
          }}>
            <Text style={{ fontWeight: '700', color: '#1F2937', fontSize: 14, marginBottom: 12 }}>
              Preferências Cognitivas
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {[
                { label: '🎯 Foco', active: userInfo?.cognitivePreferences?.focusMode },
                { label: '📝 Resumo', active: userInfo?.cognitivePreferences?.summaryMode },
                { label: '⚡ Alertas', active: userInfo?.cognitivePreferences?.cognitiveAlerts },
                { label: '✨ Animações', active: userInfo?.cognitivePreferences?.animationsEnabled },
              ].map(({ label, active }) => (
                <View key={label} style={{
                  paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
                  backgroundColor: active ? '#EEF2FF' : '#F9FAFB',
                  borderWidth: 1, borderColor: active ? '#667EEA88' : '#E5E7EB',
                }}>
                  <Text style={{ fontSize: 12, color: active ? '#667EEA' : '#9CA3AF', fontWeight: active ? '600' : '400' }}>{label}</Text>
                </View>
              ))}
            </View>
            {highLoad > 0 && (
              <View style={{ marginTop: 12, backgroundColor: '#FEF2F2', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 15 }}>⚠️</Text>
                <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '500' }}>
                  {highLoad} tarefa{highLoad > 1 ? 's' : ''} com alta carga cognitiva
                </Text>
              </View>
            )}
          </View>

          {/* Ações rápidas */}
          <Text style={{ fontWeight: '700', color: '#374151', fontSize: 15, marginBottom: 12 }}>Ações Rápidas</Text>
          <QuickAction emoji="📋" title="Quadro Kanban" subtitle="Gerencie suas tarefas" onPress={() => navigation.navigate('Kanban')} />
          <QuickAction emoji="🍅" title="Pomodoro" subtitle="Iniciar sessão de foco" onPress={() => navigation.navigate('Pomodoro')} />
          <QuickAction emoji="⚙️" title="Configurações" subtitle="Preferências cognitivas" onPress={() => navigation.navigate('Settings')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



import React from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserInfo } from '@/presentation/contexts/UserInfoContext';
import { useCognitiveFeatures } from '@/presentation/hooks/useCognitiveFeatures';
import type { NavigationProfile } from '@/shared/types/user';

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 10 }}>
      <View style={{ width: 3, height: 14, backgroundColor: '#667EEA', borderRadius: 2 }} />
      <Text style={{ fontSize: 11, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1.2 }}>{title}</Text>
    </View>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description?: string;
  value: boolean;
  onToggle(v: boolean): void;
}) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: '#fff', borderRadius: 14,
      paddingHorizontal: 16, paddingVertical: 14, marginBottom: 6,
      borderWidth: 1, borderColor: value ? '#EEF2FF' : '#F3F4F6',
      borderLeftWidth: value ? 3 : 1, borderLeftColor: value ? '#667EEA' : '#F3F4F6',
      shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    }}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}>{label}</Text>
        {description && <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#667EEA' }}
        thumbColor="#fff"
      />
    </View>
  );
}

function ChipSelector<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange(v: T): void;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={{
            paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 2,
            backgroundColor: value === opt.value ? '#667EEA' : '#F9FAFB',
            borderColor: value === opt.value ? '#667EEA' : '#E5E7EB',
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: value === opt.value ? '#fff' : '#6B7280' }}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function SettingsScreen() {
  const { userInfo, updateCognitivePrefs, updateUserInfo } = useUserInfo();
  const prefs = userInfo?.cognitivePreferences;
  const {
    toggleFocusMode,
    toggleSummaryMode,
    toggleAnimations,
    toggleCognitiveAlerts,
    setFontSize,
    setSpacingLevel,
    setComplexityLevel,
  } = useCognitiveFeatures();

  if (!prefs) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-400">Carregando...</Text>
      </SafeAreaView>
    );
  }

  const profileOptions: { value: NavigationProfile; label: string }[] = [
    { value: 'beginner', label: '🌱 Iniciante' },
    { value: 'intermediate', label: '🌿 Intermediário' },
    { value: 'advanced', label: '🌳 Avançado' },
  ];

  const handleProfileChange = (profile: NavigationProfile) => {
    updateUserInfo({ navigationProfile: profile });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }} edges={['top']}>
      {/* Header gradiente */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500' }}>Personalização</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>Configurações ⚙️</Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 4 }}>Preferências cognitivas e de interface</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 16 }}>

        <SectionTitle title="Perfil" />
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 8,
          borderLeftWidth: 4, borderLeftColor: '#667EEA',
          borderWidth: 1, borderColor: '#EEF2FF',
          shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
        }}>
          <Text style={{ fontWeight: '600', color: '#374151', fontSize: 14, marginBottom: 12 }}>Nível de experiência</Text>
          <ChipSelector
            options={profileOptions}
            value={userInfo?.navigationProfile ?? 'beginner'}
            onChange={handleProfileChange}
          />
        </View>

        <SectionTitle title="Modos de Foco" />
        <ToggleRow
          label="Modo Foco"
          description="Oculta elementos não essenciais"
          value={prefs.focusMode}
          onToggle={toggleFocusMode}
        />
        <ToggleRow
          label="Modo Resumo"
          description="Exibe apenas informações principais"
          value={prefs.summaryMode}
          onToggle={toggleSummaryMode}
        />
        <ToggleRow
          label="Animações"
          description="Ativa ou desativa animações da interface"
          value={prefs.animationsEnabled}
          onToggle={toggleAnimations}
        />
        <ToggleRow
          label="Alertas Cognitivos"
          description="Aviso quando carga cognitiva está alta"
          value={prefs.cognitiveAlerts}
          onToggle={toggleCognitiveAlerts}
        />

        {/* <SectionTitle title="Interface" />
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 8,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
        }}>
          <Text style={{ fontWeight: '600', color: '#374151', fontSize: 14, marginBottom: 12 }}>Tamanho da fonte</Text>
          <ChipSelector
            options={[
              { value: 'small', label: 'Pequena' },
              { value: 'medium', label: 'Média' },
              { value: 'large', label: 'Grande' },
            ]}
            value={prefs.fontSize}
            onChange={(v) => setFontSize(v)}
          />
        </View>

        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 8,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
        }}>
          <Text style={{ fontWeight: '600', color: '#374151', fontSize: 14, marginBottom: 12 }}>Espaçamento</Text>
          <ChipSelector
            options={[
              { value: 'compact', label: 'Compacto' },
              { value: 'normal', label: 'Normal' },
              { value: 'relaxed', label: 'Espaçado' },
            ]}
            value={prefs.spacingLevel}
            onChange={(v) => setSpacingLevel(v)}
          />
        </View>

        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 8,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
        }}>
          <Text style={{ fontWeight: '600', color: '#374151', fontSize: 14, marginBottom: 12 }}>Complexidade</Text>
          <ChipSelector
            options={[
              { value: 'simple', label: 'Simplificado' },
              { value: 'full', label: 'Completo' },
            ]}
            value={prefs.complexityLevel}
            onChange={(v) => setComplexityLevel(v)}
          />
        </View> */}

        <SectionTitle title="Alertas" />
        <View style={{
          backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 8,
          borderWidth: 1, borderColor: '#F3F4F6',
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
        }}>
          <Text style={{ fontWeight: '600', color: '#374151', fontSize: 14, marginBottom: 12 }}>
            Intervalo de alerta: {prefs.alertIntervalMinutes} min
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[10, 20, 30, 45, 60].map((min) => (
              <TouchableOpacity
                key={min}
                onPress={() => updateCognitivePrefs({ alertIntervalMinutes: min })}
                style={{
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2,
                  backgroundColor: prefs.alertIntervalMinutes === min ? '#667EEA' : '#fff',
                  borderColor: prefs.alertIntervalMinutes === min ? '#667EEA' : '#E5E7EB',
                }}
              >
                <Text style={{ fontWeight: '600', fontSize: 13, color: prefs.alertIntervalMinutes === min ? '#fff' : '#6B7280' }}>
                  {min}min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
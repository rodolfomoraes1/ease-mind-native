import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { formatAuthError } from '@/shared/utils/helpers';
import type { AuthStackParamList } from '@/presentation/navigation/AppNavigator';
import { GlassInput } from '@/presentation/components/common/GlassInput';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<NavProp>();
  const { registerWithEmail } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    setError('');
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password);
    } catch (e: any) {
      setError(formatAuthError(e?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#6b8cff', '#9f7aea']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Image
              source={require('../../../assets/icone-512-512.png')}
              style={{ width: 72, height: 72, marginBottom: 10 }}
              resizeMode="contain"
            />
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', letterSpacing: -0.5 }}>Mind Ease</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 }}>Crie sua conta gratuitamente</Text>
          </View>

          {/* Card glassmorphism */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 20, padding: 28,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
          }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '500', textAlign: 'center', marginBottom: 20 }}>
              Criar conta
            </Text>

            <GlassInput label="Nome" value={name} onChangeText={setName} placeholder="Seu nome completo" />
            <GlassInput label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
            <GlassInput label="Senha" value={password} onChangeText={setPassword} placeholder="Mínimo 6 caracteres" secureTextEntry />
            <GlassInput label="Confirmar senha" value={confirm} onChangeText={setConfirm} placeholder="Repita a senha" secureTextEntry />

            {error ? (
              <View style={{ backgroundColor: 'rgba(255,100,100,0.2)', borderRadius: 10, padding: 10, marginBottom: 12 }}>
                <Text style={{ color: '#ffcccc', fontSize: 13, textAlign: 'center' }}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity onPress={handleRegister} disabled={loading} style={{ borderRadius: 12, overflow: 'hidden', marginTop: 4 }}>
              <LinearGradient
                colors={loading ? ['rgba(102,126,234,0.5)', 'rgba(118,75,162,0.5)'] : ['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 14, alignItems: 'center', borderRadius: 12 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Já tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
            © 2025 Mind Ease · Hackathon Postech
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

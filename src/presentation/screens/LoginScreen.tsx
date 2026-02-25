import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { formatAuthError } from '@/shared/utils/helpers';
import type { AuthStackParamList } from '@/presentation/navigation/AppNavigator';
import { GlassInput } from '@/presentation/components/common/GlassInput';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<NavProp>();
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Image
              source={require('../../../assets/icone-512-512.png')}
              style={{ width: 88, height: 88, marginBottom: 12 }}
              resizeMode="contain"
            />
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', letterSpacing: -0.5, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 }}>
              Mind Ease
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, fontWeight: '300', letterSpacing: 0.5 }}>
              Foco pensado para você
            </Text>
          </View>

          {/* Card glassmorphism */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 20,
            padding: 28,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.25)',
          }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500', textAlign: 'center', marginBottom: 24 }}>
              Bem-vindo
            </Text>

            <GlassInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <GlassInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha"
              secureTextEntry
            />

            {error ? (
              <View style={{ backgroundColor: 'rgba(255,100,100,0.2)', borderRadius: 10, padding: 10, marginBottom: 12 }}>
                <Text style={{ color: '#ffcccc', fontSize: 13, textAlign: 'center' }}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                backgroundColor: loading ? 'rgba(102,126,234,0.5)' : undefined,
                borderRadius: 12, overflow: 'hidden', marginTop: 4,
              }}
            >
              <LinearGradient
                colors={loading ? ['rgba(102,126,234,0.5)', 'rgba(118,75,162,0.5)'] : ['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 14, alignItems: 'center', borderRadius: 12 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Cadastre-se</Text>
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

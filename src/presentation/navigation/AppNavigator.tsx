import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '@/presentation/contexts/AuthContext';
import { LoginScreen } from '@/presentation/screens/LoginScreen';
import { RegisterScreen } from '@/presentation/screens/RegisterScreen';
import { DashboardScreen } from '@/presentation/screens/DashboardScreen';
import { KanbanScreen } from '@/presentation/screens/KanbanScreen';
import { PomodoroScreen } from '@/presentation/screens/PomodoroScreen';
import { SettingsScreen } from '@/presentation/screens/SettingsScreen';

// ---- Param lists ----

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabsParamList = {
  Dashboard: undefined;
  Kanban: undefined;
  Pomodoro: { taskId?: string } | undefined;
  Settings: undefined;
};

// ---- Navigators ----

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

function MainNavigator() {
  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#667EEA',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <MainTabs.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <MainTabs.Screen
        name="Kanban"
        component={KanbanScreen}
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <MainTabs.Screen
        name="Pomodoro"
        component={PomodoroScreen}
        options={{
          tabBarLabel: 'Pomodoro',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🍅" focused={focused} />,
        }}
      />
      <MainTabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Config.',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
        }}
      />
    </MainTabs.Navigator>
  );
}

export function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#667EEA" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

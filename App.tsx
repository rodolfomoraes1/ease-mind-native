import 'react-native-gesture-handler';
import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/presentation/contexts/AuthContext';
import { UserInfoProvider } from '@/presentation/contexts/UserInfoContext';
import { TasksProvider } from '@/presentation/contexts/TasksContext';
import { AppNavigator } from '@/presentation/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <UserInfoProvider>
            <TasksProvider>
              <AppNavigator />
              <StatusBar style="dark" />
            </TasksProvider>
          </UserInfoProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


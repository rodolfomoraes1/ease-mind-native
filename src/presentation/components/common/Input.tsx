import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText(text: string): void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize, error, multiline, numberOfLines }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={`border rounded-xl px-4 py-3 text-base text-gray-800 bg-white ${error ? 'border-red-400' : 'border-gray-200'}`}
        placeholderTextColor="#9CA3AF"
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}

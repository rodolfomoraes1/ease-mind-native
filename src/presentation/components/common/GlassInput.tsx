import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface GlassInputProps extends TextInputProps {
  label: string;
}

export function GlassInput({ label, ...props }: GlassInputProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '500', marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        placeholderTextColor="rgba(255,255,255,0.4)"
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          borderColor: focused ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 13,
          color: '#fff',
          fontSize: 15,
        }}
      />
    </View>
  );
}

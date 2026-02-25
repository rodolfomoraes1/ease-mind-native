import React from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GlassInputProps extends TextInputProps {
  label: string;
}

export function GlassInput({ label, secureTextEntry, ...props }: GlassInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [hidden, setHidden] = React.useState(true);

  const isPassword = secureTextEntry === true;

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '500', marginBottom: 6 }}>
        {label}
      </Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          {...props}
          secureTextEntry={isPassword ? hidden : false}
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
            paddingRight: isPassword ? 48 : 16,
            color: '#fff',
            fontSize: 15,
          }}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            style={{
              position: 'absolute',
              right: 14,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="rgba(255,255,255,0.6)"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

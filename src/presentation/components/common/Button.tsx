import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress(): void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<string, { container: string; text: string }> = {
  primary: { container: 'bg-primary rounded-xl px-6 py-3', text: 'text-white font-semibold text-base' },
  secondary: { container: 'border border-primary rounded-xl px-6 py-3', text: 'text-primary font-semibold text-base' },
  ghost: { container: 'px-6 py-3', text: 'text-primary font-semibold text-base' },
  danger: { container: 'bg-red-500 rounded-xl px-6 py-3', text: 'text-white font-semibold text-base' },
};

export function Button({ title, onPress, variant = 'primary', loading, disabled, fullWidth }: ButtonProps) {
  const styles = variantStyles[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${styles.container} items-center justify-center ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : '#667EEA'} />
      ) : (
        <Text className={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

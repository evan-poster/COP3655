import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TaskMode } from '@/types';

interface ModeToggleProps {
  currentMode: TaskMode;
  onToggle: (mode: TaskMode) => void;
}

export function ModeToggle({ currentMode, onToggle }: ModeToggleProps) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={[
          styles.button,
          currentMode === 'plan' && { backgroundColor: tintColor },
        ]}
        onPress={() => onToggle('plan')}
      >
        <ThemedText
          style={[
            styles.buttonText,
            currentMode === 'plan' && { color: '#FFFFFF' },
          ]}
        >
          Plan
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          currentMode === 'hunt' && { backgroundColor: tintColor },
        ]}
        onPress={() => onToggle('hunt')}
      >
        <ThemedText
          style={[
            styles.buttonText,
            currentMode === 'hunt' && { color: '#FFFFFF' },
          ]}
        >
          Hunt
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

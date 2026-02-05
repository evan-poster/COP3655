import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Task, HuntAction } from '@/types';

interface TaskCardProps {
  task: Task;
  mode: 'compact' | 'full';
  onPress?: () => void;
  onAction?: (action: HuntAction) => void;
}

export function TaskCard({ task, mode, onPress, onAction }: TaskCardProps) {
  const tintColor = useThemeColor({}, 'tint');
  const surfaceColor = useThemeColor({ light: '#FFFFFF', dark: '#1A2332' }, 'background');
  const accentColor = '#FF6B6B';

  if (mode === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <ThemedView style={[styles.compactCard, { backgroundColor: surfaceColor }]}>
          <View style={styles.compactContent}>
            <ThemedText style={styles.compactTitle} numberOfLines={2}>
              {task.title}
            </ThemedText>
            <View style={styles.priorityBadge}>
              <ThemedText style={styles.priority}>{task.priority}</ThemedText>
            </View>
          </View>
        </ThemedView>
      </TouchableOpacity>
    );
  }

  return (
    <ThemedView style={[styles.fullCard, { backgroundColor: surfaceColor }]}>
      <View style={styles.fullContent}>
        <ThemedText style={styles.fullTitle}>{task.title}</ThemedText>
        {task.description && (
          <ThemedText style={styles.description}>{task.description}</ThemedText>
        )}
        <View style={styles.metadata}>
          <ThemedText style={styles.metadataText}>Priority: {task.priority}</ThemedText>
          <ThemedText style={styles.metadataText}>Bucket: {task.bucket}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  compactContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  compactTitle: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  priorityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priority: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  fullCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  fullContent: {
    marginBottom: 20,
  },
  fullTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 24,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metadataText: {
    fontSize: 14,
    opacity: 0.6,
  },
});


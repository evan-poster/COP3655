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
      <TouchableOpacity onPress={onPress}>
        <ThemedView style={[styles.compactCard, { backgroundColor: surfaceColor }]}>
          <View style={styles.compactContent}>
            <ThemedText style={styles.compactTitle}>{task.title}</ThemedText>
            <ThemedText style={styles.priority}>P{task.priority}</ThemedText>
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
      
      {onAction && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => onAction('complete')}
          >
            <ThemedText style={styles.actionButtonText}>✓ Mark Down</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: tintColor }]}
            onPress={() => onAction('putBack')}
          >
            <ThemedText style={styles.actionButtonText}>↻ Put Back</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
            onPress={() => onAction('takeOut')}
          >
            <ThemedText style={styles.actionButtonText}>✕ Take Out</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTitle: {
    fontSize: 16,
    flex: 1,
  },
  priority: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 8,
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
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

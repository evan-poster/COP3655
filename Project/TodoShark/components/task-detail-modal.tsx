import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Task } from '@/types';

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskDetailModal({
  visible,
  task,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailModalProps) {
  const surfaceColor = useThemeColor({ light: '#FFFFFF', dark: '#1A2332' }, 'background');
  const tintColor = useThemeColor({}, 'tint');

  if (!task) return null;

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'active':
        return '#4CAF50';
      case 'waiting':
        return '#FF9800';
      case 'deferred':
        return '#9E9E9E';
      default:
        return tintColor;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ThemedText style={styles.title}>{task.title}</ThemedText>

          {task.description && (
            <ThemedText style={styles.description}>{task.description}</ThemedText>
          )}

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Priority:</ThemedText>
              <View style={[styles.priorityBadge, { backgroundColor: tintColor }]}>
                <ThemedText style={styles.badgeText}>P{task.priority}</ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Bucket:</ThemedText>
              <View style={[styles.bucketBadge, { backgroundColor: getBucketColor(task.bucket) }]}>
                <ThemedText style={styles.badgeText}>
                  {task.bucket.charAt(0).toUpperCase() + task.bucket.slice(1)}
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Created:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {formatDate(task.createdAt)}
              </ThemedText>
            </View>

            {task.completedAt && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Completed:</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {formatDate(task.completedAt)}
                </ThemedText>
              </View>
            )}

            {task.hiddenUntil && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Hidden Until:</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {formatDate(task.hiddenUntil)}
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={onDelete}
          >
            <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.editButton, { backgroundColor: tintColor }]}
            onPress={onEdit}
          >
            <ThemedText style={styles.editButtonText}>Edit</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
  },
  infoSection: {
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    opacity: 0.7,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bucketBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editButton: {
    minHeight: 50,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

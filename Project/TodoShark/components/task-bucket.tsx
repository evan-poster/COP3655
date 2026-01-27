import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TaskCard } from '@/components/task-card';
import { Task } from '@/types';

interface TaskBucketProps {
  title: string;
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  renderTask?: (task: Task) => React.ReactElement;
}

export function TaskBucket({ title, tasks, onTaskPress, renderTask }: TaskBucketProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.count}>{tasks.length}</ThemedText>
      </View>
      <View style={styles.taskList}>
        {tasks.map((task) => (
          renderTask ? (
            renderTask(task)
          ) : (
            <TaskCard
              key={task.id}
              task={task}
              mode="compact"
              onPress={() => onTaskPress(task)}
            />
          )
        ))}
        {tasks.length === 0 && (
          <ThemedText style={styles.emptyText}>No tasks in this bucket</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 16,
    opacity: 0.6,
  },
  taskList: {
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

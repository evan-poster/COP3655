import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ModeToggle } from '@/components/mode-toggle';
import { TaskBucket } from '@/components/task-bucket';
import { TaskCard } from '@/components/task-card';
import { FloatingActionButton } from '@/components/floating-action-button';
import { AddTaskModal } from '@/components/add-task-modal';
import { Task, TaskMode, HuntAction } from '@/types';
import { useTasks } from '@/hooks/use-tasks';

export default function TasksScreen() {
  const [mode, setMode] = useState<TaskMode>('plan');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { tasks, loading, error } = useTasks();

  const activeTasks = tasks.filter(task => task.bucket === 'active');
  const waitingTasks = tasks.filter(task => task.bucket === 'waiting');
  const deferredTasks = tasks.filter(task => task.bucket === 'deferred');

  const handleTaskPress = (task: Task) => {
    console.log('Task pressed:', task.title);
  };

  const handleHuntAction = (action: HuntAction) => {
    console.log('Hunt action:', action);
    // Move to next task
    if (currentTaskIndex < activeTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      setCurrentTaskIndex(0);
    }
  };

  const handleTaskAdded = () => {
    // Modal will close automatically, data updates via Firebase listener
    console.log('Task added successfully');
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Tasks</ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Tasks</ThemedText>
        <ModeToggle currentMode={mode} onToggle={setMode} />
      </View>

      {mode === 'plan' ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}>
          <TaskBucket
            title="Active"
            tasks={activeTasks}
            onTaskPress={handleTaskPress}
          />
          <TaskBucket
            title="Waiting"
            tasks={waitingTasks}
            onTaskPress={handleTaskPress}
          />
          <TaskBucket
            title="Deferred"
            tasks={deferredTasks}
            onTaskPress={handleTaskPress}
          />
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.huntContent}>
          {activeTasks.length > 0 ? (
            <>
              <ThemedText style={styles.huntTitle}>Current Task</ThemedText>
              <TaskCard
                task={activeTasks[currentTaskIndex]}
                mode="full"
                onAction={handleHuntAction}
              />
              <ThemedText style={styles.huntCounter}>
                {currentTaskIndex + 1} of {activeTasks.length}
              </ThemedText>
            </>
          ) : (
            <View style={styles.emptyHunt}>
              <ThemedText style={styles.emptyHuntText}>
                No active tasks to hunt! 🦈
              </ThemedText>
            </View>
          )}
        </ScrollView>
      )}

      <FloatingActionButton onPress={() => setModalVisible(true)} />
      
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleTaskAdded}
      />
    </ThemedView>
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
    gap: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  huntContent: {
    padding: 20,
    flex: 1,
  },
  huntTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  huntCounter: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.6,
  },
  emptyHunt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHuntText: {
    fontSize: 18,
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

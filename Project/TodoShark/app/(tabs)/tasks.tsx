import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ModeToggle } from '@/components/mode-toggle';
import { TaskBucket } from '@/components/task-bucket';
import { TaskCard } from '@/components/task-card';
import { Task, TaskMode, HuntAction } from '@/types';

const MOCK_TASKS: Task[] = [
  // Active bucket
  {
    id: '1',
    title: 'Complete website redesign',
    description: 'Finish homepage mockups and get team feedback',
    bucket: 'active',
    priority: 1,
    createdAt: new Date('2026-01-25'),
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Check and approve pending PRs from team',
    bucket: 'active',
    priority: 2,
    createdAt: new Date('2026-01-25'),
  },
  {
    id: '3',
    title: 'Update documentation',
    description: 'Add API documentation for new endpoints',
    bucket: 'active',
    priority: 3,
    createdAt: new Date('2026-01-24'),
  },
  
  // Waiting bucket
  {
    id: '4',
    title: 'Client feedback on proposal',
    description: 'Waiting for client to review and approve',
    bucket: 'waiting',
    priority: 2,
    createdAt: new Date('2026-01-23'),
  },
  {
    id: '5',
    title: 'Server upgrade approval',
    description: 'Pending IT department approval',
    bucket: 'waiting',
    priority: 3,
    createdAt: new Date('2026-01-22'),
  },
  
  // Deferred bucket
  {
    id: '6',
    title: 'Research new frameworks',
    description: 'Explore options for next project',
    bucket: 'deferred',
    priority: 4,
    createdAt: new Date('2026-01-20'),
  },
  {
    id: '7',
    title: 'Organize team building event',
    description: 'Plan Q2 team outing',
    bucket: 'deferred',
    priority: 5,
    createdAt: new Date('2026-01-18'),
  },
];

export default function TasksScreen() {
  const [mode, setMode] = useState<TaskMode>('plan');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const activeTasks = MOCK_TASKS.filter(task => task.bucket === 'active');
  const waitingTasks = MOCK_TASKS.filter(task => task.bucket === 'waiting');
  const deferredTasks = MOCK_TASKS.filter(task => task.bucket === 'deferred');

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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Tasks</ThemedText>
        <ModeToggle currentMode={mode} onToggle={setMode} />
      </View>

      {mode === 'plan' ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
});

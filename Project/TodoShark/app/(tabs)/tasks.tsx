import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ModeToggle } from '@/components/mode-toggle';
import { TaskBucket } from '@/components/task-bucket';
import { TaskCard } from '@/components/task-card';
import { FloatingActionButton } from '@/components/floating-action-button';
import { AddTaskModal } from '@/components/add-task-modal';
import { TaskDetailModal } from '@/components/task-detail-modal';
import { EditTaskModal } from '@/components/edit-task-modal';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { SwipeableItem } from '@/components/swipeable-item';
import { SwipeableTaskCard } from '@/components/swipeable-task-card';
import { Task, TaskMode, HuntAction } from '@/types';
import { useTasks } from '@/hooks/use-tasks';
import { deleteTask } from '@/services/firebase';

export default function TasksScreen() {
  const [mode, setMode] = useState<TaskMode>('plan');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { tasks, loading, error } = useTasks();

  const activeTasks = tasks.filter(task => task.bucket === 'active');
  const waitingTasks = tasks.filter(task => task.bucket === 'waiting');
  const deferredTasks = tasks.filter(task => task.bucket === 'deferred');

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setDetailModalVisible(true);
  };

  const handleEdit = () => {
    setDetailModalVisible(false);
    setEditModalVisible(true);
  };

  const handleDeletePress = () => {
    setDetailModalVisible(false);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTask) return;

    setDeleting(true);
    try {
      await deleteTask(selectedTask.id);
      setDeleteDialogVisible(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSwipeDelete = (task: Task) => {
    setSelectedTask(task);
    setDeleteDialogVisible(true);
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

  const handleTaskUpdated = () => {
    // Modal will close automatically, data updates via Firebase listener
    console.log('Task updated successfully');
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
            renderTask={(task) => (
              <SwipeableItem
                key={task.id}
                onDelete={() => handleSwipeDelete(task)}
              >
                <TaskCard
                  task={task}
                  mode="compact"
                  onPress={() => handleTaskPress(task)}
                />
              </SwipeableItem>
            )}
          />
          <TaskBucket
            title="Waiting"
            tasks={waitingTasks}
            onTaskPress={handleTaskPress}
            renderTask={(task) => (
              <SwipeableItem
                key={task.id}
                onDelete={() => handleSwipeDelete(task)}
              >
                <TaskCard
                  task={task}
                  mode="compact"
                  onPress={() => handleTaskPress(task)}
                />
              </SwipeableItem>
            )}
          />
          <TaskBucket
            title="Deferred"
            tasks={deferredTasks}
            onTaskPress={handleTaskPress}
            renderTask={(task) => (
              <SwipeableItem
                key={task.id}
                onDelete={() => handleSwipeDelete(task)}
              >
                <TaskCard
                  task={task}
                  mode="compact"
                  onPress={() => handleTaskPress(task)}
                />
              </SwipeableItem>
            )}
          />
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.huntContent}>
          {activeTasks.length > 0 ? (
            <>
              <View style={styles.huntHeader}>
                <ThemedText style={styles.huntTitle}>Current Task</ThemedText>
                <ThemedText style={styles.huntCounter}>
                  {currentTaskIndex + 1} of {activeTasks.length}
                </ThemedText>
              </View>
              <SwipeableTaskCard
                task={activeTasks[currentTaskIndex]}
                onAction={handleHuntAction}
              />
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

      <FloatingActionButton onPress={() => setAddModalVisible(true)} />
      
      <AddTaskModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleTaskAdded}
      />

      {selectedTask && (
        <>
          <TaskDetailModal
            visible={detailModalVisible}
            task={selectedTask}
            onClose={() => {
              setDetailModalVisible(false);
              setSelectedTask(null);
            }}
            onEdit={handleEdit}
            onDelete={handleDeletePress}
          />

          <EditTaskModal
            visible={editModalVisible}
            task={selectedTask}
            onClose={() => setEditModalVisible(false)}
            onSubmit={handleTaskUpdated}
          />
        </>
      )}

      <DeleteConfirmationDialog
        visible={deleteDialogVisible}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogVisible(false);
          setSelectedTask(null);
        }}
        loading={deleting}
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
  huntHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  huntTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  huntCounter: {
    fontSize: 16,
    opacity: 0.6,
    fontWeight: '600',
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


import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ReminderItem } from '@/components/reminder-item';
import { FloatingActionButton } from '@/components/floating-action-button';
import { AddReminderModal } from '@/components/add-reminder-modal';
import { ReminderDetailModal } from '@/components/reminder-detail-modal';
import { EditReminderModal } from '@/components/edit-reminder-modal';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { SwipeableItem } from '@/components/swipeable-item';
import { useReminders } from '@/hooks/use-reminders';
import { deleteReminder } from '@/services/firebase';
import { Reminder } from '@/types';

export default function RemindersScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { reminders, loading } = useReminders();

  const handleReminderPress = (reminder: Reminder) => {
    setSelectedReminder(reminder);
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
    if (!selectedReminder) return;

    setDeleting(true);
    try {
      await deleteReminder(selectedReminder.id);
      setDeleteDialogVisible(false);
      setSelectedReminder(null);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      Alert.alert('Error', 'Failed to delete reminder. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSwipeDelete = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setDeleteDialogVisible(true);
  };

  const handleReminderAdded = () => {
    // Modal will close automatically, data updates via Firebase listener
    console.log('Reminder added successfully');
  };

  const handleReminderUpdated = () => {
    // Modal will close automatically, data updates via Firebase listener
    console.log('Reminder updated successfully');
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Reminders</ThemedText>
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
        <ThemedText style={styles.headerTitle}>Reminders</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}>
        {reminders.map((reminder) => (
          <SwipeableItem
            key={reminder.id}
            onDelete={() => handleSwipeDelete(reminder)}
          >
            <ReminderItem
              reminder={reminder}
              onPress={() => handleReminderPress(reminder)}
            />
          </SwipeableItem>
        ))}
        {reminders.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              No reminders yet! 🔔
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => setAddModalVisible(true)} />
      
      <AddReminderModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleReminderAdded}
      />

      {selectedReminder && (
        <>
          <ReminderDetailModal
            visible={detailModalVisible}
            reminder={selectedReminder}
            onClose={() => {
              setDetailModalVisible(false);
              setSelectedReminder(null);
            }}
            onEdit={handleEdit}
            onDelete={handleDeletePress}
          />

          <EditReminderModal
            visible={editModalVisible}
            reminder={selectedReminder}
            onClose={() => setEditModalVisible(false)}
            onSubmit={handleReminderUpdated}
          />
        </>
      )}

      <DeleteConfirmationDialog
        visible={deleteDialogVisible}
        title="Delete Reminder"
        message="Are you sure you want to delete this reminder? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogVisible(false);
          setSelectedReminder(null);
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

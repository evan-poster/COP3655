import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ReminderItem } from '@/components/reminder-item';
import { FloatingActionButton } from '@/components/floating-action-button';
import { AddReminderModal } from '@/components/add-reminder-modal';
import { useReminders } from '@/hooks/use-reminders';
import { Reminder } from '@/types';

export default function RemindersScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { reminders, loading } = useReminders();

  const handleReminderPress = (reminder: Reminder) => {
    console.log('Reminder pressed:', reminder.title);
  };

  const handleReminderAdded = () => {
    // Modal will close automatically, data updates via Firebase listener
    console.log('Reminder added successfully');
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
          <ReminderItem
            key={reminder.id}
            reminder={reminder}
            onPress={() => handleReminderPress(reminder)}
          />
        ))}
        {reminders.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              No reminders yet! 🔔
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => setModalVisible(true)} />
      
      <AddReminderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleReminderAdded}
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



import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ReminderItem } from '@/components/reminder-item';
import { Reminder } from '@/types';

const MOCK_REMINDERS: Reminder[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly sync with development team',
    dateTime: new Date('2026-01-26T14:00:00'),
    recurring: { frequency: 'weekly' },
    completed: false,
  },
  {
    id: '2',
    title: 'Submit Report',
    description: 'Monthly progress report due',
    dateTime: new Date('2026-01-27T09:00:00'),
    completed: false,
  },
  {
    id: '3',
    title: 'Call Client',
    description: 'Follow up on project status',
    dateTime: new Date('2026-01-28T15:30:00'),
    completed: false,
  },
];

export default function RemindersScreen() {
  const handleReminderPress = (reminder: Reminder) => {
    console.log('Reminder pressed:', reminder.title);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Reminders</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {MOCK_REMINDERS.map((reminder) => (
          <ReminderItem
            key={reminder.id}
            reminder={reminder}
            onPress={() => handleReminderPress(reminder)}
          />
        ))}
        {MOCK_REMINDERS.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              No reminders yet! 🔔
            </ThemedText>
          </View>
        )}
      </ScrollView>
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
});

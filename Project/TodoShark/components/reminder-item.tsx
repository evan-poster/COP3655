import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Reminder } from '@/types';

interface ReminderItemProps {
  reminder: Reminder;
  onPress: () => void;
}

export function ReminderItem({ reminder, onPress }: ReminderItemProps) {
  const surfaceColor = useThemeColor({ light: '#FFFFFF', dark: '#1A2332' }, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={[styles.container, { backgroundColor: surfaceColor }]}>
        <View style={styles.iconContainer}>
          <IconSymbol name="bell.fill" size={24} color={tintColor} />
        </View>
        <View style={styles.content}>
          <ThemedText style={styles.title}>{reminder.title}</ThemedText>
          {reminder.description && (
            <ThemedText style={styles.description}>{reminder.description}</ThemedText>
          )}
          <View style={styles.footer}>
            <ThemedText style={styles.dateTime}>
              {formatDateTime(reminder.dateTime)}
            </ThemedText>
            {reminder.recurring && (
              <View style={[styles.recurringBadge, { backgroundColor: tintColor }]}>
                <ThemedText style={styles.recurringText}>
                  {reminder.recurring.frequency}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTime: {
    fontSize: 14,
    opacity: 0.6,
  },
  recurringBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recurringText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

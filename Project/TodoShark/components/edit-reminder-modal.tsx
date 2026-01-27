import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { updateReminder } from '@/services/firebase';
import { Reminder } from '@/types';

interface EditReminderModalProps {
  visible: boolean;
  reminder: Reminder;
  onClose: () => void;
  onSubmit: () => void;
}

export function EditReminderModal({ visible, reminder, onClose, onSubmit }: EditReminderModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333333' }, 'background');

  // Initialize form with reminder data when modal opens
  useEffect(() => {
    if (visible && reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description || '');
      setDateTime(reminder.dateTime);
      setIsRecurring(!!reminder.recurring);
      setFrequency(reminder.recurring?.frequency || 'daily');
      setError('');
    }
  }, [visible, reminder]);

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDateTime = new Date(dateTime);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      setDateTime(newDateTime);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(dateTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setDateTime(newDateTime);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateReminder(reminder.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dateTime,
        recurring: isRecurring ? { frequency } : undefined,
      });

      onSubmit();
      onClose();
    } catch (err) {
      console.error('Error updating reminder:', err);
      setError('Failed to update reminder. Please try again.');
      Alert.alert('Error', 'Failed to update reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Edit Reminder</ThemedText>
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: '#FFE5E5' }]}>
                <ThemedText style={[styles.errorText, { color: '#D32F2F' }]}>
                  {error}
                </ThemedText>
              </View>
            ) : null}

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Title *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: surfaceColor, color: textColor, borderColor },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter reminder title"
                placeholderTextColor={textColor + '80'}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Description</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: surfaceColor, color: textColor, borderColor },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter reminder description (optional)"
                placeholderTextColor={textColor + '80'}
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Date</ThemedText>
              <TouchableOpacity
                style={[
                  styles.dateTimeButton,
                  { backgroundColor: surfaceColor, borderColor },
                ]}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <ThemedText>{formatDate(dateTime)}</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Time</ThemedText>
              <TouchableOpacity
                style={[
                  styles.dateTimeButton,
                  { backgroundColor: surfaceColor, borderColor },
                ]}
                onPress={() => setShowTimePicker(true)}
                disabled={loading}
              >
                <ThemedText>{formatTime(dateTime)}</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <ThemedText style={styles.label}>Recurring</ThemedText>
                <Switch
                  value={isRecurring}
                  onValueChange={setIsRecurring}
                  trackColor={{ false: '#767577', true: tintColor + '80' }}
                  thumbColor={isRecurring ? tintColor : '#f4f3f4'}
                  disabled={loading}
                />
              </View>
            </View>

            {isRecurring && (
              <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Frequency</ThemedText>
                <View style={[styles.pickerContainer, { backgroundColor: surfaceColor, borderColor }]}>
                  <Picker
                    selectedValue={frequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)}
                    style={[styles.picker, { color: textColor }]}
                    enabled={!loading}
                  >
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Weekly" value="weekly" />
                    <Picker.Item label="Monthly" value="monthly" />
                  </Picker>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor }]}
              onPress={handleClose}
              disabled={loading}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton, { backgroundColor: tintColor }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.submitButtonText}>Save Changes</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {showDatePicker && (
          <DateTimePicker
            value={dateTime}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={dateTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
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
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    minHeight: 50,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

import React, { useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { addTask } from '@/services/firebase';
import { TaskBucket } from '@/types';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function AddTaskModal({ visible, onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(3);
  const [bucket, setBucket] = useState<TaskBucket>('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333333' }, 'background');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(3);
    setBucket('active');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
      await addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        bucket,
        priority,
        createdAt: new Date(),
      });

      resetForm();
      onSubmit();
      onClose();
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
      Alert.alert('Error', 'Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <ThemedText style={styles.headerTitle}>Add New Task</ThemedText>
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
                placeholder="Enter task title"
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
                placeholder="Enter task description (optional)"
                placeholderTextColor={textColor + '80'}
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Priority (1-5)</ThemedText>
              <View style={[styles.pickerContainer, { backgroundColor: surfaceColor, borderColor }]}>
                <Picker
                  selectedValue={priority}
                  onValueChange={(value: number) => setPriority(value)}
                  style={[styles.picker, { color: textColor }]}
                  enabled={!loading}
                >
                  <Picker.Item label="1 - Highest" value={1} />
                  <Picker.Item label="2 - High" value={2} />
                  <Picker.Item label="3 - Medium" value={3} />
                  <Picker.Item label="4 - Low" value={4} />
                  <Picker.Item label="5 - Lowest" value={5} />
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Bucket</ThemedText>
              <View style={[styles.pickerContainer, { backgroundColor: surfaceColor, borderColor }]}>
                <Picker
                  selectedValue={bucket}
                  onValueChange={(value: TaskBucket) => setBucket(value)}
                  style={[styles.picker, { color: textColor }]}
                  enabled={!loading}
                >
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Waiting" value="waiting" />
                  <Picker.Item label="Deferred" value="deferred" />
                </Picker>
              </View>
            </View>
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
                <ThemedText style={styles.submitButtonText}>Add Task</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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

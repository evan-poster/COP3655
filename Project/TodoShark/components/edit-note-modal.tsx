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
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { updateNote } from '@/services/firebase';
import { Note } from '@/types';

interface EditNoteModalProps {
  visible: boolean;
  note: Note;
  onClose: () => void;
  onSubmit: () => void;
}

export function EditNoteModal({ visible, note, onClose, onSubmit }: EditNoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333333' }, 'background');

  // Initialize form with note data when modal opens
  useEffect(() => {
    if (visible && note) {
      setTitle(note.title);
      setContent(note.content || '');
      setTagsInput(note.tags?.join(', ') || '');
      setError('');
    }
  }, [visible, note]);

  const handleClose = () => {
    setError('');
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
      // Parse tags from comma-separated string
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await updateNote(note.id, {
        title: title.trim(),
        content: content.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        updatedAt: new Date(),
      });

      onSubmit();
      onClose();
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note. Please try again.');
      Alert.alert('Error', 'Failed to update note. Please try again.');
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
            <ThemedText style={styles.headerTitle}>Edit Note</ThemedText>
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
                placeholder="Enter note title"
                placeholderTextColor={textColor + '80'}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Content</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.contentArea,
                  { backgroundColor: surfaceColor, color: textColor, borderColor },
                ]}
                value={content}
                onChangeText={setContent}
                placeholder="Enter note content"
                placeholderTextColor={textColor + '80'}
                multiline
                numberOfLines={10}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Tags</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: surfaceColor, color: textColor, borderColor },
                ]}
                value={tagsInput}
                onChangeText={setTagsInput}
                placeholder="Enter tags separated by commas (optional)"
                placeholderTextColor={textColor + '80'}
                editable={!loading}
              />
              <ThemedText style={styles.helperText}>
                Example: work, important, project
              </ThemedText>
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
                <ThemedText style={styles.submitButtonText}>Save Changes</ThemedText>
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
  contentArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
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

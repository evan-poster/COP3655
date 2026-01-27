import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { NoteItem } from '@/components/note-item';
import { FloatingActionButton } from '@/components/floating-action-button';
import { AddNoteModal } from '@/components/add-note-modal';
import { NoteDetailModal } from '@/components/note-detail-modal';
import { EditNoteModal } from '@/components/edit-note-modal';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { SwipeableItem } from '@/components/swipeable-item';
import { useNotes } from '@/hooks/use-notes';
import { deleteNote } from '@/services/firebase';
import { Note } from '@/types';

export default function NotesScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { notes, loading } = useNotes();

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
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
    if (!selectedNote) return;

    setDeleting(true);
    try {
      await deleteNote(selectedNote.id);
      setDeleteDialogVisible(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSwipeDelete = (note: Note) => {
    setSelectedNote(note);
    setDeleteDialogVisible(true);
  };

  const handleNoteAdded = () => {
    // Modal will close automatically, data updates via Firebase listener
    console.log('Note added successfully');
  };

  const handleNoteUpdated = () => {
    // Modal will close automatically, data updates via Firebase listener
    console.log('Note updated successfully');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Notes</ThemedText>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}>
          {notes.map((note) => (
            <SwipeableItem
              key={note.id}
              onDelete={() => handleSwipeDelete(note)}
            >
              <NoteItem
                note={note}
                onPress={() => handleNotePress(note)}
              />
            </SwipeableItem>
          ))}
          {notes.length === 0 && (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>
                No notes yet! 📝
              </ThemedText>
            </View>
          )}
        </ScrollView>
      )}

      <FloatingActionButton onPress={() => setAddModalVisible(true)} />
      
      <AddNoteModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleNoteAdded}
      />

      {selectedNote && (
        <>
          <NoteDetailModal
            visible={detailModalVisible}
            note={selectedNote}
            onClose={() => {
              setDetailModalVisible(false);
              setSelectedNote(null);
            }}
            onEdit={handleEdit}
            onDelete={handleDeletePress}
          />

          <EditNoteModal
            visible={editModalVisible}
            note={selectedNote}
            onClose={() => setEditModalVisible(false)}
            onSubmit={handleNoteUpdated}
          />
        </>
      )}

      <DeleteConfirmationDialog
        visible={deleteDialogVisible}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogVisible(false);
          setSelectedNote(null);
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
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

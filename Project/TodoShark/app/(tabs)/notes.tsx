import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { NoteItem } from '@/components/note-item';
import { useNotes } from '@/hooks/use-notes';
import { Note } from '@/types';

export default function NotesScreen() {
  const { notes, loading } = useNotes();

  const handleNotePress = (note: Note) => {
    console.log('Note pressed:', note.title);
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
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onPress={() => handleNotePress(note)}
            />
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

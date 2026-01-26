import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { NoteItem } from '@/components/note-item';
import { Note } from '@/types';

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Project Ideas',
    content: 'New feature concepts for Q2:\n- Dark mode improvements\n- Offline sync\n- Widget support',
    tags: ['work', 'ideas'],
    createdAt: new Date('2026-01-25'),
    updatedAt: new Date('2026-01-25'),
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Discussed Q1 goals and timeline. Key points:\n- Launch by March\n- Focus on mobile first\n- Weekly demos',
    tags: ['work', 'meetings'],
    createdAt: new Date('2026-01-24'),
    updatedAt: new Date('2026-01-24'),
  },
  {
    id: '3',
    title: 'Book Recommendations',
    content: 'Books to read:\n- Atomic Habits\n- Deep Work\n- The Pragmatic Programmer',
    tags: ['personal', 'reading'],
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-23'),
  },
];

export default function NotesScreen() {
  const handleNotePress = (note: Note) => {
    console.log('Note pressed:', note.title);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Notes</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {MOCK_NOTES.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onPress={() => handleNotePress(note)}
          />
        ))}
        {MOCK_NOTES.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              No notes yet! 📝
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

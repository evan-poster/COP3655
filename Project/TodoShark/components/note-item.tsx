import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Note } from '@/types';

interface NoteItemProps {
  note: Note;
  onPress: () => void;
}

export function NoteItem({ note, onPress }: NoteItemProps) {
  const surfaceColor = useThemeColor({ light: '#FFFFFF', dark: '#1A2332' }, 'background');
  const tintColor = useThemeColor({}, 'tint');

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={[styles.container, { backgroundColor: surfaceColor }]}>
        <ThemedText style={styles.title}>{note.title}</ThemedText>
        <ThemedText style={styles.content} numberOfLines={2}>
          {note.content}
        </ThemedText>
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: tintColor }]}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>
        )}
        <ThemedText style={styles.date}>
          Updated {formatDate(note.updatedAt)}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
  },
});

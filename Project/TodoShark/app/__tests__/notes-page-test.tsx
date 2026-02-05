import React from 'react';
import { fireEvent, waitFor, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NotesScreen from '../(tabs)/notes';
import { useNotes } from '@/hooks/use-notes';
import { deleteNote } from '@/services/firebase';
import { Note } from '@/types';

// Mock dependencies
jest.mock('@/hooks/use-notes');
jest.mock('@/services/firebase');
jest.mock('@/components/themed-view', () => {
  const { View } = require('react-native');
  return {
    ThemedView: function ThemedView(props) {
      return React.createElement(View, props, props.children);
    },
  };
});
jest.mock('@/components/themed-text', () => {
  const { Text } = require('react-native');
  return {
    ThemedText: function ThemedText(props) {
      return React.createElement(Text, props, props.children);
    },
  };
});
jest.mock('@/components/note-item', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    NoteItem: function NoteItem(props) {
      return React.createElement(
        TouchableOpacity,
        { testID: `note-item-${props.note.id}`, onPress: props.onPress },
        React.createElement(Text, null, props.note.title)
      );
    },
  };
});
jest.mock('@/components/floating-action-button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    FloatingActionButton: function FloatingActionButton(props) {
      return React.createElement(
        TouchableOpacity,
        { testID: 'fab-button', onPress: props.onPress },
        React.createElement(Text, null, 'Add')
      );
    },
  };
});
jest.mock('@/components/add-note-modal', () => {
  const { View, Text } = require('react-native');
  return {
    AddNoteModal: function AddNoteModal(props) {
      return props.visible
        ? React.createElement(
            View,
            { testID: 'add-note-modal' },
            React.createElement(Text, null, 'Add Note Modal')
          )
        : null;
    },
  };
});
jest.mock('@/components/note-detail-modal', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    NoteDetailModal: function NoteDetailModal(props) {
      return props.visible
        ? React.createElement(
            View,
            { testID: 'note-detail-modal' },
            React.createElement(Text, null, props.note?.title),
            React.createElement(
              TouchableOpacity,
              { testID: 'edit-button', onPress: props.onEdit },
              React.createElement(Text, null, 'Edit')
            ),
            React.createElement(
              TouchableOpacity,
              { testID: 'delete-button', onPress: props.onDelete },
              React.createElement(Text, null, 'Delete')
            )
          )
        : null;
    },
  };
});
jest.mock('@/components/edit-note-modal', () => {
  const { View, Text } = require('react-native');
  return {
    EditNoteModal: function EditNoteModal(props) {
      return props.visible
        ? React.createElement(
            View,
            { testID: 'edit-note-modal' },
            React.createElement(Text, null, 'Edit Note Modal')
          )
        : null;
    },
  };
});
jest.mock('@/components/delete-confirmation-dialog', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    DeleteConfirmationDialog: function DeleteConfirmationDialog(props) {
      return props.visible
        ? React.createElement(
            View,
            { testID: 'delete-dialog' },
            React.createElement(
              TouchableOpacity,
              { testID: 'confirm-delete', onPress: props.onConfirm },
              React.createElement(Text, null, 'Confirm')
            ),
            React.createElement(
              TouchableOpacity,
              { testID: 'cancel-delete', onPress: props.onCancel },
              React.createElement(Text, null, 'Cancel')
            )
          )
        : null;
    },
  };
});
jest.mock('@/components/swipeable-item', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    SwipeableItem: function SwipeableItem(props) {
      return React.createElement(
        View,
        null,
        props.children,
        React.createElement(
          TouchableOpacity,
          { testID: 'swipe-delete', onPress: props.onDelete },
          React.createElement(Text, null, 'Swipe Delete')
        )
      );
    },
  };
});

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('NotesScreen', () => {
  const mockUseNotes = useNotes as jest.MockedFunction<typeof useNotes>;
  const mockDeleteNote = deleteNote as jest.MockedFunction<typeof deleteNote>;

  const mockNotes: Note[] = [
    {
      id: '1',
      title: 'Test Note 1',
      content: 'This is test note 1',
      tags: ['test'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Test Note 2',
      content: 'This is test note 2',
      tags: [],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should render loading indicator when loading is true', () => {
      mockUseNotes.mockReturnValue({
        notes: [],
        loading: true,
        error: null,
      });

      const { getByTestId } = render(<NotesScreen />);
      expect(getByTestId('activity-indicator')).toBeTruthy();
    });
  });

  describe('Empty State', () => {
    it('should render empty state when there are no notes', () => {
      mockUseNotes.mockReturnValue({
        notes: [],
        loading: false,
        error: null,
      });

      const { getByText } = render(<NotesScreen />);
      expect(getByText('No notes yet! 📝')).toBeTruthy();
    });

    it('should render FloatingActionButton in empty state', () => {
      mockUseNotes.mockReturnValue({
        notes: [],
        loading: false,
        error: null,
      });

      const { getByTestId } = render(<NotesScreen />);
      expect(getByTestId('fab-button')).toBeTruthy();
    });
  });

  describe('Notes List', () => {
    it('should render list of notes when data is available', () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });

      const { getByTestId, getByText } = render(<NotesScreen />);
      
      expect(getByTestId('note-item-1')).toBeTruthy();
      expect(getByTestId('note-item-2')).toBeTruthy();
      expect(getByText('Test Note 1')).toBeTruthy();
      expect(getByText('Test Note 2')).toBeTruthy();
    });

    it('should render header with title', () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });

      const { getByText } = render(<NotesScreen />);
      expect(getByText('Notes')).toBeTruthy();
    });
  });

  describe('Add Note Modal', () => {
    it('should open add note modal when FAB is pressed', () => {
      mockUseNotes.mockReturnValue({
        notes: [],
        loading: false,
        error: null,
      });

      const { getByTestId, queryByTestId } = render(<NotesScreen />);
      
      // Modal should not be visible initially
      expect(queryByTestId('add-note-modal')).toBeNull();
      
      // Press FAB
      fireEvent.press(getByTestId('fab-button'));
      
      // Modal should be visible
      expect(getByTestId('add-note-modal')).toBeTruthy();
    });
  });

  describe('Note Detail Modal', () => {
    it('should open detail modal when note is pressed', () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });

      const { getByTestId, queryByTestId } = render(<NotesScreen />);
      
      // Modal should not be visible initially
      expect(queryByTestId('note-detail-modal')).toBeNull();
      
      // Press note
      fireEvent.press(getByTestId('note-item-1'));
      
      // Modal should be visible with note details
      expect(getByTestId('note-detail-modal')).toBeTruthy();
      expect(getByTestId('note-detail-modal')).toHaveTextContent('Test Note 1');
    });

    it('should open edit modal when edit button is pressed in detail modal', () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });

      const { getByTestId, queryByTestId } = render(<NotesScreen />);
      
      // Open detail modal
      fireEvent.press(getByTestId('note-item-1'));
      
      // Edit modal should not be visible
      expect(queryByTestId('edit-note-modal')).toBeNull();
      
      // Press edit button
      fireEvent.press(getByTestId('edit-button'));
      
      // Edit modal should be visible, detail modal should be hidden
      expect(getByTestId('edit-note-modal')).toBeTruthy();
      expect(queryByTestId('note-detail-modal')).toBeNull();
    });
  });

  describe('Delete Functionality', () => {
    it('should open delete dialog when delete button is pressed in detail modal', () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });

      const { getByTestId, queryByTestId } = render(<NotesScreen />);
      
      // Open detail modal
      fireEvent.press(getByTestId('note-item-1'));
      
      // Delete dialog should not be visible
      expect(queryByTestId('delete-dialog')).toBeNull();
      
      // Press delete button
      fireEvent.press(getByTestId('delete-button'));
      
      // Delete dialog should be visible
      expect(getByTestId('delete-dialog')).toBeTruthy();
    });

    it('should successfully delete note when confirmed', async () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });
      mockDeleteNote.mockResolvedValue(undefined);

      const { getByTestId, queryByTestId } = render(<NotesScreen />);
      
      // Open detail modal
      fireEvent.press(getByTestId('note-item-1'));
      
      // Press delete button
      fireEvent.press(getByTestId('delete-button'));
      
      // Confirm delete
      fireEvent.press(getByTestId('confirm-delete'));
      
      await waitFor(() => {
        expect(mockDeleteNote).toHaveBeenCalledWith('1');
        expect(queryByTestId('delete-dialog')).toBeNull();
      });
    });

    it('should handle delete error gracefully', async () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });
      const error = new Error('Delete failed');
      mockDeleteNote.mockRejectedValue(error);

      const { getByTestId } = render(<NotesScreen />);
      
      // Open detail modal
      fireEvent.press(getByTestId('note-item-1'));
      
      // Press delete button
      fireEvent.press(getByTestId('delete-button'));
      
      // Confirm delete
      fireEvent.press(getByTestId('confirm-delete'));
      
      await waitFor(() => {
        expect(mockDeleteNote).toHaveBeenCalledWith('1');
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Failed to delete note. Please try again.'
        );
      });
    });

    it('should cancel delete and close dialog', () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });

      const { getByTestId, queryByTestId } = render(<NotesScreen />);
      
      // Open detail modal
      fireEvent.press(getByTestId('note-item-1'));
      
      // Press delete button
      fireEvent.press(getByTestId('delete-button'));
      
      // Cancel delete
      fireEvent.press(getByTestId('cancel-delete'));
      
      // Delete dialog should be closed
      expect(queryByTestId('delete-dialog')).toBeNull();
      expect(mockDeleteNote).not.toHaveBeenCalled();
    });
  });

  describe('Swipe Delete', () => {
    it('should open delete dialog when swiping to delete', () => {
      mockUseNotes.mockReturnValue({
        notes: mockNotes,
        loading: false,
        error: null,
      });

      const { getAllByTestId, getByTestId } = render(<NotesScreen />);
      
      // Get first swipe delete button
      const swipeDeleteButtons = getAllByTestId('swipe-delete');
      
      // Trigger swipe delete
      fireEvent.press(swipeDeleteButtons[0]);
      
      // Delete dialog should be visible
      expect(getByTestId('delete-dialog')).toBeTruthy();
    });
  });
});

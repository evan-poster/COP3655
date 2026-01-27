import { useState, useEffect } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { notesCollection } from '@/services/firebase';
import { Note } from '@/types';

interface UseNotesResult {
  notes: Note[];
  loading: boolean;
  error: Error | null;
}

export function useNotes(): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(notesCollection, orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesData = snapshot.docs.map((doc) => doc.data());
        setNotes(notesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { notes, loading, error };
}

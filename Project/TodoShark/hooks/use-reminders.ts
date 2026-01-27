import { useState, useEffect } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { remindersCollection } from '@/services/firebase';
import { Reminder } from '@/types';

interface UseRemindersResult {
  reminders: Reminder[];
  loading: boolean;
  error: Error | null;
}

export function useReminders(): UseRemindersResult {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(remindersCollection, orderBy('dateTime', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const remindersData = snapshot.docs.map((doc) => doc.data());
        setReminders(remindersData);
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

  return { reminders, loading, error };
}

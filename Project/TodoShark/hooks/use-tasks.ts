import { useState, useEffect } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { tasksCollection } from '@/services/firebase';
import { Task } from '@/types';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(tasksCollection, orderBy('priority', 'asc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => doc.data());
        setTasks(tasksData);
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

  return { tasks, loading, error };
}

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/firebase.Config';
import { Note, Reminder, Task } from '@/types';

const noteConverter: FirestoreDataConverter<Note> = {
  toFirestore(note: Note): DocumentData {
    const data: DocumentData = {
      title: note.title,
      createdAt: Timestamp.fromDate(note.createdAt),
      updatedAt: Timestamp.fromDate(note.updatedAt),
    };
    
    if (note.content !== undefined) {
      data.content = note.content;
    }
    
    if (note.tags && note.tags.length > 0) {
      data.tags = note.tags;
    }
    
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Note {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  },
};

const notesCollection = collection(db, 'notes').withConverter(noteConverter);

export async function addNote(note: Omit<Note, 'id'>): Promise<string> {
  const docRef = await addDoc(notesCollection, note as Note);
  return docRef.id;
}

export async function updateNote(id: string, updates: Partial<Omit<Note, 'id'>>): Promise<void> {
  const noteDoc = doc(db, 'notes', id);
  const firestoreUpdates: DocumentData = { ...updates };
  
  if (updates.createdAt) {
    firestoreUpdates.createdAt = Timestamp.fromDate(updates.createdAt);
  }
  if (updates.updatedAt) {
    firestoreUpdates.updatedAt = Timestamp.fromDate(updates.updatedAt);
  }
  
  await updateDoc(noteDoc, firestoreUpdates);
}

export async function deleteNote(id: string): Promise<void> {
  const noteDoc = doc(db, 'notes', id);
  await deleteDoc(noteDoc);
}

export async function getNotes(): Promise<Note[]> {
  const q = query(notesCollection, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

const reminderConverter: FirestoreDataConverter<Reminder> = {
  toFirestore(reminder: Reminder): DocumentData {
    const data: DocumentData = {
      title: reminder.title,
      dateTime: Timestamp.fromDate(reminder.dateTime),
      completed: reminder.completed,
    };
    
    if (reminder.description !== undefined) {
      data.description = reminder.description;
    }
    
    if (reminder.recurring) {
      data.recurring = {
        frequency: reminder.recurring.frequency,
        ...(reminder.recurring.endDate && {
          endDate: Timestamp.fromDate(reminder.recurring.endDate),
        }),
      };
    }
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Reminder {
    const data = snapshot.data();
    const reminder: Reminder = {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      dateTime: (data.dateTime as Timestamp).toDate(),
      completed: data.completed,
    };
    if (data.recurring) {
      reminder.recurring = {
        frequency: data.recurring.frequency,
        ...(data.recurring.endDate && {
          endDate: (data.recurring.endDate as Timestamp).toDate(),
        }),
      };
    }
    return reminder;
  },
};

const remindersCollection = collection(db, 'reminders').withConverter(reminderConverter);

export async function addReminder(reminder: Omit<Reminder, 'id'>): Promise<string> {
  const docRef = await addDoc(remindersCollection, reminder as Reminder);
  return docRef.id;
}

export async function updateReminder(id: string, updates: Partial<Omit<Reminder, 'id'>>): Promise<void> {
  const reminderDoc = doc(db, 'reminders', id);
  const firestoreUpdates: DocumentData = { ...updates };

  if (updates.dateTime) {
    firestoreUpdates.dateTime = Timestamp.fromDate(updates.dateTime);
  }
  if (updates.recurring) {
    firestoreUpdates.recurring = {
      frequency: updates.recurring.frequency,
      ...(updates.recurring.endDate && {
        endDate: Timestamp.fromDate(updates.recurring.endDate),
      }),
    };
  }

  await updateDoc(reminderDoc, firestoreUpdates);
}

export async function deleteReminder(id: string): Promise<void> {
  const reminderDoc = doc(db, 'reminders', id);
  await deleteDoc(reminderDoc);
}

export async function getReminders(): Promise<Reminder[]> {
  const q = query(remindersCollection, orderBy('dateTime', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

const taskConverter: FirestoreDataConverter<Task> = {
  toFirestore(task: Task): DocumentData {
    const data: DocumentData = {
      title: task.title,
      bucket: task.bucket,
      priority: task.priority,
      createdAt: Timestamp.fromDate(task.createdAt),
    };
    if (task.description !== undefined) {
      data.description = task.description;
    }
    if (task.completedAt) {
      data.completedAt = Timestamp.fromDate(task.completedAt);
    }
    if (task.hiddenUntil) {
      data.hiddenUntil = Timestamp.fromDate(task.hiddenUntil);
    }
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Task {
    const data = snapshot.data();
    const task: Task = {
      id: snapshot.id,
      title: data.title,
      bucket: data.bucket,
      priority: data.priority,
      createdAt: (data.createdAt as Timestamp).toDate(),
    };
    if (data.description !== undefined) {
      task.description = data.description;
    }
    if (data.completedAt) {
      task.completedAt = (data.completedAt as Timestamp).toDate();
    }
    if (data.hiddenUntil) {
      task.hiddenUntil = (data.hiddenUntil as Timestamp).toDate();
    }
    return task;
  },
};

const tasksCollection = collection(db, 'tasks').withConverter(taskConverter);

export async function addTask(task: Omit<Task, 'id'>): Promise<string> {
  const docRef = await addDoc(tasksCollection, task as Task);
  return docRef.id;
}

export async function updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<void> {
  const taskDoc = doc(db, 'tasks', id);
  const firestoreUpdates: DocumentData = { ...updates };

  if (updates.createdAt) {
    firestoreUpdates.createdAt = Timestamp.fromDate(updates.createdAt);
  }
  if (updates.completedAt) {
    firestoreUpdates.completedAt = Timestamp.fromDate(updates.completedAt);
  }
  if (updates.hiddenUntil) {
    firestoreUpdates.hiddenUntil = Timestamp.fromDate(updates.hiddenUntil);
  }

  await updateDoc(taskDoc, firestoreUpdates);
}

export async function deleteTask(id: string): Promise<void> {
  const taskDoc = doc(db, 'tasks', id);
  await deleteDoc(taskDoc);
}

export async function getTasks(): Promise<Task[]> {
  const q = query(tasksCollection, orderBy('priority', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export { noteConverter, notesCollection, reminderConverter, remindersCollection, taskConverter, tasksCollection };



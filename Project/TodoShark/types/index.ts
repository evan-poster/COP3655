export type TaskBucket = 'active' | 'waiting' | 'deferred';

export interface Task {
  id: string;
  title: string;
  description?: string;
  bucket: TaskBucket;
  priority: number; // 1-5, 1 being highest
  createdAt: Date;
  completedAt?: Date;
  hiddenUntil?: Date; // For "take out" functionality
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dateTime: Date;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskMode = 'plan' | 'hunt';

export type HuntAction = 'complete' | 'putBack' | 'takeOut';

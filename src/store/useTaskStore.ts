import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '../models/Task';

interface TaskState {
  tasks: Task[];
  addTask: (title: string, dueDate: string | null) => void;
  toggleTask: (id: string) => void;
  editTask: (id: string, title: string, dueDate: string | null) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, dueDate) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              dueDate,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      editTask: (id, title, dueDate) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, title, dueDate } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    { name: 'todo-storage' }
  )
);

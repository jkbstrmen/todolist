import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import type { Task, TaskList } from '../models/Task';

const idbStorage = {
  getItem: async (name: string) => {
    const value = await idbGet<string>(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await idbSet(name, value);
  },
  removeItem: async (name: string) => {
    await idbDel(name);
  },
};

const DEFAULT_LIST: TaskList = { id: 'default', name: 'My Tasks' };
export const COMPLETED_LIST_ID = '__completed__';

interface TaskState {
  lists: TaskList[];
  activeListId: string;
  tasks: Task[];
  addList: (name: string) => string;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  setActiveList: (id: string) => void;
  addTask: (title: string, description: string, dueDate: string | null, dueTime: string | null) => void;
  toggleTask: (id: string) => void;
  editTask: (id: string, title: string, description: string, dueDate: string | null, dueTime: string | null) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      lists: [DEFAULT_LIST],
      activeListId: DEFAULT_LIST.id,
      tasks: [],
      addList: (name) => {
        const id = crypto.randomUUID();
        set((state) => ({
          lists: [...state.lists, { id, name }],
          activeListId: id,
        }));
        return id;
      },
      renameList: (id, name) =>
        set((state) => ({
          lists: state.lists.map((l) => (l.id === id ? { ...l, name } : l)),
        })),
      deleteList: (id) => {
        const state = get();
        if (state.lists.length <= 1) return;
        const remaining = state.lists.filter((l) => l.id !== id);
        set({
          lists: remaining,
          tasks: state.tasks.filter((t) => t.listId !== id),
          activeListId:
            state.activeListId === id ? remaining[0].id : state.activeListId,
        });
      },
      setActiveList: (id) => set({ activeListId: id }),
      addTask: (title, description, dueDate, dueTime) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title,
              description,
              completed: false,
              dueDate,
              dueTime,
              listId: state.activeListId,
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
      editTask: (id, title, description, dueDate, dueTime) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, title, description, dueDate, dueTime } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    { name: 'todo-storage', storage: createJSONStorage(() => idbStorage) }
  )
);

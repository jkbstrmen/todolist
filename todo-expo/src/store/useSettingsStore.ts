import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Settings } from '../models/Settings';
import { DEFAULT_SETTINGS } from '../models/Settings';

interface SettingsState extends Settings {
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSetting: (key, value) => set({ [key]: value }),
    }),
    { name: 'todo-settings', storage: createJSONStorage(() => AsyncStorage) }
  )
);

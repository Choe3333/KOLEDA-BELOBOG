import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppSettings {
  openaiApiKey: string;
  aiModel: string;
  temperature: number;
  maxTokens: number;
  language: string;
}

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  openaiApiKey: '',
  aiModel: 'gpt-4o',
  temperature: 0.8,
  maxTokens: 1500,
  language: 'en',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: { ...defaultSettings },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetSettings: () =>
        set({ settings: { ...defaultSettings } }),
    }),
    {
      name: 'novelcraft-settings',
    }
  )
);

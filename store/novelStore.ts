import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorldSetting {
  genre: string;
  tone: string;
  background: string;
  aiGenerated: string;
}

export interface Character {
  id: string;
  name: string;
  personality: string;
  motivation: string;
  appearance: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

type ActiveTab = 'world' | 'characters' | 'chapters' | 'edit' | 'export' | 'settings';

interface NovelStore {
  worldSetting: WorldSetting;
  characters: Character[];
  chapters: Chapter[];
  activeTab: ActiveTab;
  setWorldSetting: (setting: Partial<WorldSetting>) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, character: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  addChapter: (chapter: Chapter) => void;
  updateChapter: (id: string, chapter: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const useNovelStore = create<NovelStore>()(
  persist(
    (set) => ({
      worldSetting: {
        genre: '',
        tone: '',
        background: '',
        aiGenerated: '',
      },
      characters: [],
      chapters: [],
      activeTab: 'world',

      setWorldSetting: (setting) =>
        set((state) => ({
          worldSetting: { ...state.worldSetting, ...setting },
        })),

      addCharacter: (character) =>
        set((state) => ({
          characters: [...state.characters, character],
        })),

      updateCharacter: (id, character) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...character } : c
          ),
        })),

      deleteCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
        })),

      addChapter: (chapter) =>
        set((state) => ({
          chapters: [...state.chapters, chapter],
        })),

      updateChapter: (id, chapter) =>
        set((state) => ({
          chapters: state.chapters.map((c) =>
            c.id === id ? { ...c, ...chapter } : c
          ),
        })),

      deleteChapter: (id) =>
        set((state) => ({
          chapters: state.chapters.filter((c) => c.id !== id),
        })),

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'novel-storage',
    }
  )
);

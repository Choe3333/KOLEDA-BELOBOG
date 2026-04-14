'use client';

import { useNovelStore } from '@/store/novelStore';
import { useSettingsStore } from '@/store/settingsStore';
import Sidebar from '@/components/Sidebar';
import WorldBuilder from '@/components/WorldBuilder';
import CharacterSheet from '@/components/CharacterSheet';
import ChapterGenerator from '@/components/ChapterGenerator';
import EditingTools from '@/components/EditingTools';
import ExportPanel from '@/components/ExportPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { activeTab } = useNovelStore();
  const { settings } = useSettingsStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'world':
        return <WorldBuilder />;
      case 'characters':
        return <CharacterSheet />;
      case 'chapters':
        return <ChapterGenerator />;
      case 'edit':
        return <EditingTools />;
      case 'export':
        return <ExportPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <WorldBuilder />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg">NovelCraft</span>
              <span className="text-gray-500 text-sm ml-2">AI Writing Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-900/50 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-700/50 font-medium">
              {settings.aiModel.toUpperCase()} Powered
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

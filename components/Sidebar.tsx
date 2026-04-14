'use client';

import { Globe, Users, BookOpen, Edit3, Download, Settings } from 'lucide-react';
import { useNovelStore } from '@/store/novelStore';

const navItems = [
  { id: 'world', label: 'World', icon: Globe },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'chapters', label: 'Chapters', icon: BookOpen },
  { id: 'edit', label: 'Edit', icon: Edit3 },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export default function Sidebar() {
  const { activeTab, setActiveTab } = useNovelStore();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">NovelCraft</h1>
        <p className="text-xs text-indigo-400 mt-1">AI Writing Assistant</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-600 text-center">Powered by GPT-4o</p>
      </div>
    </aside>
  );
}

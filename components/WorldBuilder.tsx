'use client';

import { useState } from 'react';
import { Globe, Sparkles, Loader2 } from 'lucide-react';
import { useNovelStore } from '@/store/novelStore';
import { useApiSettings } from '@/lib/useApiSettings';

const genres = ['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Historical'];
const tones = ['Dark', 'Light', 'Epic', 'Romantic', 'Thriller'];

export default function WorldBuilder() {
  const { worldSetting, setWorldSetting } = useNovelStore();
  const apiSettings = useApiSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'world',
          genre: worldSetting.genre || 'Fantasy',
          tone: worldSetting.tone || 'Epic',
          background: worldSetting.background,
          ...apiSettings,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setWorldSetting({ aiGenerated: data.result });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="text-indigo-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-white">World Builder</h2>
          <p className="text-gray-400 text-sm">Design your story universe with AI assistance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
          <select
            value={worldSetting.genre}
            onChange={(e) => setWorldSetting({ genre: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Select genre...</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
          <select
            value={worldSetting.tone}
            onChange={(e) => setWorldSetting({ tone: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Select tone...</option>
            {tones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Background & Context</label>
        <textarea
          value={worldSetting.background}
          onChange={(e) => setWorldSetting({ background: e.target.value })}
          placeholder="Describe your world concept, key ideas, or any specific elements you want to include..."
          rows={4}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder-gray-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Sparkles size={18} />
        )}
        {loading ? 'Generating...' : 'Generate World Setting'}
      </button>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {worldSetting.aiGenerated && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-indigo-400" />
            <h3 className="text-white font-semibold">Generated World Setting</h3>
          </div>
          <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
            {worldSetting.aiGenerated}
          </div>
        </div>
      )}
    </div>
  );
}

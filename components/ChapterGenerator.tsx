'use client';

import { useState } from 'react';
import { BookOpen, Plus, Sparkles, Loader2, Edit2, Trash2, Save, X } from 'lucide-react';
import { useNovelStore } from '@/store/novelStore';
import { useApiSettings } from '@/lib/useApiSettings';

export default function ChapterGenerator() {
  const { chapters, addChapter, updateChapter, deleteChapter } = useNovelStore();
  const apiSettings = useApiSettings();
  const [title, setTitle] = useState('');
  const [hints, setHints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const previousChapters = sortedChapters.slice(-2).map((c) => ({
        title: c.title,
        content: c.content,
      }));

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chapter',
          title: title || `Chapter ${chapters.length + 1}`,
          hints,
          previousChapters,
          ...apiSettings,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      addChapter({
        id: crypto.randomUUID(),
        title: title || `Chapter ${chapters.length + 1}`,
        content: data.result,
        order: chapters.length + 1,
      });
      setTitle('');
      setHints('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (id: string, currentTitle: string, currentContent: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setEditContent(currentContent);
  };

  const saveEdit = () => {
    if (editingId) {
      updateChapter(editingId, { title: editTitle, content: editContent });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="text-indigo-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-white">Chapter Generator</h2>
          <p className="text-gray-400 text-sm">Generate and manage your story chapters</p>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Generate Next Chapter</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Chapter Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Chapter ${chapters.length + 1}`}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Story Direction / Hints</label>
          <textarea
            value={hints}
            onChange={(e) => setHints(e.target.value)}
            placeholder="Describe what should happen in this chapter..."
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder-gray-500"
          />
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          {loading ? 'Generating...' : 'Generate Chapter'}
        </button>
      </div>

      {sortedChapters.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Chapters ({sortedChapters.length})</h3>
          {sortedChapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
            >
              {editingId === chapter.id ? (
                <div className="p-6 space-y-3">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={10}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-y text-sm leading-relaxed"
                  />
                  <div className="flex gap-3">
                    <button onClick={saveEdit} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      <Save size={14} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
                    <div>
                      <span className="text-xs text-indigo-400 font-medium">Chapter {chapter.order}</span>
                      <h4 className="text-white font-semibold">{chapter.title}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(chapter.id, chapter.title, chapter.content)}
                        className="text-gray-400 hover:text-indigo-400 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteChapter(chapter.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                      {chapter.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {sortedChapters.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <BookOpen size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No chapters yet. Generate your first chapter above!</p>
        </div>
      )}
    </div>
  );
}

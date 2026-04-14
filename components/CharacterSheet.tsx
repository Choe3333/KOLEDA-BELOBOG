'use client';

import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Sparkles, Loader2, X } from 'lucide-react';
import { useNovelStore, Character } from '@/store/novelStore';

const emptyChar: Omit<Character, 'id'> = {
  name: '',
  personality: '',
  motivation: '',
  appearance: '',
};

export default function CharacterSheet() {
  const { characters, addCharacter, updateCharacter, deleteCharacter } = useNovelStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyChar);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const openAdd = () => {
    setFormData(emptyChar);
    setEditingId(null);
    setShowModal(true);
    setError('');
  };

  const openEdit = (char: Character) => {
    setFormData({ name: char.name, personality: char.personality, motivation: char.motivation, appearance: char.appearance });
    setEditingId(char.id);
    setShowModal(true);
    setError('');
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (editingId) {
      updateCharacter(editingId, formData);
    } else {
      addCharacter({ id: crypto.randomUUID(), ...formData });
    }
    setShowModal(false);
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    setError('');
    try {
      const res = await fetch('/api/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, traits: formData.personality }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFormData((prev) => ({
        ...prev,
        personality: data.result.personality || prev.personality,
        motivation: data.result.motivation || prev.motivation,
        appearance: data.result.appearance || prev.appearance,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="text-indigo-400" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">Characters</h2>
            <p className="text-gray-400 text-sm">Manage your story&apos;s cast</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus size={16} />
          Add Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <Users size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No characters yet. Add your first character!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.map((char) => (
            <div
              key={char.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-bold text-lg">{char.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(char)}
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteCharacter(char.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {char.personality && (
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                  <span className="text-gray-500">Personality: </span>{char.personality}
                </p>
              )}
              {char.motivation && (
                <p className="text-gray-400 text-sm line-clamp-2">
                  <span className="text-gray-500">Motivation: </span>{char.motivation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-white font-bold text-lg">
                {editingId ? 'Edit Character' : 'Add Character'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Character name"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Personality</label>
                <textarea
                  value={formData.personality}
                  onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                  placeholder="Describe their personality..."
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Motivation</label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="What drives them?"
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Appearance</label>
                <textarea
                  value={formData.appearance}
                  onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                  placeholder="Physical description..."
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder-gray-500"
                />
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAIGenerate}
                  disabled={aiLoading}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  AI Generate
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Character
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

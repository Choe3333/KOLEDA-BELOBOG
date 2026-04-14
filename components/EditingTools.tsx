'use client';

import { useState } from 'react';
import { Edit3, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function EditingTools() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeType, setActiveType] = useState<'rewrite' | 'expand' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = async (type: 'rewrite' | 'expand') => {
    if (!inputText.trim()) {
      setError('Please enter some text to edit');
      return;
    }
    setLoading(true);
    setActiveType(type);
    setError('');
    setOutputText('');

    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content: inputText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutputText(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Edit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUseOutput = () => {
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
      setActiveType(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Edit3 className="text-indigo-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-white">Editing Tools</h2>
          <p className="text-gray-400 text-sm">Polish and expand your writing with AI</p>
        </div>
      </div>

      <div className={`grid gap-6 ${outputText ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            {outputText ? 'Original Text' : 'Text to Edit'}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here to rewrite or expand it..."
            rows={12}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder-gray-500 text-sm leading-relaxed"
          />

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleEdit('rewrite')}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeType === 'rewrite' && loading
                  ? 'bg-indigo-800 cursor-not-allowed text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading && activeType === 'rewrite' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              Rewrite
            </button>
            <button
              onClick={() => handleEdit('expand')}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeType === 'expand' && loading
                  ? 'bg-purple-800 cursor-not-allowed text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {loading && activeType === 'expand' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Edit3 size={16} />
              )}
              Expand
            </button>
          </div>
        </div>

        {outputText && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-300">
                {activeType === 'rewrite' ? '✨ Rewritten Text' : '📖 Expanded Text'}
              </label>
              <button
                onClick={handleUseOutput}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Use as Input <ArrowRight size={12} />
              </button>
            </div>
            <div className="w-full bg-gray-800 border border-indigo-500/30 text-gray-300 rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap min-h-[300px]">
              {outputText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

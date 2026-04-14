'use client';

import { useState } from 'react';
import { Download, FileText, File, Globe, Users, BookOpen } from 'lucide-react';
import { useNovelStore } from '@/store/novelStore';
import { exportToMarkdown, exportToPDF } from '@/lib/export';

export default function ExportPanel() {
  const { worldSetting, characters, chapters } = useNovelStore();
  const [pdfLoading, setPdfLoading] = useState(false);
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const handleExportMarkdown = () => {
    exportToMarkdown({ worldSetting, characters, chapters });
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      await exportToPDF({ worldSetting, characters, chapters });
    } finally {
      setPdfLoading(false);
    }
  };

  const hasContent = worldSetting.aiGenerated || characters.length > 0 || chapters.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Download className="text-indigo-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-white">Export</h2>
          <p className="text-gray-400 text-sm">Download your novel as PDF or Markdown</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleExportMarkdown}
          disabled={!hasContent}
          className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 hover:border-indigo-500 text-white px-6 py-4 rounded-xl font-medium transition-all"
        >
          <FileText size={22} className="text-indigo-400" />
          <div className="text-left">
            <div className="font-semibold">Export as Markdown</div>
            <div className="text-xs text-gray-400">Download .md file</div>
          </div>
        </button>

        <button
          onClick={handleExportPDF}
          disabled={!hasContent || pdfLoading}
          className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 hover:border-indigo-500 text-white px-6 py-4 rounded-xl font-medium transition-all"
        >
          <File size={22} className="text-purple-400" />
          <div className="text-left">
            <div className="font-semibold">{pdfLoading ? 'Generating...' : 'Export as PDF'}</div>
            <div className="text-xs text-gray-400">Download .pdf file</div>
          </div>
        </button>
      </div>

      {!hasContent && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 text-yellow-300 text-sm">
          Add some content first — create a world setting, characters, or chapters to export.
        </div>
      )}

      {/* Preview */}
      {hasContent && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Novel Preview</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* World */}
            {(worldSetting.genre || worldSetting.aiGenerated) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-indigo-400" />
                  <h4 className="text-white font-medium">World Setting</h4>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 space-y-1">
                  {worldSetting.genre && <p><span className="text-gray-500">Genre:</span> {worldSetting.genre}</p>}
                  {worldSetting.tone && <p><span className="text-gray-500">Tone:</span> {worldSetting.tone}</p>}
                  {worldSetting.aiGenerated && (
                    <p className="line-clamp-3 mt-2 text-gray-400">{worldSetting.aiGenerated}</p>
                  )}
                </div>
              </div>
            )}

            {/* Characters */}
            {characters.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-indigo-400" />
                  <h4 className="text-white font-medium">Characters ({characters.length})</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {characters.map((char) => (
                    <span key={char.id} className="bg-gray-900 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {char.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chapters */}
            {sortedChapters.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-indigo-400" />
                  <h4 className="text-white font-medium">Chapters ({sortedChapters.length})</h4>
                </div>
                <div className="space-y-2">
                  {sortedChapters.map((ch) => (
                    <div key={ch.id} className="bg-gray-900 rounded-lg px-4 py-3">
                      <div className="text-xs text-indigo-400 mb-1">Chapter {ch.order}</div>
                      <div className="text-white text-sm font-medium">{ch.title}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {ch.content.length} characters
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

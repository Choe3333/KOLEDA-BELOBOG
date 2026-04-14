'use client';

import { useState } from 'react';
import { Settings, Key, Cpu, Thermometer, FileText, RotateCcw, Check, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

const models = [
  { value: 'gpt-4o', label: 'GPT-4o (Recommended)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Faster)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Budget)' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어 (Korean)' },
  { value: 'ja', label: '日本語 (Japanese)' },
  { value: 'zh', label: '中文 (Chinese)' },
];

export default function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.openaiApiKey);

  const handleSave = () => {
    updateSettings({ openaiApiKey: apiKeyInput });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setApiKeyInput('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isApiKeySet = apiKeyInput.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="text-indigo-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-gray-400 text-sm">Configure API keys and customize AI behavior</p>
        </div>
      </div>

      {/* API Key Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Key size={18} className="text-indigo-400" />
          <h3 className="text-white font-semibold">API Configuration</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-500 font-mono text-sm"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Your API key is stored locally in the browser and never sent to any third-party server.
          </p>
        </div>

        {!isApiKeySet && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-yellow-300 text-sm">
              No API key set. The app will run in demo mode with placeholder content. Get your API key from{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-yellow-200"
              >
                platform.openai.com
              </a>
            </p>
          </div>
        )}

        {isApiKeySet && (
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 flex items-center gap-2">
            <Check size={16} className="text-green-400" />
            <p className="text-green-300 text-sm">API key is configured</p>
          </div>
        )}
      </div>

      {/* AI Model Settings */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu size={18} className="text-indigo-400" />
          <h3 className="text-white font-semibold">AI Model Settings</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
          <select
            value={settings.aiModel}
            onChange={(e) => updateSettings({ aiModel: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1.5">
              <Thermometer size={14} />
              Temperature (Creativity)
            </label>
            <span className="text-indigo-400 text-sm font-mono">{settings.temperature.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Precise (0.0)</span>
            <span>Balanced (1.0)</span>
            <span>Creative (2.0)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1.5">
              <FileText size={14} />
              Max Tokens (Response Length)
            </label>
            <span className="text-indigo-400 text-sm font-mono">{settings.maxTokens}</span>
          </div>
          <input
            type="range"
            min="500"
            max="4000"
            step="100"
            value={settings.maxTokens}
            onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Short (500)</span>
            <span>Medium (2000)</span>
            <span>Long (4000)</span>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Output Language</h3>
        <select
          value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          {languages.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">
          Controls the language used for AI-generated content.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {saved ? <Check size={18} /> : <Key size={18} />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <RotateCcw size={18} />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

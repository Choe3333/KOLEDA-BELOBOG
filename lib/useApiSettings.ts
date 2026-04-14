import { useSettingsStore } from '@/store/settingsStore';

export function useApiSettings() {
  const { settings } = useSettingsStore();

  return {
    apiKey: settings.openaiApiKey || undefined,
    model: settings.aiModel,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    language: settings.language,
  };
}

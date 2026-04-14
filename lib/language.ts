const languageNames: Record<string, string> = {
  ko: 'Korean',
  ja: 'Japanese',
  zh: 'Chinese',
};

export function getLanguageInstruction(language?: string): string {
  if (!language || language === 'en') return '';
  const name = languageNames[language] ?? language;
  return `\n\nIMPORTANT: Write your response in ${name}.`;
}

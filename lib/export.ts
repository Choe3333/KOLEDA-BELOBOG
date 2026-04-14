import { WorldSetting, Character, Chapter } from '@/store/novelStore';

interface NovelData {
  worldSetting: WorldSetting;
  characters: Character[];
  chapters: Chapter[];
}

export function exportToMarkdown(data: NovelData): void {
  const { worldSetting, characters, chapters } = data;

  let markdown = '# My Novel\n\n';

  // World Setting
  markdown += '## World Setting\n\n';
  if (worldSetting.genre) markdown += `**Genre:** ${worldSetting.genre}\n\n`;
  if (worldSetting.tone) markdown += `**Tone:** ${worldSetting.tone}\n\n`;
  if (worldSetting.background) {
    markdown += `**Background:**\n\n${worldSetting.background}\n\n`;
  }
  if (worldSetting.aiGenerated) {
    markdown += `**AI Generated World:**\n\n${worldSetting.aiGenerated}\n\n`;
  }

  // Characters
  if (characters.length > 0) {
    markdown += '---\n\n## Characters\n\n';
    characters.forEach((char) => {
      markdown += `### ${char.name}\n\n`;
      if (char.personality) markdown += `**Personality:** ${char.personality}\n\n`;
      if (char.motivation) markdown += `**Motivation:** ${char.motivation}\n\n`;
      if (char.appearance) markdown += `**Appearance:** ${char.appearance}\n\n`;
    });
  }

  // Chapters
  if (chapters.length > 0) {
    markdown += '---\n\n## Chapters\n\n';
    const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
    sortedChapters.forEach((chapter) => {
      markdown += `### Chapter ${chapter.order}: ${chapter.title}\n\n`;
      markdown += `${chapter.content}\n\n`;
    });
  }

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'novel.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(data: NovelData): Promise<void> {
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.default;
  const { worldSetting, characters, chapters } = data;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const addText = (
    text: string,
    size: number,
    style: 'normal' | 'bold' = 'normal',
    color: [number, number, number] = [0, 0, 0]
  ) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(text, maxWidth);
    const lineHeight = size * 0.4;

    if (y + lines.length * lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    doc.text(lines, margin, y);
    y += lines.length * lineHeight + 4;
  };

  const addSpacer = (space = 6) => {
    y += space;
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Title
  addText('My Novel', 28, 'bold', [63, 81, 181]);
  addSpacer(10);

  // World Setting
  if (worldSetting.genre || worldSetting.background || worldSetting.aiGenerated) {
    addText('World Setting', 18, 'bold', [63, 81, 181]);
    addSpacer(4);
    if (worldSetting.genre) addText(`Genre: ${worldSetting.genre}`, 11, 'normal');
    if (worldSetting.tone) addText(`Tone: ${worldSetting.tone}`, 11, 'normal');
    if (worldSetting.background) {
      addSpacer(2);
      addText('Background:', 12, 'bold');
      addText(worldSetting.background, 10, 'normal');
    }
    if (worldSetting.aiGenerated) {
      addSpacer(2);
      addText('World Description:', 12, 'bold');
      addText(worldSetting.aiGenerated, 10, 'normal');
    }
    addSpacer(8);
  }

  // Characters
  if (characters.length > 0) {
    addText('Characters', 18, 'bold', [63, 81, 181]);
    addSpacer(4);
    characters.forEach((char) => {
      addText(char.name, 14, 'bold');
      if (char.personality) addText(`Personality: ${char.personality}`, 10, 'normal');
      if (char.motivation) addText(`Motivation: ${char.motivation}`, 10, 'normal');
      if (char.appearance) addText(`Appearance: ${char.appearance}`, 10, 'normal');
      addSpacer(4);
    });
    addSpacer(4);
  }

  // Chapters
  if (chapters.length > 0) {
    addText('Chapters', 18, 'bold', [63, 81, 181]);
    addSpacer(4);
    const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
    sortedChapters.forEach((chapter) => {
      addText(`Chapter ${chapter.order}: ${chapter.title}`, 14, 'bold');
      addSpacer(2);
      addText(chapter.content, 10, 'normal');
      addSpacer(8);
    });
  }

  doc.save('novel.pdf');
}

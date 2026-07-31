import { stripHtml } from './html.utils';

export function extractBulletPoints(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  // Convert <li> tags and <br> to newline separators, and insert newlines before inline bullet symbols
  const formattedContent = content
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/([^\n])\s*([\u2022\u2023\u25E6\u2043\u2219\-\*])/g, '$1\n$2');

  // Strip remaining HTML tags
  const plainText = stripHtml(formattedContent);

  const lines = plainText.split(/\r?\n/);
  const bulletPoints: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match lines starting with bullets (•, -, *, ◦, ‣, ⁃) or numbered lists (1., 1), etc.)
    const bulletMatch = trimmed.match(/^(?:[\u2022\u2023\u25E6\u2043\u2219\-\*]|(?:\d+[\.\)]))\s*(.+)$/);
    if (bulletMatch && bulletMatch[1]) {
      // Remove square brackets [ and ] from extracted bullet items
      let cleanPoint = bulletMatch[1].replace(/[\[\]]/g, '').trim();
      if (cleanPoint) {
        bulletPoints.push(cleanPoint);
      }
    }
  }

  return bulletPoints;
}

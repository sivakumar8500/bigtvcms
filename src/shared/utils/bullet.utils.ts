import { stripHtml } from './html.utils';

export interface FormattedBulletsResult {
  bulletPoints: string[];
  content: string;
}

/**
 * Extracts bullet points and returns clean content without bullet point lines
 * so that content only contains header/location text and bulletPoints contains
 * clean bullet point strings without square brackets ([ and ]).
 */
export function formatBulletPostContentAndBullets(
  content: string,
  explicitBullets?: string[]
): FormattedBulletsResult {
  let bullets: string[] = [];
  if (Array.isArray(explicitBullets) && explicitBullets.length > 0) {
    bullets = explicitBullets
      .map((pt) => String(pt).replace(/[\[\]]/g, '').trim())
      .filter(Boolean);
  }

  const formattedContent = (content || '')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/([^\n])\s*([\u2022\u2023\u25E6\u2043\u2219\-\*])/g, '$1\n$2');

  const plainText = stripHtml(formattedContent);
  const lines = plainText.split(/\r?\n/);

  const nonBulletLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const bulletMatch = trimmed.match(/^(?:[\u2022\u2023\u25E6\u2043\u2219\-\*]|(?:\d+[\.\)]))\s*(.+)$/);
    const keywordBulletMatch = /^(?:\[?\s*(?:Key point|point|Official statement|ముఖ్యమైన విషయం|అధికారుల ప్రకటన|తాజా సమాచారం))/i.test(trimmed);

    let isBullet = false;
    let bulletText = '';

    if (bulletMatch && bulletMatch[1]) {
      isBullet = true;
      bulletText = bulletMatch[1].replace(/[\[\]]/g, '').trim();
    } else if (keywordBulletMatch) {
      isBullet = true;
      bulletText = trimmed.replace(/[\[\]]/g, '').trim();
    } else if (bullets.length > 0) {
      const cleanLine = trimmed.replace(/^[•\-\*\s]+/, '').replace(/[\[\]]/g, '').trim().toLowerCase();
      const matchesExplicit = bullets.some((b) => b.toLowerCase() === cleanLine);
      if (matchesExplicit) {
        isBullet = true;
        bulletText = trimmed.replace(/[\[\]]/g, '').trim();
      }
    }

    if (isBullet) {
      if (bulletText && (!explicitBullets || explicitBullets.length === 0)) {
        bullets.push(bulletText);
      }
    } else {
      nonBulletLines.push(trimmed);
    }
  }

  return {
    bulletPoints: bullets,
    content: nonBulletLines.join('\n'),
  };
}

export function extractBulletPoints(content: string): string[] {
  return formatBulletPostContentAndBullets(content).bulletPoints;
}

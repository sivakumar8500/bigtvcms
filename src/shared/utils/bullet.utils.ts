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
    .replace(/<\/li>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<h[1-6][^>]*>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/\s+(\.|\>|\*|\_|•)\s+/g, '\n$1 ')
    .replace(/([^\n\d])\s*([\u2022\u2023\u25E6\u2043\u2219\>\*\_])/g, '$1\n$2');

  const plainText = stripHtml(formattedContent);
  const lines = plainText.split(/\r?\n/);

  const nonBulletLines: string[] = [];
  const extractedBullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Reject lines starting with hyphen (-) as bullet points (hyphen is normal content text)
    if (/^\-/.test(trimmed)) {
      nonBulletLines.push(trimmed);
      continue;
    }

    // Accept bullet delimiters: ., >, *, _, •, numbers (1., 1), 1)
    const bulletMatch = trimmed.match(
      /^(?:[\u2022\u2023\u25E6\u2043\u2219\>\*\_\.]|(?:\d+[\.\)]?))\s*(.+)$/
    );
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
      const cleanLine = trimmed.replace(/^[•\>\*\.\_\s]+/, '').replace(/[\[\]]/g, '').trim().toLowerCase();
      const matchesExplicit = bullets.some((b) => b.toLowerCase() === cleanLine);
      if (matchesExplicit) {
        isBullet = true;
        bulletText = trimmed.replace(/[\[\]]/g, '').trim();
      }
    }

    // If preceding lines produced bullet points, any subsequent line in a bullet list is also a separate bullet point
    if (!isBullet && extractedBullets.length > 0) {
      isBullet = true;
      bulletText = trimmed.replace(/^[•\>\*\.\_\s]+/, '').replace(/[\[\]]/g, '').trim();
    }

    if (isBullet && bulletText) {
      extractedBullets.push(bulletText);
    } else {
      nonBulletLines.push(trimmed);
    }
  }

  // Fallback: If no explicit bullet delimiters were found but there are non-bullet lines
  if (extractedBullets.length === 0 && nonBulletLines.length > 0) {
    const firstLineIsBullet = /^(?:[\u2022\u2023\u25E6\u2043\u2219\>\*\_\.]|(?:\d+[\.\)]?))\s*/.test(nonBulletLines[0]);
    if (firstLineIsBullet || nonBulletLines.length > 1) {
      const startIndex = firstLineIsBullet ? 0 : (bullets.length > 0 ? 0 : 1);
      const header = startIndex > 0 ? nonBulletLines[0] : '';
      const bulletLines = nonBulletLines.slice(startIndex);
      const fallbackBullets: string[] = [];

      for (const b of bulletLines) {
        if (!/^\-/.test(b)) {
          const parts = b
            .split(/\s+\.\s+|\r?\n/)
            .map((p) => p.replace(/^[•\>\*\.\_\s]+/, '').replace(/[\[\]]/g, '').trim())
            .filter(Boolean);
          fallbackBullets.push(...parts);
        }
      }

      if (fallbackBullets.length > 0) {
        return {
          bulletPoints: fallbackBullets,
          content: header,
        };
      }
    }
  }

  const rawBullets = extractedBullets.length > 0 ? extractedBullets : bullets;
  const finalBulletsList: string[] = [];

  for (const item of rawBullets) {
    const parts = item
      .split(/\s+\.\s+|\r?\n/)
      .map((p) => p.replace(/^[•\>\*\.\_\s]+/, '').replace(/[\[\]]/g, '').trim())
      .filter(Boolean);
    finalBulletsList.push(...parts);
  }

  return {
    bulletPoints: finalBulletsList,
    content: nonBulletLines.join('\n'),
  };
}

export function extractBulletPoints(content: string): string[] {
  return formatBulletPostContentAndBullets(content).bulletPoints;
}

export function formatDisplayContent(post: any): string {
  if (!post) return '';
  const rawContent = (typeof post === 'string' ? post : post.content || post.body || '').trim();
  const bullets = typeof post === 'object' && post ? (post.bulletPoints || post.bullet_points || post.bullets || []) : [];

  let formatted = rawContent.replace(/\s+(\.|\>|\*|\_|•)\s+/g, '\n$1 ');

  if (Array.isArray(bullets) && bullets.length > 0) {
    const cleanBullets = bullets.map((b: any) => String(b).replace(/[\[\]]/g, '').trim()).filter(Boolean);
    if (cleanBullets.length > 0) {
      const contentLower = formatted.toLowerCase();
      const allPresentInContent = cleanBullets.every((b) => contentLower.includes(b.toLowerCase()));

      if (!allPresentInContent || !formatted.includes('\n')) {
        const bulletLines = cleanBullets.map((b) =>
          /^(?:[\u2022\u2023\u25E6\u2043\u2219\>\*\_\.]|(?:\d+[\.\)]?))/.test(b) ? b : `. ${b}`
        );

        if (!formatted) {
          formatted = bulletLines.join('\n');
        } else {
          const contentLines = formatted.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
          const headerLines = contentLines.filter(
            (line: string) => !cleanBullets.some((b) => line.replace(/^[•\>\*\.\_\s]+/, '').toLowerCase() === b.toLowerCase())
          );
          const headerText = headerLines.join('\n');
          formatted = headerText ? `${headerText}\n\n${bulletLines.join('\n')}` : bulletLines.join('\n');
        }
      }
    }
  }

  return formatted;
}

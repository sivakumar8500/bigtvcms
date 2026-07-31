import { extractBulletPoints, formatBulletPostContentAndBullets } from '../utils/bullet.utils';

describe('formatBulletPostContentAndBullets', () => {
  it('should extract bullet points and remove bullet point lines from content', () => {
    const rawContent = `📰 BREAKING NEWS | [LOCATION]
🔴 [Main News Headline]
 [Key point – 1]
 [Key point – 2]
 [Key point – 3]
 [Official statement / Latest update]`;

    const result = formatBulletPostContentAndBullets(rawContent);

    expect(result.bulletPoints).toEqual([
      'Key point – 1',
      'Key point – 2',
      'Key point – 3',
      'Official statement / Latest update',
    ]);
    expect(result.content).toBe('📰 BREAKING NEWS | [LOCATION]\n🔴 [Main News Headline]');
  });

  it('should extract bullet points formatted with • bullet characters and return header content', () => {
    const content = `
[ప్రధాన వార్త శీర్షిక]

• [ముఖ్యమైన విషయం – 1]
• [ముఖ్యమైన విషయం – 2]
• [ముఖ్యమైన విషయం – 3]
• [అధికారుల ప్రకటన / తాజా సమాచారం]
    `;

    const result = formatBulletPostContentAndBullets(content);
    expect(result.bulletPoints).toEqual([
      'ముఖ్యమైన విషయం – 1',
      'ముఖ్యమైన విషయం – 2',
      'ముఖ్యమైన విషయం – 3',
      'అధికారుల ప్రకటన / తాజా సమాచారం',
    ]);
    expect(result.content).toBe('[ప్రధాన వార్త శీర్షిక]');
  });

  it('should extract bullet points formatted with dash or star', () => {
    const content = `
Headline text
- point 1
* point 2
- point 3
    `;
    const result = formatBulletPostContentAndBullets(content);
    expect(result.bulletPoints).toEqual(['point 1', 'point 2', 'point 3']);
    expect(result.content).toBe('Headline text');
  });
});

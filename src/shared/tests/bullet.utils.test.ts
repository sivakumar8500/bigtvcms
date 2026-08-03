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

  it('should extract bullet points formatted with ., >, 1, •, *, _ and reject only -', () => {
    const content = `
Headline text
. point 1
> point 2
1. point 3
- hyphen line (not bullet)
_ point 4
* point 5
    `;
    const result = formatBulletPostContentAndBullets(content);
    expect(result.bulletPoints).toEqual(['point 1', 'point 2', 'point 3', 'point 4', 'point 5']);
    expect(result.content).toBe('Headline text\n- hyphen line (not bullet)');
  });

  it('should extract newly added bullet points when editing an existing post with prior bulletPoints', () => {
    const editContent = `<p>Hello siva kumar</p><ul><li>Hai</li><li>HelloKumar</li><li>Siva</li><li>NewPoint</li></ul>`;
    const initialBullets = ['Hai', 'HelloKumar', 'Siva'];

    const result = formatBulletPostContentAndBullets(editContent, initialBullets);
    expect(result.bulletPoints).toEqual(['Hai', 'HelloKumar', 'Siva', 'NewPoint']);
    expect(result.content).toBe('Hello siva kumar');
  });

  it('should split separate bullet lines like dsdddddddhaihello and ff into separate items in bulletPoints array', () => {
    const editContent = `<p>. dsdddddddhaihello</p><p>. ff</p>`;
    const result = formatBulletPostContentAndBullets(editContent, ['dsdddddddhaihello']);
    expect(result.bulletPoints).toEqual(['dsdddddddhaihello', 'ff']);
  });

  it('should extract 3 separate bullet strings when user enters 3 points like ahi, hello, siva', () => {
    const editContent = `<div>ahi</div><div>hello</div><div>siva</div>`;
    const result = formatBulletPostContentAndBullets(editContent, ['ahi']);
    expect(result.bulletPoints).toEqual(['ahi', 'hello', 'siva']);
  });
});

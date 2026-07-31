import { extractBulletPoints } from '../utils/bullet.utils';

describe('extractBulletPoints', () => {
  it('should extract inline bullet points and remove square brackets', () => {
    const content =
      '[ప్రధాన వార్త శీర్షిక]• [ముఖ్యమైన విషయం – 1]• [ముఖ్యమైన విషయం – 2]• [ముఖ్యమైన విషయం – 3]• [అధికారుల ప్రకటన / తాజా సమాచారం]';

    const points = extractBulletPoints(content);
    expect(points).toEqual([
      'ముఖ్యమైన విషయం – 1',
      'ముఖ్యమైన విషయం – 2',
      'ముఖ్యమైన విషయం – 3',
      'అధికారుల ప్రకటన / తాజా సమాచారం',
    ]);
  });

  it('should extract bullet points formatted with • bullet characters and linebreaks', () => {
    const content = `
[ప్రధాన వార్త శీర్షిక]

• [ముఖ్యమైన విషయం – 1]
• [ముఖ్యమైన విషయం – 2]
• [ముఖ్యమైన విషయం – 3]
• [అధికారుల ప్రకటన / తాజా సమాచారం]
    `;

    const points = extractBulletPoints(content);
    expect(points).toEqual([
      'ముఖ్యమైన విషయం – 1',
      'ముఖ్యమైన విషయం – 2',
      'ముఖ్యమైన విషయం – 3',
      'అధికారుల ప్రకటన / తాజా సమాచారం',
    ]);
  });

  it('should extract bullet points formatted with dash or star', () => {
    const content = `
Headline text
- point 1
* point 2
- point 3
    `;
    const points = extractBulletPoints(content);
    expect(points).toEqual(['point 1', 'point 2', 'point 3']);
  });

  it('should extract bullet points from HTML <li> tags', () => {
    const content = `
<p>[ప్రధాన వార్త శీర్షిక]</p>
<ul>
  <li>అవకాడో ఉదయం తినడం మంచిది.</li>
  <li>జామపండు మధ్యాహ్నం తీసుకోవాలి.</li>
</ul>
    `;
    const points = extractBulletPoints(content);
    expect(points).toEqual([
      'అవకాడో ఉదయం తినడం మంచిది.',
      'జామపండు మధ్యాహ్నం తీసుకోవాలి.',
    ]);
  });

  it('should return empty array when content has no bullet points', () => {
    const content = 'Plain paragraph content without any bullets.';
    const points = extractBulletPoints(content);
    expect(points).toEqual([]);
  });
});

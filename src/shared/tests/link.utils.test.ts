import { formatLinks, formatLinksAndContent } from '../utils/link.utils';
import { stripAllTagsExceptLinkTags } from '../utils/html.utils';

describe('formatLinksAndContent', () => {
  it('should format string array into objects with id and value', () => {
    const input = ['https://www.bharatpetroleum.in/index'];
    const formatted = formatLinks(input);
    expect(formatted).toEqual([
      {
        id: 'link1',
        value: 'https://www.bharatpetroleum.in/index',
      },
    ]);
  });

  it('should preserve existing link objects with id and value', () => {
    const input = [{ id: 'link1', value: 'https://www.bharatpetroleum.in/index' }];
    const formatted = formatLinks(input);
    expect(formatted).toEqual([
      {
        id: 'link1',
        value: 'https://www.bharatpetroleum.in/index',
      },
    ]);
  });

  it('should transform <a href="...">క్లిక్</a> into <link1>క్లిక్</link1> in content and strip outer HTML tags', () => {
    const content = '<p>🔴 [ప్రధాన వార్త <a href="https://www.bharatpetroleum.in/index">క్లిక్</a>]</p>';
    const result = formatLinksAndContent([], content);
    expect(result.content).toBe('🔴 [ప్రధాన వార్త <link1>క్లిక్</link1>]');
    expect(result.links).toEqual([
      {
        id: 'link1',
        value: 'https://www.bharatpetroleum.in/index',
      },
    ]);
  });

  it('should strip rich editor HTML tags (<pre>, <code>, <span>) leaving only clean text with <link1> tags', () => {
    const richContent = '<pre class="microlight"><code class="language-json"><span style="color: red;">తగినన్ని <a href="https://google.com">అవకాశాలు </a>కల్పిస్తే బాగుంటుంది.</span></code></pre>';
    const result = formatLinksAndContent([], richContent);
    expect(result.content).toBe('తగినన్ని <link1>అవకాశాలు </link1>కల్పిస్తే బాగుంటుంది.');
    expect(result.links).toEqual([
      {
        id: 'link1',
        value: 'https://google.com',
      },
    ]);
  });

  it('should strip <span> tags with styles from content in all post formats', () => {
    const spanContent = '<span style="color: rgb(31, 41, 55); font-family: Ramabhadra;">విజయనగరం జిల్లా భోగాపురంలో...</span>';
    const cleaned = stripAllTagsExceptLinkTags(spanContent);
    expect(cleaned).toBe('విజయనగరం జిల్లా భోగాపురంలో...');
  });

  it('should extract URLs from content string if links array is empty', () => {
    const content = 'Visit https://www.bharatpetroleum.in/index for official news.';
    const formatted = formatLinks([], content);
    expect(formatted).toEqual([
      {
        id: 'link1',
        value: 'https://www.bharatpetroleum.in/index',
      },
    ]);
  });
});

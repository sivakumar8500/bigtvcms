import { formatLinks, formatLinksAndContent, restoreLinksInContent } from '../utils/link.utils';
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

  it('should preserve existing <link1> tags and link objects when editing post without changing link', () => {
    const content = 'Check <link1>diog</link1> today';
    const existingLinks = [{ id: 'link1', value: 'www.google.com' }];
    const result = formatLinksAndContent(existingLinks, content);
    expect(result.content).toBe('Check <link1>diog</link1> today');
    expect(result.links).toEqual([{ id: 'link1', value: 'www.google.com' }]);
  });

  it('should clean up nested <link1> tags when user wraps or edits link in editor', () => {
    const content = 'Check <a href="https://bing.com"><link1>diog</link1></a> today';
    const existingLinks = [{ id: 'link1', value: 'www.google.com' }];
    const result = formatLinksAndContent(existingLinks, content);
    expect(result.content).toBe('Check <link1>diog</link1> today');
    expect(result.links).toEqual([{ id: 'link1', value: 'https://bing.com' }]);
  });

  it('should clean up outer <link1> tags wrapping anchor tags and duplicated tags', () => {
    const outerContent = 'Check <link1><a href="https://bing.com">diog</a></link1> today';
    const res1 = formatLinksAndContent([], outerContent);
    expect(res1.content).toBe('Check <link1>diog</link1> today');
    expect(res1.links).toEqual([{ id: 'link1', value: 'https://bing.com' }]);

    const dupeContent = 'Check <link1><link1>diog</link1></link1> today';
    const res2 = formatLinksAndContent([{ id: 'link1', value: 'https://example.com' }], dupeContent);
    expect(res2.content).toBe('Check <link1>diog</link1> today');
    expect(res2.links).toEqual([{ id: 'link1', value: 'https://example.com' }]);
  });
});

describe('restoreLinksInContent', () => {
  it('should convert <link1>innerText</link1> back into <a href="url">innerText</a>', () => {
    const content = 'Check <link1>diog</link1> for updates';
    const links = [{ id: 'link1', value: 'www.google.com' }];
    const restored = restoreLinksInContent(content, links);
    expect(restored).toBe('Check <a href="www.google.com">diog</a> for updates');
  });

  it('should handle string link inputs, object maps, and unwrap duplicated tags', () => {
    const dupe = '<link1><link1>diog</link1></link1>';
    const restored1 = restoreLinksInContent(dupe, 'https://example.com');
    expect(restored1).toBe('<a href="https://example.com">diog</a>');

    const restored2 = restoreLinksInContent('<link1>news</link1>', { link1: 'https://news.com' });
    expect(restored2).toBe('<a href="https://news.com">news</a>');
  });

  it('should handle case insensitivity and multiple links', () => {
    const content = '<link1>First</link1> and <link2>Second</link2>';
    const links = [
      { id: 'link1', value: 'https://first.com' },
      { id: 'link2', value: 'https://second.com' },
    ];
    const restored = restoreLinksInContent(content, links);
    expect(restored).toBe('<a href="https://first.com">First</a> and <a href="https://second.com">Second</a>');
  });

  it('should return original content if links is empty or undefined', () => {
    expect(restoreLinksInContent('Some <link1>text</link1>', [])).toBe('Some <link1>text</link1>');
    expect(restoreLinksInContent('Some text', null)).toBe('Some text');
    expect(restoreLinksInContent('', [{ id: 'link1', value: 'www.google.com' }])).toBe('');
  });
});


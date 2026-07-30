import { stripHtml } from '../html.utils';

describe('stripHtml utility', () => {
  it('returns empty string for null, undefined or empty input', () => {
    expect(stripHtml(null)).toBe('');
    expect(stripHtml(undefined)).toBe('');
    expect(stripHtml('')).toBe('');
  });

  it('strips simple HTML tags from text', () => {
    expect(stripHtml('<p>Hello World</p>')).toBe('Hello World');
    expect(stripHtml('<h1>Breaking News</h1>')).toBe('Breaking News');
    expect(stripHtml('<b>Bold</b> and <i>Italic</i>')).toBe('Bold and Italic');
  });

  it('strips nested and script HTML tags', () => {
    expect(stripHtml('<div><p>Title <span>Text</span></p></div>')).toBe('Title Text');
    expect(stripHtml('<script>alert("xss")</script>Dangerous Content')).toBe('alert("xss")Dangerous Content');
  });

  it('replaces &nbsp; with space and trims padding', () => {
    expect(stripHtml(' <p>&nbsp;Hello&nbsp;World&nbsp;</p> ')).toBe('Hello World');
  });
});

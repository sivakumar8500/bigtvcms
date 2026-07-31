import { stripAllTagsExceptLinkTags } from './html.utils';

export interface FormattedLinksResult {
  links: Array<{ id: string; value: string }>;
  content: string;
}

/**
 * Formats links into array of objects [{ id: "link1", value: "https://..." }]
 * and transforms HTML content so only <linkX>text</linkX> tags remain in content
 * while stripping all other HTML tags (<pre>, <code>, <span>, <p>, etc.).
 */
export function formatLinksAndContent(linksInput: any, content?: string): FormattedLinksResult {
  const links: Array<{ id: string; value: string }> = [];
  let updatedContent = content || '';

  let rawList: any[] = [];
  if (Array.isArray(linksInput)) {
    rawList = linksInput;
  } else if (typeof linksInput === 'string' && linksInput.trim()) {
    rawList = [linksInput.trim()];
  }

  const urlToIdMap = new Map<string, string>();
  let linkCounter = 1;

  // 1. Process explicit linksInput array if present
  rawList.forEach((item) => {
    if (!item) return;
    let urlValue = '';
    let linkId = '';

    if (typeof item === 'object' && item.value) {
      urlValue = String(item.value).trim();
      linkId = item.id || `link${linkCounter++}`;
    } else if (typeof item === 'string' && item.trim()) {
      urlValue = item.trim();
      linkId = `link${linkCounter++}`;
    }

    if (urlValue && !urlToIdMap.has(urlValue)) {
      urlToIdMap.set(urlValue, linkId);
      links.push({ id: linkId, value: urlValue });
    }
  });

  // 2. Extract <a> tags from content, replace with <linkX>text</linkX>
  if (updatedContent && typeof updatedContent === 'string') {
    const anchorRegex = /<a\s+[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>(.*?)<\/a>/gi;

    updatedContent = updatedContent.replace(anchorRegex, (fullMatch, url, innerText) => {
      const cleanUrl = url.trim();
      let linkId = urlToIdMap.get(cleanUrl);
      if (!linkId) {
        linkId = `link${linkCounter++}`;
        urlToIdMap.set(cleanUrl, linkId);
        links.push({ id: linkId, value: cleanUrl });
      }
      return `<${linkId}>${innerText}</${linkId}>`;
    });
  }

  // 3. Fallback: Extract plain URLs from content if no links found yet
  if (links.length === 0 && updatedContent && typeof updatedContent === 'string') {
    const urlRegex = /https?:\/\/[^\s<"'>]+/gi;
    const urlMatches = updatedContent.match(urlRegex);
    if (urlMatches) {
      urlMatches.forEach((url) => {
        const cleanUrl = url.trim();
        if (!urlToIdMap.has(cleanUrl)) {
          const linkId = `link${linkCounter++}`;
          urlToIdMap.set(cleanUrl, linkId);
          links.push({ id: linkId, value: cleanUrl });
        }
      });
    }
  }

  // 4. Strip all other HTML tags EXCEPT <linkX> and </linkX> tags from content
  if (updatedContent && typeof updatedContent === 'string') {
    updatedContent = stripAllTagsExceptLinkTags(updatedContent);
  }

  return {
    links,
    content: updatedContent,
  };
}

export function formatLinks(linksInput: any, content?: string): Array<{ id: string; value: string }> {
  return formatLinksAndContent(linksInput, content).links;
}

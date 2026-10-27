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

  const rawListMap = new Map<string, string>();
  let seedCounter = 1;
  rawList.forEach((item) => {
    if (!item) return;
    let urlValue = '';
    let linkId = '';

    if (typeof item === 'object' && item.value) {
      urlValue = String(item.value).trim();
      linkId = item.id || `link${seedCounter++}`;
    } else if (typeof item === 'string' && item.trim()) {
      urlValue = item.trim();
      linkId = `link${seedCounter++}`;
    }

    if (urlValue && linkId) {
      rawListMap.set(linkId.toLowerCase(), urlValue);
    }
  });

  // Clean up any outer/inner <linkX> tags around or inside <a> tags before processing
  if (updatedContent && typeof updatedContent === 'string') {
    // 1. Unwrap outer <linkX> around <a> tag: <link1><a href="...">text</a></link1> -> <a href="...">text</a>
    updatedContent = updatedContent.replace(/<\/?link\d+[^>]*>\s*(<a\s+[^>]*href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>)\s*<\/?link\d+[^>]*>/gi, '$1');
    // 2. Clean up inner <linkX> inside <a> tag: <a href="..."><link1>text</link1></a> -> <a href="...">text</a>
    updatedContent = updatedContent.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, innerText) => {
      const cleanInner = innerText.replace(/<\/?link\d+[^>]*>/gi, '');
      return `<a ${attrs}>${cleanInner}</a>`;
    });
    // 3. Clean up duplicated/nested <linkX><linkX> tags
    while (/<link(\d+)[^>]*>\s*<link\1[^>]*>([\s\S]*?)<\/link\1>\s*<\/link\1>/gi.test(updatedContent)) {
      updatedContent = updatedContent.replace(/<link(\d+)[^>]*>\s*<link\1[^>]*>([\s\S]*?)<\/link\1>\s*<\/link\1>/gi, '<link$1>$2</link$1>');
    }
  }

  // 1. Extract <a> tags from content, replace with <linkX>text</linkX>
  let hasAnchorTags = false;
  const usedIds = new Set<string>();
  const urlToIdMap = new Map<string, string>();
  let linkCounter = 1;

  if (updatedContent && typeof updatedContent === 'string') {
    const anchorRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

    updatedContent = updatedContent.replace(anchorRegex, (fullMatch, url, innerText) => {
      hasAnchorTags = true;
      const cleanUrl = url.trim();
      let linkId = urlToIdMap.get(cleanUrl);
      if (!linkId) {
        while (usedIds.has(`link${linkCounter}`.toLowerCase())) {
          linkCounter++;
        }
        linkId = `link${linkCounter++}`;
        usedIds.add(linkId.toLowerCase());
        urlToIdMap.set(cleanUrl, linkId);
        links.push({ id: linkId, value: cleanUrl });
      }
      return `<${linkId}>${innerText}</${linkId}>`;
    });
  }

  // 2. If content still contains <linkX> tags from existing links, ensure their IDs and URLs from rawListMap are preserved
  if (updatedContent && typeof updatedContent === 'string') {
    const existingLinkRegex = /<link(\d+)[^>]*>([\s\S]*?)<\/link\1>/gi;
    let m: RegExpExecArray | null;
    while ((m = existingLinkRegex.exec(updatedContent)) !== null) {
      const tagId = `link${m[1]}`;
      const existingInLinks = links.find((l) => l.id.toLowerCase() === tagId.toLowerCase());
      if (!existingInLinks) {
        let urlVal = rawListMap.get(tagId.toLowerCase()) || '';
        if (!urlVal) {
          const idx = parseInt(m[1], 10) - 1;
          const fallback = rawList[idx] || rawList[0];
          if (fallback) {
            urlVal = typeof fallback === 'object' && fallback.value ? String(fallback.value).trim() : typeof fallback === 'string' ? fallback.trim() : '';
          }
        }
        if (urlVal) {
          links.push({ id: tagId, value: urlVal });
          usedIds.add(tagId.toLowerCase());
        }
      }
    }
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

  // 4. Fallback: If no links found and no anchor tags were in content, preserve rawList links
  if (links.length === 0 && !hasAnchorTags) {
    rawList.forEach((item) => {
      if (!item) return;
      let urlValue = '';
      let linkId = '';
      if (typeof item === 'object' && item.value) {
        urlValue = String(item.value).trim();
        linkId = item.id || `link${links.length + 1}`;
      } else if (typeof item === 'string' && item.trim()) {
        urlValue = item.trim();
        linkId = `link${links.length + 1}`;
      }
      if (urlValue && !links.some((l) => l.value === urlValue)) {
        links.push({ id: linkId, value: urlValue });
      }
    });
  }

  // 5. If <a> tags or <linkX> were present in content, filter links to only those referenced in content
  const referencedLinkIds = new Set<string>();
  const linkRefRegex = /<link(\d+)[^>]*>/gi;
  let refMatch: RegExpExecArray | null;
  while ((refMatch = linkRefRegex.exec(updatedContent)) !== null) {
    referencedLinkIds.add(`link${refMatch[1]}`.toLowerCase());
  }

  let finalLinks = links;
  if (referencedLinkIds.size > 0) {
    finalLinks = links.filter((l) => referencedLinkIds.has(l.id.toLowerCase()));
  } else if (hasAnchorTags) {
    finalLinks = [];
  }

  // 6. Strip all other HTML tags EXCEPT <linkX> and </linkX> tags from content
  if (updatedContent && typeof updatedContent === 'string') {
    updatedContent = stripAllTagsExceptLinkTags(updatedContent);
  }

  return {
    links: finalLinks,
    content: updatedContent,
  };
}

export function formatLinks(linksInput: any, content?: string): Array<{ id: string; value: string }> {
  return formatLinksAndContent(linksInput, content).links;
}

/**
 * Restores <link1>innerText</link1> tags in content back into HTML <a href="url">innerText</a>
 * tags using the provided links array [{ id: "link1", value: "https://..." }] so they can be viewed
 * and edited in rich HTML editors.
 */
export function restoreLinksInContent(
  content?: string | null,
  links?: any
): string {
  if (!content) return '';

  let restored = content;
  // Clean duplicated/nested <linkX><linkX> tags first
  while (/<link(\d+)[^>]*>\s*<link\1[^>]*>([\s\S]*?)<\/link\1>\s*<\/link\1>/gi.test(restored)) {
    restored = restored.replace(/<link(\d+)[^>]*>\s*<link\1[^>]*>([\s\S]*?)<\/link\1>\s*<\/link\1>/gi, '<link$1>$2</link$1>');
  }

  if (!links || (Array.isArray(links) && links.length === 0) || (typeof links === 'object' && Object.keys(links).length === 0)) {
    return restored;
  }

  const linkMap = new Map<string, string>();
  const urlList: string[] = [];

  let rawList: any[] = [];
  if (Array.isArray(links)) {
    rawList = links;
  } else if (typeof links === 'string' && links.trim()) {
    rawList = [links.trim()];
  } else if (typeof links === 'object' && links !== null) {
    if ((links as any).value) {
      rawList = [links];
    } else {
      rawList = Object.entries(links).map(([k, v]) => ({ id: k, value: v }));
    }
  }

  rawList.forEach((item, index) => {
    if (!item) return;
    const url = typeof item === 'object' && item.value ? String(item.value).trim() : typeof item === 'string' ? String(item).trim() : '';
    if (!url) return;
    const linkId = typeof item === 'object' && item.id ? String(item.id).trim().toLowerCase() : `link${index + 1}`;
    linkMap.set(linkId, url);
    urlList.push(url);
  });

  restored = restored.replace(/<link(\d+)[^>]*>([\s\S]*?)<\/link\1>/gi, (match, num, innerText) => {
    const key = `link${num}`.toLowerCase();
    const url = linkMap.get(key) || urlList[parseInt(num, 10) - 1] || urlList[0];
    if (url) {
      return `<a href="${url}">${innerText}</a>`;
    }
    return match;
  });

  return restored;
}

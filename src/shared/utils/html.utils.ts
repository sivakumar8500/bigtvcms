/**
 * Removes HTML tags, converts line breaks/paragraphs, and replaces non-breaking space entities.
 * @param input Raw input string potentially containing HTML tags.
 * @returns Cleaned plain-text string with all HTML tags stripped.
 */
export function stripHtml(input?: string | null): string {
  if (!input) return '';
  return input
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

/**
 * Strips all HTML tags (<p>, <span>, <div>, <strong>, <pre>, <code>, etc.) from input,
 * allowing ONLY custom <link1> ... </link1> (or <linkX>) tags.
 */
export function stripAllTagsExceptLinkTags(input?: string | null): string {
  if (!input) return '';
  return input
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<(?!\/?link\d+[\s>])[^>]+>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

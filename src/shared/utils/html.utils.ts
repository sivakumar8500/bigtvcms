/**
 * Removes any HTML tags and replaces non-breaking space entities from a string.
 * @param input Raw input string potentially containing HTML tags.
 * @returns Cleaned plain-text string with all HTML tags stripped.
 */
export function stripHtml(input?: string | null): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

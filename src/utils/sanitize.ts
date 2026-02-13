import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks.
 * Use this for any user-provided content before rendering or sending to the server.
 */

/**
 * Sanitize HTML content - allows basic formatting tags
 * Use for rich text fields like descriptions and messages
 */
export function sanitizeHtml(input: string | undefined | null): string {
  if (!input) return '';

  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize to plain text - removes ALL HTML tags
 * Use for plain text fields like names, titles, short messages
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return '';

  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize form data object - applies text sanitization to all string fields
 * @param data - Form data object
 * @param htmlFields - Array of field names that should allow basic HTML
 * @returns Sanitized copy of the data
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T,
  htmlFields: string[] = []
): T {
  const sanitized = { ...data };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      if (htmlFields.includes(key)) {
        (sanitized as Record<string, unknown>)[key] = sanitizeHtml(sanitized[key] as string);
      } else {
        (sanitized as Record<string, unknown>)[key] = sanitizeText(sanitized[key] as string);
      }
    }
  }

  return sanitized;
}

/**
 * Escape special characters for safe display
 * Use when you need to display user input as-is without interpretation
 */
export function escapeHtml(input: string | undefined | null): string {
  if (!input) return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return input.replace(/[&<>"']/g, (char) => map[char]);
}

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeFormData,
  escapeHtml,
};

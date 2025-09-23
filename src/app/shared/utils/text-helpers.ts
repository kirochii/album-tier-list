/**
 * Capitalizes the first letter of each word in a string.
 */
export function capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Joins an array of strings (or a single string) into a comma-separated,
 * capitalized string. Returns null if empty or null/undefined.
 */
export function formatTextList(input: string | string[] | null | undefined): string | null {
    const list = Array.isArray(input) ? input : input ? [input] : [];
    return list.length ? list.map(capitalizeWords).join(', ') : null;
}

/**
 * Converts a string to title case (first letter uppercase, rest lowercase).
 */
export function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Converts a string to kebab-case (lowercase, words separated by hyphens).
 */
export function toKebabCase(str: string): string {
    return str
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
}

/**
 * Converts a string to snake_case (lowercase, words separated by underscores).
 */
export function toSnakeCase(str: string): string {
    return str
        .trim()
        .replace(/\s+/g, '_')
        .toLowerCase();
}
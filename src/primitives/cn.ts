import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names. Accepts any clsx-compatible value (strings, arrays,
 * objects with boolean values, falsy values that are dropped).
 *
 * Do NOT use class-variance-authority. Variants are CSS class modifiers
 * (e.g. `.btn.primary`) composed here.
 */
export function cn(...args: ClassValue[]): string {
  return clsx(...args);
}

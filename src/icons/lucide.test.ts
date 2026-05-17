import { describe, it, expect } from 'vitest';
import * as lucideExports from './lucide.js';

describe('lucide re-exports', () => {
  const expectedIcons = [
    'Check',
    'X',
    'ChevronDown',
    'ChevronUp',
    'ChevronLeft',
    'ChevronRight',
    'Search',
    'Settings',
    'Menu',
    'MoreHorizontal',
    'MoreVertical',
    'Plus',
    'Minus',
    'Edit',
    'Trash2',
    'Eye',
    'EyeOff',
    'Loader2',
    'AlertCircle',
    'Info',
  ];

  it('exports all expected icons', () => {
    for (const name of expectedIcons) {
      expect(lucideExports).toHaveProperty(name);
    }
  });

  it('each export is a non-null React component (function or object with $$typeof)', () => {
    for (const name of expectedIcons) {
      const icon = lucideExports[name as keyof typeof lucideExports];
      expect(icon).toBeTruthy();
      // lucide icons are forwardRef objects; accept both function and object forms
      expect(['function', 'object'].includes(typeof icon)).toBe(true);
    }
  });

  it('exports exactly the curated set — no extra symbols', () => {
    const exported = Object.keys(lucideExports);
    expect(exported.sort()).toEqual(expectedIcons.sort());
  });
});

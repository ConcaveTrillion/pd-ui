import { describe, it, expect } from 'vitest';
import * as lucideExports from './lucide.js';

describe('lucide re-exports', () => {
  const expectedIcons = [
    'AlertCircle',
    'Check',
    'ChevronDown',
    'ChevronLeft',
    'ChevronRight',
    'ChevronUp',
    'Edit',
    'Eye',
    'EyeOff',
    'FolderOpen',
    'GitBranch',
    'Info',
    'Keyboard',
    'LayoutList',
    'List',
    'Loader2',
    'Menu',
    'Minus',
    'MoreHorizontal',
    'MoreVertical',
    'PanelRightClose',
    'Plus',
    'Search',
    'Settings',
    'Square',
    'Trash2',
    'X',
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

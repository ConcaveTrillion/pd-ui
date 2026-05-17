import { describe, it, expect } from 'vitest';
import * as iconsBarrel from './index.js';

describe('icons barrel (src/icons/index.ts)', () => {
  // Lucide re-exports
  const lucideNames = [
    'Check', 'X', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
    'Search', 'Settings', 'Menu', 'MoreHorizontal', 'MoreVertical',
    'Plus', 'Minus', 'Edit', 'Trash2', 'Eye', 'EyeOff', 'Loader2',
    'AlertCircle', 'Info',
  ];

  // Bespoke re-exports
  const bespokeNames = [
    'LayerBlock', 'LayerPara', 'LayerLine', 'LayerWord',
    'ModeSelect', 'ModeRebox', 'ModeErase', 'ModeCharFixer',
    'MatchStatusExact', 'MatchStatusFuzzy', 'MatchStatusMismatch',
  ];

  it('re-exports all lucide icons', () => {
    for (const name of lucideNames) {
      expect(iconsBarrel).toHaveProperty(name);
    }
  });

  it('re-exports all bespoke OCR icons', () => {
    for (const name of bespokeNames) {
      expect(iconsBarrel).toHaveProperty(name);
      expect(iconsBarrel[name as keyof typeof iconsBarrel]).toBeTruthy();
    }
  });

  it('exports exactly the union of lucide + bespoke names', () => {
    const expected = [...lucideNames, ...bespokeNames].sort();
    const actual = Object.keys(iconsBarrel).sort();
    expect(actual).toEqual(expected);
  });
});

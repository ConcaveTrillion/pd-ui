import { describe, it, expect } from 'vitest';
import { cn } from './cn.js';

describe('cn', () => {
  it('returns empty string for no args', () => {
    expect(cn()).toBe('');
  });

  it('returns a single class string', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('joins multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('drops undefined values', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('drops false values', () => {
    expect(cn('foo', false, 'bar')).toBe('foo bar');
  });

  it('drops null values', () => {
    expect(cn('foo', null, 'bar')).toBe('foo bar');
  });

  it('handles nested arrays', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles deeply nested arrays', () => {
    expect(cn([['foo', false, 'bar'], 'baz'])).toBe('foo bar baz');
  });

  it('handles object truthiness — truthy keys are included', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('handles mixed args: string, array, object', () => {
    expect(cn('base', ['mod1', false && 'mod2'], { active: true, disabled: false })).toBe(
      'base mod1 active',
    );
  });

  it('handles empty string gracefully', () => {
    expect(cn('', 'foo')).toBe('foo');
  });
});

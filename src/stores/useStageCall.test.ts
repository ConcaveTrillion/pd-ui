/**
 * useStageCall tests — covering #166.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useStageCall } from './useStageCall.js';

describe('useStageCall (#166)', () => {
  it('starts idle', () => {
    const { result } = renderHook(() => useStageCall('stage1', 'page1'));
    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.isWarming).toBe(false);
  });

  it('is a stub (no-op) when submit is not provided', () => {
    const { result } = renderHook(() => useStageCall('s', 'p'));
    act(() => { result.current.run({}); });
    expect(result.current.status).toBe('idle');
  });

  it('goes pending then done when submit resolves', async () => {
    const submit = vi.fn(() => Promise.resolve({ text: 'result' }));
    const { result } = renderHook(() =>
      useStageCall('stage1', 'p1', { submit }),
    );
    await act(() => { result.current.run({}); return Promise.resolve(); });
    expect(result.current.status).toBe('done');
    expect(result.current.result).toEqual({ text: 'result' });
  });

  it('goes error when submit rejects with non-503', async () => {
    const submit = vi.fn(() => Promise.reject(new Error('fail')));
    const { result } = renderHook(() =>
      useStageCall('stage1', 'p1', { submit }),
    );
    await act(() => { result.current.run({}); return Promise.resolve(); });
    expect(result.current.status).toBe('error');
  });

  it('goes warming when submit rejects with 503-like error', async () => {
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    const submit = vi.fn(() => Promise.reject({ status: 503, retryAfter: 1000 }));
    const { result } = renderHook(() =>
      useStageCall('stage1', 'p1', { submit }),
    );
    await act(() => { result.current.run({}); return Promise.resolve(); });
    expect(result.current.status).toBe('warming');
    expect(result.current.isWarming).toBe(true);
    expect(result.current.retryAt).toBeGreaterThan(Date.now() - 100);
  });
});

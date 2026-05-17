/**
 * useLongJob tests — covering #166.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLongJob } from './useLongJob.js';

describe('useLongJob (#166)', () => {
  it('starts idle', () => {
    const { result } = renderHook(() => useLongJob(null));
    expect(result.current.status).toBe('idle');
    expect(result.current.progress).toBeNull();
    expect(result.current.events).toEqual([]);
  });

  it('is a stub (no-op) when pollFn is not provided', () => {
    const { result } = renderHook(() => useLongJob('job-1'));
    expect(result.current.status).toBe('idle');
  });

  it('polls and returns done status', async () => {
    const pollFn = vi.fn(() => Promise.resolve({
      status: 'done' as const,
      progress: 1.0,
      events: [{ type: 'complete', ts: 1000 }],
    }));
    const { result } = renderHook(() =>
      useLongJob('job-1', { pollFn, pollIntervalMs: 100 }),
    );
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(result.current.status).toBe('done');
    expect(result.current.progress).toBe(1.0);
    expect(result.current.events).toHaveLength(1);
  });

  it('sets error when pollFn throws', async () => {
    const pollFn = vi.fn(() => Promise.reject(new Error('fail')));
    const { result } = renderHook(() =>
      useLongJob('job-1', { pollFn }),
    );
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(result.current.status).toBe('error');
  });

  it('cancel() calls cancelFn and sets status=cancelled', async () => {
    const cancelFn = vi.fn(() => Promise.resolve());
    const pollFn = vi.fn(() => Promise.resolve({ status: 'running' as const, progress: 0.5 }));
    const { result } = renderHook(() =>
      useLongJob('job-1', { pollFn, cancelFn, pollIntervalMs: 5000 }),
    );
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    await act(async () => {
      result.current.cancel();
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(cancelFn).toHaveBeenCalledWith('job-1');
    expect(result.current.status).toBe('cancelled');
  });
});

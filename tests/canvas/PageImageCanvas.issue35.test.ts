/**
 * Tests for rAF drag-throttle fix — issue #35.
 *
 * Contract:
 *   1. N synchronous `schedule()` calls → exactly 1 rAF callback in that frame.
 *   2. The rAF callback executes the *latest* scheduled fn (not the first).
 *   3. After the rAF fires, the next `schedule()` call enqueues a fresh rAF.
 *   4. While a frame is pending, additional `schedule()` calls are collapsed (no double-queue).
 *
 * rAF is faked with vi.useFakeTimers so frame firing is deterministic.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeRafThrottle } from '../../src/canvas/rafThrottle';

describe('makeRafThrottle — rAF throttle contract (issue #35)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('N synchronous schedule() calls collapse to 1 rAF callback', () => {
    const schedule = makeRafThrottle();
    const fn = vi.fn();

    // Schedule 5 times synchronously — should only queue 1 rAF
    schedule(fn);
    schedule(fn);
    schedule(fn);
    schedule(fn);
    schedule(fn);

    // No callback yet — frame hasn't fired
    expect(fn).not.toHaveBeenCalled();

    // Run all rAF callbacks
    vi.runAllTimers();

    // Exactly 1 call, not 5
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('the rAF callback invokes the latest fn, not the first', () => {
    const schedule = makeRafThrottle();
    const calls: number[] = [];

    schedule(() => {
      calls.push(1);
    });
    schedule(() => {
      calls.push(2);
    });
    schedule(() => {
      calls.push(3);
    }); // this is the latest

    vi.runAllTimers();

    // Only the last fn ran
    expect(calls).toEqual([3]);
  });

  it('after the rAF fires, a new schedule() enqueues a second rAF', () => {
    const schedule = makeRafThrottle();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    // First frame
    schedule(fn1);
    vi.runAllTimers();
    expect(fn1).toHaveBeenCalledTimes(1);

    // Second frame — pending is now false, so this should queue a new rAF
    schedule(fn2);
    expect(fn2).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it('additional schedule() calls while pending do not double-queue', () => {
    const schedule = makeRafThrottle();
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame');

    schedule(vi.fn());
    schedule(vi.fn());
    schedule(vi.fn());

    // Only 1 rAF should have been requested, not 3
    expect(rafSpy).toHaveBeenCalledTimes(1);

    vi.runAllTimers();
    rafSpy.mockRestore();
  });

  it('each makeRafThrottle() call produces an independent scheduler', () => {
    const scheduleA = makeRafThrottle();
    const scheduleB = makeRafThrottle();
    const fnA = vi.fn();
    const fnB = vi.fn();

    scheduleA(fnA);
    scheduleB(fnB);

    // Neither pending state bleeds into the other
    scheduleA(fnA);
    scheduleB(fnB);

    vi.runAllTimers();

    expect(fnA).toHaveBeenCalledTimes(1);
    expect(fnB).toHaveBeenCalledTimes(1);
  });
});

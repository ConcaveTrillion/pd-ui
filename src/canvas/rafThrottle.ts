/**
 * rAF-throttle factory (issue #35).
 *
 * Returns a `schedule(fn)` function whose `pending` flag lives in the
 * closure across calls, so N synchronous `schedule()` invocations in the
 * same frame collapse to exactly 1 rAF callback.
 *
 * The callback always invokes the *latest* `fn` passed to `schedule()`,
 * so stale closure values from earlier events are never committed.
 *
 * Usage:
 *   const throttle = makeRafThrottle()
 *   // in event handler:
 *   throttle(() => setState(latestValue))
 */
export function makeRafThrottle(): (fn: () => void) => void {
  let pending = false;
  let latestFn: (() => void) | null = null;
  return function schedule(fn: () => void): void {
    latestFn = fn;
    if (!pending) {
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        latestFn?.();
        latestFn = null;
      });
    }
  };
}

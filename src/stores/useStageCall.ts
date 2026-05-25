/**
 * useStageCall — stub-friendly hook for GPU stage dispatch.
 *
 * Per spec §6, this hook handles 503 Retry-After backoff transparently and
 * presents a unified interface whether the backend uses the StageDispatcher
 * or another adapter.
 *
 * Phase 1 ships a stub implementation that can be wired to real pd-ocr-ops
 * HTTP routes. The transport contract URL is:
 *   POST /api/stage/<stageId>/run
 *   Body: { page_id: pageId, params }
 *   Response: { job_id: string } | { result: T } (sync fast path)
 *
 * Covers issue #166, fix for #23 (warming-state retry).
 */
import * as React from 'react';

export type StageCallStatus = 'idle' | 'pending' | 'warming' | 'done' | 'error';

export interface StageCallState<T = unknown> {
  status: StageCallStatus;
  result: T | null;
  /** True while the backend is warming (503 Retry-After received). */
  isWarming: boolean;
  /** Timestamp (ms) of when the retry should be attempted. null when not warming. */
  retryAt: number | null;
  /** Number of warming retries remaining. */
  retriesRemaining: number;
  /** Trigger the call. */
  run: (params: Record<string, unknown>) => void;
}

export interface UseStageCallOptions {
  /**
   * If provided, the hook will call this function to submit the stage run.
   * In Phase 1 the app wires this to their fetch adapter.
   * When undefined, the hook behaves as a permanent stub (status='idle').
   */
  submit?: (stageId: string, pageId: string, params: Record<string, unknown>) => Promise<unknown>;
  /**
   * Maximum number of automatic retries after a 503 warming response.
   * Defaults to 3. When exhausted the hook transitions to 'error'.
   */
  maxRetries?: number;
}

export function useStageCall<T = unknown>(
  stageId: string,
  pageId: string,
  options: UseStageCallOptions = {},
): StageCallState<T> {
  const { maxRetries = 3 } = options;

  const [status, setStatus] = React.useState<StageCallStatus>('idle');
  const [result, setResult] = React.useState<T | null>(null);
  const [isWarming, setIsWarming] = React.useState(false);
  const [retryAt, setRetryAt] = React.useState<number | null>(null);
  const [retriesRemaining, setRetriesRemaining] = React.useState(maxRetries);

  /** Persisted ref to the last submitted params for retry. */
  const lastParamsRef = React.useRef<Record<string, unknown> | null>(null);
  /** Persisted retry timer ID so we can cancel it. */
  const retryTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Retries remaining, as a ref so the retry closure sees the current count. */
  const retriesRemainingRef = React.useRef(maxRetries);
  /** Stable ref to options.submit so the run callback stays stable. */
  const submitRef = React.useRef(options.submit);
  React.useEffect(() => {
    submitRef.current = options.submit;
  });

  /** Clear any pending retry timer. */
  const clearRetryTimer = React.useCallback(() => {
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // Cancel retry timer on unmount.
  React.useEffect(() => {
    return clearRetryTimer;
  }, [clearRetryTimer]);

  const run = React.useCallback(
    (params: Record<string, unknown>) => {
      const submit = submitRef.current;
      if (!submit) return;

      // Cancel any in-flight retry.
      clearRetryTimer();

      // Reset retry counter when the user initiates a fresh run.
      retriesRemainingRef.current = maxRetries;
      setRetriesRemaining(maxRetries);

      lastParamsRef.current = params;
      setStatus('pending');
      setResult(null);
      setIsWarming(false);
      setRetryAt(null);

      const attempt = (attempParams: Record<string, unknown>) => {
        const currentSubmit = submitRef.current;
        if (!currentSubmit) return;

        currentSubmit(stageId, pageId, attempParams)
          .then((res) => {
            setResult(res as T);
            setStatus('done');
            setIsWarming(false);
            setRetryAt(null);
          })
          .catch((err: unknown) => {
            // 503 warming signal
            if (
              err !== null &&
              typeof err === 'object' &&
              'status' in err &&
              (err as { status: number }).status === 503
            ) {
              if (retriesRemainingRef.current <= 0) {
                // Exhausted retries — surface as error.
                setStatus('error');
                setIsWarming(false);
                setRetryAt(null);
                return;
              }

              const retryAfter =
                'retryAfter' in err ? (err as { retryAfter: number }).retryAfter : 5000;
              const retryTimestamp = Date.now() + retryAfter;

              retriesRemainingRef.current -= 1;
              setRetriesRemaining(retriesRemainingRef.current);
              setStatus('warming');
              setIsWarming(true);
              setRetryAt(retryTimestamp);

              retryTimerRef.current = setTimeout(() => {
                retryTimerRef.current = null;
                const savedParams = lastParamsRef.current;
                if (!savedParams) return;
                setStatus('pending');
                setIsWarming(false);
                setRetryAt(null);
                attempt(savedParams);
              }, retryAfter);
            } else {
              setStatus('error');
            }
          });
      };

      attempt(params);
    },
    [stageId, pageId, maxRetries, clearRetryTimer],
  );

  return { status, result, isWarming, retryAt, retriesRemaining, run };
}

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
 * Covers issue #166.
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
}

export function useStageCall<T = unknown>(
  stageId: string,
  pageId: string,
  options: UseStageCallOptions = {},
): StageCallState<T> {
  const [status, setStatus] = React.useState<StageCallStatus>('idle');
  const [result, setResult] = React.useState<T | null>(null);
  const [isWarming, setIsWarming] = React.useState(false);
  const [retryAt, setRetryAt] = React.useState<number | null>(null);

  const run = React.useCallback(
    (params: Record<string, unknown>) => {
      const { submit } = options;
      if (!submit) return;

      setStatus('pending');
      setResult(null);
      setIsWarming(false);
      setRetryAt(null);

      submit(stageId, pageId, params)
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
            const retryAfter =
              'retryAfter' in err ? (err as { retryAfter: number }).retryAfter : 5000;
            setStatus('warming');
            setIsWarming(true);
            setRetryAt(Date.now() + retryAfter);
          } else {
            setStatus('error');
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stageId, pageId],
  );

  return { status, result, isWarming, retryAt, run };
}

/**
 * createApiSuiteSiblingsConfig — builds the fetchInstalled/postLaunch callbacks
 * that SuiteSiblingsProvider needs, backed by the pd-ocr-ops standard
 * `/api/suite/*` REST contract.
 *
 * Contract
 * ────────
 * GET  /api/suite/installed
 *   → 200 application/json   body: InstalledApp[]
 *   → error / non-2xx        returns [] (resilient)
 *
 * POST /api/suite/launch
 *   body: application/json   { id: string }
 *   → 200 application/json   body: { kind: 'opened', url: string }
 *                            or   { kind: 'requires-host-config', siblingId: string }
 *   → error / non-2xx        returns { kind: 'requires-host-config', siblingId }
 *
 * Usage
 * ─────
 * ```ts
 * import {
 *   SuiteSiblingsProvider,
 *   createApiSuiteSiblingsConfig,
 * } from '@concavetrillion/pd-ui/shell';
 *
 * <SuiteSiblingsProvider value={createApiSuiteSiblingsConfig()}>
 *   <AppShell ... />
 * </SuiteSiblingsProvider>
 * ```
 *
 * This replaces the no-op fetchInstalled/postLaunch stubs in
 * pd-ocr-labeler-spa's App.tsx (GAP-3 from issue #6).
 */

import type { InstalledApp, LaunchResult } from './types.js';

export interface ApiSuiteSiblingsOptions {
  /**
   * URL for the installed apps endpoint.
   * Defaults to `'/api/suite/installed'`.
   */
  installedUrl?: string;
  /**
   * URL for the launch endpoint.
   * Defaults to `'/api/suite/launch'`.
   */
  launchUrl?: string;
}

/**
 * Create the fetchInstalled/postLaunch pair backed by the pd-ocr-ops
 * `/api/suite/*` REST endpoints.
 */
export function createApiSuiteSiblingsConfig(opts: ApiSuiteSiblingsOptions = {}): {
  fetchInstalled: () => Promise<InstalledApp[]>;
  postLaunch: (id: string) => Promise<LaunchResult>;
} {
  const installedUrl = opts.installedUrl ?? '/api/suite/installed';
  const launchUrl = opts.launchUrl ?? '/api/suite/launch';

  return {
    async fetchInstalled(): Promise<InstalledApp[]> {
      try {
        const res = await fetch(installedUrl);
        if (!res.ok) return [];
        const data = (await res.json()) as InstalledApp[];
        return data;
      } catch {
        return [];
      }
    },

    async postLaunch(id: string): Promise<LaunchResult> {
      try {
        const res = await fetch(launchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) return { kind: 'requires-host-config', siblingId: id };
        const data = (await res.json()) as LaunchResult;
        return data;
      } catch {
        return { kind: 'requires-host-config', siblingId: id };
      }
    },
  };
}

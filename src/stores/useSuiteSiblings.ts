/**
 * useSuiteSiblings — hook that reads from SuiteSiblingsContext.
 *
 * Returns { siblings, launch, loading }.
 *
 * Must be used inside a <SuiteSiblingsProvider>. Returns a no-op stub
 * when no provider is found (graceful degradation: LauncherSlot simply
 * renders nothing when siblings is empty).
 *
 * Covers issue #165.
 */
export { useSuiteSiblingsContext as useSuiteSiblings } from '../shell/SuiteSiblingsContext.js';

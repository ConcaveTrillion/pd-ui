/**
 * createSelectionStore — Zustand store factory for canvas word selection.
 *
 * Returns a fresh store per call. Apps instantiate one per AppShell/page;
 * never use a singleton.
 *
 * State:
 *   ids: ReadonlySet<string>   — currently selected word IDs
 *
 * Actions:
 *   select(id)                 — add one ID
 *   deselect(id)               — remove one ID
 *   clearSelection()           — empty the set
 *   setSelection(set)          — replace the set
 */
import { createStore } from 'zustand/vanilla';

export interface SelectionState {
  ids: ReadonlySet<string>;
  select: (id: string) => void;
  deselect: (id: string) => void;
  clearSelection: () => void;
  setSelection: (ids: ReadonlySet<string>) => void;
}

export function createSelectionStore() {
  return createStore<SelectionState>()((set) => ({
    ids: new Set<string>(),

    select: (id) =>
      set((s) => {
        if (s.ids.has(id)) return s;
        const next = new Set(s.ids);
        next.add(id);
        return { ids: next };
      }),

    deselect: (id) =>
      set((s) => {
        if (!s.ids.has(id)) return s;
        const next = new Set(s.ids);
        next.delete(id);
        return { ids: next };
      }),

    clearSelection: () => set({ ids: new Set() }),

    setSelection: (ids) => set({ ids: new Set(ids) }),
  }));
}

export type SelectionStore = ReturnType<typeof createSelectionStore>;

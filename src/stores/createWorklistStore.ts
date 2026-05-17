/**
 * createWorklistStore — Zustand store factory for worklist active item and filter.
 *
 * Returns a fresh store per call. Apps instantiate one per AppShell.
 *
 * State:
 *   activeIndex: number | null  — index of the currently active/focused item
 *   filter: string              — search/filter text
 *
 * Actions:
 *   setActiveIndex(index)
 *   setFilter(text)
 *   clearFilter()
 */
import { createStore } from 'zustand/vanilla';

export interface WorklistStoreState {
  activeIndex: number | null;
  filter: string;
  setActiveIndex: (index: number | null) => void;
  setFilter: (text: string) => void;
  clearFilter: () => void;
}

export function createWorklistStore() {
  return createStore<WorklistStoreState>()((set) => ({
    activeIndex: null,
    filter: '',

    setActiveIndex: (index) => set({ activeIndex: index }),

    setFilter: (text) => set({ filter: text }),

    clearFilter: () => set({ filter: '' }),
  }));
}

export type WorklistStore = ReturnType<typeof createWorklistStore>;

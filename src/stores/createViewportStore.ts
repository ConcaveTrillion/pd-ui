/**
 * createViewportStore — Zustand store factory for canvas pan/zoom state.
 *
 * Returns a fresh store per call. Apps instantiate one per AppShell/page.
 *
 * State:
 *   scale: number           — zoom factor (1.0 = native size)
 *   pan: { x, y }          — canvas translation in CSS pixels
 *
 * Actions:
 *   setScale(scale)
 *   setPan(pan)
 *   reset()                — restore scale=1.0, pan={0,0}
 */
import { createStore } from 'zustand/vanilla';

export interface ViewportState {
  scale: number;
  pan: { x: number; y: number };
  setScale: (scale: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  reset: () => void;
}

const INITIAL: Pick<ViewportState, 'scale' | 'pan'> = {
  scale: 1.0,
  pan: { x: 0, y: 0 },
};

export function createViewportStore() {
  return createStore<ViewportState>()((set) => ({
    ...INITIAL,

    setScale: (scale) => set({ scale }),

    setPan: (pan) => set({ pan }),

    reset: () => set({ ...INITIAL }),
  }));
}

export type ViewportStore = ReturnType<typeof createViewportStore>;

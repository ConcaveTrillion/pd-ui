import '@testing-library/jest-dom'

// jsdom doesn't implement ResizeObserver. Provide a no-op stub so
// components that use it (e.g. PageImageCanvas) don't throw.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

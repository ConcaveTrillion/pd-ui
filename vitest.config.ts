import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    // Exclude agent worktrees — these are sibling checkouts under .claude/worktrees/
    // that have their own vitest configs but no installed node_modules.
    // Without this exclusion, vitest picks them up and reports ~2000 failures.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.claude/worktrees/**',
    ],
    coverage: {
      provider: 'v8',
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})

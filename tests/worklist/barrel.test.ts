/**
 * Worklist subpath barrel test (M6.7, issue #156).
 *
 * Verifies that all expected exports are present in src/worklist/index.ts
 * and that vite.config.ts and package.json wire the worklist subpath.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')

describe('src/worklist/index.ts barrel', () => {
  it('exports WordList', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('WordList')
  })

  it('exports LineList', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('LineList')
  })

  it('exports PageList', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('PageList')
  })

  it('exports MatchStatusChip', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('MatchStatusChip')
  })

  it('exports ConfidenceBar', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('ConfidenceBar')
  })

  it('exports StatusPip', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('StatusPip')
  })

  it('exports useWorklistFilter', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('useWorklistFilter')
  })

  it('exports useWorklistSort', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('useWorklistSort')
  })

  it('exports MatchStatus type', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('MatchStatus')
  })

  it('exports WordListProps type', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('WordListProps')
  })

  it('exports WordRowProps type', () => {
    const content = readFileSync(join(REPO_ROOT, 'src/worklist/index.ts'), 'utf-8')
    expect(content).toContain('WordRowProps')
  })

  it('vite.config.ts has worklist entry', () => {
    const viteConfig = readFileSync(join(REPO_ROOT, 'vite.config.ts'), 'utf-8')
    expect(viteConfig).toContain("worklist: resolve(__dirname, 'src/worklist/index.ts')")
  })

  it('package.json exports ./worklist points to dist/worklist', () => {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf-8')) as {
      exports?: Record<string, { import?: string; types?: string }>
    }
    const worklistExport = pkg.exports?.['./worklist']
    expect(worklistExport).toBeDefined()
    expect(worklistExport?.import).toContain('dist/worklist.js')
  })
})

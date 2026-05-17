import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('vite.config.ts contract', () => {
  it('vite.config.ts exists', () => {
    const content = readFileSync(resolve(__dirname, '../vite.config.ts'), 'utf-8')
    expect(content).toBeTruthy()
  })

  it('vite config declares all required entry points', () => {
    const content = readFileSync(resolve(__dirname, '../vite.config.ts'), 'utf-8')
    const entries = ['index', 'canvas', 'worklist', 'shell', 'primitives', 'icons', 'types', 'stores', 'testids']
    for (const entry of entries) {
      expect(content, `entry '${entry}' must be declared in vite.config.ts`).toContain(entry)
    }
  })

  it('vite config externalizes react', () => {
    const content = readFileSync(resolve(__dirname, '../vite.config.ts'), 'utf-8')
    expect(content).toContain("'react'")
  })

  it('vite config has cssCodeSplit', () => {
    const content = readFileSync(resolve(__dirname, '../vite.config.ts'), 'utf-8')
    expect(content).toContain('cssCodeSplit')
  })
})

describe('dist/ output completeness', () => {
  const DIST = resolve(__dirname, '../dist')
  const REQUIRED_ENTRIES = [
    'index',
    'canvas',
    'worklist',
    'shell',
    'primitives',
    'icons',
    'types',
    'stores',
    'testids',
  ] as const

  it('dist/ directory exists after build', () => {
    expect(existsSync(DIST), 'dist/ directory must exist — run pnpm build first').toBe(true)
  })

  for (const entry of REQUIRED_ENTRIES) {
    it(`dist/ contains ${entry}.js`, () => {
      expect(existsSync(resolve(DIST, `${entry}.js`)), `dist/${entry}.js missing`).toBe(true)
    })

    it(`dist/ contains ${entry}.d.ts`, () => {
      expect(existsSync(resolve(DIST, `${entry}.d.ts`)), `dist/${entry}.d.ts missing`).toBe(true)
    })
  }

  it('dist/ contains no unexpected top-level entry points', () => {
    if (!existsSync(DIST)) return // skip if not built yet; covered by prior test
    const files = readdirSync(DIST)
    const jsEntries = files.filter(f => /^[a-z]+\.js$/.test(f))
    const expectedJs = REQUIRED_ENTRIES.map(e => `${e}.js`)
    for (const js of jsEntries) {
      expect(expectedJs, `Unexpected entry point: dist/${js}`).toContain(js)
    }
  })

  it('theme/ directory contains tokens.css and primitives.css', () => {
    const THEME = resolve(__dirname, '../theme')
    expect(existsSync(resolve(THEME, 'tokens.css')), 'theme/tokens.css missing').toBe(true)
    expect(existsSync(resolve(THEME, 'primitives.css')), 'theme/primitives.css missing').toBe(true)
  })
})

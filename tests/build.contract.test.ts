import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
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

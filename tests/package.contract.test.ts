import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8')) as Record<string, unknown>

describe('package.json contract', () => {
  it('has correct name', () => {
    expect(pkg['name']).toBe('@concavetrillion/pd-ui')
  })

  it('exports has all required subpaths', () => {
    const exports = pkg['exports'] as Record<string, unknown>
    const required = [
      '.',
      './canvas',
      './worklist',
      './shell',
      './primitives',
      './icons',
      './types',
      './stores',
      './testids',
      './theme/tokens.css',
      './theme/primitives.css',
    ]
    for (const subpath of required) {
      expect(exports, `exports["${subpath}"] must exist`).toHaveProperty(subpath)
    }
  })

  it('does not depend on class-variance-authority', () => {
    const deps = (pkg['dependencies'] as Record<string, unknown>) ?? {}
    expect(Object.keys(deps)).not.toContain('class-variance-authority')
  })

  it('does not depend on tailwindcss', () => {
    const deps = (pkg['dependencies'] as Record<string, unknown>) ?? {}
    expect(Object.keys(deps)).not.toContain('tailwindcss')
  })

  it('peerDependencies requires React 18', () => {
    const peers = (pkg['peerDependencies'] as Record<string, unknown>) ?? {}
    expect(peers).toHaveProperty('react')
    const reactVersion = peers['react'] as string
    expect(reactVersion).toMatch(/\^18/)
  })

  it('exports has ./theme/tokens.css subpath', () => {
    const exports = pkg['exports'] as Record<string, unknown>
    expect(exports).toHaveProperty('./theme/tokens.css')
    expect(exports['./theme/tokens.css']).toBe('./theme/tokens.css')
  })

  it('exports has ./theme/primitives.css subpath', () => {
    const exports = pkg['exports'] as Record<string, unknown>
    expect(exports).toHaveProperty('./theme/primitives.css')
    expect(exports['./theme/primitives.css']).toBe('./theme/primitives.css')
  })

  it('files includes "theme" directory', () => {
    const files = pkg['files'] as string[]
    expect(files).toContain('theme')
  })

  it('version is 0.1.0-alpha.1', () => {
    expect(pkg['version']).toBe('0.1.0-alpha.1')
  })
})

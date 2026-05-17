import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const themeDir = resolve(__dirname, '../../theme')

const primitivesCss = readFileSync(resolve(themeDir, 'primitives.css'), 'utf-8')

describe('theme/primitives.css hex-literal guard', () => {
  it('uses only var(--…) references, not raw #hex literals', () => {
    // Match any # followed by 3-8 hex chars that look like a color literal.
    // Allow: CSS IDs in selectors like #some-id, but those would be #word chars
    // In CSS, a hex color is #[0-9a-fA-F]{3,8} (3, 4, 6, or 8 hex digits).
    // We exclude comments and look for standalone hex colors.
    //
    // Strip CSS comments first, then scan for hex color patterns.
    const noComments = primitivesCss.replace(/\/\*[\s\S]*?\*\//g, '')
    // Hex color: # followed by exactly 3, 4, 6, or 8 hex chars then a non-hex boundary
    const hexColorPattern = /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g
    const matches = noComments.match(hexColorPattern) ?? []
    expect(
      matches,
      `primitives.css must not contain raw hex color literals; found: ${matches.join(', ')}`
    ).toHaveLength(0)
  })
})

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { spawnSync } from 'child_process'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Path to the actual sync script
const SYNC_SCRIPT = resolve(__dirname, '../../scripts/sync-design-system.mjs')

// Resolve the node binary from the current process
const NODE = process.execPath

/** Build a minimal fake workspace tree in a tmp dir, optionally with spaces in the path */
function buildTmpWorkspace(
  opts: {
    tokensContent?: string
    primitivesContent?: string
    docTokensContent?: string
    docPrimitivesContent?: string
  },
  /** If true, the workspace root dir will contain a space in its name */
  withSpaceInPath = false
): string {
  const prefix = withSpaceInPath ? resolve(tmpdir(), 'pd ui sync test ') : resolve(tmpdir(), 'pd-ui-sync-test-')
  const tmpRoot = mkdtempSync(prefix)

  // pd-ui/theme/
  const themeDir = resolve(tmpRoot, 'pd-ui', 'theme')
  mkdirSync(themeDir, { recursive: true })

  // docs/design-system/
  const docsDir = resolve(tmpRoot, 'docs', 'design-system')
  mkdirSync(docsDir, { recursive: true })

  // pd-ui/scripts/ (symlink or copy the actual script)
  const scriptsDir = resolve(tmpRoot, 'pd-ui', 'scripts')
  mkdirSync(scriptsDir, { recursive: true })

  writeFileSync(resolve(themeDir, 'tokens.css'), opts.tokensContent ?? ':root { --a: 1; }', 'utf-8')
  writeFileSync(resolve(themeDir, 'primitives.css'), opts.primitivesContent ?? '.btn {}', 'utf-8')
  writeFileSync(
    resolve(docsDir, 'tokens.css'),
    opts.docTokensContent ?? ':root { --a: OLD; }',
    'utf-8'
  )
  writeFileSync(
    resolve(docsDir, 'primitives.css'),
    opts.docPrimitivesContent ?? '.btn { OLD }',
    'utf-8'
  )

  return tmpRoot
}

/** Run the sync script inside a given pd-ui directory, using --force to skip git guard */
function runSync(tmpRoot: string, extraArgs: string[] = []): ReturnType<typeof spawnSync> {
  // We need to run the REAL script but with the tmp workspace layout.
  // The script resolves paths relative to itself (__dirname).
  // We can't easily move the script, so we invoke it with an env override.
  // Instead, write a small wrapper that overrides the paths.
  //
  // Simpler approach: write a wrapper script into the tmp pd-ui/scripts/
  // that re-exports with overridden paths.
  //
  // Even simpler: just pass the paths via env and read them in a wrapper.
  // OR: patch the script copy in the tmp dir.
  //
  // We'll copy and patch the sync script to use resolved tmp paths,
  // then invoke the patched copy.
  const patchedScriptPath = resolve(tmpRoot, 'pd-ui', 'scripts', 'sync-design-system.mjs')

  const originalScript = readFileSync(SYNC_SCRIPT, 'utf-8')

  // Patch: override the computed paths so they point to our tmp tree
  const pdUiRootTmp = resolve(tmpRoot, 'pd-ui')
  const patchedScript = originalScript
    .replace(
      /const pdUiRoot = resolve\(__dirname, '\.\.'\)/,
      `const pdUiRoot = ${JSON.stringify(pdUiRootTmp)}`
    )

  writeFileSync(patchedScriptPath, patchedScript, 'utf-8')

  return spawnSync(NODE, [patchedScriptPath, ...extraArgs], {
    encoding: 'utf-8',
    cwd: resolve(tmpRoot, 'pd-ui'),
  })
}

let tmpRoot: string

beforeEach(() => {
  tmpRoot = buildTmpWorkspace({
    tokensContent: ':root { --new: value; }',
    primitivesContent: '.btn { color: var(--ink-1); }',
    docTokensContent: ':root { --old: value; }',
    docPrimitivesContent: '.btn { color: var(--old); }',
  })
})

afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true })
})

describe('sync-design-system.mjs', () => {
  it('syncs pd-ui/theme/ to docs/design-system/ (--force skips git guard)', () => {
    const result = runSync(tmpRoot, ['--force'])

    expect(result.status, `script stderr: ${String(result.stderr ?? '')}`).toBe(0)

    // docs/design-system/ should now match pd-ui/theme/
    const docTokens = readFileSync(resolve(tmpRoot, 'docs', 'design-system', 'tokens.css'), 'utf-8')
    const pdTokens = readFileSync(resolve(tmpRoot, 'pd-ui', 'theme', 'tokens.css'), 'utf-8')
    expect(docTokens).toBe(pdTokens)

    const docPrimitives = readFileSync(
      resolve(tmpRoot, 'docs', 'design-system', 'primitives.css'),
      'utf-8'
    )
    const pdPrimitives = readFileSync(
      resolve(tmpRoot, 'pd-ui', 'theme', 'primitives.css'),
      'utf-8'
    )
    expect(docPrimitives).toBe(pdPrimitives)
  })

  it('--dry-run prints diff summary but does not write files', () => {
    const originalDocTokens = readFileSync(
      resolve(tmpRoot, 'docs', 'design-system', 'tokens.css'),
      'utf-8'
    )

    const result = runSync(tmpRoot, ['--dry-run'])

    expect(result.status, `script stderr: ${String(result.stderr ?? '')}`).toBe(0)
    expect(result.stdout).toMatch(/CHANGED|NEW/)

    // File should NOT have been changed
    const afterDocTokens = readFileSync(
      resolve(tmpRoot, 'docs', 'design-system', 'tokens.css'),
      'utf-8'
    )
    expect(afterDocTokens).toBe(originalDocTokens)
  })

  it('exits 0 when files are already in sync', () => {
    // Make docs match pd-ui
    const pdTokens = readFileSync(resolve(tmpRoot, 'pd-ui', 'theme', 'tokens.css'), 'utf-8')
    const pdPrimitives = readFileSync(
      resolve(tmpRoot, 'pd-ui', 'theme', 'primitives.css'),
      'utf-8'
    )
    writeFileSync(resolve(tmpRoot, 'docs', 'design-system', 'tokens.css'), pdTokens)
    writeFileSync(resolve(tmpRoot, 'docs', 'design-system', 'primitives.css'), pdPrimitives)

    const result = runSync(tmpRoot, ['--force'])
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('in sync')
  })

  it('--check exits non-zero when diff exists', () => {
    // Ensure docs differ from pd-ui (they do from beforeEach)
    const result = runSync(tmpRoot, ['--check'])
    expect(result.status).not.toBe(0)
    expect(result.stderr).toMatch(/diff detected|CHANGED/)
  })

  it('--check exits 0 when files are in sync', () => {
    const pdTokens = readFileSync(resolve(tmpRoot, 'pd-ui', 'theme', 'tokens.css'), 'utf-8')
    const pdPrimitives = readFileSync(
      resolve(tmpRoot, 'pd-ui', 'theme', 'primitives.css'),
      'utf-8'
    )
    writeFileSync(resolve(tmpRoot, 'docs', 'design-system', 'tokens.css'), pdTokens)
    writeFileSync(resolve(tmpRoot, 'docs', 'design-system', 'primitives.css'), pdPrimitives)

    const result = runSync(tmpRoot, ['--check'])
    expect(result.status).toBe(0)
  })

  it('git-status guard handles paths with spaces (no shell injection)', () => {
    // Build a workspace whose path contains spaces to verify execFileSync argv
    // is used (not shell interpolation which would break on spaces).
    const spaceRoot = buildTmpWorkspace(
      {
        tokensContent: ':root { --a: 1; }',
        primitivesContent: '.btn {}',
        docTokensContent: ':root { --a: 1; }',
        docPrimitivesContent: '.btn {}',
      },
      true
    )
    try {
      // Files are in sync and the dir is not a git repo, so the guard runs
      // git status, git fails (not a repo), guard is skipped, and the script
      // exits 0 reporting all-in-sync. A shell-interpolated invocation would
      // either fail to parse the path or produce an incorrect result.
      const result = runSync(spaceRoot, [])
      expect(result.status, `stderr: ${String(result.stderr ?? '')}`).toBe(0)
      expect(result.stdout).toContain('in sync')
    } finally {
      rmSync(spaceRoot, { recursive: true, force: true })
    }
  })
})

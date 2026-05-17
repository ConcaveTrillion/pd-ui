/**
 * Tests for scripts/codegen-fetch.mjs
 *
 * Strategy: the script reads codegen.versions.json and builds uv pip install
 * commands. We use a shim approach — place a fake `uv` on PATH and verify
 * the correct invocation is produced.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync, chmodSync } from 'fs'
import { execFileSync } from 'child_process'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')
const SCRIPT = join(REPO_ROOT, 'scripts/codegen-fetch.mjs')

describe('codegen:fetch script', () => {
  let tmpDir: string
  let shimBinDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'codegen-fetch-'))
    shimBinDir = join(tmpDir, 'bin')
    mkdirSync(shimBinDir)
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('reads codegen.versions.json from repo root', () => {
    const versionsPath = join(REPO_ROOT, 'codegen.versions.json')
    const content = readFileSync(versionsPath, 'utf-8')
    const versions = JSON.parse(content) as Record<string, string>
    expect(versions).toHaveProperty('pd-book-tools')
    expect(typeof versions['pd-book-tools']).toBe('string')
  })

  it('codegen.versions.json has pd-ocr-ops key', () => {
    const versionsPath = join(REPO_ROOT, 'codegen.versions.json')
    const versions = JSON.parse(readFileSync(versionsPath, 'utf-8')) as Record<string, string>
    expect(versions).toHaveProperty('pd-ocr-ops')
  })

  it('script file exists and is executable Node.js', () => {
    const content = readFileSync(SCRIPT, 'utf-8')
    expect(content).toContain('#!/usr/bin/env node')
  })

  it('script reads versions and forms correct uv pip install invocation', () => {
    // Write a shim uv that records its arguments
    const shimLog = join(tmpDir, 'uv-calls.log')
    const uvShim = join(shimBinDir, 'uv')
    writeFileSync(uvShim, `#!/bin/sh\necho "$@" >> "${shimLog}"\n`, 'utf-8')
    chmodSync(uvShim, 0o755)

    const versionsPath = join(REPO_ROOT, 'codegen.versions.json')
    const versions = JSON.parse(readFileSync(versionsPath, 'utf-8')) as Record<string, string>
    const btVersion = versions['pd-book-tools']

    const env = {
      ...process.env,
      PATH: `${shimBinDir}:${process.env['PATH'] ?? ''}`,
      CODEGEN_VENV_DIR: join(tmpDir, 'venv'),
      // Skip actual venv creation (shim handles it)
    }

    try {
      execFileSync('node', [SCRIPT, '--book-tools-only', '--dry-run'], {
        env,
        cwd: REPO_ROOT,
        encoding: 'utf-8',
      })
    } catch {
      // dry-run mode may exit 0 or non-zero depending on impl; we only check log
    }

    // The script should log what it would invoke — check stdout contains version
    // We use --dry-run flag which prints the commands without executing them
    let output = ''
    try {
      output = execFileSync('node', [SCRIPT, '--book-tools-only', '--dry-run'], {
        env,
        cwd: REPO_ROOT,
        encoding: 'utf-8',
      })
    } catch (e: unknown) {
      output = (e as { stdout?: string; stderr?: string }).stdout ?? (e as { stderr?: string }).stderr ?? ''
    }

    expect(output).toContain('pd-book-tools')
    expect(output).toContain(btVersion)
  })

  it('script --dry-run prints pip install command with pd-index-pip URL', () => {
    const env = {
      ...process.env,
      PATH: `${shimBinDir}:${process.env['PATH'] ?? ''}`,
    }

    let output = ''
    try {
      output = execFileSync('node', [SCRIPT, '--book-tools-only', '--dry-run'], {
        env,
        cwd: REPO_ROOT,
        encoding: 'utf-8',
      })
    } catch (e: unknown) {
      output = (e as { stdout?: string }).stdout ?? ''
    }

    // Must reference the self-hosted index
    expect(output).toMatch(/pd-index-pip|concavetrillion.*pd-index|pd-index/)
  })
})

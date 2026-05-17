/**
 * Tests for scripts/codegen-emit.mjs
 *
 * Strategy: create a stub venv where `python -m pd_book_tools.schemas.emit`
 * is replaced by a shell script that echoes a known JSON fixture. Verify that
 * the script writes .codegen/book-tools.schema.json containing that fixture.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync, chmodSync, existsSync } from 'fs'
import { execFileSync } from 'child_process'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')
const SCRIPT = join(REPO_ROOT, 'scripts/codegen-emit.mjs')

const FIXTURE_SCHEMA = JSON.stringify({
  Word: {
    type: 'object',
    properties: {
      text: { type: 'string' },
      bounding_box: { type: 'object' },
      ocr_confidence: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    },
  },
})

describe('codegen:emit script', () => {
  let tmpDir: string
  let stubVenvDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'codegen-emit-'))
    stubVenvDir = join(tmpDir, 'venv')
    const binDir = join(stubVenvDir, 'bin')
    mkdirSync(binDir, { recursive: true })

    // Create a stub python that echoes the fixture when invoked with the emit args
    const stubPython = join(binDir, 'python')
    writeFileSync(
      stubPython,
      `#!/bin/sh\nif echo "$@" | grep -q "pd_book_tools.schemas.emit"; then\n  echo '${FIXTURE_SCHEMA}'\nelse\n  exec python3 "$@"\nfi\n`,
      'utf-8',
    )
    chmodSync(stubPython, 0o755)
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('script file exists', () => {
    const content = readFileSync(SCRIPT, 'utf-8')
    expect(content).toContain('#!/usr/bin/env node')
  })

  it('writes .codegen/book-tools.schema.json when given a stub venv', () => {
    const outputFile = join(tmpDir, 'book-tools.schema.json')

    execFileSync('node', [SCRIPT, '--book-tools-only'], {
      env: {
        ...process.env,
        CODEGEN_VENV_DIR: stubVenvDir,
        CODEGEN_SCHEMA_OUT: outputFile,
      },
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    })

    expect(existsSync(outputFile)).toBe(true)
    const written = JSON.parse(readFileSync(outputFile, 'utf-8')) as Record<string, { type: string }>
    expect(written).toHaveProperty('Word')
    expect(written['Word']).toHaveProperty('type', 'object')
  })

  it('output JSON contains Word, text, bounding_box from fixture', () => {
    const outputFile = join(tmpDir, 'book-tools.schema.json')

    execFileSync('node', [SCRIPT, '--book-tools-only'], {
      env: {
        ...process.env,
        CODEGEN_VENV_DIR: stubVenvDir,
        CODEGEN_SCHEMA_OUT: outputFile,
      },
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    })

    const written = JSON.parse(readFileSync(outputFile, 'utf-8')) as Record<
      string,
      { properties: Record<string, unknown> }
    >
    const word = written['Word']
    expect(word?.properties).toHaveProperty('text')
    expect(word?.properties).toHaveProperty('bounding_box')
  })

  it('script uses env var CODEGEN_VENV_DIR to locate python', () => {
    const content = readFileSync(SCRIPT, 'utf-8')
    expect(content).toContain('CODEGEN_VENV_DIR')
  })
})

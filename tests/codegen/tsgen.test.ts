/**
 * Tests for scripts/codegen-tsgen.mjs
 *
 * Strategy: provide a tiny fixture JSON Schema, run the script against it,
 * and assert that src/types/generated/book-tools.ts is emitted with expected
 * content (auto-generated header, types for fixture schemas).
 *
 * Uses CODEGEN_SCHEMA_IN and CODEGEN_TYPES_OUT env vars to redirect I/O to
 * tmp dirs so tests don't mutate the real generated file.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync, readFileSync, existsSync } from 'fs'
import { execFileSync } from 'child_process'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')
const SCRIPT = join(REPO_ROOT, 'scripts/codegen-tsgen.mjs')

// Minimal OpenAPI-compatible JSON Schema fixture with a Word type
const FIXTURE_SCHEMA = {
  Word: {
    type: 'object' as const,
    properties: {
      text: { type: 'string' as const, title: 'Text' },
      bounding_box: {
        type: 'object' as const,
        title: 'Bounding Box',
        properties: {
          x: { type: 'number' as const },
          y: { type: 'number' as const },
        },
      },
      ocr_confidence: {
        anyOf: [{ type: 'number' as const }, { type: 'null' as const }],
        title: 'Ocr Confidence',
      },
    },
  },
}

describe('codegen:tsgen script', () => {
  let tmpDir: string
  let schemaIn: string
  let typesOut: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'codegen-tsgen-'))
    schemaIn = join(tmpDir, 'book-tools.schema.json')
    typesOut = join(tmpDir, 'book-tools.ts')
    writeFileSync(schemaIn, JSON.stringify(FIXTURE_SCHEMA, null, 2), 'utf-8')
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('script file exists', () => {
    const content = readFileSync(SCRIPT, 'utf-8')
    expect(content).toContain('#!/usr/bin/env node')
  })

  it('generates a TypeScript file from fixture schema', () => {
    execFileSync('node', [SCRIPT, '--book-tools-only'], {
      env: {
        ...process.env,
        CODEGEN_SCHEMA_IN: schemaIn,
        CODEGEN_TYPES_OUT: typesOut,
      },
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    })

    expect(existsSync(typesOut)).toBe(true)
  })

  it('generated file has auto-generated header comment', () => {
    execFileSync('node', [SCRIPT, '--book-tools-only'], {
      env: {
        ...process.env,
        CODEGEN_SCHEMA_IN: schemaIn,
        CODEGEN_TYPES_OUT: typesOut,
      },
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    })

    const content = readFileSync(typesOut, 'utf-8')
    expect(content).toMatch(/AUTO-GENERATED/)
    expect(content).toMatch(/DO NOT EDIT/)
  })

  it('generated file exports a Word type', () => {
    execFileSync('node', [SCRIPT, '--book-tools-only'], {
      env: {
        ...process.env,
        CODEGEN_SCHEMA_IN: schemaIn,
        CODEGEN_TYPES_OUT: typesOut,
      },
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    })

    const content = readFileSync(typesOut, 'utf-8')
    // openapi-typescript generates types in the schemas namespace
    expect(content).toMatch(/Word/)
  })

  it('generated file contains text and bounding_box properties', () => {
    execFileSync('node', [SCRIPT, '--book-tools-only'], {
      env: {
        ...process.env,
        CODEGEN_SCHEMA_IN: schemaIn,
        CODEGEN_TYPES_OUT: typesOut,
      },
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    })

    const content = readFileSync(typesOut, 'utf-8')
    expect(content).toContain('text')
    expect(content).toContain('bounding_box')
  })

  it('script uses CODEGEN_SCHEMA_IN env var', () => {
    const content = readFileSync(SCRIPT, 'utf-8')
    expect(content).toContain('CODEGEN_SCHEMA_IN')
  })

  it('script uses CODEGEN_TYPES_OUT env var', () => {
    const content = readFileSync(SCRIPT, 'utf-8')
    expect(content).toContain('CODEGEN_TYPES_OUT')
  })
})

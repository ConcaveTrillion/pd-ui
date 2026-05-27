#!/usr/bin/env node
/**
 * codegen-emit.mjs — M4.2
 *
 * Invokes pdomain_book_tools.schemas.emit from the codegen venv and writes
 * the resulting JSON Schema to .codegen/book-tools.schema.json.
 *
 * Flags:
 *   --book-tools-only   Only emit pdomain-book-tools schemas (skip pdomain-ops)
 *
 * Environment overrides (used in tests):
 *   CODEGEN_VENV_DIR     Path to the venv (default: .codegen/venv)
 *   CODEGEN_SCHEMA_OUT   Path for output JSON (default: .codegen/book-tools.schema.json)
 */

import { execFileSync } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')

function parseArgs(argv) {
  const args = argv.slice(2)
  return {
    bookToolsOnly: args.includes('--book-tools-only'),
  }
}

async function main() {
  const opts = parseArgs(process.argv)

  const venvDir =
    process.env['CODEGEN_VENV_DIR'] ?? join(REPO_ROOT, '.codegen', 'venv')

  const schemaOut =
    process.env['CODEGEN_SCHEMA_OUT'] ??
    join(REPO_ROOT, '.codegen', 'book-tools.schema.json')

  // Ensure output directory exists
  const outDir = join(schemaOut, '..')
  mkdirSync(outDir, { recursive: true })

  const pythonBin = join(venvDir, 'bin', 'python')

  console.log(`Running pdomain_book_tools.schemas.emit via ${pythonBin}`)
  console.log(`Output: ${schemaOut}`)

  const result = execFileSync(pythonBin, ['-m', 'pdomain_book_tools.schemas.emit'], {
    encoding: 'utf-8',
    cwd: REPO_ROOT,
  })

  // Validate it's valid JSON before writing
  let parsed
  try {
    parsed = JSON.parse(result)
  } catch (err) {
    console.error('schemas.emit output is not valid JSON:', err.message)
    process.exit(1)
  }

  writeFileSync(schemaOut, JSON.stringify(parsed, null, 2) + '\n', 'utf-8')
  console.log(`codegen:emit complete — wrote ${schemaOut}`)

  if (!opts.bookToolsOnly) {
    const opsSchemaOut =
      process.env['CODEGEN_OPS_SCHEMA_OUT'] ??
      join(REPO_ROOT, '.codegen', 'ocr-ops.schema.json')

    console.log(`Running pdomain_ops.schemas via ${pythonBin}`)
    console.log(`Output: ${opsSchemaOut}`)

    const opsResult = execFileSync(pythonBin, ['-m', 'pdomain_ops.schemas'], {
      encoding: 'utf-8',
      cwd: REPO_ROOT,
    })

    let opsParsed
    try {
      opsParsed = JSON.parse(opsResult)
    } catch (err) {
      console.error('pdomain_ops.schemas output is not valid JSON:', err.message)
      process.exit(1)
    }

    writeFileSync(opsSchemaOut, JSON.stringify(opsParsed, null, 2) + '\n', 'utf-8')
    console.log(`codegen:emit (ocr-ops) complete — wrote ${opsSchemaOut}`)
  }
}

main().catch((err) => {
  console.error('codegen:emit failed:', err.message)
  process.exit(1)
})

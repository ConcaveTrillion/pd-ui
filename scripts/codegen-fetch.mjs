#!/usr/bin/env node
/**
 * codegen-fetch.mjs — M4.1
 *
 * Reads codegen.versions.json, creates .codegen/venv/ via `uv venv`, and
 * installs pinned wheels from the pd-index-pip self-hosted registry.
 *
 * Flags:
 *   --book-tools-only   Only install pd-book-tools (skip pd-ocr-ops)
 *   --dry-run           Print the commands that would be run; do not execute
 *   --local             Install from local sibling paths instead of registry
 *                       (bootstrap mode for dev before wheels are published)
 */

import { readFileSync, existsSync, mkdirSync } from 'fs'
import { execFileSync } from 'child_process'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')

const PD_INDEX_PIP_URL = 'https://concavetrillion.github.io/pd-index-pip/simple/'

function parseArgs(argv) {
  const args = argv.slice(2)
  return {
    bookToolsOnly: args.includes('--book-tools-only'),
    dryRun: args.includes('--dry-run'),
    local: args.includes('--local'),
  }
}

function readVersions() {
  const versionsPath = join(REPO_ROOT, 'codegen.versions.json')
  const raw = readFileSync(versionsPath, 'utf-8')
  return JSON.parse(raw)
}

function run(cmd, args, { dryRun, cwd } = {}) {
  const display = [cmd, ...args].join(' ')
  if (dryRun) {
    console.log(`[dry-run] ${display}`)
    return
  }
  console.log(`$ ${display}`)
  execFileSync(cmd, args, { stdio: 'inherit', cwd: cwd ?? REPO_ROOT })
}

async function main() {
  const opts = parseArgs(process.argv)
  const versions = readVersions()

  const venvDir = process.env['CODEGEN_VENV_DIR'] ?? join(REPO_ROOT, '.codegen', 'venv')

  // Ensure .codegen dir exists
  const codegenDir = join(REPO_ROOT, '.codegen')
  if (!opts.dryRun) {
    mkdirSync(codegenDir, { recursive: true })
  } else {
    console.log(`[dry-run] mkdir -p ${codegenDir}`)
  }

  // Create venv (--clear recreates it if it already exists)
  run('uv', ['venv', '--clear', venvDir], { dryRun: opts.dryRun })

  // Build package specs
  const packages = []

  if (opts.local) {
    // Local bootstrap mode: install from sibling repo paths
    const btPath = resolve(REPO_ROOT, '..', 'pd-book-tools')
    packages.push(btPath)
    if (!opts.bookToolsOnly) {
      const opsPath = resolve(REPO_ROOT, '..', 'pd-ocr-ops')
      packages.push(opsPath)
    }
    const btVersion = versions['pd-book-tools']
    console.log(`[local mode] pd-book-tools==${btVersion} from ${btPath}`)
  } else {
    // Registry mode: install from pd-index-pip
    const btVersion = versions['pd-book-tools']
    packages.push(`pd-book-tools==${btVersion}`)
    console.log(`Installing pd-book-tools==${btVersion} from ${PD_INDEX_PIP_URL}`)

    if (!opts.bookToolsOnly) {
      const opsVersion = versions['pd-ocr-ops']
      packages.push(`pd-ocr-ops==${opsVersion}`)
      console.log(`Installing pd-ocr-ops==${opsVersion} from ${PD_INDEX_PIP_URL}`)
    }
  }

  // Install packages
  const installArgs = opts.local
    ? ['pip', 'install', '--python', venvDir, ...packages]
    : ['pip', 'install', '--python', venvDir, '--extra-index-url', PD_INDEX_PIP_URL, ...packages]

  run('uv', installArgs, { dryRun: opts.dryRun })

  if (!opts.dryRun) {
    console.log('codegen:fetch complete.')
  }
}

main().catch((err) => {
  console.error('codegen:fetch failed:', err.message)
  process.exit(1)
})

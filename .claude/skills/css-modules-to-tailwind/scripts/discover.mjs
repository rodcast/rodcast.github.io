#!/usr/bin/env node
// Discover CSS Modules and the components that import them — or verify a
// migration is complete. Zero dependencies; run from the project root.
//
//   node discover.mjs            List every *.module.{css,scss} + its importers.
//   node discover.mjs --check    Exit non-zero if any module file/import remains
//                                (use after migration to prove it's total).
//   node discover.mjs --json     Machine-readable output for the default mode.
//
// "Importers" are found by scanning source files for an import whose specifier
// ends in .module.css / .module.scss, capturing the local alias (e.g. `styles`,
// `icon`) so you know what to grep for when rewriting JSX.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const CHECK = process.argv.includes('--check');
const JSON_OUT = process.argv.includes('--json');

const IGNORE = new Set([
  'node_modules',
  '.next',
  'out',
  'dist',
  'build',
  '.git',
  'coverage',
]);
const SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const MODULE_RE = /\.module\.s?css$/;

/** Recursively collect files, skipping ignored dirs. */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE.has(name)) continue;
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const allFiles = walk(ROOT);
const moduleFiles = allFiles.filter((f) => MODULE_RE.test(f));
const sourceFiles = allFiles.filter((f) => SOURCE_EXT.has(extname(f)));

// Map module file path -> [{ component, alias }]
const importsByModule = new Map(moduleFiles.map((m) => [m, []]));
// Match: import styles from '...module.css'  /  import * as styles from '...'
const importRe =
  /import\s+(?:(\w+)|\*\s+as\s+(\w+))\s+from\s+['"]([^'"]+\.module\.s?css)['"]/g;

let strayImports = 0;
for (const sf of sourceFiles) {
  const text = readFileSync(sf, 'utf8');
  let m;
  while ((m = importRe.exec(text)) !== null) {
    const alias = m[1] || m[2];
    const spec = m[3];
    strayImports++;
    // Resolve the specifier to an actual module file by suffix match (handles
    // path aliases like @/styles/x.module.css without reading tsconfig).
    const tail = spec.replace(/^.*[/\\]/, '');
    const target =
      moduleFiles.find((mf) => mf.endsWith(spec.replace(/^@?\/?/, ''))) ||
      moduleFiles.find((mf) => mf.endsWith('/' + tail)) ||
      null;
    if (target) importsByModule.get(target).push({ component: sf, alias });
  }
}

const rel = (p) => relative(ROOT, p);

if (CHECK) {
  const remainingFiles = moduleFiles.map(rel);
  if (remainingFiles.length === 0 && strayImports === 0) {
    console.log(
      '✓ Migration complete: no *.module.{css,scss} files or imports remain.'
    );
    process.exit(0);
  }
  console.error('✗ Migration incomplete.');
  if (remainingFiles.length) {
    console.error(`\n  ${remainingFiles.length} module file(s) still present:`);
    for (const f of remainingFiles) console.error(`    - ${f}`);
  }
  if (strayImports) {
    console.error(
      `\n  ${strayImports} module import(s) still referenced in source.`
    );
  }
  process.exit(1);
}

const report = moduleFiles.map((mf) => ({
  file: rel(mf),
  importers: importsByModule.get(mf).map((i) => ({
    component: rel(i.component),
    alias: i.alias,
  })),
}));

if (JSON_OUT) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

if (report.length === 0) {
  console.log('No CSS Module files found. Nothing to migrate.');
  process.exit(0);
}

console.log(`Found ${report.length} CSS Module file(s):\n`);
for (const r of report) {
  console.log(`● ${r.file}`);
  if (r.importers.length === 0) {
    console.log(
      '    (no importers found — possibly dead, verify before deleting)'
    );
  }
  for (const imp of r.importers) {
    console.log(`    ← ${imp.component}  (as "${imp.alias}")`);
  }
  if (r.importers.length > 1) {
    console.log('    ⚠ shared by multiple components — migrate them together.');
  }
  console.log('');
}

const shared = report.filter((r) => r.importers.length > 1);
console.log(
  'Suggested order: migrate leaf/single-importer modules first, shared ones last.'
);
if (shared.length) {
  console.log(
    `Shared modules to handle carefully: ${shared.map((s) => s.file).join(', ')}`
  );
}

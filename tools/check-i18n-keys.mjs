// Fails the build if src/locales/en.json and fr.json ever drift apart - keeps future English
// content updates from silently shipping untranslated (or now-orphaned) strings to French
// readers. Runs automatically before `npm run build` (see package.json's "prebuild" script).
// Deliberately lives outside scripts/, which is reserved for the Sunday community-data
// automation (see I18N_HANDOFF_CLAUDE.md) - this has nothing to do with that pipeline.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'src', 'locales');

function loadJson(filename) {
  const filePath = path.join(localesDir, filename);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

// Collects every leaf path (e.g. "usecases.items.3.title") in a nested object. Arrays are
// walked by index so a translation missing an entire array entry (not just a field) is caught
// too, not just field-level drift within entries that exist in both.
function collectPaths(value, prefix, out) {
  if (Array.isArray(value)) {
    value.forEach((item, idx) => collectPaths(item, `${prefix}.${idx}`, out));
  } else if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectPaths(child, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.add(prefix);
  }
}

const en = loadJson('en.json');
const fr = loadJson('fr.json');

const enPaths = new Set();
const frPaths = new Set();
collectPaths(en, '', enPaths);
collectPaths(fr, '', frPaths);

const missingInFr = [...enPaths].filter((p) => !frPaths.has(p)).sort();
const extraInFr = [...frPaths].filter((p) => !enPaths.has(p)).sort();

if (missingInFr.length > 0 || extraInFr.length > 0) {
  console.error('\ni18n key mismatch between src/locales/en.json and src/locales/fr.json:\n');
  if (missingInFr.length > 0) {
    console.error(`  Missing in fr.json (${missingInFr.length}):`);
    missingInFr.forEach((p) => console.error(`    - ${p}`));
  }
  if (extraInFr.length > 0) {
    console.error(`  Present in fr.json but not en.json (${extraInFr.length}):`);
    extraInFr.forEach((p) => console.error(`    - ${p}`));
  }
  console.error('\nen.json is the source of truth - add/remove the matching keys in fr.json.\n');
  process.exit(1);
}

console.log('i18n check passed: en.json and fr.json are in sync.');

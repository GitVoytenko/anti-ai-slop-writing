#!/usr/bin/env node
/**
 * Structural validation of the skill itself.
 *
 * The skill is loaded by an agent, not by a compiler, so nothing else would
 * catch a broken reference link or a description that grew past the limit —
 * until the day the skill silently stops loading.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LANGUAGES = ['en', 'ru', 'uk'];
const MODULES = ['rules.md', 'banned.md', 'patterns.md'];
const DESCRIPTION_LIMIT = 1024;

const problems = [];
const notes = [];

const fail = (message) => problems.push(message);
const note = (message) => notes.push(message);

function readFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const body = match[1];

  const name = body.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const version = body.match(/^\s+version:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim();

  // description uses a YAML folded block, so it spans lines until the next key
  const descriptionMatch = body.match(/^description:\s*(?:>-|>|\|)?\s*\n([\s\S]*?)(?=^\S)/m);
  const inline = body.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  const description = descriptionMatch
    ? descriptionMatch[1].split('\n').map((l) => l.trim()).filter(Boolean).join(' ')
    : inline;

  return { name, version, description };
}

// 1. SKILL.md and its frontmatter
const skillPath = join(ROOT, 'SKILL.md');
if (!existsSync(skillPath)) {
  fail('SKILL.md is missing');
} else {
  const skill = readFileSync(skillPath, 'utf8');
  const front = readFrontmatter(skill);

  if (!front) fail('SKILL.md has no YAML frontmatter');
  else {
    if (front.name !== 'anti-ai-slop-writing') fail(`frontmatter name is "${front.name}", expected anti-ai-slop-writing`);
    if (!front.description) fail('frontmatter has no description');
    else {
      const length = front.description.length;
      if (length > DESCRIPTION_LIMIT) fail(`description is ${length} chars, limit is ${DESCRIPTION_LIMIT}`);
      else note(`description ${length}/${DESCRIPTION_LIMIT} chars`);
    }
    if (!front.version) fail('frontmatter has no metadata.version');

    // 2. version agreement across skill, package and changelog
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    if (front.version && pkg.version !== front.version) {
      fail(`package.json version ${pkg.version} does not match SKILL.md ${front.version}`);
    }
    const changelog = join(ROOT, 'CHANGELOG.md');
    if (existsSync(changelog)) {
      const top = readFileSync(changelog, 'utf8').match(/^##\s*\[?(\d+\.\d+\.\d+)\]?/m)?.[1];
      if (top && front.version && top !== front.version) {
        fail(`CHANGELOG.md top entry is ${top}, SKILL.md says ${front.version}`);
      }
    }
    if (front.version) note(`version ${front.version}`);
  }

  // 3. every relative link resolves
  const links = [...skill.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
  const broken = links.filter((href) => !/^https?:/.test(href) && !existsSync(join(ROOT, href.split('#')[0])));
  for (const href of broken) fail(`SKILL.md links to a missing file: ${href}`);
  note(`${links.length} links checked`);
}

// 4. language modules
for (const lang of LANGUAGES) {
  for (const module of MODULES) {
    const path = join(ROOT, 'references', lang, module);
    if (!existsSync(path)) {
      fail(`missing module references/${lang}/${module}`);
      continue;
    }
    const contents = readFileSync(path, 'utf8').trim();
    if (contents.length < 200) fail(`references/${lang}/${module} looks empty (${contents.length} chars)`);
    if (!contents.startsWith('# ')) fail(`references/${lang}/${module} does not start with a heading`);
  }
}

const core = join(ROOT, 'references', 'core', 'craft.md');
if (!existsSync(core)) fail('missing references/core/craft.md');

// 5. the banned lists still parse into something usable
const { parseBanned } = await import('../detector/lib/parse-banned.js');
for (const lang of LANGUAGES) {
  const path = join(ROOT, 'references', lang, 'banned.md');
  if (!existsSync(path)) continue;
  const { entries } = parseBanned(path, lang);
  const kinds = new Set(entries.map((e) => e.kind));
  for (const kind of ['vocabulary', 'phrase', 'opener']) {
    if (!kinds.has(kind)) fail(`references/${lang}/banned.md has no parseable ${kind} section`);
  }
  if (entries.length < 50) fail(`references/${lang}/banned.md parsed only ${entries.length} entries`);
  else note(`${lang}: ${entries.length} banned entries`);
}

for (const line of notes) console.log(`  ${line}`);
if (problems.length === 0) {
  console.log('validate-skill: ok');
  process.exit(0);
}
for (const problem of problems) console.error(`validate-skill: ${problem}`);
process.exit(1);

# The detector

Zero dependencies, Node 18 or newer, no build step.

```bash
aislop draft.md
aislop posts/ --lang ru --severity medium
cat draft.txt | aislop -
aislop docs/ --format json --max 0
```

| Option | Effect |
| --- | --- |
| `--lang en\|ru\|uk\|auto` | output language; auto-detects per file by default |
| `--severity high\|medium\|low` | minimum severity reported (default `low`) |
| `--only rule,rule` | report only these rules |
| `--ignore rule,rule` | skip these rules |
| `--format pretty\|json` | human output or machine output |
| `--max n` | exit 1 when findings exceed `n` |
| `--quiet` | per-file summary without the individual lines |

Exit codes: `0` within budget, `1` over budget, `2` bad usage.

## Node API

```js
import { detect } from 'anti-ai-slop-writing';

const { lang, issues, stats } = detect(text, { lang: 'ru', severity: 'medium' });
```

`issues[]` carries `rule`, `severity`, `line`, `column`, `start`, `end`,
`excerpt`, `message`, and `fix` when the banned list supplies a replacement.
`stats` carries `words`, `issues`, `per1000`, `byRule`, `bySeverity`, and
`bannedEntries`.

## Rules

### Lexical, driven by `references/<lang>/banned.md`

| Rule | What it catches |
| --- | --- |
| `banned-word` | vocabulary entries, matched across inflections in RU/UK and across `-s`/`-ed`/`-ing` in EN |
| `banned-phrase` | phrase entries, with `X` / `[noun]` treated as slots |
| `banned-opener` | opener entries, **only** at the start of a sentence |

Severity comes from the list itself. A bare entry is `high`, an entry carrying
an arrow replacement (`данный (→ этот)`) is `medium`, and an entry with a
condition the tool cannot verify (`landscape (figurative)`, `ключевой (как
филлер)`) is `low`.

### Structural

| Rule | Threshold |
| --- | --- |
| `uniform-sentence-length` | 3+ consecutive sentences within 2 words of each other |
| `flat-rhythm` | standard deviation under 40% of mean length, 60+ words |
| `parataxis` | 4+ consecutive sentences of 8 words or fewer |
| `rule-of-three` | `A, B and C` inside one sentence, subordinate clauses excluded |
| `role-opener` | `As a [role], I…` / «Как [роль], я…» / «Як [роль], я…» |
| `verbal-noun-chain` | two adjacent `-ание/-ение` or `-ання/-ення` nouns (RU/UK) |

### Punctuation

| Rule | Threshold |
| --- | --- |
| `em-dash` | EN only: more than one per 500 words |
| `rhetorical-dash` | RU/UK: more than one per 500 words, **grammatical тире excluded** |
| `not-just-construction` | «X — это не просто Y» and its English and Ukrainian twins |
| `exclamation` | more than one per 1000 words |
| `ellipsis` | more than one per piece |

The dash rules are the ones worth reading twice. In English the em dash is
rationed outright. In Russian and Ukrainian a dash is counted only when it is
not doing grammatical work: a dash near the head of its clause («Киев —
столица») or one followed by a copula word («…без интернета, это четыре
часа») is free, and only the leftover rhetorical pauses are budgeted.

### Formatting

| Rule | What it catches |
| --- | --- |
| `emoji-bullet` | a line that starts with an emoji as its bullet |
| `bullet-run` | more than 7 consecutive bullets |
| `hashtag-stack` | more than 2 hashtags |
| `thread-opener` | `🧵`, `Thread:`, «Тред:» |

## What is never scanned

`mask.js` blanks these before any rule runs, keeping every offset intact so
`line:column` still points at the right place:

fenced and inline code, HTML comments, link and image targets, bare URLs,
reference definitions, YAML frontmatter, and blockquotes. Quoted material
belongs to whoever is quoted, and the skill says as much: never rewrite a banned
phrase inside a quotation, a title, or text that discusses the phrase itself.

For the rules that measure prose, markdown decoration and table rows are blanked
too.

## Known limits

**Morphology is approximate.** Russian and Ukrainian stems are cut by length,
with a separate rule for infinitives, and the tail is capped at four letters. It
catches «данный → данного → данным» and «здійснювати → здійснюємо». It will miss
irregular forms, and a very short banned word can, in principle, reach a word
nobody meant to ban. The fixtures in `test/fixtures/human/` exist to catch that
class of mistake before it ships.

**Conditions are unverifiable by design.** «Ландшафт» is banned figuratively and
fine for terrain. The detector reports it as `low` and lets you decide. Running
with `--severity high` skips every conditional entry, which is the right setting
for a CI gate.

**Two sections of `en/banned.md` are not parsed.** "Model-Specific First-Word
Tells" is about the first word of a chat reply, not of a document, and
"Era-Specific AI Vocabulary" is historical context whose live entries already
appear in the main list.

**The craft rules are out of reach.** Whether a scene beats its summary, whether
the painful number sits in a main clause, whether the piece ends once: those
live in `references/core/craft.md`, they decide whether a text reads as human,
and no regular expression can check them. A clean detector run means the
mechanical layer is clean. It does not mean the writing is good.

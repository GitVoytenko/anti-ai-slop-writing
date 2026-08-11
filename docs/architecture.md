# Architecture

Two halves that share one source of truth.

```
SKILL.md ─────────────┐
references/           │  read by the model at generation time
  core/craft.md       │
  <lang>/rules.md     │
  <lang>/banned.md ───┼──── also parsed by the detector at runtime
  <lang>/patterns.md  │
                      │
detector/ ────────────┘  read by node, never by the model
```

## Why the modules are split

A single instruction file has one failure mode: it grows until the model starts
skimming it, and the parts it skims are the specific ones. Splitting by language
means a Ukrainian task never loads the Russian banned list, and the model reads
four short files instead of one long one.

The split also decides who owns what. `SKILL.md` holds rules that survive
translation: no groups of three, no uniform sentence length, no invented facts.
Anything that depends on the alphabet lives in the language module and
**overrides** `SKILL.md` where they disagree. The dash rule is the clearest
case. English rations the em dash; Russian and Ukrainian cannot, because тире is
required grammar there, and a rule copied across would teach the model to write
broken Russian.

`core/craft.md` is the odd one out: language-independent, but too specific for
`SKILL.md`. It holds second-order craft — one markedly short sentence per block,
detail over evaluation, end once, order equals priorities. It also holds a
revision discipline section that protects a draft from the other rules. Those
came out of editing texts that passed every word check and still read as
generated.

## How the model loads them

`SKILL.md` step 0 picks the output language (not the language of the request:
a Russian prompt can ask for an English tweet), then loads `core/craft.md` plus
the three files for that language. Missing files are skipped rather than fatal,
so a fork can delete a language it does not need.

## How the detector reuses the same files

`detector/lib/parse-banned.js` reads `references/<lang>/banned.md` and turns it
into matchable entries. Nothing is duplicated in code: add a word to the
markdown and the linter finds it on the next run. The parser understands the
conventions the lists already use: slash variants, bracketed conditions, arrow
replacements, quoted narrower forms. That is what keeps the markdown readable
for a human while remaining machine-usable.

Everything downstream is layered on top:

```
mask.js          blanks code, links, quotes, frontmatter (positions preserved)
tokenize.js      sentences, words, offsets → line:column, language guess
morphology.js    a banned entry → a regex that survives Russian inflection
rules/lexical.js       vocabulary, phrases, openers
rules/structural.js    rhythm, groups of three, parataxis, credential openers
rules/punctuation.js   dash budgets, exclamation marks, ellipses
rules/formatting.js    emoji bullets, hashtag stacks, thread openers
index.js         orchestration, severity filtering, statistics
cli.js           file walking, exit codes, output formats
```

Two text streams run through the rules. Lexical rules see the masked text, so a
banned word inside a code block is invisible to them. Structural and punctuation
rules see the masked text with markdown decoration blanked out as well, so a
heading is not a one-word sentence and a table of terse cells is not a run of
same-length sentences.

## What the detector deliberately cannot do

The craft rules are the ones that matter most and the ones no linter can check.
Whether a scene beats its summary. Whether the number that hurts sits in a main
clause or is parked in a subordinate one. Whether the piece ends once. Whether the
reader's one real option survived the edit. A regular expression cannot see any
of that, and pretending otherwise would give a green check to text that fails
where it counts.

So the detector is a floor. It catches the mechanical half, fast and
repeatably, which frees a human editor to look at the half that needs judgment.

# Anti-AI-Slop Writing

[![CI](https://github.com/GitVoytenko/anti-ai-slop-writing/actions/workflows/ci.yml/badge.svg)](https://github.com/GitVoytenko/anti-ai-slop-writing/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](package.json)

A writing skill for Claude that produces text without the patterns people have
learned to recognise as machine-written, in **English, Russian and Ukrainian**.
It ships with a linter that reads the same word lists the model reads, so you
can check any draft from the command line.

Anti-AI-writing tooling is mostly English-first, and translating an English
list into Russian or Ukrainian breaks on the very first rule. The em dash is the
top English tell, while тире is required grammar in both Slavic languages:
«Киев — столица» is simply correct, and a linter that flags it teaches the
writer to break the language. Each language here gets its own rules, its own
banned list, its own before/after pairs.

## What it looks like

Each pair below says the same thing twice: first the way a model writes it by
default, then the way it writes with this skill loaded. No fact is added and
none is dropped. All three pairs are made up for this README.

**English.** One fact, wrapped in 33 words, then stated in 11.

> **Before.** In today's fast-moving digital landscape, our comprehensive
> platform empowers teams to unlock the full potential of their data — it's not
> just analytics, it's transformation. Onboarding now takes three days instead
> of two weeks.
>
> **After.** Onboarding used to take two weeks. It takes three days now.

Everything before the last sentence of the "before" is filler: it could sit
under any product in any industry, unchanged. That is the tell, and it is what
survives a "write it like a human" instruction.

**Russian.** The fact is *four hours became three minutes*, and the "before"
buries it in a subordinate clause at the very end, where nobody feels it.

> **Before.** В современном мире автоматизация играет ключевую роль. Стоит
> отметить, что внедрение данного решения позволило существенно повысить
> эффективность подготовки отчётности: время сократилось с четырёх часов до
> трёх минут.
>
> **After.** Раньше бухгалтер собирала отчёт четыре часа. Теперь три минуты.

**Ukrainian.** Two days of waiting for support, now four hours.

> **Before.** У сучасному світі якісна підтримка відіграє ключову роль. Варто
> зазначити, що впровадження даного рішення дозволило суттєво підвищити
> ефективність опрацювання звернень: середній час відповіді скоротився з двох
> діб до чотирьох годин.
>
> **After.** Раніше лист у підтримку висів дві доби. Тепер — чотири години.

That Ukrainian "after" keeps its dash and the linter stays quiet, because тире
is standing in for the verb the sentence drops. Required grammar. An English
rule ported straight across would have flagged it and pushed the writer toward
worse Ukrainian.

Run the linter over any of the three "before" versions and it names each
problem, with a replacement where the list has one:

```
$ npx github:GitVoytenko/anti-ai-slop-writing draft.md
draft.md (27 words, ru)
  1:1    high   banned-phrase  banned phrase: "В современном мире"
  1:41   high   banned-phrase  banned phrase: "ключевую роль"
  1:56   high   banned-phrase  banned phrase: "Стоит отметить, что"
  1:86   medium banned-word    banned word: "данный" — use этот instead
  1:133  low    banned-word    banned word: "эффективный" — banned как филлер
```

All three "after" versions come back clean.

## Why a skill and not a prompt

"Write like a human, avoid AI patterns" gets you an answer that avoids the
words the model associates with the phrase *AI patterns*. It keeps every
structural tell: the groups of three, the even sentence lengths, the tidy
upbeat close, the paragraph that ends in a transition every single time.

A skill carries what a prompt cannot: a banned list of 125 to 158 matchable
entries per language, rewrite pairs to compare a draft against, and a dash rule
that knows the difference between two alphabets. It also carries instructions for what
**not** to flag, which matters more than it sounds, because an over-eager edit
destroys the evidence that a person wrote the thing. Polish is not proof of a
machine. Канцелярит inside a legal document is the correct register, and
rewriting it there makes the document worse.

One more rule most style guides skip: never invent a fact to sound specific. A
fabricated number reads more human than an honest vague one, and it is still a
defect.

## Install

**Claude Code.** Clone into your skills directory and Claude picks it up in any
project:

```bash
git clone https://github.com/GitVoytenko/anti-ai-slop-writing.git ~/.claude/skills/anti-ai-slop-writing
```

**Claude Desktop / Cowork.** Upload the folder as a skill, or point your skills
directory at the clone.

**Any other agent.** `SKILL.md` is plain markdown with relative links. Paste it
into a system prompt and keep `references/` alongside it, or inline the four
files one language uses: `core/craft.md` plus that language's three modules.

**The linter alone**, without the skill. It is not on npm, so it runs from the
repository:

```bash
npx github:GitVoytenko/anti-ai-slop-writing draft.md
```

## How the skill is organised

`SKILL.md` holds what applies everywhere: structural rules, punctuation
budgets, the no-invented-facts rule, the draft → audit → final loop. Everything
language-specific lives in a module the model loads on demand.

```
SKILL.md
references/
  core/craft.md          second-order craft: pacing, ordering, endings, revision discipline
  en/  ru/  uk/
    rules.md             grammar-level tells; overrides SKILL.md on conflict
    banned.md            vocabulary, phrases, openers
    patterns.md          before/after rewrites + a public-domain human exemplar
```

Every module is self-contained. Edit one without touching the others; delete
one and the skill keeps working with what remains. Adding a fourth language
means creating `references/<lang>/` with the same three files and adding one
routing line to `SKILL.md`. See [docs/adding-a-language.md](docs/adding-a-language.md).

Current contents, counted by `npm run stats`:

| Language | Vocabulary | Phrases | Openers | Rewrite pairs |
| --- | --- | --- | --- | --- |
| English | 70 | 39 | 16 | 5 |
| Russian | 75 | 39 | 18 | 10 |
| Ukrainian | 101 | 40 | 17 | 10 |

The Ukrainian list is the longest because it carries a category the others do
not need: calques from Russian and from English. Machine-translated Ukrainian
reads as machine-written even when every word is clean.

## The detector

Zero dependencies, Node 18 or newer. It parses `references/<lang>/banned.md` at
runtime, which means the word lists have exactly one home: add a word to the
markdown and the linter picks it up on the next run.

```bash
npm install GitVoytenko/anti-ai-slop-writing   # or clone the repo and run npm link

aislop draft.md                      # auto-detects the language
aislop posts/ --lang ru --severity medium
cat draft.txt | aislop -
aislop README.md --max 0             # exit 1 on any finding, for CI or a git hook
```

```js
import { detect } from 'anti-ai-slop-writing';

const { issues, stats } = detect(text, { lang: 'uk' });
// issues: [{ rule, severity, line, column, excerpt, message, fix }]
// stats:  { words, issues, per1000, byRule, bySeverity }
```

Findings come in three severities. `high` is unconditional: a banned phrase, a
credential opener, three same-length sentences in a row. `medium` carries a
suggested replacement, or narrows a word to the exact form that is banned. `low` marks a word
that is banned only in one sense: `ландшафт` is fine for terrain and slop for
`информационный ландшафт`, and no regular expression can tell those apart.

What it will not do: judge whether a scene beats its summary, whether the
painful number sits in a main clause, whether the piece ends once or three
times. Those rules are in `core/craft.md`, they matter more than the word
lists, and they need a reader. The linter is a floor, not a verdict.

[docs/detector.md](docs/detector.md) lists every rule and its known limits.

## It passes its own linter

[PROOF.md](PROOF.md) is generated by running the detector over this
repository's documentation. CI checks the count against the recorded budget, so
prose that drifts fails the build like a broken test would.

```bash
npm test           # detector rules, parser, CLI, and the fixtures below
npm run lint:skill # frontmatter, version agreement, every reference link
npm run self-scan  # regenerate PROOF.md
npm run check      # all three, what CI runs
```

The test fixtures come in pairs. Three deliberately slop-ridden files that the
detector has to catch, and three ordinary human texts it has to leave alone. A
style linter that only proves it can find slop is half a linter: the human
fixtures fail loudly the day a rule starts eating real writing.

## Contributing

Word lists are never finished. Adding an entry is a one-line change to a
markdown file, and the linter picks it up without touching any code. [CONTRIBUTING.md](CONTRIBUTING.md) covers the
entry format and the severity conventions, plus what a new language port needs.

## Credits

The English banned list draws on Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
(WikiProject AI Cleanup) and on [Carnegie Mellon's 2025 study](https://www.cmu.edu/dietrich/news/news-stories/2025/february/large-language-models-writing-text.html)
of the lexical and grammatical features that separate model output from human
writing. The Russian and Ukrainian lists cite their own sources at the top of
each `patterns.md`.

The rewrite pairs for Russian and Ukrainian came out of editing real drafts. The
human exemplars are public domain: Chekhov's 1886 letter to his brother for
Russian, a 1907 letter of Lesya Ukrainka for Ukrainian.

MIT licensed. See [LICENSE](LICENSE).

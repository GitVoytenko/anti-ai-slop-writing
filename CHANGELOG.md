# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[semantic versioning](https://semver.org/spec/v2.0.0.html). The version in
`SKILL.md`, `package.json` and this file must agree; `npm run lint:skill` fails
if they drift.

## [Unreleased]

### Fixed

- Documentation pointed at `npx aislop`, which resolves to an unrelated package
  on npm. Install and run instructions now use the repository.
- Credits attributed the English list partly to Buffer's 52M-post analysis; that
  study measures social media engagement, not AI writing markers. Replaced with
  the Carnegie Mellon 2025 study, linked.
- Corrected the word count in the README demo, and the test count.

- `references/en/banned.md` carried the same wrong citation; replaced there too,
  with the authors named.

### Changed

- Placeholder slots per banned entry are capped, bounding regex matching cost.

### Added

- `validate-skill.js` now checks the documentation against the files it
  describes: the README counts table against the parsed lists, every relative
  link in README, CONTRIBUTING and docs, and any instruction to install `aislop`
  from npm.

## [2.4.0] - 2026-08-11

First public release. The skill had been in private use before this; the version
number continues that history rather than restarting at 1.0.0.

### Added

- `SKILL.md` — the writing directive: structural rules, punctuation budgets, the
  no-invented-facts rule, voice calibration, and the draft → audit → final loop.
- `references/core/craft.md` — second-order craft rules that apply to every
  language, plus the revision discipline that keeps the other rules from
  hollowing out a draft.
- `references/{en,ru,uk}/` — three modules per language: `rules.md` (grammar-level
  tells that override the general rules), `banned.md` (vocabulary, phrases,
  openers), `patterns.md` (before/after pairs and a public-domain human
  exemplar).
- `detector/` — a zero-dependency linter that parses the same `banned.md` files
  the model reads, so the word lists have one home. Ships as the `aislop` CLI and
  a Node API.
- Structural rules the word lists cannot express: uniform sentence length, flat
  rhythm, parataxis, groups of three, credential openers, verbal-noun chains.
- Language-aware dash handling: the em dash is rationed in English, while
  grammatical тире stays free in Russian and Ukrainian and only rhetorical
  pauses count against the budget.
- `scripts/validate-skill.js` — frontmatter, description length, link
  resolution, and version agreement.
- `scripts/self-scan.js` — runs the detector over this repository's own
  documentation and writes `PROOF.md`; CI enforces the recorded budget.
- Test fixtures in both directions: slop the detector must catch, and ordinary
  human writing it must leave alone.

[Unreleased]: https://github.com/GitVoytenko/anti-ai-slop-writing/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/GitVoytenko/anti-ai-slop-writing/releases/tag/v2.4.0

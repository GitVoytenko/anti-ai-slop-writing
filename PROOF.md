# Self-scan

<!-- budget: 7 -->

The detector run against this repository's own documentation. Regenerate with
`npm run self-scan`; CI runs `node scripts/self-scan.js --check` and fails if
the count climbs above the budget recorded above.

Excluded by design: `references/*/banned.md` (a list of banned words) and
`references/*/patterns.md` (each entry quotes the bad version before the good
one). Linting those would measure the wrong thing.

**7 findings across 5 files, 3352 words** — 0 high, 0 medium, 7 low.

| File | Language | Words | High | Medium | Low |
| --- | --- | --- | --- | --- | --- |
| `CONTRIBUTING.md` | en | 597 | 0 | 0 | 1 |
| `README.md` | en | 1041 | 0 | 0 | 1 |
| `docs/adding-a-language.md` | en | 527 | 0 | 0 | 1 |
| `docs/architecture.md` | en | 491 | 0 | 0 | 1 |
| `docs/detector.md` | en | 696 | 0 | 0 | 3 |

## Findings

### CONTRIBUTING.md

- `CONTRIBUTING.md:102:77` **low** rule-of-three — group of three — use two, four, or one unless the content really has three items

### README.md

- `README.md:8:42` **low** rule-of-three — group of three — use two, four, or one unless the content really has three items

### docs/adding-a-language.md

- `docs/adding-a-language.md:37:54` **low** rule-of-three — group of three — use two, four, or one unless the content really has three items

### docs/architecture.md

- `docs/architecture.md:83:40` **low** rule-of-three — group of three — use two, four, or one unless the content really has three items

### docs/detector.md

- `docs/detector.md:54:5` **low** rule-of-three — group of three — use two, four, or one unless the content really has three items
- `docs/detector.md:98:25` **low** rule-of-three — group of three — use two, four, or one unless the content really has three items
- `docs/detector.md:99:1` **low** rule-of-three — group of three — use two, four, or one unless the content really has three items

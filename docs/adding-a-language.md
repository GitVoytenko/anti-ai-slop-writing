# Adding a language

A fourth language is five files and one routing line. Nothing in the existing
modules changes.

The order below matters: write the language modules first and get the skill
working, then teach the detector. The skill is useful without the linter; the
linter is useless without good lists.

## 1. Create the modules

```
references/<lang>/rules.md      grammar-level tells specific to this language
references/<lang>/banned.md     vocabulary, phrases, openers
references/<lang>/patterns.md   before/after pairs + a public-domain human exemplar
```

Copy the structure from an existing language rather than the content. The
Russian and Ukrainian files are the better template for an inflected language;
the English one for an analytic language.

`rules.md` is where you contradict `SKILL.md` on purpose. It overrides the
general rules where the language demands it, and every language has at least one
such rule. English rations the em dash; Russian and Ukrainian cannot, because
тире is required grammar. German would need something about compound nouns and
the position of the verb. Write down what a non-native rule would break.

`banned.md` needs three `##` sections: vocabulary, phrases, openers. The parser
finds them by keyword in the heading, so a heading in your own language works as
long as it contains the local word for "vocabulary", "phrases" or "openers" —
otherwise add the keyword to `SECTION_KINDS` in
`detector/lib/parse-banned.js`.

`patterns.md` ends with a public-domain human exemplar, and the choice is worth
some thought. It should be a real text by a real writer whose rhythm the model
can compare itself against: Chekhov's 1886 letter for Russian, Lesya Ukrainka's
1907 letter for Ukrainian. Old is fine. The point is the uneven pacing, not the
vocabulary, and the note under the excerpt should say so.

## 2. Route it in `SKILL.md`

One line in the language list under step 0:

```markdown
- German → `references/de/` — [rules.md](references/de/rules.md), [banned.md](references/de/banned.md), [patterns.md](references/de/patterns.md)
```

That is the whole skill-side change. `npm run lint:skill` checks that the links
resolve.

## 3. Add fixtures

```
test/fixtures/slop/<lang>.md     text your language modules should tear apart
test/fixtures/human/<lang>.md    ordinary writing the detector must leave alone
```

Write the human fixture first, and write it badly on purpose, with the mess a
real person leaves. Uneven sentences, a fragment, an aside, a real place name.
If your detector rules fire on it, the rules are wrong, not the text.

Then add the language to the arrays in `test/fixtures.test.js`.

## 4. Teach the detector

`detector/index.js`: add the code to `LANGUAGES`.

`detector/lib/tokenize.js`: `detectLanguage` currently splits Cyrillic between
Russian and Ukrainian by the letters only one of them uses. A new script needs
its own branch; a new Latin-script language needs a signal beyond the alphabet,
usually a short list of frequent function words.

`detector/rules/structural.js`: three tables are language-keyed and each needs an
entry: `RULE_OF_THREE` (how the language joins the last item), `CLAUSE_STARTERS`
(subordinating conjunctions, so a clause is not read as a list item), and
`ROLE_OPENER`. `VERBAL_NOUN_CHAIN` applies only where bureaucratese stacks verbal
nouns; leave it `null` otherwise.

`detector/rules/punctuation.js`: `NOT_JUST` needs the local form of the "not
just X" construction. If the language uses dashes grammatically, extend
`COPULA_AFTER` with its copula words, or the linter will flag correct grammar.

`detector/lib/morphology.js`: inflected languages need their endings in
`INFINITIVE_ENDINGS` and their alphabet in `CYRILLIC_ENDING` (or a new
equivalent). For an analytic language, `morph: false` is the honest setting.

## 5. Check both directions

```bash
npm run check
```

Then read the output on your own writing, not only on the fixtures. The
question that matters is not "did it find the slop" but "did it stay quiet on
the good text". A linter that flags real prose gets ignored within a week, and
an ignored linter is worse than none: it makes the repository look checked.

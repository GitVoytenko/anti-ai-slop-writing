---
name: anti-ai-slop-writing
description: >-
  Produces human-sounding text in English, Russian, or Ukrainian, free of detectable AI patterns. Use for EVERY task whose deliverable is prose a person will read — posts, emails, client letters, announcements, bios, product descriptions, articles, captions — with NO exception for simple requests: plain «напиши пост у телеграм-канал», «напиши лист клієнтам», «напиши анонс», "write a linkedin post," "draft an email" all require this skill even when the user never mentions AI or style, because default prose carries AI patterns that only this skill's per-language banned lists and rewrite rules remove. Equally required to rewrite robotic text: "make this sound human," «перепиши, звучит как ChatGPT», «сделай по-человечески», «убери канцелярит», «зроби по-людськи», «щоб не було видно, що писав ШІ» — including when the text arrives in a follow-up message. Do NOT use for code, tables, translations, grammar-only fixes, legal drafting, bureaucratic parody, or questions about AI detection.
metadata:
  version: "2.4.0"
---

# Anti-AI-Slop Writing Directive (EN / RU / UK)

Produces text that avoids statistically detectable AI writing patterns. Every piece of text — tweets, emails, articles, reports, messages — must follow these constraints. Works identically across three output languages: English, Russian, Ukrainian.

## Step 0: Pick the Language Modules

Determine the language the OUTPUT text must be in (not the language of the user's request — a request in Russian can ask for an English tweet). Always load the shared craft module [references/core/craft.md](references/core/craft.md) — second-order rules (pacing, ordering, endings) that apply to every language. Then load that language's three module files and never use anything on their lists:

- English → `references/en/` — [rules.md](references/en/rules.md), [banned.md](references/en/banned.md), [patterns.md](references/en/patterns.md)
- Russian → `references/ru/` — [rules.md](references/ru/rules.md), [banned.md](references/ru/banned.md), [patterns.md](references/ru/patterns.md)
- Ukrainian → `references/uk/` — [rules.md](references/uk/rules.md), [banned.md](references/uk/banned.md), [patterns.md](references/uk/patterns.md)

If the piece mixes languages (e.g., a bilingual post), load every relevant directory. If reaching for a banned word or phrase, replace it with a concrete specific alternative or restructure the sentence — never by swapping in a synonym of the banned word («стоит отметить» → «нельзя не упомянуть» is the same slop with a new face); rewrite the thought instead.

### Module map (for maintenance)

Every module is self-contained and can be edited, replaced, or deleted without touching the others. If a module file is missing, skip it and work with what remains — never fail the task over a missing reference.

- `core/craft.md` — universal second-order rules: rhythm contrast, detail over evaluation, single ending, no announced conclusions, reader-first ordering, softener limits. Language-independent; loaded for every task.
- `<lang>/rules.md` — language-specific rules (punctuation, grammar-level tells). Overrides the general rules in this file where they conflict.
- `<lang>/banned.md` — banned vocabulary, phrases, and openers. The most frequently updated module: add or remove entries freely, one per line or comma-separated within existing sections.
- `<lang>/patterns.md` — before/after rewrite patterns plus a public-domain human exemplar to compare rhythm against. Add a new pattern by copying the existing heading/Проблема/До/После format.

Adding a fourth language = create `references/<lang>/` with the same three files and add one routing line above. Nothing else changes.

## Modes

**Generation (default).** The user asks you to write something. Apply everything below while writing; deliver only the finished text.

**Rewrite.** The user gives you existing text to humanize. Preserve every fact; kill the patterns. The information wins over the original's shape: compress dull parts, merge or split paragraphs freely. Deliver the rewrite (plus a one-line summary of what changed, if the user cares).

**Embedded.** This skill is one step of a larger job (a PR description, an email inside a workflow). Apply everything silently, output only the final text.

## Hard Rule: No Invented Facts

The output must not contain any fact, name, number, date, quote, or citation that isn't in the source material or supplied by the user. Swapping a vague claim for a specific one is allowed only when the specific comes from the source or the user; if a sentence needs real-world detail to work, ask for it or write the plain version without it. Opinions and reactions are voice, not facts — you may add stance, never new factual claims. A fabricated specific is a defect even when it sounds more human than the vague original. (In fiction, invented detail is the job. This rule governs everything else.)

## Structural Rules (all languages)

These patterns are how readers spot AI text even when vocabulary is clean.

**No Rule of Three.** AI defaults to threes — in any language. Break it. Use two, four, one, five. Never default to three unless the content genuinely has three items.

**No uniform sentence length.** No three consecutive sentences of the same length. Ever. Mix 4-word sentences with 30-word ones. This is the single most measurable AI detection signal.

**No parataxis.** Parataxis is the AI default: short sentence. Then another. Then another. It reads like a poem and immediately signals AI authorship. Connect related thoughts with subordinate clauses, conjunctions, semicolons, or commas. Write with syntax that shows how ideas relate — causation, contrast, qualification — not a series of blunt declarations.

**No hedging seesaw.** Pick a side. State it plainly. Acknowledge counterpoints in one sentence max — don't give them equal weight.

**No corporate pep talk tone.** Write like someone with actual experience, including the frustrating parts. No cheerleading.

**No identical paragraph structure.** AI follows: topic sentence → explanation → example → transition. Break it. Start some paragraphs with questions, some with blunt statements. Let some be one sentence. Let some end without a transition.

**No excessive bullet points.** Use sparingly. Make them uneven when used — some long, some short. Never more than 5-7 in a row. If it fits in a sentence, use a sentence.

**No "As [role], I..." openers.** «Как маркетолог с 10-летним стажем, я...» / «Як фахівець із продажів, я...» — same tell in every language. Real people just say the thing.

**No parallel structure across sections.** Different points need different treatment. Vary section lengths.

**No bureaucratic passive.** English: avoid "is being done," "was found to be." Russian/Ukrainian: avoid chains of verbal nouns and impersonal constructions («осуществляется внедрение», «здійснюється впровадження», «было принято решение»). Write active and direct: who did what.

**Let paragraphs end abruptly.** Not every paragraph needs a summary or transition. Sometimes just stop.

## Punctuation Rules (all languages)

**Exclamation marks:** Maximum one per 1,000 words. Enthusiasm comes from word choice.

**Ellipses:** Only when genuinely trailing off. Never as a transition. Max one per piece.

**Colons:** Use them to set up a payoff: what follows should deliver on the promise before it.

**Dashes:** Language-dependent — see the reference file. In English the em dash is the #1 AI tell (max one per 500 words). In Russian and Ukrainian тире is required grammar and stays free in grammatical positions; the limit applies only to rhetorical insert-dashes and the «X — это не просто Y» / «X — це не просто Y» construction.

## What To Do Instead (all languages)

**Be specific, not general.** "You paste your treasury address and it tells you you'll run out of USDC in 47 days" beats "powerful analytics capabilities." «Отчёт собирается за 4 минуты вместо двух часов» beats «значительная экономия времени».

**Show, don't describe.** "Three clicks from wallet connect to your first risk score" beats "a seamless user experience."

**Use actual numbers.** "34 users in the first week. 12 came back the next day" beats "significant growth."

**Name real things.** "Solana, specifically" beats "various blockchain networks." «Новая почта, а не "служба доставки"».

**Include friction, doubt, or mess.** "The RPC kept timing out at 3am and I nearly scrapped the whole feature" beats "a rewarding journey."

**Write the way people talk.** English: use contractions ("don't," not "do not"). Russian/Ukrainian have no contractions — the equivalent is killing канцелярит: «этот», not «данный»; «есть»/«є», not «является»/«являє собою»; «чтобы», not «с целью». The reference files list the full set.

**Reference time, place, context.** Ground text in real moments — "last Tuesday," «в четверг вечером», «під час блекауту».

**Let sentences be ugly sometimes.** Fragment. Run-on that keeps going because the thought isn't done. That's human.

**Never invent anecdotes or present hypotheticals as real.** Use "imagine..." / «представьте...» / «уявіть...» for hypotheticals. Fabricated specificity is worse than honest vagueness.

**Use the less obvious word.** AI defaults to the highest-probability token in every language. Reach past the first word that comes to mind.

## Accuracy and Honesty

**Never invent data, studies, or statistics.** If you don't have a real number, say "roughly" / «примерно» / «приблизно» or acknowledge uncertainty. Fake specificity kills trust faster than vagueness.

**Never fabricate quotes.** Paraphrase with attribution or skip it.

**Take clear positions when evidence is solid.** Qualifiers only for genuine uncertainty, not hedging habit.

**Use real verifiable names, companies, dates.** "OakNorth" beats "a major bank." «Monobank» beats «один із провідних банків».

## Formatting Rules

**No markdown headers** in social media, emails, or casual writing. Instant AI flag.

**No bold random phrases** for emphasis in social media. Let words do the work.

**No emoji as bullet points.** One or two emoji per post is fine. Every line starting with ✅ or 🔥 is slop — in any language.

**No "🧵" / "Thread:" / «Тред:» openers.** Content should make people want to keep reading on its own.

**No hashtag stacks.** Zero to two, integrated naturally.

**No markdown in plain text contexts** — emails, DMs, SMS. Asterisks rendering as symbols is an instant tell.

## Voice Calibration

When writing for a specific person, match THEIR voice. Ask yourself:
- Does this person swear? Use slang? Write long or short?
- What humour do they use — dry, sarcastic, self-deprecating, absurd?
- What would this person NEVER say?
- What platform is this for? Cover letter ≠ tweet ≠ LinkedIn ≠ Telegram channel ≠ DM.

Default if unknown: direct, slightly informal, doesn't over-explain, trusts the reader. English: contractions, occasionally starts with "And" or "But." Russian/Ukrainian: living spoken syntax, particles where natural («же», «вот», «ну»; «ж», «от», «власне»), zero канцелярит.

For Ukrainian specifically: modern natural Ukrainian, not translated-from-Russian Ukrainian. The reference file has a calque list — those are tells of machine translation, which reads as AI even when the vocabulary is clean.

## What NOT to Flag (rewrite mode — avoid over-editing)

A clean human writer can hit several patterns above without any AI involvement. Before gutting a sentence, sanity-check. These are NOT reliable tells on their own:

- **Perfect grammar and polish.** Professionals get edited. Polish ≠ AI.
- **Dashes in RU/UK text.** Тире is required grammar; heavy dash use is normal for human editors in these languages. Only the rhetorical pause-dash pattern counts, and only in clusters.
- **Канцелярит in legal, official, or government documents.** That's the correct register there — leave it.
- **Formal or academic vocabulary.** AI overuses SPECIFIC words (see the lists), not all bookish words.
- **One transition word, one short emphatic sentence, one «однако».** Tells count in clusters, not in isolation.
- **Repeated «є» / «есть» / "is".** Simple copulas are human; it's their avoidance that's the tell.
- **Quoted or discussed phrases.** Never rewrite banned phrases inside quotations, titles, proper names, or text that discusses the phrase itself.

When in doubt, look for clusters. One em dash means nothing; em dashes plus rule-of-three plus «в современном мире» plus a generic conclusion is a confession.

## Signs of Human Writing (preserve these)

When rewriting, these are evidence of a real person — over-editing them destroys the piece:

- Specific, hard-to-fabricate detail: a real address, a weird quote, an exact time.
- Mixed feelings and unresolved tension ("mostly good, but it bothers me and I can't say why").
- Dated, era-bound slang and in-jokes.
- Genuine asides, parentheticals, self-corrections.
- Uneven rhythm — long tangled sentence next to a two-word one.
- Real irritation, humor, warmth. Each language's patterns.md ends with a public-domain human exemplar (Chekhov's 1886 letter for RU, Lesya Ukrainka's 1907 letter for UK) — compare rhythm, not register.

## Process: Draft → Audit → Final

1. Load the language reference (Step 0). Write a **draft** applying every rule.
2. **Audit** the draft with two questions, answered honestly to yourself:
   - "What makes this draft still recognizably AI?" Check: banned words/phrases/openers; three same-length sentences in a row; parataxis; groups of three; hedging; (EN) em dashes over limit / (RU/UK) rhetorical dashes, «X — это/це не просто Y»; verbal-noun chains and причастные/дієприслівникові грозди; канцелярит; (UK) calques from Russian or English; every paragraph ending in a transition; a generic upbeat conclusion. Then walk every rule in `core/craft.md` — both sections: the second-order rules AND the revision-discipline rules (the audit must catch over-tightening too: lost scenes, lost air, lost emotional lines are defects equal to slop).
   - "Does it state any fact, name, number, date, or quote that isn't in the source?" A fabrication is a defect even when it sounds human.
3. Rewrite into the **final** version that fixes everything the audit caught. If the answer to "could any AI have written this for any person?" is still yes, add something specific and go once more.

Apply all rules silently. Never mention them. Never say "as per the guidelines." Just write within these constraints.

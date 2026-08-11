/**
 * Punctuation budgets.
 *
 * The dash rule is where a naive port would go wrong. In English the em dash is
 * the most cited AI tell, so it gets a hard budget. In Russian and Ukrainian
 * тире is required grammar — «Киев — столица» is simply correct — so only two
 * things count: rhetorical inserted dashes above a rate, and the «X — это не
 * просто Y» construction. references/<lang>/rules.md states this outright.
 */

import { splitSentences, wordCount } from '../lib/tokenize.js';

const EM_DASH_PER_WORDS = 500;
const EXCLAMATION_PER_WORDS = 1000;
const MAX_ELLIPSES = 1;

const NOT_JUST = {
  en: /[\p{L}][^.!?\n]{0,40}\s+[—–]\s+it['’]s not just(?![\p{L}])[^.!?\n]{0,60}/giu,
  ru: /[^.!?\n]{2,40}\s+[—–]\s+это не просто(?![\p{L}])[^.!?\n]{0,60}/giu,
  uk: /[^.!?\n]{2,40}\s+[—–]\s+це не просто(?![\p{L}])[^.!?\n]{0,60}/giu,
};

// A spaced dash. Number ranges («5—7») have no spaces and never match.
const SPACED_DASH = /\s[—–]\s/gu;

// Words that follow a zero-copula dash: «X — это Y», «X — значить Y».
// \b is ASCII-only, so Cyrillic words need an explicit "no letter follows".
const COPULA_AFTER = /^\s*(это|це|значит|значить|означает|означає|ось)(?![\p{L}])/iu;

/**
 * Grammatical zero-copula dash in RU/UK: «Киев — столица». Approximated two
 * ways — the dash sits near the head of its clause, where the copula would be,
 * or it is followed by an explicit copula word. Everything else is treated as a
 * rhetorical pause, which is the only kind the skill budgets.
 */
function isGrammaticalDash(sentence, offsetInSentence) {
  if (COPULA_AFTER.test(sentence.slice(offsetInSentence + 1))) return true;
  const before = sentence.slice(0, offsetInSentence);
  const clause = before.split(/[,;:]/).pop() ?? before;
  return wordCount(before) <= 4 || wordCount(clause) <= 3;
}

export function punctuation(text, { lang }) {
  const findings = [];
  const total = wordCount(text);
  const sentences = splitSentences(text);

  // 1. em dashes
  if (lang === 'en') {
    const budget = Math.max(1, Math.floor(total / EM_DASH_PER_WORDS));
    const hits = [...text.matchAll(/[—–]/gu)];
    hits.slice(budget).forEach((m) => {
      findings.push({
        rule: 'em-dash',
        severity: 'high',
        start: m.index,
        end: m.index + m[0].length,
        message: `em dash over budget (${hits.length} in ${total} words, limit ${budget}) — the top English AI tell`,
      });
    });
  } else {
    const rhetorical = [];
    for (const sentence of sentences) {
      SPACED_DASH.lastIndex = 0;
      let m;
      while ((m = SPACED_DASH.exec(sentence.text)) !== null) {
        const dashAt = m.index + 1;
        if (isGrammaticalDash(sentence.text, dashAt)) continue;
        rhetorical.push({ start: sentence.start + dashAt, end: sentence.start + dashAt + 1 });
      }
    }
    const budget = Math.max(1, Math.floor(total / EM_DASH_PER_WORDS));
    rhetorical.slice(budget).forEach((hit) => {
      findings.push({
        rule: 'rhetorical-dash',
        severity: 'medium',
        start: hit.start,
        end: hit.end,
        message: `rhetorical dash over budget (${rhetorical.length} in ${total} words, limit ${budget}) — grammatical тире is free, dramatic pauses are not`,
      });
    });
  }

  // 2. «X — это не просто Y»
  const notJust = NOT_JUST[lang];
  if (notJust) {
    notJust.lastIndex = 0;
    let m;
    while ((m = notJust.exec(text)) !== null) {
      findings.push({
        rule: 'not-just-construction',
        severity: 'high',
        start: m.index,
        end: m.index + m[0].length,
        message: 'the "not just X — it\'s Y" construction, banned in every language module',
      });
    }
  }

  // 3. exclamation marks
  const bangs = [...text.matchAll(/!/g)];
  const bangBudget = Math.max(1, Math.floor(total / EXCLAMATION_PER_WORDS));
  bangs.slice(bangBudget).forEach((m) => {
    findings.push({
      rule: 'exclamation',
      severity: 'medium',
      start: m.index,
      end: m.index + 1,
      message: `exclamation marks over budget (${bangs.length} in ${total} words, limit ${bangBudget}) — enthusiasm comes from word choice`,
    });
  });

  // 4. ellipses
  const dots = [...text.matchAll(/\.{3}|…/gu)];
  dots.slice(MAX_ELLIPSES).forEach((m) => {
    findings.push({
      rule: 'ellipsis',
      severity: 'low',
      start: m.index,
      end: m.index + m[0].length,
      message: 'more than one ellipsis — use it only for genuinely trailing off, never as a transition',
    });
  });

  return findings;
}

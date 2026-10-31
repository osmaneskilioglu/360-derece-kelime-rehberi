// services/searchService.ts
import { mockVerbs } from '../data/mockVerbs';
import type { Verb, VerbForms, WordFamilyEntry } from '../types/verb';

/* -------------------------------------------------------------------------- */
/*  Tipler                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Aranan kelimenin fiille ilişkisi:
 *  - lemma:   sözlük hali (V1)
 *  - form:    çekim formu (V2, V3, 3. tekil, V-ing)
 *  - derived: kelime ailesinden türev (isim, sıfat, zarf, olumsuz haller)
 */
export type MatchKind = 'lemma' | 'form' | 'derived';

export interface VerbMatch {
  kind: MatchKind;
  /** Veride kayıtlı hâliyle kelime (büyük/küçük harf korunur) */
  matchedWord: string;
  /** Kelime hangi fiil formlarına denk geliyor? (decided → ['v2', 'v3']) */
  formKeys?: Array<keyof VerbForms>;
  /** Kelime ailesinde de yer alıyorsa ilgili kayıt (decided → sıfat) */
  familyEntry?: WordFamilyEntry;
}

export interface SearchResult {
  verb: Verb;
  match: VerbMatch;
}

export interface Suggestion {
  word: string;
  verbId: string;
  lemma: string;
  kind: MatchKind;
}

interface IndexEntry {
  verbId: string;
  match: VerbMatch;
}

export interface SearchIndex {
  verbsById: Map<string, Verb>;
  /** normalize edilmiş kelime → bu kelimeyi içeren fiil kayıtları */
  entriesByWord: Map<string, IndexEntry[]>;
  /** Önek araması için sıralı kelime listesi */
  sortedWords: string[];
}

/* -------------------------------------------------------------------------- */
/*  Normalizasyon                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Arama girdisini indeks anahtarına çevirir.
 *  - Türkçe klavyede otomatik büyük harfle gelen "İ" / "ı" karakterlerini i'ye çevirir
 *  - küçük harfe çevirir, fazla boşlukları temizler
 *  - baştaki "to " ekini atar ("to satisfy" → "satisfy")
 *  - uçlardaki noktalama ve rakamları temizler
 */
export function normalizeQuery(query: string): string {
  return query
    .replace(/İ/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^to /, '')
    .replace(/^[^a-z]+|[^a-z]+$/g, '');
}

/* -------------------------------------------------------------------------- */
/*  İndeks oluşturma                                                          */
/* -------------------------------------------------------------------------- */

const KIND_PRIORITY: Record<MatchKind, number> = {
  lemma: 0,
  form: 1,
  derived: 2,
};

interface Draft {
  raw: string;
  isLemma: boolean;
  formKeys: Array<keyof VerbForms>;
  familyEntry?: WordFamilyEntry;
}

export function buildSearchIndex(verbs: Verb[]): SearchIndex {
  const verbsById = new Map<string, Verb>();
  const entriesByWord = new Map<string, IndexEntry[]>();

  for (const verb of verbs) {
    verbsById.set(verb.id, verb);

    // Aynı fiil içinde aynı kelime birden çok yerde geçebilir
    // (decided = V2 = V3 = sıfat). Önce birleştiriyoruz.
    const drafts = new Map<string, Draft>();
    const draftFor = (raw: string): Draft | null => {
      const key = normalizeQuery(raw);
      if (!key) return null;
      let d = drafts.get(key);
      if (!d) {
        d = { raw, isLemma: false, formKeys: [] };
        drafts.set(key, d);
      }
      return d;
    };

    const lemmaDraft = draftFor(verb.lemma);
    if (lemmaDraft) lemmaDraft.isLemma = true;

    (Object.keys(verb.forms) as Array<keyof VerbForms>).forEach((formKey) => {
      const d = draftFor(verb.forms[formKey]);
      if (d) d.formKeys.push(formKey);
    });

    for (const entry of verb.wordFamily) {
      const d = draftFor(entry.word);
      if (d && !d.familyEntry) d.familyEntry = entry;
    }

    drafts.forEach((d, key) => {
      const kind: MatchKind =
        d.isLemma || d.formKeys.includes('v1')
          ? 'lemma'
          : d.formKeys.length > 0
            ? 'form'
            : 'derived';

      const match: VerbMatch = { kind, matchedWord: d.raw };
      if (d.formKeys.length > 0) match.formKeys = d.formKeys;
      if (d.familyEntry) match.familyEntry = d.familyEntry;

      const list = entriesByWord.get(key);
      if (list) list.push({ verbId: verb.id, match });
      else entriesByWord.set(key, [{ verbId: verb.id, match }]);
    });
  }

  const sortedWords = Array.from(entriesByWord.keys()).sort();
  return { verbsById, entriesByWord, sortedWords };
}

/** Mock veriden ilk kullanımda (lazy) oluşturulan varsayılan indeks. */
let defaultIndex: SearchIndex | null = null;

export function getDefaultIndex(): SearchIndex {
  if (!defaultIndex) defaultIndex = buildSearchIndex(mockVerbs);
  return defaultIndex;
}

/* -------------------------------------------------------------------------- */
/*  Arama                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Yazılan kelimeyle eşleşen tüm fiil kayıtlarını döndürür.
 * Bir kelime birden çok fiile ait olabilir (ör. "found": find'ın V2'si, found'un V1'i),
 * bu yüzden sonuç bir listedir. Sıralama: lemma > çekim formu > türev.
 */
export function searchVerbs(
  query: string,
  index: SearchIndex = getDefaultIndex(),
): SearchResult[] {
  const key = normalizeQuery(query);
  if (!key) return [];

  const entries = index.entriesByWord.get(key);
  if (!entries) return [];

  const results: SearchResult[] = [];
  for (const entry of entries) {
    const verb = index.verbsById.get(entry.verbId);
    if (verb) results.push({ verb, match: entry.match });
  }

  return results.sort(
    (a, b) =>
      KIND_PRIORITY[a.match.kind] - KIND_PRIORITY[b.match.kind] ||
      a.verb.lemma.localeCompare(b.verb.lemma),
  );
}

/** En iyi tek eşleşmeyi döndürür; bulunamazsa null. */
export function findVerb(
  query: string,
  index: SearchIndex = getDefaultIndex(),
): SearchResult | null {
  return searchVerbs(query, index)[0] ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Otomatik tamamlama                                                        */
/* -------------------------------------------------------------------------- */

const MAX_SCAN = 100;

/** sorted içinde target'tan küçük olmayan ilk elemanın konumu */
function lowerBound(sorted: string[], target: string): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Yazılan önekle başlayan kelimeleri önerir.
 * Sıralama: lemma > çekim formu > türev; eşitlikte kısa kelime önce.
 */
export function getSuggestions(
  query: string,
  limit = 8,
  index: SearchIndex = getDefaultIndex(),
): Suggestion[] {
  const prefix = normalizeQuery(query);
  if (!prefix) return [];

  const { sortedWords, entriesByWord, verbsById } = index;
  const found: Suggestion[] = [];

  for (
    let i = lowerBound(sortedWords, prefix);
    i < sortedWords.length && sortedWords[i].startsWith(prefix);
    i++
  ) {
    const word = sortedWords[i];
    for (const entry of entriesByWord.get(word) ?? []) {
      const verb = verbsById.get(entry.verbId);
      if (verb) {
        found.push({
          word: entry.match.matchedWord,
          verbId: verb.id,
          lemma: verb.lemma,
          kind: entry.match.kind,
        });
      }
    }
    if (found.length >= MAX_SCAN) break;
  }

  return found
    .sort(
      (a, b) =>
        KIND_PRIORITY[a.kind] - KIND_PRIORITY[b.kind] ||
        a.word.length - b.word.length ||
        a.word.localeCompare(b.word),
    )
    .slice(0, limit);
}
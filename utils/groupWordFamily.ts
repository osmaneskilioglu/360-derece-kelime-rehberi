// utils/groupWordFamily.ts
import type { Verb, WordFamilyEntry, WordPartOfSpeech } from '../types/verb';

/** Kelime ailesi kaydı; ana fiilin kendisi için sentetik kayıtta isRoot = true */
export interface FamilyItem extends WordFamilyEntry {
  isRoot?: boolean;
}

/**
 * Bir zıtlık kartı:
 *  - positive + negatives: eşleşmiş çift (satisfied ↔ dissatisfied, unsatisfied)
 *  - positive + []:        zıt karşılığı olmayan olumlu kelime
 *  - null + [negative]:    olumlu karşılığı bulunamayan olumsuz kelime
 */
export interface FamilyGroup {
  key: string;
  positive: FamilyItem | null;
  negatives: FamilyItem[];
}

export interface FamilySection {
  partOfSpeech: WordPartOfSpeech;
  groups: FamilyGroup[];
}

export const SECTION_ORDER: readonly WordPartOfSpeech[] = [
  'noun',
  'adjective',
  'adverb',
  'verb',
];

/**
 * verb.wordFamily listesini kelime türüne göre bölümlere ayırır ve
 * negationOf ilişkisine göre olumlu/olumsuz çiftleri eşleştirir.
 *
 *  - Bir olumlu kelimenin birden çok olumsuz karşılığı olabilir.
 *  - negationOf ana fiilin id'sini gösteriyorsa (dissatisfy → satisfy),
 *    ana fiil "Fiiller" bölümünün başına sentetik bir olumlu kayıt olarak eklenir.
 *  - Çift, olumlu kelimenin bölümünde yer alır.
 */
export function groupWordFamily(verb: Verb): FamilySection[] {
  const root: FamilyItem = {
    id: verb.id,
    word: verb.lemma,
    partOfSpeech: 'verb',
    polarity: 'positive',
    meaningTr: verb.meaningTr[0] ?? '',
    example: '',
    isRoot: true,
  };

  const byId = new Map<string, FamilyItem>();
  for (const entry of verb.wordFamily) byId.set(entry.id, entry);

  const resolve = (id?: string): FamilyItem | undefined => {
    if (!id) return undefined;
    return byId.get(id) ?? (id === verb.id ? root : undefined);
  };

  // Olumsuz kelimeleri hedefledikleri olumlu kelimeye bağla
  const negativesByTarget = new Map<string, FamilyItem[]>();
  const orphans: FamilyItem[] = [];

  for (const entry of verb.wordFamily) {
    if (entry.polarity !== 'negative') continue;
    const target = resolve(entry.negationOf);
    if (target && target.polarity === 'positive') {
      const list = negativesByTarget.get(target.id);
      if (list) list.push(entry);
      else negativesByTarget.set(target.id, [entry]);
    } else {
      orphans.push(entry);
    }
  }

  const groupsByPos = new Map<WordPartOfSpeech, FamilyGroup[]>();
  const add = (pos: WordPartOfSpeech, group: FamilyGroup) => {
    const list = groupsByPos.get(pos);
    if (list) list.push(group);
    else groupsByPos.set(pos, [group]);
  };

  // Ana fiil, yalnızca bir olumsuz türevin karşılığıysa gösterilir
  const rootNegatives = negativesByTarget.get(root.id);
  if (rootNegatives && !byId.has(root.id)) {
    add('verb', { key: `${root.id}:root`, positive: root, negatives: rootNegatives });
  }

  for (const entry of verb.wordFamily) {
    if (entry.polarity !== 'positive') continue;
    add(entry.partOfSpeech, {
      key: entry.id,
      positive: entry,
      negatives: negativesByTarget.get(entry.id) ?? [],
    });
  }

  for (const entry of orphans) {
    add(entry.partOfSpeech, { key: entry.id, positive: null, negatives: [entry] });
  }

  return SECTION_ORDER.filter((pos) => groupsByPos.has(pos)).map((pos) => ({
    partOfSpeech: pos,
    groups: groupsByPos.get(pos) ?? [],
  }));
}
// services/searchService.ts
import type { Verb, TenseConjugation, VerbForms } from '../types/verb';

import pronounsData from '../data/pronounsDatabase.json';
import prepositionsData from '../data/prepositionsDatabase.json';
import conjunctionsData from '../data/conjunctionsDatabase.json';
import verbsData from '../data/verbs.json';
import verbsDbData from '../data/verbsDatabase.json';
import adjectivesData from '../data/adjectivesDatabase.json';
import nounsData from '../data/nounsDatabase.json';
import phrasesData from '../data/phrasesDatabase.json';

const SUBJECT = {
  I: 'I',
  heSheIt: 'he/she/it',
  youWeThey: 'you/we/they',
};

export function buildTenses(forms?: VerbForms): TenseConjugation[] {
  if (!forms || !forms.v1) return [];
  const { v1, v2, v3, thirdPersonSingular, presentParticiple } = forms;
  const sForm = thirdPersonSingular || `${v1}s`;
  const ing = presentParticiple || `${v1}ing`;
  const past = v2 || `${v1}ed`;
  const pp = v3 || past;

  return [
    {
      id: 'present_simple', time: 'present', aspect: 'simple', name: 'Present Simple', nameTr: 'Geniş Zaman',
      formula: 'S + V1 / V-(s)',
      forms: {
        affirmative: { I: `${SUBJECT.I} ${v1}`, heSheIt: `${SUBJECT.heSheIt} ${sForm}`, youWeThey: `${SUBJECT.youWeThey} ${v1}` },
        negative: { I: `${SUBJECT.I} don't ${v1}`, heSheIt: `${SUBJECT.heSheIt} doesn't ${v1}`, youWeThey: `${SUBJECT.youWeThey} don't ${v1}` },
        interrogative: { I: `Do ${SUBJECT.I} ${v1}?`, heSheIt: `Does ${SUBJECT.heSheIt} ${v1}?`, youWeThey: `Do ${SUBJECT.youWeThey} ${v1}?` }
      }
    },
    {
      id: 'present_continuous', time: 'present', aspect: 'continuous', name: 'Present Continuous', nameTr: 'Şimdiki Zaman',
      formula: 'S + am/is/are + V-ing',
      forms: {
        affirmative: { I: `${SUBJECT.I} am ${ing}`, heSheIt: `${SUBJECT.heSheIt} is ${ing}`, youWeThey: `${SUBJECT.youWeThey} are ${ing}` },
        negative: { I: `${SUBJECT.I} am not ${ing}`, heSheIt: `${SUBJECT.heSheIt} isn't ${ing}`, youWeThey: `${SUBJECT.youWeThey} aren't ${ing}` },
        interrogative: { I: `Am ${SUBJECT.I} ${ing}?`, heSheIt: `Is ${SUBJECT.heSheIt} ${ing}?`, youWeThey: `Are ${SUBJECT.youWeThey} ${ing}?` }
      }
    },
    {
      id: 'present_perfect', time: 'present', aspect: 'perfect', name: 'Present Perfect', nameTr: 'Yakın Geçmiş Zaman',
      formula: 'S + have/has + V3',
      forms: {
        affirmative: { I: `${SUBJECT.I} have ${pp}`, heSheIt: `${SUBJECT.heSheIt} has ${pp}`, youWeThey: `${SUBJECT.youWeThey} have ${pp}` },
        negative: { I: `${SUBJECT.I} haven't ${pp}`, heSheIt: `${SUBJECT.heSheIt} hasn't ${pp}`, youWeThey: `${SUBJECT.youWeThey} haven't ${pp}` },
        interrogative: { I: `Have ${SUBJECT.I} ${pp}?`, heSheIt: `Has ${SUBJECT.heSheIt} ${pp}?`, youWeThey: `Have ${SUBJECT.youWeThey} ${pp}?` }
      }
    },
    {
      id: 'present_perfect_continuous', time: 'present', aspect: 'perfectContinuous' as any, name: 'Present Perfect Continuous', nameTr: 'Süregelen Yakın Geçmiş',
      formula: 'S + have/has been + V-ing',
      forms: {
        affirmative: { I: `${SUBJECT.I} have been ${ing}`, heSheIt: `${SUBJECT.heSheIt} has been ${ing}`, youWeThey: `${SUBJECT.youWeThey} have been ${ing}` },
        negative: { I: `${SUBJECT.I} haven't been ${ing}`, heSheIt: `${SUBJECT.heSheIt} hasn't been ${ing}`, youWeThey: `${SUBJECT.youWeThey} haven't been ${ing}` },
        interrogative: { I: `Have ${SUBJECT.I} been ${ing}?`, heSheIt: `Has ${SUBJECT.heSheIt} been ${ing}?`, youWeThey: `Have ${SUBJECT.youWeThey} been ${ing}?` }
      }
    },
    {
      id: 'past_simple', time: 'past', aspect: 'simple', name: 'Past Simple', nameTr: 'Geçmiş Zaman (-di)',
      formula: 'S + V2',
      forms: {
        affirmative: { I: `${SUBJECT.I} ${past}`, heSheIt: `${SUBJECT.heSheIt} ${past}`, youWeThey: `${SUBJECT.youWeThey} ${past}` },
        negative: { I: `${SUBJECT.I} didn't ${v1}`, heSheIt: `${SUBJECT.heSheIt} didn't ${v1}`, youWeThey: `${SUBJECT.youWeThey} didn't ${v1}` },
        interrogative: { I: `Did ${SUBJECT.I} ${v1}?`, heSheIt: `Did ${SUBJECT.heSheIt} ${v1}?`, youWeThey: `Did ${SUBJECT.youWeThey} ${v1}?` }
      }
    },
    {
      id: 'past_continuous', time: 'past', aspect: 'continuous', name: 'Past Continuous', nameTr: 'Geçmişte Süregelen Zaman',
      formula: 'S + was/were + V-ing',
      forms: {
        affirmative: { I: `${SUBJECT.I} was ${ing}`, heSheIt: `${SUBJECT.heSheIt} was ${ing}`, youWeThey: `${SUBJECT.youWeThey} were ${ing}` },
        negative: { I: `${SUBJECT.I} wasn't ${ing}`, heSheIt: `${SUBJECT.heSheIt} wasn't ${ing}`, youWeThey: `${SUBJECT.youWeThey} weren't ${ing}` },
        interrogative: { I: `Was ${SUBJECT.I} ${ing}?`, heSheIt: `Was ${SUBJECT.heSheIt} ${ing}?`, youWeThey: `Were ${SUBJECT.youWeThey} ${ing}?` }
      }
    },
    {
      id: 'past_perfect', time: 'past', aspect: 'perfect', name: 'Past Perfect', nameTr: 'Mişli Geçmiş Zaman',
      formula: 'S + had + V3',
      forms: {
        affirmative: { I: `${SUBJECT.I} had ${pp}`, heSheIt: `${SUBJECT.heSheIt} had ${pp}`, youWeThey: `${SUBJECT.youWeThey} had ${pp}` },
        negative: { I: `${SUBJECT.I} hadn't ${pp}`, heSheIt: `${SUBJECT.heSheIt} hadn't ${pp}`, youWeThey: `${SUBJECT.youWeThey} hadn't ${pp}` },
        interrogative: { I: `Had ${SUBJECT.I} ${pp}?`, heSheIt: `Had ${SUBJECT.heSheIt} ${pp}?`, youWeThey: `Had ${SUBJECT.youWeThey} ${pp}?` }
      }
    },
    {
      id: 'past_perfect_continuous', time: 'past', aspect: 'perfectContinuous' as any, name: 'Past Perfect Continuous', nameTr: 'Geçmişte Süregelen Öncelik',
      formula: 'S + had been + V-ing',
      forms: {
        affirmative: { I: `${SUBJECT.I} had been ${ing}`, heSheIt: `${SUBJECT.heSheIt} had been ${ing}`, youWeThey: `${SUBJECT.youWeThey} had been ${ing}` },
        negative: { I: `${SUBJECT.I} hadn't been ${ing}`, heSheIt: `${SUBJECT.heSheIt} hadn't been ${ing}`, youWeThey: `${SUBJECT.youWeThey} hadn't been ${ing}` },
        interrogative: { I: `Had ${SUBJECT.I} been ${ing}?`, heSheIt: `Had ${SUBJECT.heSheIt} been ${ing}?`, youWeThey: `Had ${SUBJECT.youWeThey} been ${ing}?` }
      }
    },
    {
      id: 'future_simple', time: 'future', aspect: 'simple', name: 'Future Simple (Will)', nameTr: 'Gelecek Zaman (Will)',
      formula: 'S + will + V1',
      forms: {
        affirmative: { I: `${SUBJECT.I} will ${v1}`, heSheIt: `${SUBJECT.heSheIt} will ${v1}`, youWeThey: `${SUBJECT.youWeThey} will ${v1}` },
        negative: { I: `${SUBJECT.I} won't ${v1}`, heSheIt: `${SUBJECT.heSheIt} won't ${v1}`, youWeThey: `${SUBJECT.youWeThey} won't ${v1}` },
        interrogative: { I: `Will ${SUBJECT.I} ${v1}?`, heSheIt: `Will ${SUBJECT.heSheIt} ${v1}?`, youWeThey: `Will ${SUBJECT.youWeThey} ${v1}?` }
      }
    },
    {
      id: 'future_going_to', time: 'future', aspect: 'simple' as any, name: 'Be Going To Future', nameTr: 'Planlı Gelecek Zaman (Going to)',
      formula: 'S + am/is/are going to + V1',
      forms: {
        affirmative: { I: `${SUBJECT.I} am going to ${v1}`, heSheIt: `${SUBJECT.heSheIt} is going to ${v1}`, youWeThey: `${SUBJECT.youWeThey} are going to ${v1}` },
        negative: { I: `${SUBJECT.I} am not going to ${v1}`, heSheIt: `${SUBJECT.heSheIt} isn't going to ${v1}`, youWeThey: `${SUBJECT.youWeThey} aren't going to ${v1}` },
        interrogative: { I: `Am ${SUBJECT.I} going to ${v1}?`, heSheIt: `Is ${SUBJECT.heSheIt} going to ${v1}?`, youWeThey: `Are ${SUBJECT.youWeThey} going to ${v1}?` }
      }
    },
    {
      id: 'future_continuous', time: 'future', aspect: 'continuous', name: 'Future Continuous', nameTr: 'Gelecekte Süregelen Zaman',
      formula: 'S + will be + V-ing',
      forms: {
        affirmative: { I: `${SUBJECT.I} will be ${ing}`, heSheIt: `${SUBJECT.heSheIt} will be ${ing}`, youWeThey: `${SUBJECT.youWeThey} will be ${ing}` },
        negative: { I: `${SUBJECT.I} won't be ${ing}`, heSheIt: `${SUBJECT.heSheIt} won't be ${ing}`, youWeThey: `${SUBJECT.youWeThey} won't be ${ing}` },
        interrogative: { I: `Will ${SUBJECT.I} be ${ing}?`, heSheIt: `Will ${SUBJECT.heSheIt} be ${ing}?`, youWeThey: `Will ${SUBJECT.youWeThey} be ${ing}?` }
      }
    },
    {
      id: 'future_perfect', time: 'future', aspect: 'perfect', name: 'Future Perfect', nameTr: 'Gelecekte Tamamlanmış Zaman',
      formula: 'S + will have + V3',
      forms: {
        affirmative: { I: `${SUBJECT.I} will have ${pp}`, heSheIt: `${SUBJECT.heSheIt} will have ${pp}`, youWeThey: `${SUBJECT.youWeThey} will have ${pp}` },
        negative: { I: `${SUBJECT.I} won't have ${pp}`, heSheIt: `${SUBJECT.heSheIt} won't have ${pp}`, youWeThey: `${SUBJECT.youWeThey} won't have ${pp}` },
        interrogative: { I: `Will ${SUBJECT.I} have ${pp}?`, heSheIt: `Will ${SUBJECT.heSheIt} have ${pp}?`, youWeThey: `Will ${SUBJECT.youWeThey} have ${pp}?` }
      }
    },
    {
      id: 'future_perfect_continuous', time: 'future', aspect: 'perfectContinuous' as any, name: 'Future Perfect Continuous', nameTr: 'Gelecekte Süregelen Tamamlanmış',
      formula: 'S + will have been + V-ing',
      forms: {
        affirmative: { I: `${SUBJECT.I} will have been ${ing}`, heSheIt: `${SUBJECT.heSheIt} will have been ${ing}`, youWeThey: `${SUBJECT.youWeThey} will have been ${ing}` },
        negative: { I: `${SUBJECT.I} won't have been ${ing}`, heSheIt: `${SUBJECT.heSheIt} won't have been ${ing}`, youWeThey: `${SUBJECT.youWeThey} won't have been ${ing}` },
        interrogative: { I: `Will ${SUBJECT.I} have been ${ing}?`, heSheIt: `Will ${SUBJECT.heSheIt} have been ${ing}?`, youWeThey: `Will ${SUBJECT.youWeThey} have been ${ing}?` }
      }
    }
  ];
}

// Önce Fiiller (Verbs) gelecek şekilde tüm veritabanlarını birleştiriyoruz
const rawList: (Verb & { categoryType: string })[] = [
  ...(verbsData as any[]).map(item => ({ ...item, tenses: buildTenses(item.forms), categoryType: 'Fiil (Verb)' })),
  ...(Array.isArray(verbsDbData) ? (verbsDbData as any[]).map(item => ({ ...item, tenses: buildTenses(item.forms), categoryType: 'Fiil (Verb)' })) : []),
  ...(nounsData as any[]).map(item => ({ ...item, categoryType: 'İsim (Noun)' })),
  ...(adjectivesData as any[]).map(item => ({ ...item, categoryType: 'Sıfat / Zarf' })),
  ...(pronounsData as any[]).map(item => ({ ...item, categoryType: 'Zamir (Pronoun)' })),
  ...(prepositionsData as any[]).map(item => ({ ...item, categoryType: 'Edat (Preposition)' })),
  ...(conjunctionsData as any[]).map(item => ({ ...item, categoryType: 'Bağlaç (Conjunction)' })),
  ...(Array.isArray(phrasesData) ? (phrasesData as any[]).map(item => ({ ...item, categoryType: 'Kalıp / Deyim' })) : []),
];

const seenLemmas = new Set<string>();
export const ALL_WORDS: (Verb & { categoryType: string })[] = rawList.filter(item => {
  if (!item || !item.lemma) return false;
  const key = `${item.lemma.toLowerCase()}_${item.categoryType}`;
  if (seenLemmas.has(key)) return false;
  seenLemmas.add(key);
  return true;
});

export function searchWords(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_WORDS.slice(0, 40);

  return ALL_WORDS.filter(w =>
    w.lemma.toLowerCase().includes(q) ||
    w.forms?.v2?.toLowerCase().includes(q) ||
    w.forms?.v3?.toLowerCase().includes(q) ||
    w.meaningTr?.some((m: string) => m.toLowerCase().includes(q)) ||
    w.wordFamily?.some((f: any) => f.word.toLowerCase().includes(q))
  );
}
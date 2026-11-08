// types/verb.ts

export type PersonGroup = 'I' | 'heSheIt' | 'youWeThey';

export interface Sense {
  category: 'verb' | 'noun' | 'adjective';
  titleTr: string;
  descriptionTr?: string;
  exampleEn?: string;
  exampleTr?: string;
}

export interface PhrasalVerb {
  phrase: string;
  meaningTr: string;
  exampleEn: string;
  exampleTr: string;
}

export interface Idiom {
  idiom: string;
  meaningTr: string;
  exampleEn: string;
  exampleTr: string;
}

export interface Collocation {
  collocation: string;
  meaningTr: string;
  usageNote?: string;
  exampleEn: string;
  exampleTr: string;
}

export interface WordFamilyMember {
  id: string;
  word: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  polarity: 'positive' | 'negative';
  negationOf?: string;
  affixes?: {
    prefix?: string;
    suffix?: string;
  };
  meaningTr: string;
  example: string;
  note?: string;
}

export interface VerbForms {
  v1: string;
  v2: string;
  v3: string;
  thirdPersonSingular: string;
  presentParticiple: string;
}

export interface TenseFormDetail {
  I: string;
  heSheIt: string;
  youWeThey: string;
}

export interface TenseConjugation {
  id: string;
  time: 'present' | 'past' | 'future';
  aspect: 'simple' | 'continuous' | 'perfect' | 'perfectContinuous' | 'perfect_continuous' | 'going_to' | string;
  name: string;
  nameTr: string;
  formula: string;
  forms: {
    affirmative: TenseFormDetail;
    negative: TenseFormDetail;
    interrogative: TenseFormDetail;
  };
}

export interface Verb {
  id: string;
  lemma: string;
  ipa: string;
  meaningTr: string[];
  isRegular: boolean;
  transitivity: 'transitive' | 'intransitive' | 'both';
  forms: VerbForms;
  spellingNotes?: string[];
  wordFamily: WordFamilyMember[];
  senses: Sense[]; // Zorunlu alan
  phrasalVerbs?: PhrasalVerb[];
  idioms?: Idiom[];
  collocations?: Collocation[];
  tenses?: TenseConjugation[];
}
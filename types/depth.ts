// types/depth.ts

export type ToneKind = 'positive' | 'neutral' | 'negative';

export type RegisterLevel =
  | 'very_formal'
  | 'formal'
  | 'neutral'
  | 'informal'
  | 'slang';

export type DomainKey =
  | 'law'
  | 'medicine'
  | 'science'
  | 'math_cs'
  | 'literature_art'
  | 'business_finance'
  | 'sports'
  | 'other';

export type CultureKind = 'film' | 'tv' | 'song' | 'book' | 'speech' | 'other';

export interface Etymology {
  rootForm: string;
  originLanguage: string;
  rootMeaningTr: string;
  components?: { part: string; meaningTr: string }[];
  path?: { language: string; form: string }[];
  storyTr?: string;
  relatedWords?: { word: string; noteTr: string }[];
}

export interface MorphologyDepth {
  affixes: {
    affix: string;
    kind: 'prefix' | 'suffix';
    functionTr: string;
    examples: string[];
  }[];
  noteTr?: string;
}

export interface SemanticsDepth {
  synonyms: { word: string; nuanceTr: string }[];
  antonyms: { word: string; noteTr?: string }[];
  confusables: { word: string; differenceTr: string; exampleEn?: string }[];
}

export interface UsageDepth {
  collocations: { pattern: string; meaningTr?: string; exampleEn: string }[];
  idioms: {
    phrase: string;
    kind: 'idiom' | 'proverb';
    meaningTr: string;
    exampleEn: string;
    exampleTr?: string;
    noteTr?: string;
  }[];
  slang: { phrase: string; meaningTr: string; noteTr?: string }[];
}

export interface DomainUsage {
  domain: DomainKey;
  termTr?: string;
  meaningTr: string;
  exampleEn: string;
}

export interface ToneDepth {
  tone: ToneKind;
  toneNoteTr: string;
  register: RegisterLevel;
  registerNoteTr?: string;
  compare?: { word: string; tone: ToneKind; register: RegisterLevel }[];
}

export interface PhoneticsDepth {
  ipaUs?: string;
  ipaUk?: string;
  syllables: string[];
  stressedSyllable: number;
  stressNoteTr?: string;
  rhymes: string[];
  rhymeNoteTr?: string;
}

export interface CultureReference {
  kind: CultureKind;
  title: string;
  year?: number;
  contextTr: string;
}

export interface WordDepth {
  id: string;
  lemma: string;
  review?: 'draft' | 'reviewed';
  sources?: string[];
  etymology?: Etymology;
  morphology?: MorphologyDepth;
  semantics?: SemanticsDepth;
  usage?: UsageDepth;
  domains?: DomainUsage[];
  tone?: ToneDepth;
  phonetics?: PhoneticsDepth;
  culture?: CultureReference[];
}
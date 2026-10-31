// types/verb.ts

/* -------------------------------------------------------------------------- */
/*  Temel tipler                                                              */
/* -------------------------------------------------------------------------- */

/** Kelime türü */
export type WordPartOfSpeech = 'verb' | 'noun' | 'adjective' | 'adverb';

/** Olumlu (kök anlamı taşıyan) veya olumsuz / zıt anlamlı türev */
export type Polarity = 'positive' | 'negative';

export type Transitivity = 'transitive' | 'intransitive' | 'both';

/* -------------------------------------------------------------------------- */
/*  Fiil formları (V1 / V2 / V3 ...)                                          */
/* -------------------------------------------------------------------------- */

export interface VerbForms {
  /** V1 – yalın hal (decide) */
  v1: string;
  /** V2 – past simple (decided) */
  v2: string;
  /** V3 – past participle (decided) */
  v3: string;
  /** he/she/it için Present Simple (decides) */
  thirdPersonSingular: string;
  /** V-ing – present participle (deciding) */
  presentParticiple: string;
}

/* -------------------------------------------------------------------------- */
/*  Zaman çekimleri                                                           */
/* -------------------------------------------------------------------------- */

/** Çekim tablosunda kullanılan özne grupları */
export type PersonGroup = 'I' | 'heSheIt' | 'youWeThey';

/** Cümle tipi */
export type SentenceType = 'affirmative' | 'negative' | 'interrogative';

export type TenseTime = 'present' | 'past' | 'future';
export type TenseAspect =
  | 'simple'
  | 'continuous'
  | 'perfect'
  | 'perfectContinuous';

/** Örn. "present_simple", "past_perfectContinuous" */
export type TenseId = `${TenseTime}_${TenseAspect}`;

/** Her özne grubu için bir cümle */
export type PersonForms = Record<PersonGroup, string>;

/** Olumlu / olumsuz / soru × özne grupları */
export type TenseForms = Record<SentenceType, PersonForms>;

export interface TenseConjugation {
  id: TenseId;
  time: TenseTime;
  aspect: TenseAspect;
  /** İngilizce ad, örn. "Present Perfect Continuous" */
  name: string;
  /** Türkçe karşılık (yaklaşık) */
  nameTr: string;
  /** Kalıp, örn. "S + have/has + been + V-ing" */
  formula: string;
  forms: TenseForms;
}

/* -------------------------------------------------------------------------- */
/*  Kelime ailesi (türetilmiş kelimeler)                                      */
/* -------------------------------------------------------------------------- */

export interface Affixes {
  prefix?: string; // "un", "dis", "in" ...
  suffix?: string; // "ion", "ive", "ly" ...
}

export interface WordFamilyEntry {
  /** Verb içinde benzersiz id (genelde kelimenin kendisi) */
  id: string;
  word: string;
  partOfSpeech: WordPartOfSpeech;
  polarity: Polarity;
  /**
   * Olumsuz/zıt bir kelimenin karşılığı olan olumlu kelimenin id'si.
   * Fiilin kendisine referans için Verb.id kullanılabilir (örn. "satisfy").
   */
  negationOf?: string;
  affixes?: Affixes;
  /** Kısa Türkçe anlam */
  meaningTr: string;
  /** Örnek İngilizce cümle */
  example: string;
  /** Yazım / kök değişimi gibi notlar */
  note?: string;
  /** Opsiyonel IPA telaffuzu */
  ipa?: string;
}

/* -------------------------------------------------------------------------- */
/*  Detaylı Anlamlar, Phrasal Verbs ve Deyimler (Idioms)                      */
/* -------------------------------------------------------------------------- */

export interface DetailedSense {
  category: 'verb' | 'noun';
  titleTr: string;
  descriptionTr: string;
  exampleEn: string;
  exampleTr: string;
}

export interface PhrasalVerbEntry {
  phrase: string;
  meaningTr: string;
  exampleEn: string;
  exampleTr: string;
}

export interface IdiomEntry {
  idiom: string;
  meaningTr: string;
  exampleEn: string;
  exampleTr: string;
}

/* -------------------------------------------------------------------------- */
/*  Ana fiil kaydı                                                            */
/* -------------------------------------------------------------------------- */

export interface Verb {
  /** Benzersiz id, genelde lemma ile aynı (küçük harf) */
  id: string;
  /** Sözlük hali (V1) */
  lemma: string;
  ipa?: string;
  /** Türkçe anlamlar */
  meaningTr: string[];
  isRegular: boolean;
  transitivity?: Transitivity;
  forms: VerbForms;
  /** Yazım kuralı açıklamaları (y → ied, sondaki e düşer ...) */
  spellingNotes?: string[];
  /** 12 zaman × (olumlu/olumsuz/soru) × özne grupları */
  tenses: TenseConjugation[];
  /** İsim, sıfat, zarf ve bunların olumsuz/zıt halleri (düz liste) */
  wordFamily: WordFamilyEntry[];
  /** Fiil ve İsim olarak detaylı anlam katmanları */
  senses?: DetailedSense[];
  /** Sık kullanılan Phrasal Verb yapıları */
  phrasalVerbs?: PhrasalVerbEntry[];
  /** Sık kullanılan Deyimler (Idioms) */
  idioms?: IdiomEntry[];
}

/* -------------------------------------------------------------------------- */
/*  Yardımcı tipler                                                           */
/* -------------------------------------------------------------------------- */

export type VerbDatabase = Verb[];
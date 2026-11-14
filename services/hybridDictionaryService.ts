// services/hybridDictionaryService.ts
import type { Verb, VerbForms } from '../types/verb';
import type { WordDepth } from '../types/depth';
import { buildTenses } from './searchService';

const STORAGE_KEY = '@user_saved_words_v1';

// Bellekte tutulan kullanıcı kelimeleri (Uygulama açıkken anında erişim için)
let memorySavedWords: Record<string, { verb: Verb & { categoryType: string }; depth: WordDepth }> = {};

// AsyncStorage varsa dinamik yükler, yoksa bellekte çalışır (Hata vermez)
async function getStorage() {
  try {
    const mod = await import('@react-native-async-storage/async-storage');
    return mod.default;
  } catch {
    return null;
  }
}

/**
 * Uygulama açılışında kullanıcının daha önce "Lokale Ekle" dediği kelimeleri yükler.
 */
export async function loadUserSavedWords(): Promise<typeof memorySavedWords> {
  try {
    const storage = await getStorage();
    if (storage) {
      const raw = await storage.getItem(STORAGE_KEY);
      if (raw) {
        memorySavedWords = JSON.parse(raw);
      }
    }
  } catch (e) {
    console.warn('Lokal kelimeler yüklenemedi:', e);
  }
  return memorySavedWords;
}

/**
 * Kullanıcının istediği bir kelimeyi (Online veya Offline) cihazın lokal veritabanına kaydeder.
 */
export async function saveWordToLocal(
  verb: Verb & { categoryType?: string },
  depth?: WordDepth
): Promise<void> {
  const key = verb.lemma.toLowerCase();
  memorySavedWords[key] = {
    verb: { ...verb, categoryType: verb.categoryType || 'Kişisel Sözlük' },
    depth: depth || {
      id: verb.id || key,
      lemma: verb.lemma,
      review: 'reviewed',
    },
  };

  try {
    const storage = await getStorage();
    if (storage) {
      await storage.setItem(STORAGE_KEY, JSON.stringify(memorySavedWords));
    }
  } catch (e) {
    console.warn('Kelime lokale kaydedilemedi:', e);
  }
}

/**
 * Kelimeyi lokal kayıtlardan kaldırır.
 */
export async function removeWordFromLocal(lemma: string): Promise<void> {
  const key = lemma.toLowerCase();
  delete memorySavedWords[key];
  try {
    const storage = await getStorage();
    if (storage) {
      await storage.setItem(STORAGE_KEY, JSON.stringify(memorySavedWords));
    }
  } catch (e) {
    console.warn('Kelime lokalden silinemedi:', e);
  }
}

export function isWordSavedLocally(lemma?: string): boolean {
  if (!lemma) return false;
  return Boolean(memorySavedWords[lemma.toLowerCase()]);
}

export function getSavedWordsList(): (Verb & { categoryType: string })[] {
  return Object.values(memorySavedWords).map((item) => item.verb);
}

export function getSavedWordByLemma(lemma: string) {
  return memorySavedWords[lemma.toLowerCase()] || null;
}

/**
 * Düzenli/Düzensiz fiil çekimlerini otomatik tahmin eder (Online gelen fiiller için 13 Tense üretir)
 */
function inferVerbForms(lemma: string): VerbForms {
  const clean = lemma.toLowerCase().trim();
  const endsWithE = clean.endsWith('e');
  const endsWithConsonantY = /[^aeiou]y$/.test(clean);

  const v2 = endsWithE
    ? `${clean}d`
    : endsWithConsonantY
    ? `${clean.slice(0, -1)}ied`
    : `${clean}ed`;

  const thirdPersonSingular = endsWithConsonantY
    ? `${clean.slice(0, -1)}ies`
    : /(s|sh|ch|x|z|o)$/.test(clean)
    ? `${clean}es`
    : `${clean}s`;

  const presentParticiple =
    endsWithE && !clean.endsWith('ee')
      ? `${clean.slice(0, -1)}ing`
      : `${clean}ing`;

  return {
    v1: clean,
    v2,
    v3: v2,
    thirdPersonSingular,
    presentParticiple,
  };
}

/**
 * Kelime lokal veritabanında yoksa Online Açık Kaynak Sözlükten (Wiktionary/WordNet API) canlı çeker
 * ve uygulamanın 360° + 13 Tense formatına dönüştürür.
 */
export async function fetchWordOnline(
  query: string
): Promise<{ verb: Verb & { categoryType: string }; depth: WordDepth } | null> {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return null;

  try {
    // 1. İngilizce Wiktionary / WordNet tabanlı Free Dictionary API sorgusu
    const dictRes = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`
    );
    if (!dictRes.ok) return null;

    const data = await dictRes.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];
    const lemma: string = entry.word || clean;
    const ipa: string =
      entry.phonetic ||
      entry.phonetics?.find((p: any) => p.text)?.text ||
      '';

    // 2. Türkçe karşılığını açık çeviri servisinden (MyMemory ücretsiz API) alalım
    let turkishMeanings: string[] = [];
    try {
      const trRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(lemma)}&langpair=en|tr`
      );
      if (trRes.ok) {
        const trJson = await trRes.json();
        const mainTr = trJson?.responseData?.translatedText;
        if (mainTr && mainTr.toLowerCase() !== lemma.toLowerCase()) {
          turkishMeanings.push(mainTr.toLowerCase());
        }
      }
    } catch {
      // Çeviri servisi yanıt vermezse İngilizce tanımlarla devam et
    }

    const meanings = entry.meanings || [];
    const isVerb = meanings.some((m: any) => m.partOfSpeech === 'verb');
    const primaryPos = meanings[0]?.partOfSpeech || 'word';

    const synonymsSet = new Set<string>();
    const antonymsSet = new Set<string>();
    const senses: any[] = [];
    const wordFamily: any[] = [];

    meanings.forEach((m: any) => {
      const pos = m.partOfSpeech || '';
      wordFamily.push({
        word: lemma,
        partOfSpeech: pos,
        meaningTr: m.definitions?.[0]?.definition || '',
        exampleEn: m.definitions?.[0]?.example || '',
      });

      (m.synonyms || []).slice(0, 5).forEach((s: string) => synonymsSet.add(s));
      (m.antonyms || []).slice(0, 5).forEach((a: string) => antonymsSet.add(a));

      (m.definitions || []).slice(0, 3).forEach((def: any, idx: number) => {
        (def.synonyms || []).slice(0, 3).forEach((s: string) => synonymsSet.add(s));
        (def.antonyms || []).slice(0, 3).forEach((a: string) => antonymsSet.add(a));

        if (turkishMeanings.length === 0 && idx === 0 && def.definition) {
          turkishMeanings.push(def.definition);
        }

        senses.push({
          id: `${lemma}_sense_${idx}`,
          titleTr: `${pos.toUpperCase()} • ${def.definition}`,
          descriptionTr: def.definition,
          exampleEn: def.example || `Example usage of ${lemma}.`,
          exampleTr: '',
        });
      });
    });

    const forms = isVerb ? inferVerbForms(lemma) : {
      v1: lemma,
      v2: '',
      v3: '',
      thirdPersonSingular: '',
      presentParticiple: '',
    };
    const tenses = isVerb ? buildTenses(forms) : [];

    const verbObj: Verb & { categoryType: string } = {
      id: `online_${lemma}`,
      lemma,
      ipa,
      meaningTr: turkishMeanings.length > 0 ? turkishMeanings : ['(Online Sözlük Kaydı)'],
      isRegular: true,
      transitivity: 'both' as any,
      forms: forms as any,
      tenses,
      senses,
      wordFamily,
      collocations: [],
      idioms: [],
      phrasalVerbs: [],
      categoryType: isVerb ? 'Fiil (Online)' : `Online (${primaryPos})`,
    };

    const depthObj: WordDepth = {
      id: verbObj.id,
      lemma,
      review: 'reviewed',
      sources: ['Kaikki / Wiktionary API', 'FreeDictionary'],
      semantics: {
        synonyms: Array.from(synonymsSet)
          .slice(0, 6)
          .map((w) => ({ word: w, nuanceTr: 'Eş / yakın anlamlı (Wiktionary)' })),
        antonyms: Array.from(antonymsSet)
          .slice(0, 6)
          .map((w) => ({ word: w })),
        confusables: [],
      },
      phonetics: {
        ipaUs: ipa,
        ipaUk: ipa,
        syllables: [lemma],
        stressedSyllable: 0,
        rhymes: [],
      },
    };

    return { verb: verbObj, depth: depthObj };
  } catch (err) {
    console.warn('Online kelime çekme hatası:', err);
    return null;
  }
}
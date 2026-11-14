// data/depthData.ts
import type { WordDepth } from '../types/depth';

export const DEPTH_DATA: Record<string, WordDepth> = {
  satisfy: {
    id: 'satisfy',
    lemma: 'satisfy',
    review: 'draft',
    sources: ['Etymonline', 'Cambridge Dictionary'],
    etymology: {
      rootForm: 'satisfacere',
      originLanguage: 'Latince',
      rootMeaningTr: 'Yeterince yapmak, beklentiyi veya borcu eksiksiz karşılamak',
      components: [
        { part: 'satis', meaningTr: 'yeterli, yeterince' },
        { part: 'facere', meaningTr: 'yapmak, etmek' },
      ],
      path: [
        { language: 'Latince', form: 'satisfacere' },
        { language: 'Eski Fransızca', form: 'satisfaire' },
        { language: 'Orta İngilizce', form: 'satisfien' },
      ],
      storyTr:
        'Başlangıçta hukuk dilinde bir borcu veya yükümlülüğü tam ödemek anlamında kullanılırken, zamanla duygusal olarak tatmin etmek ve memnun bırakmak anlamını kazanmıştır.',
      relatedWords: [
        { word: 'saturate', noteTr: 'Aynı "satis" (doygun/yeterli) kökünden gelir; doyurmak.' },
        { word: 'sad', noteTr: 'Proto-Germence "doymuş, bıkmış" kökünden gelir; Latince satis ile akrabadır.' },
        { word: 'fact', noteTr: 'Latince "facere" (yapmak) kökünü paylaşır.' },
      ],
    },
    morphology: {
      affixes: [
        {
          affix: 'dis-',
          kind: 'prefix',
          functionTr: 'Olumsuzluk ve karşıtlık katar',
          examples: ['dissatisfy', 'dissatisfied', 'dissatisfaction'],
        },
        {
          affix: '-action',
          kind: 'suffix',
          functionTr: 'Fiilden durum ve sonuç ismi türetir',
          examples: ['satisfaction'],
        },
        {
          affix: '-ory',
          kind: 'suffix',
          functionTr: 'Nitelik bildiren sıfat türetir',
          examples: ['satisfactory (tatmin edici, yeterli)'],
        },
      ],
      noteTr: 'Sonundaki -fy eki Latince "facere" (yapmak) fiilinin İngilizceleşmiş halidir (clarify, simplify gibi).',
    },
    semantics: {
      synonyms: [
        { word: 'fulfill', nuanceTr: 'Bir sözü, potansiyeli veya derin bir amacı eksiksiz yerine getirmek.' },
        { word: 'content', nuanceTr: 'Eldekiyle yetinip huzur bulmak; beklentiyi sınırlı tutmak.' },
        { word: 'gratify', nuanceTr: 'Bir arzuyu veya gururu okşayıp haz vermek.' },
        { word: 'appease', nuanceTr: 'Öfkeli veya talepkar bir tarafı taviz vererek yatıştırmak.' },
      ],
      antonyms: [
        { word: 'dissatisfy', noteTr: 'Hoşnutsuzluk yaratmak' },
        { word: 'frustrate', noteTr: 'Beklentiyi boşa çıkarıp hayal kırıklığına uğratmak' },
      ],
      confusables: [
        {
          word: 'satisfied vs. satisfying',
          differenceTr: '"Satisfied" kişinin hissettiği duygudur; "satisfying" ise o memnuniyeti veren iş veya olaydır.',
          exampleEn: 'I am satisfied because it was a satisfying meal.',
        },
        {
          word: 'satisfactory',
          differenceTr: 'Kusursuz değil ama "yeterli, standartları karşılar" anlamında ölçülü bir sıfattır.',
          exampleEn: 'The audit results were satisfactory.',
        },
      ],
    },
    usage: {
      collocations: [
        {
          pattern: 'satisfy a requirement / condition',
          meaningTr: 'Bir şartı veya kriteri karşılamak',
          exampleEn: 'Candidates must satisfy all entry requirements.',
        },
        {
          pattern: 'satisfy curiosity',
          meaningTr: 'Merakını gidermek',
          exampleEn: 'Just to satisfy my curiosity, how did you solve it?',
        },
        {
          pattern: 'satisfy demand',
          meaningTr: 'Talebi karşılamak',
          exampleEn: 'Supply could not satisfy the sudden market demand.',
        },
      ],
      idioms: [
        {
          phrase: 'satisfaction guaranteed',
          kind: 'idiom',
          meaningTr: 'Memnuniyet garantili',
          exampleEn: 'We offer a 30-day trial with satisfaction guaranteed.',
          exampleTr: 'Memnuniyet garantili 30 günlük deneme sunuyoruz.',
        },
      ],
      slang: [],
    },
    domains: [
      {
        domain: 'law',
        termTr: 'Borcu ifa etmek / Mahkemeyi ikna etmek',
        meaningTr: 'Yasal bir borcu ödemek veya mahkemeyi kanıtlarla ikna etmek.',
        exampleEn: 'The evidence was sufficient to satisfy the jury.',
      },
      {
        domain: 'math_cs',
        termTr: 'Denklemi / Koşulu sağlamak',
        meaningTr: 'Bir değerin matematiksel bir denklemi veya yazılım koşulunu doğru kılması.',
        exampleEn: 'Find all integers that satisfy the inequality.',
      },
      {
        domain: 'business_finance',
        termTr: 'Müşteri ve SLA hedeflerini karşılamak',
        meaningTr: 'Sözleşmedeki hizmet seviyesi veya pazar beklentilerini eksiksiz karşılamak.',
        exampleEn: 'The vendor failed to satisfy the SLA response times.',
      },
    ],
    tone: {
      tone: 'positive',
      toneNoteTr: 'Gereksinimlerin karşılandığını ve belirsizliğin çözüldüğünü ifade eden yapıcı bir tondadır.',
      register: 'neutral',
      registerNoteTr: 'Hem günlük konuşmada hem de resmi ve akademik metinlerde standarttır.',
      compare: [
        { word: 'please', tone: 'positive', register: 'neutral' },
        { word: 'gratify', tone: 'positive', register: 'formal' },
        { word: 'hit the spot', tone: 'positive', register: 'informal' },
      ],
    },
    phonetics: {
      ipaUs: '/ˈsæt.ɪs.faɪ/',
      ipaUk: '/ˈsæt.ɪs.faɪ/',
      syllables: ['sat', 'is', 'fy'],
      stressedSyllable: 0,
      stressNoteTr: 'Vurgu ilk hecededir (SAT-is-fy). İsim hali olan "satisfaction"da ise vurgu üçüncü heceye (sat-is-FAC-tion) kayar.',
      rhymes: ['clarify', 'justify', 'modify', 'qualify'],
    },
    culture: [
      {
        kind: 'song',
        title: '(I Can’t Get No) Satisfaction – The Rolling Stones',
        year: 1965,
        contextTr: 'Modern dünyada insanın sürekli tüketmesine rağmen gerçek tatmine ulaşamamasını anlatan klasik eser.',
      },
    ],
  },

  decide: {
    id: 'decide',
    lemma: 'decide',
    review: 'draft',
    sources: ['Etymonline', 'Cambridge Dictionary'],
    etymology: {
      rootForm: 'decidere',
      originLanguage: 'Latince',
      rootMeaningTr: 'Kesip atmak, diğer ihtimalleri keserek tek bir seçeneği bırakmak',
      components: [
        { part: 'de-', meaningTr: 'tamamen, aşağı, uzağa' },
        { part: 'caedere', meaningTr: 'kesmek' },
      ],
      path: [
        { language: 'Latince', form: 'decidere' },
        { language: 'Eski Fransızca', form: 'decider' },
        { language: 'Orta İngilizce', form: 'deciden' },
      ],
      storyTr:
        'Karar vermek, zihindeki diğer tüm alternatiflerin ipini "kesip atmak" ve tek bir yolda ilerlemek demektir.',
      relatedWords: [
        { word: 'precise', noteTr: 'Önceden kesilmiş, sınırları net çizilmiş (kesin).' },
        { word: 'concise', noteTr: 'Fazlalıkları kırpılmış, özlü söz.' },
        { word: 'scissors', noteTr: 'Kesme aracı (makas) aynı kök ailesindendir.' },
      ],
    },
    morphology: {
      affixes: [
        {
          affix: '-sion',
          kind: 'suffix',
          functionTr: 'Fiilden eylem ve sonuç ismi türetir',
          examples: ['decision (karar)'],
        },
        {
          affix: '-ive',
          kind: 'suffix',
          functionTr: 'Özellik bildiren sıfat türetir',
          examples: ['decisive (kararlı / belirleyici)'],
        },
        {
          affix: 'in- / un-',
          kind: 'prefix',
          functionTr: 'Olumsuzluk katar',
          examples: ['indecisive (kararsız mizaç)', 'undecided (henüz karar vermemiş)'],
        },
      ],
    },
    semantics: {
      synonyms: [
        { word: 'determine', nuanceTr: 'Analiz veya yetkiyle kesin olarak saptamak/belirlemek.' },
        { word: 'resolve', nuanceTr: 'Kesin bir iradeyle karar kılmak (resmi).' },
        { word: 'settle on', nuanceTr: 'Uzun değerlendirmeden sonra bir seçenekte karar kılmak.' },
        { word: 'opt for', nuanceTr: 'Alternatifler arasından birini tercih etmek.' },
      ],
      antonyms: [
        { word: 'hesitate', noteTr: 'Tereddüt etmek, duraksamak' },
        { word: 'waver', noteTr: 'İki seçenek arasında gidip gelmek' },
      ],
      confusables: [
        {
          word: 'decisive vs. decided',
          differenceTr: '"Decisive" hızlı karar alabilen kişi veya sonucu belirleyen faktördür; "decided" ise belirgin/tartışmasız demektir.',
          exampleEn: 'Speed was the decisive factor in winning the contract.',
        },
        {
          word: 'indecisive vs. undecided',
          differenceTr: '"Indecisive" genel olarak karar veremeyen karakter özelliğidir; "undecided" ise belirli bir konuda henüz seçim yapmamış olmaktır.',
          exampleEn: 'Voters remain undecided ahead of the election.',
        },
      ],
    },
    usage: {
      collocations: [
        {
          pattern: 'decide on / upon something',
          meaningTr: 'Bir seçenek üzerinde karar kılmak',
          exampleEn: 'We finally decided on the new architecture.',
        },
        {
          pattern: 'decide against doing something',
          meaningTr: 'Bir şeyi yapmamaya karar vermek',
          exampleEn: 'They decided against moving to the cloud this quarter.',
        },
      ],
      idioms: [
        {
          phrase: 'make up one’s mind',
          kind: 'idiom',
          meaningTr: 'Kararını vermek, zihnini netleştirmek',
          exampleEn: 'Have you made up your mind yet?',
          exampleTr: 'Kararını verdin mi?',
        },
      ],
      slang: [],
    },
    domains: [
      {
        domain: 'law',
        termTr: 'Hükme bağlamak',
        meaningTr: 'Bir davayı resmi mahkeme kararıyla sonuçlandırmak.',
        exampleEn: 'The court decided in favor of the defendant.',
      },
      {
        domain: 'sports',
        termTr: 'Maçın sonucunu tayin etmek',
        meaningTr: 'Bir golün veya sayının galibi belirlemesi.',
        exampleEn: 'A last-minute goal decided the final.',
      },
    ],
    tone: {
      tone: 'neutral',
      toneNoteTr: 'Tarafsız, rasyonel ve eylem odaklı bir kelimedir.',
      register: 'neutral',
      registerNoteTr: 'Günlük ve profesyonel iletişimin en temel standart kelimelerindendir.',
      compare: [
        { word: 'make up your mind', tone: 'neutral', register: 'informal' },
        { word: 'resolve', tone: 'positive', register: 'formal' },
      ],
    },
    phonetics: {
      ipaUs: '/dɪˈsaɪd/',
      ipaUk: '/dɪˈsaɪd/',
      syllables: ['de', 'cide'],
      stressedSyllable: 1,
      stressNoteTr: 'Vurgu ikinci hecededir (de-CIDE).',
      rhymes: ['provide', 'divide', 'guide', 'side'],
    },
  },
};

/**
 * ID veya Kelime Objesine göre 360° Derinlik verisini getirir.
 * Özel yazılmış 360° verisi yoksa, Oxford 3000 JSON verisinden (phrasalVerbs, idioms, ipa) otomatik üretir.
 */
export function getWordDepth(idOrVerb: string | any): WordDepth | undefined {
  if (!idOrVerb) return undefined;

  const key =
    typeof idOrVerb === 'string'
      ? idOrVerb.toLowerCase().replace(/^verb_/, '')
      : (idOrVerb.lemma || idOrVerb.id || '').toLowerCase();

  if (DEPTH_DATA[key]) {
    return DEPTH_DATA[key];
  }

  if (typeof idOrVerb === 'object' && idOrVerb.id && DEPTH_DATA[idOrVerb.id]) {
    return DEPTH_DATA[idOrVerb.id];
  }

  // Oxford 3000 / JSON verisinden otomatik 360° katmanı oluşturma
  if (typeof idOrVerb === 'object' && idOrVerb.lemma) {
    const v = idOrVerb;
    const collocations = (v.phrasalVerbs || []).map((pv: any) => ({
      pattern: pv.phrase,
      meaningTr: pv.meaningTr,
      exampleEn: pv.exampleEn || '',
    }));

    const idioms = (v.idioms || []).map((idm: any) => ({
      phrase: idm.idiom || idm.phrase,
      kind: 'idiom' as const,
      meaningTr: idm.meaningTr,
      exampleEn: idm.exampleEn || '',
      exampleTr: idm.exampleTr,
    }));

    return {
      id: v.id || v.lemma,
      lemma: v.lemma,
      review: 'reviewed',
      usage:
        collocations.length > 0 || idioms.length > 0
          ? { collocations, idioms, slang: [] }
          : undefined,
      phonetics: v.ipa
        ? {
            ipaUs: v.ipa,
            ipaUk: v.ipa,
            syllables: [v.lemma],
            stressedSyllable: 0,
            rhymes: [],
          }
        : undefined,
    };
  }

  return undefined;
}
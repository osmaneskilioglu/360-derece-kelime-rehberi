// components/DepthSections.tsx
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { speakEnglish } from '../services/speechService';
import type {
  CultureKind,
  DomainKey,
  Etymology,
  MorphologyDepth,
  PhoneticsDepth,
  RegisterLevel,
  SemanticsDepth,
  ToneDepth,
  ToneKind,
  UsageDepth,
  WordDepth,
} from '../types/depth';

const colors = {
  ink: '#16213E',
  muted: '#5B6480',
  onInk: '#FFFFFF',
  cardBg: '#FFFFFF',
  cardBorder: '#E3E7F3',
  divider: '#EDF0F8',
  soft: '#EEF2FC',
  softStrong: '#D3DBF5',
  warnBg: '#FCEFD3',
  warnText: '#8A5200',
};

const TONE_COLORS: Record<ToneKind, { bg: string; fg: string }> = {
  positive: { bg: '#E2F3EA', fg: '#1B6B44' },
  neutral: { bg: '#EAEEFC', fg: '#16213E' },
  negative: { bg: '#FBEEEA', fg: '#6E2A1F' },
};

const TONE_LABEL: Record<ToneKind, string> = {
  positive: 'Olumlu',
  neutral: 'Nötr',
  negative: 'Olumsuz',
};

const REGISTER_ORDER: readonly RegisterLevel[] = [
  'very_formal',
  'formal',
  'neutral',
  'informal',
  'slang',
];

const REGISTER_LABEL: Record<RegisterLevel, string> = {
  very_formal: 'Çok resmi',
  formal: 'Resmi',
  neutral: 'Standart',
  informal: 'Samimi',
  slang: 'Argo',
};

const DOMAIN_LABEL: Record<DomainKey, string> = {
  law: 'Hukuk',
  medicine: 'Tıp',
  science: 'Bilim',
  math_cs: 'Matematik ve Bilgisayar',
  literature_art: 'Edebiyat ve Sanat',
  business_finance: 'İş ve Finans',
  sports: 'Spor',
  other: 'Diğer',
};

const CULTURE_LABEL: Record<CultureKind, string> = {
  film: 'Film',
  tv: 'Dizi',
  song: 'Şarkı',
  book: 'Kitap',
  speech: 'Konuşma',
  other: 'Diğer',
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Chip({
  label,
  strong,
  onPress,
}: {
  label: string;
  strong?: boolean;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.chip,
          strong && styles.chipStrong,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.chipText, strong && styles.chipTextStrong]}>
          {label} 🔊
        </Text>
      </Pressable>
    );
  }
  return (
    <View style={[styles.chip, strong && styles.chipStrong]}>
      <Text style={[styles.chipText, strong && styles.chipTextStrong]}>{label}</Text>
    </View>
  );
}

function Item({ children }: { children: ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

interface AccordionProps {
  title: string;
  summary?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function Accordion({ title, summary, open, onToggle, children }: AccordionProps) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={summary ? `${title}, ${summary}` : title}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
      >
        <View style={styles.headerText}>
          <Text style={styles.cardTitle}>{title}</Text>
          {summary ? (
            <Text style={styles.cardSummary} numberOfLines={1}>
              {summary}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.chevron, open && styles.chevronOpen]}>›</Text>
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

function EtymologyView({ data }: { data: Etymology }) {
  return (
    <View style={styles.stack}>
      <Field label="Kök">
        <Text style={styles.value}>
          <Text style={styles.emph}>{data.rootForm}</Text> ({data.originLanguage})
        </Text>
      </Field>

      <Field label="Orijinal anlam">
        <Text style={styles.value}>{data.rootMeaningTr}</Text>
      </Field>

      {data.components && data.components.length > 0 ? (
        <Field label="Parçaları">
          {data.components.map((c) => (
            <Text key={c.part} style={styles.value}>
              <Text style={styles.emph}>{c.part}</Text> = {c.meaningTr}
            </Text>
          ))}
        </Field>
      ) : null}

      {data.path && data.path.length > 0 ? (
        <Field label="Yolculuk">
          <Text style={styles.value}>
            {data.path.map((s) => `${s.language} ${s.form}`).join('  →  ')}
          </Text>
        </Field>
      ) : null}

      {data.storyTr ? (
        <Field label="Hikayesi">
          <Text style={styles.value}>{data.storyTr}</Text>
        </Field>
      ) : null}

      {data.relatedWords && data.relatedWords.length > 0 ? (
        <Field label="Aynı kökten kelimeler (Dinlemek için dokun)">
          {data.relatedWords.map((w) => (
            <Pressable key={w.word} onPress={() => speakEnglish(w.word)}>
              <Text style={styles.value}>
                <Text style={styles.emph}>{w.word} 🔊</Text>: {w.noteTr}
              </Text>
            </Pressable>
          ))}
        </Field>
      ) : null}
    </View>
  );
}

function MorphologyView({ data }: { data: MorphologyDepth }) {
  return (
    <View style={styles.stack}>
      {data.affixes.map((a) => (
        <Item key={a.affix}>
          <View style={styles.rowWrap}>
            <Chip label={a.affix} strong={a.kind === 'prefix'} />
            <Text style={styles.small}>{a.kind === 'prefix' ? 'ön ek' : 'son ek'}</Text>
          </View>
          <Text style={styles.value}>{a.functionTr}</Text>
          <Text style={styles.example}>{a.examples.join(', ')}</Text>
        </Item>
      ))}
      {data.noteTr ? <Text style={styles.note}>{data.noteTr}</Text> : null}
    </View>
  );
}

function SemanticsView({ data }: { data: SemanticsDepth }) {
  return (
    <View style={styles.stack}>
      {data.synonyms.length > 0 ? (
        <Field label="Eş ve yakın anlamlılar (Dinlemek için dokun)">
          {data.synonyms.map((s) => (
            <Item key={s.word}>
              <Pressable onPress={() => speakEnglish(s.word)}>
                <Text style={styles.emph}>{s.word} 🔊</Text>
              </Pressable>
              <Text style={styles.value}>{s.nuanceTr}</Text>
            </Item>
          ))}
        </Field>
      ) : null}

      {data.antonyms.length > 0 ? (
        <Field label="Zıt anlamlılar">
          {data.antonyms.map((a) => (
            <Pressable key={a.word} onPress={() => speakEnglish(a.word)}>
              <Text style={styles.value}>
                <Text style={styles.emph}>{a.word} 🔊</Text>
                {a.noteTr ? `: ${a.noteTr}` : ''}
              </Text>
            </Pressable>
          ))}
        </Field>
      ) : null}

      {data.confusables.length > 0 ? (
        <Field label="Sık karıştırılanlar">
          {data.confusables.map((c) => (
            <Item key={c.word}>
              <Text style={styles.emph}>{c.word}</Text>
              <Text style={styles.value}>{c.differenceTr}</Text>
              {c.exampleEn ? (
                <Pressable onPress={() => speakEnglish(c.exampleEn!)}>
                  <Text style={styles.example}>{c.exampleEn} 🔊</Text>
                </Pressable>
              ) : null}
            </Item>
          ))}
        </Field>
      ) : null}
    </View>
  );
}

function UsageView({ data }: { data: UsageDepth }) {
  return (
    <View style={styles.stack}>
      {data.collocations.length > 0 ? (
        <Field label="Sık kullanılan kalıplar">
          {data.collocations.map((c) => (
            <Item key={c.pattern}>
              <Pressable onPress={() => speakEnglish(c.pattern)}>
                <Text style={styles.emph}>{c.pattern} 🔊</Text>
              </Pressable>
              {c.meaningTr ? <Text style={styles.value}>{c.meaningTr}</Text> : null}
              {c.exampleEn ? (
                <Pressable onPress={() => speakEnglish(c.exampleEn)}>
                  <Text style={styles.example}>{c.exampleEn} 🔊</Text>
                </Pressable>
              ) : null}
            </Item>
          ))}
        </Field>
      ) : null}

      {data.idioms.length > 0 ? (
        <Field label="Deyimler ve atasözleri">
          {data.idioms.map((i) => (
            <Item key={i.phrase}>
              <View style={styles.rowWrap}>
                <Pressable onPress={() => speakEnglish(i.phrase)}>
                  <Text style={styles.emph}>{i.phrase} 🔊</Text>
                </Pressable>
                <Chip label={i.kind === 'proverb' ? 'Atasözü' : 'Deyim'} />
              </View>
              <Text style={styles.value}>{i.meaningTr}</Text>
              {i.exampleEn ? (
                <Pressable onPress={() => speakEnglish(i.exampleEn)}>
                  <Text style={styles.example}>{i.exampleEn} 🔊</Text>
                </Pressable>
              ) : null}
              {i.exampleTr ? <Text style={styles.small}>{i.exampleTr}</Text> : null}
              {i.noteTr ? <Text style={styles.note}>{i.noteTr}</Text> : null}
            </Item>
          ))}
        </Field>
      ) : null}

      {data.slang.length > 0 ? (
        <Field label="Argo ve günlük konuşma">
          {data.slang.map((s) => (
            <Item key={s.phrase}>
              <Pressable onPress={() => speakEnglish(s.phrase)}>
                <Text style={styles.emph}>{s.phrase} 🔊</Text>
              </Pressable>
              <Text style={styles.value}>{s.meaningTr}</Text>
              {s.noteTr ? <Text style={styles.note}>{s.noteTr}</Text> : null}
            </Item>
          ))}
        </Field>
      ) : null}
    </View>
  );
}

function DomainsView({ data }: { data: NonNullable<WordDepth['domains']> }) {
  return (
    <View style={styles.stack}>
      {data.map((d, idx) => (
        <Item key={`${d.domain}-${idx}`}>
          <View style={styles.rowWrap}>
            <Chip label={DOMAIN_LABEL[d.domain]} strong />
            {d.termTr ? <Text style={styles.emph}>{d.termTr}</Text> : null}
          </View>
          <Text style={styles.value}>{d.meaningTr}</Text>
          <Pressable onPress={() => speakEnglish(d.exampleEn)}>
            <Text style={styles.example}>{d.exampleEn} 🔊</Text>
          </Pressable>
        </Item>
      ))}
    </View>
  );
}

function ToneView({ data }: { data: ToneDepth }) {
  const activeIndex = REGISTER_ORDER.indexOf(data.register);
  const toneColor = TONE_COLORS[data.tone];

  return (
    <View style={styles.stack}>
      <Field label="Duygusal ton">
        <View style={styles.rowWrap}>
          <View style={[styles.tonePill, { backgroundColor: toneColor.bg }]}>
            <Text style={[styles.tonePillText, { color: toneColor.fg }]}>
              {TONE_LABEL[data.tone]}
            </Text>
          </View>
        </View>
        <Text style={styles.value}>{data.toneNoteTr}</Text>
      </Field>

      <Field label="Resmiyet derecesi">
        <View style={styles.scale}>
          {REGISTER_ORDER.map((level, idx) => (
            <View
              key={level}
              style={[styles.scaleSegment, idx === activeIndex && styles.scaleSegmentActive]}
            />
          ))}
        </View>
        <View style={styles.scaleLabels}>
          <Text style={styles.small}>Çok resmi</Text>
          <Text style={styles.small}>Argo</Text>
        </View>
        <Text style={styles.value}>
          <Text style={styles.emph}>{REGISTER_LABEL[data.register]}</Text>
          {data.registerNoteTr ? `: ${data.registerNoteTr}` : ''}
        </Text>
      </Field>

      {data.compare && data.compare.length > 0 ? (
        <Field label="Benzerleriyle karşılaştır">
          {data.compare.map((c) => (
            <Text key={c.word} style={styles.value}>
              <Text style={styles.emph}>{c.word}</Text>
              {`: ${TONE_LABEL[c.tone]}, ${REGISTER_LABEL[c.register].toLowerCase()}`}
            </Text>
          ))}
        </Field>
      ) : null}
    </View>
  );
}

function PhoneticsView({ data }: { data: PhoneticsDepth }) {
  const sameIpa = data.ipaUs && data.ipaUk && data.ipaUs === data.ipaUk;

  return (
    <View style={styles.stack}>
      <Field label="Okunuş">
        {sameIpa ? (
          <Text style={styles.value}>
            <Text style={styles.emph}>ABD ve İngiliz</Text>  {data.ipaUs}
          </Text>
        ) : (
          <>
            {data.ipaUs ? (
              <Text style={styles.value}>
                <Text style={styles.emph}>ABD</Text>  {data.ipaUs}
              </Text>
            ) : null}
            {data.ipaUk ? (
              <Text style={styles.value}>
                <Text style={styles.emph}>İngiliz</Text>  {data.ipaUk}
              </Text>
            ) : null}
          </>
        )}
      </Field>

      <Field label="Heceler ve vurgu">
        <View style={styles.rowWrap}>
          {data.syllables.map((s, idx) => (
            <Chip key={`${s}-${idx}`} label={s} strong={idx === data.stressedSyllable} />
          ))}
        </View>
        {data.stressNoteTr ? <Text style={styles.value}>{data.stressNoteTr}</Text> : null}
      </Field>

      {data.rhymes.length > 0 ? (
        <Field label="Uyaklı kelimeler (Dinlemek için dokun)">
          <View style={styles.rowWrap}>
            {data.rhymes.map((r) => (
              <Chip key={r} label={r} onPress={() => speakEnglish(r)} />
            ))}
          </View>
          {data.rhymeNoteTr ? <Text style={styles.note}>{data.rhymeNoteTr}</Text> : null}
        </Field>
      ) : null}
    </View>
  );
}

function CultureView({ data }: { data: NonNullable<WordDepth['culture']> }) {
  return (
    <View style={styles.stack}>
      {data.map((c, idx) => (
        <Item key={`${c.title}-${idx}`}>
          <View style={styles.rowWrap}>
            <Chip label={CULTURE_LABEL[c.kind]} strong />
            <Text style={styles.emph}>
              {c.title}
              {c.year ? ` (${c.year})` : ''}
            </Text>
          </View>
          <Text style={styles.value}>{c.contextTr}</Text>
        </Item>
      ))}
    </View>
  );
}

function RealUsageView({ lemma }: { lemma: string }) {
  const open = (url: string) => {
    Linking.openURL(url).catch(() => undefined);
  };
  const encoded = encodeURIComponent(lemma);

  return (
    <View style={styles.stack}>
      <Text style={styles.value}>
        YouGlish, kelimenin gerçek videolarda cümle içinde nasıl kullanıldığını gösterir.
        Cambridge Dictionary ise tanım ve örnek cümleler sunar.
      </Text>
      <View style={styles.buttonRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => open(`https://youglish.com/pronounce/${encoded}/english`)}
          style={({ pressed }) => [styles.button, styles.buttonPrimary, pressed && styles.pressed]}
        >
          <Text style={styles.buttonPrimaryText}>YouGlish</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => open(`https://dictionary.cambridge.org/dictionary/english/${encoded}`)}
          style={({ pressed }) => [styles.button, styles.buttonOutline, pressed && styles.pressed]}
        >
          <Text style={styles.buttonOutlineText}>Cambridge</Text>
        </Pressable>
      </View>
    </View>
  );
}

interface SectionDef {
  key: string;
  title: string;
  summary: string;
  content: ReactNode;
}

function domainSummary(domains: NonNullable<WordDepth['domains']>): string {
  const labels = Array.from(new Set(domains.map((d) => DOMAIN_LABEL[d.domain])));
  return labels.join(', ');
}

function buildSections(lemma: string, depth?: WordDepth): SectionDef[] {
  const out: SectionDef[] = [];

  if (depth?.etymology) {
    const e = depth.etymology;
    out.push({
      key: 'etymology',
      title: 'Köken ve tarihçe',
      summary: `${e.originLanguage}: ${e.rootForm}`,
      content: <EtymologyView data={e} />,
    });
  }

  if (depth?.morphology && depth.morphology.affixes.length > 0) {
    const m = depth.morphology;
    out.push({
      key: 'morphology',
      title: 'Ek yapısı',
      summary: m.affixes.map((a) => a.affix).join('  '),
      content: <MorphologyView data={m} />,
    });
  }

  if (depth?.semantics) {
    const s = depth.semantics;
    const total = s.synonyms.length + s.antonyms.length + s.confusables.length;
    if (total > 0) {
      out.push({
        key: 'semantics',
        title: 'Anlamsal ilişkiler',
        summary: `${s.synonyms.length} eş anlamlı, ${s.antonyms.length} zıt anlamlı, ${s.confusables.length} karıştırılan`,
        content: <SemanticsView data={s} />,
      });
    }
  }

  if (depth?.usage) {
    const u = depth.usage;
    const total = u.idioms.length + u.collocations.length + u.slang.length;
    if (total > 0) {
      out.push({
        key: 'usage',
        title: 'Kalıplar ve deyimler',
        summary: `${u.collocations.length} kalıp, ${u.idioms.length} deyim`,
        content: <UsageView data={u} />,
      });
    }
  }

  if (depth?.domains && depth.domains.length > 0) {
    out.push({
      key: 'domains',
      title: 'Alanlara göre anlam',
      summary: domainSummary(depth.domains),
      content: <DomainsView data={depth.domains} />,
    });
  }

  if (depth?.tone) {
    const t = depth.tone;
    out.push({
      key: 'tone',
      title: 'Ton ve resmiyet',
      summary: `${TONE_LABEL[t.tone]}, ${REGISTER_LABEL[t.register].toLowerCase()}`,
      content: <ToneView data={t} />,
    });
  }

  if (depth?.phonetics) {
    const p = depth.phonetics;
    out.push({
      key: 'phonetics',
      title: 'Ses ve uyak',
      summary: p.ipaUs ?? p.ipaUk ?? '',
      content: <PhoneticsView data={p} />,
    });
  }

  if (depth?.culture && depth.culture.length > 0) {
    out.push({
      key: 'culture',
      title: 'Popüler kültür',
      summary: depth.culture.map((c) => c.title).join(', '),
      content: <CultureView data={depth.culture} />,
    });
  }

  out.push({
    key: 'real',
    title: 'Gerçek kullanım',
    summary: 'YouGlish ve Cambridge',
    content: <RealUsageView lemma={lemma} />,
  });

  return out;
}

export interface DepthSectionsProps {
  lemma: string;
  depth?: WordDepth;
}

export function DepthSections({ lemma, depth }: DepthSectionsProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpen({});
  }, [lemma]);

  const toggle = useCallback((key: string) => {
    setOpen((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  const sections = buildSections(lemma, depth);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        360° derinlik
      </Text>

      {!depth ? (
        <Text style={styles.empty}>Bu kelime için derin analiz henüz hazırlanmadı.</Text>
      ) : null}

      {__DEV__ && depth?.review === 'draft' ? (
        <View style={styles.devNote}>
          <Text style={styles.devNoteText}>
            Geliştirici notu: Bu içerik taslaktır, kaynaklardan doğrulanmamıştır.
          </Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {sections.map((s) => (
          <Accordion
            key={s.key}
            title={s.title}
            summary={s.summary}
            open={Boolean(open[s.key])}
            onToggle={() => toggle(s.key)}
          >
            {s.content}
          </Accordion>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.ink,
  },
  empty: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: colors.muted,
  },
  devNote: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.warnBg,
  },
  devNoteText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.warnText,
  },
  list: {
    marginTop: 12,
    gap: 10,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerPressed: {
    backgroundColor: colors.soft,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  cardSummary: {
    marginTop: 2,
    fontSize: 13,
    color: colors.muted,
  },
  chevron: {
    fontSize: 24,
    lineHeight: 26,
    color: colors.muted,
  },
  chevronOpen: {
    transform: [{ rotate: '90deg' }],
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  stack: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  item: {
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.soft,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  emph: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.ink,
  },
  example: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    color: colors.ink,
  },
  small: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: colors.soft,
  },
  chipStrong: {
    backgroundColor: colors.ink,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  chipTextStrong: {
    color: colors.onInk,
  },
  tonePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tonePillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scale: {
    flexDirection: 'row',
    gap: 4,
  },
  scaleSegment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.softStrong,
  },
  scaleSegmentActive: {
    backgroundColor: colors.ink,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  buttonPrimary: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  buttonPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onInk,
  },
  buttonOutline: {
    backgroundColor: colors.cardBg,
    borderColor: colors.ink,
  },
  buttonOutlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  pressed: {
    opacity: 0.85,
  },
});
// components/WordFamilySection.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { VerbMatch } from '../services/searchService';
import type { Polarity, Verb, WordPartOfSpeech } from '../types/verb';
import {
  groupWordFamily,
  type FamilyGroup,
  type FamilyItem,
} from '../utils/groupWordFamily';

const colors = {
  ink: '#16213E',
  muted: '#5B6480',
  cardBg: '#FFFFFF',
  cardBorder: '#E3E7F3',
  divider: '#EDF0F8',
  vsBg: '#F1F3FA',
};

interface Tone {
  bg: string;
  text: string;
  sub: string;
  chipFill: string;
  chipBorder: string;
  chipText: string;
  solidBg: string;
  solidText: string;
}

const TONES: Record<Polarity, Tone> = {
  positive: {
    bg: '#EEF2FC',
    text: '#16213E',
    sub: '#4E5878',
    chipFill: '#D3DBF5',
    chipBorder: '#B3C0EA',
    chipText: '#16213E',
    solidBg: '#16213E',
    solidText: '#FFFFFF',
  },
  negative: {
    bg: '#FBEEEA',
    text: '#6E2A1F',
    sub: '#7D5148',
    chipFill: '#F2CFC6',
    chipBorder: '#E2AFA2',
    chipText: '#6E2A1F',
    solidBg: '#6E2A1F',
    solidText: '#FFFFFF',
  },
};

const SECTION_TITLE: Record<WordPartOfSpeech, { tr: string; en: string }> = {
  noun: { tr: 'İsimler', en: 'Nouns' },
  adjective: { tr: 'Sıfatlar', en: 'Adjectives' },
  adverb: { tr: 'Zarflar', en: 'Adverbs' },
  verb: { tr: 'Fiiller', en: 'Verbs' },
};

const POS_TR: Record<WordPartOfSpeech, string> = {
  noun: 'isim',
  adjective: 'sıfat',
  adverb: 'zarf',
  verb: 'fiil',
};

type ChipVariant = 'filled' | 'outline' | 'solid';

interface ChipProps {
  label: string;
  variant: ChipVariant;
  tone: Tone;
  accessibilityLabel?: string;
}

function Chip({ label, variant, tone, accessibilityLabel }: ChipProps) {
  const containerStyle =
    variant === 'filled'
      ? { backgroundColor: tone.chipFill, borderColor: tone.chipFill }
      : variant === 'outline'
        ? { backgroundColor: 'transparent', borderColor: tone.chipBorder }
        : { backgroundColor: tone.solidBg, borderColor: tone.solidBg };
  const textColor = variant === 'solid' ? tone.solidText : tone.chipText;

  return (
    <View
      style={[styles.chip, containerStyle]}
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={[styles.chipText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

interface WordCellProps {
  item: FamilyItem;
  selected: boolean;
  showPolarity: boolean;
  onPress: (id: string) => void;
}

function WordCell({ item, selected, showPolarity, onPress }: WordCellProps) {
  const tone = TONES[item.polarity];
  const prefix = item.affixes?.prefix;
  const suffix = item.affixes?.suffix;
  const hasChips = Boolean(item.isRoot || prefix || suffix || showPolarity);

  const body = (
    <>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={[styles.word, { color: tone.text }]}
      >
        {item.word}
      </Text>
      {item.meaningTr ? (
        <Text style={[styles.meaning, { color: tone.sub }]}>{item.meaningTr}</Text>
      ) : null}
      {hasChips ? (
        <View style={styles.chipRow}>
          {item.isRoot ? (
            <Chip label="ana fiil" variant="solid" tone={tone} />
          ) : null}
          {showPolarity ? (
            <Chip label="olumsuz" variant="solid" tone={tone} />
          ) : null}
          {prefix ? (
            <Chip
              label={`${prefix}-`}
              variant="filled"
              tone={tone}
              accessibilityLabel={`ön ek ${prefix}`}
            />
          ) : null}
          {suffix ? (
            <Chip
              label={`-${suffix}`}
              variant="outline"
              tone={tone}
              accessibilityLabel={`son ek ${suffix}`}
            />
          ) : null}
        </View>
      ) : null}
    </>
  );

  if (item.isRoot) {
    return (
      <View style={[styles.cell, { backgroundColor: tone.bg }]}>{body}</View>
    );
  }

  const a11y = [
    item.word,
    POS_TR[item.partOfSpeech],
    item.polarity === 'negative' ? 'olumsuz' : null,
    item.meaningTr,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityHint="Örnek cümleyi gösterir veya gizler"
      accessibilityState={{ expanded: selected }}
      style={({ pressed }) => [
        styles.cell,
        {
          backgroundColor: tone.bg,
          borderColor: selected ? colors.ink : 'transparent',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {body}
    </Pressable>
  );
}

interface GroupCardProps {
  group: FamilyGroup;
  selectedId: string | null;
  onToggle: (id: string) => void;
}

function GroupCard({ group, selectedId, onToggle }: GroupCardProps) {
  const { positive, negatives } = group;
  const isPair = positive !== null && negatives.length > 0;
  const items = positive ? [positive, ...negatives] : negatives;
  const selected = items.find((i) => i.id === selectedId && !i.isRoot);

  return (
    <View style={styles.card}>
      {isPair && positive ? (
        <View style={styles.pairRow}>
          <View style={styles.flex1}>
            <WordCell
              item={positive}
              selected={positive.id === selectedId}
              showPolarity={false}
              onPress={onToggle}
            />
          </View>

          <View
            style={styles.vs}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Text style={styles.vsGlyph}>↔</Text>
          </View>

          <View style={[styles.flex1, styles.negColumn]}>
            {negatives.map((n) => (
              <WordCell
                key={n.id}
                item={n}
                selected={n.id === selectedId}
                showPolarity={false}
                onPress={onToggle}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.singleColumn}>
          {items.map((item) => (
            <WordCell
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              showPolarity={item.polarity === 'negative'}
              onPress={onToggle}
            />
          ))}
        </View>
      )}

      {selected ? (
        <View style={styles.detail}>
          <Text style={styles.detailExample}>{selected.example}</Text>
          {selected.note ? (
            <Text style={styles.detailNote}>{selected.note}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export interface WordFamilySectionProps {
  verb: Verb;
  match?: VerbMatch;
}

export function WordFamilySection({ verb, match }: WordFamilySectionProps) {
  const sections = useMemo(() => groupWordFamily(verb), [verb]);

  const initialId = match?.familyEntry?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initialId);

  useEffect(() => {
    setSelectedId(initialId);
  }, [verb.id, initialId]);

  const toggle = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Kelime ailesi
      </Text>

      {verb.wordFamily.length === 0 ? (
        <Text style={styles.empty}>Bu fiil için türev kelime eklenmemiş.</Text>
      ) : (
        <>
          <View style={styles.legend}>
            <Chip label="un-" variant="filled" tone={TONES.positive} />
            <Text style={styles.legendText}>ön ek</Text>
            <Chip label="-ly" variant="outline" tone={TONES.positive} />
            <Text style={styles.legendText}>son ek</Text>
            <Text style={styles.legendHint}>Örnek için kelimeye dokun</Text>
          </View>

          {sections.map((section) => (
            <View key={section.partOfSpeech} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} accessibilityRole="header">
                  {SECTION_TITLE[section.partOfSpeech].tr}
                </Text>
                <Text style={styles.sectionCaption}>
                  {SECTION_TITLE[section.partOfSpeech].en}
                </Text>
              </View>

              {section.groups.map((group) => (
                <GroupCard
                  key={group.key}
                  group={group}
                  selectedId={selectedId}
                  onToggle={toggle}
                />
              ))}
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
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
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  legendText: {
    fontSize: 13,
    color: colors.muted,
  },
  legendHint: {
    fontSize: 13,
    color: colors.muted,
    marginLeft: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  sectionCaption: {
    fontSize: 13,
    color: colors.muted,
  },
  card: {
    marginTop: 10,
    padding: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  flex1: {
    flex: 1,
  },
  negColumn: {
    gap: 8,
  },
  singleColumn: {
    gap: 8,
  },
  vs: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsGlyph: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 13,
    color: colors.muted,
    backgroundColor: colors.vsBg,
  },
  cell: {
    flexGrow: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  word: {
    fontSize: 17,
    fontWeight: '700',
  },
  meaning: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detail: {
    marginTop: 8,
    paddingTop: 10,
    paddingHorizontal: 6,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  detailExample: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    color: colors.ink,
  },
  detailNote: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
});
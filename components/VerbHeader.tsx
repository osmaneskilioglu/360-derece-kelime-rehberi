// components/VerbHeader.tsx
import { StyleSheet, Text, View } from 'react-native';
import type { VerbMatch } from '../services/searchService';
import type { Verb, VerbForms, WordPartOfSpeech } from '../types/verb';

const colors = {
  ink: '#16213E',
  muted: '#5B6480',
  onInk: '#FFFFFF',
  onInkMuted: '#B9C2E3',
  pillV1: '#EAEEFC',
  pillV2: '#D8DFF8',
  pillV3: '#C4CEF3',
  regularBg: '#E2F3EA',
  regularText: '#1B6B44',
  irregularBg: '#FCEFD3',
  irregularText: '#8A5200',
};

type PillKey = 'v1' | 'v2' | 'v3';

const PILLS: ReadonlyArray<{ key: PillKey; label: string; bg: string }> = [
  { key: 'v1', label: 'V1', bg: colors.pillV1 },
  { key: 'v2', label: 'V2', bg: colors.pillV2 },
  { key: 'v3', label: 'V3', bg: colors.pillV3 },
];

const FORM_LABEL: Record<keyof VerbForms, string> = {
  v1: 'V1',
  v2: 'V2',
  v3: 'V3',
  thirdPersonSingular: '3. tekil şahıs',
  presentParticiple: 'V-ing',
};

const POS_TR: Record<WordPartOfSpeech, string> = {
  verb: 'fiil',
  noun: 'isim',
  adjective: 'sıfat',
  adverb: 'zarf',
};

function describeMatch(verb: Verb, match?: VerbMatch): string | null {
  if (!match || match.kind === 'lemma') return null;

  const word = `“${match.matchedWord}”`;
  const forms = match.formKeys?.map((k) => FORM_LABEL[k]).join(' / ');
  const entry = match.familyEntry;
  const derived = entry
    ? `${entry.polarity === 'negative' ? 'olumsuz ' : ''}${POS_TR[entry.partOfSpeech]}`
    : null;

  if (forms && derived) {
    return `${word}, ${verb.lemma} fiilinin ${forms} formu; aynı zamanda ${derived} olarak kullanılır.`;
  }
  if (forms) {
    return `${word}, ${verb.lemma} fiilinin ${forms} formu.`;
  }
  if (derived) {
    return `${word}, ${verb.lemma} fiilinden türeyen bir ${derived}.`;
  }
  return null;
}

export interface VerbHeaderProps {
  verb: Verb;
  match?: VerbMatch;
}

export function VerbHeader({ verb, match }: VerbHeaderProps) {
  const highlighted: ReadonlyArray<keyof VerbForms> =
    match?.kind === 'form' ? (match.formKeys ?? []) : [];
  const hint = describeMatch(verb, match);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.lemma} accessibilityRole="header">
            {verb.lemma}
          </Text>
          {verb.ipa ? <Text style={styles.ipa}>{verb.ipa}</Text> : null}
        </View>

        <View
          style={[
            styles.badge,
            verb.isRegular ? styles.badgeRegular : styles.badgeIrregular,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              verb.isRegular ? styles.badgeTextRegular : styles.badgeTextIrregular,
            ]}
          >
            {verb.isRegular ? 'Regular' : 'Irregular'}
          </Text>
        </View>
      </View>

      {verb.meaningTr.length > 0 ? (
        <Text style={styles.meaning}>{verb.meaningTr.join('; ')}</Text>
      ) : null}

      <View style={styles.pillRow}>
        {PILLS.map(({ key, label, bg }) => {
          const word = verb.forms[key];
          const isMatch = highlighted.includes(key);
          return (
            <View
              key={key}
              accessible
              accessibilityLabel={`${label}: ${word}`}
              style={[styles.pill, { backgroundColor: isMatch ? colors.ink : bg }]}
            >
              <Text
                style={[
                  styles.pillLabel,
                  { color: isMatch ? colors.onInkMuted : colors.muted },
                ]}
              >
                {label}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={[
                  styles.pillWord,
                  { color: isMatch ? colors.onInk : colors.ink },
                ]}
              >
                {word}
              </Text>
            </View>
          );
        })}
      </View>

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleBlock: {
    flexShrink: 1,
    paddingRight: 12,
  },
  lemma: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: colors.ink,
  },
  ipa: {
    marginTop: 2,
    fontSize: 16,
    color: colors.muted,
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeRegular: { backgroundColor: colors.regularBg },
  badgeIrregular: { backgroundColor: colors.irregularBg },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgeTextRegular: { color: colors.regularText },
  badgeTextIrregular: { color: colors.irregularText },
  meaning: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  pillWord: {
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
});
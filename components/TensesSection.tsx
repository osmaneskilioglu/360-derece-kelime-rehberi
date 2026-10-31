// components/TensesSection.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Verb, TenseConjugation, PersonGroup } from '../types/verb';

interface TensesSectionProps {
  verb: Verb;
}

type CategoryFilter = 'all' | 'present' | 'past' | 'future';
type ActiveSentenceType = 'affirmative' | 'negative' | 'question';

const PERSON_LABELS: Record<PersonGroup, string> = {
  I: 'I',
  heSheIt: 'he / she / it',
  youWeThey: 'you / we / they',
};

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'Tümü (12)' },
  { key: 'present', label: 'Present' },
  { key: 'past', label: 'Past' },
  { key: 'future', label: 'Future' },
];

export const TensesSection: React.FC<TensesSectionProps> = ({ verb }) => {
  const tensesList: TenseConjugation[] = Array.isArray(verb.tenses)
    ? verb.tenses
    : Object.values(verb.tenses || {});

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [expandedTense, setExpandedTense] = useState<string | null>(
    tensesList[0]?.name || null
  );
  const [sentenceType, setSentenceType] = useState<ActiveSentenceType>('affirmative');

  const filteredTenses = tensesList.filter((tense) => {
    if (selectedCategory === 'all') return true;
    const lowerName = (tense.name || '').toLowerCase();
    if (selectedCategory === 'present') return lowerName.includes('present');
    if (selectedCategory === 'past') return lowerName.includes('past');
    if (selectedCategory === 'future')
      return lowerName.includes('future') || lowerName.includes('conditional');
    return true;
  });

  const toggleExpand = (tenseName: string) => {
    setExpandedTense((prev) => (prev === tenseName ? null : tenseName));
  };

  const getConjugationText = (
    tense: any,
    type: ActiveSentenceType,
    person: PersonGroup
  ): string => {
    if (!tense) return '-';

    const root = tense.forms || tense.sentences || tense;

    let group = null;
    if (type === 'affirmative') {
      group = root.affirmative || root.positive || root.olumlu;
    } else if (type === 'negative') {
      group = root.negative || root.olumsuz;
    } else if (type === 'question') {
      // Dilbilgisi modellerindeki 'interrogative' veya 'question' adlandırmalarını yakalar
      group =
        root.interrogative ||
        root.question ||
        root.questions ||
        root.questionForm ||
        root.soru;
    }

    if (!group) return '-';

    return group[person] || '-';
  };

  if (!tensesList.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Zaman Çekimleri (Tenses)</Text>

      {/* Kategori Filtresi */}
      <View style={styles.filterRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.filterChip,
              selectedCategory === cat.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === cat.key && styles.filterChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Zaman Kartları */}
      <View style={styles.tensesWrapper}>
        {filteredTenses.map((tense) => {
          const isExpanded = expandedTense === tense.name;

          return (
            <View key={tense.name} style={styles.tenseCard}>
              <TouchableOpacity
                style={styles.tenseHeader}
                onPress={() => toggleExpand(tense.name)}
                activeOpacity={0.7}
              >
                <View style={styles.tenseHeaderLeft}>
                  <Text style={styles.tenseName}>{tense.name}</Text>
                  {tense.nameTr ? (
                    <Text style={styles.tenseNameTr}>{tense.nameTr}</Text>
                  ) : null}
                </View>
                <View style={styles.headerRight}>
                  {tense.formula ? (
                    <View style={styles.formulaBadge}>
                      <Text style={styles.formulaText}>{tense.formula}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                </View>
              </TouchableOpacity>

              {/* Açılır Gövde */}
              {isExpanded && (
                <View style={styles.tenseBody}>
                  {/* Cümle Türü Seçici */}
                  <View style={styles.typeSelector}>
                    <TouchableOpacity
                      style={[
                        styles.typeBtn,
                        sentenceType === 'affirmative' && styles.typeBtnPositiveActive,
                      ]}
                      onPress={() => setSentenceType('affirmative')}
                    >
                      <Text
                        style={[
                          styles.typeBtnText,
                          sentenceType === 'affirmative' && styles.typeBtnTextActive,
                        ]}
                      >
                        + Olumlu
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeBtn,
                        sentenceType === 'negative' && styles.typeBtnNegativeActive,
                      ]}
                      onPress={() => setSentenceType('negative')}
                    >
                      <Text
                        style={[
                          styles.typeBtnText,
                          sentenceType === 'negative' && styles.typeBtnTextActive,
                        ]}
                      >
                        − Olumsuz
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeBtn,
                        sentenceType === 'question' && styles.typeBtnQuestionActive,
                      ]}
                      onPress={() => setSentenceType('question')}
                    >
                      <Text
                        style={[
                          styles.typeBtnText,
                          sentenceType === 'question' && styles.typeBtnTextActive,
                        ]}
                      >
                        ? Soru
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* 3 Özne Grubu Çekimleri */}
                  <View style={styles.conjugationList}>
                    {(['I', 'heSheIt', 'youWeThey'] as PersonGroup[]).map((person) => (
                      <View key={person} style={styles.conjugationRow}>
                        <View style={styles.subjectBox}>
                          <Text style={styles.subjectText}>{PERSON_LABELS[person]}</Text>
                        </View>
                        <Text style={styles.sentenceText}>
                          {getConjugationText(tense, sentenceType, person)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  tensesWrapper: {
    gap: 10,
  },
  tenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  tenseHeaderLeft: {
    flex: 1,
  },
  tenseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  tenseNameTr: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formulaBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  formulaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  chevron: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  tenseBody: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
    padding: 14,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 2,
    marginBottom: 12,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeBtnPositiveActive: {
    backgroundColor: '#16A34A',
  },
  typeBtnNegativeActive: {
    backgroundColor: '#DC2626',
  },
  typeBtnQuestionActive: {
    backgroundColor: '#D97706',
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  conjugationList: {
    gap: 8,
  },
  conjugationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subjectBox: {
    width: 95,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    marginRight: 10,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  sentenceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    flex: 1,
  },
});
// components/UsageSection.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Verb } from '../types/verb';
import { speakEnglish } from '../services/speechService';

interface UsageSectionProps {
  verb: Verb;
}

type TabKey = 'senses' | 'phrasal' | 'idioms';

export const UsageSection: React.FC<UsageSectionProps> = ({ verb }) => {
  const hasSenses = Boolean(verb.senses && verb.senses.length > 0);
  const hasPhrasal = Boolean(verb.phrasalVerbs && verb.phrasalVerbs.length > 0);
  const hasIdioms = Boolean(verb.idioms && verb.idioms.length > 0);

  const [activeTab, setActiveTab] = useState<TabKey>('senses');

  if (!hasSenses && !hasPhrasal && !hasIdioms) {
    return null;
  }

  const verbSenses = (verb.senses || []).filter((s) => s.category === 'verb');
  const nounSenses = (verb.senses || []).filter((s) => s.category === 'noun');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>360° Kullanım & Kalıplar</Text>

      {/* Sekme Başlıkları */}
      <View style={styles.tabBar}>
        {hasSenses && (
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'senses' && styles.tabBtnActive]}
            onPress={() => setActiveTab('senses')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'senses' && styles.tabBtnTextActive,
              ]}
            >
              Anlamlar ({verb.senses?.length})
            </Text>
          </TouchableOpacity>
        )}

        {hasPhrasal && (
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'phrasal' && styles.tabBtnActive]}
            onPress={() => setActiveTab('phrasal')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'phrasal' && styles.tabBtnTextActive,
              ]}
            >
              Phrasal Verbs ({verb.phrasalVerbs?.length})
            </Text>
          </TouchableOpacity>
        )}

        {hasIdioms && (
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'idioms' && styles.tabBtnActive]}
            onPress={() => setActiveTab('idioms')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'idioms' && styles.tabBtnTextActive,
              ]}
            >
              Deyimler ({verb.idioms?.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 1. SEKME: DETAYLI ANLAMLAR (FİİL & İSİM) */}
      {activeTab === 'senses' && hasSenses && (
        <View style={styles.contentWrapper}>
          {verbSenses.length > 0 && (
            <View style={styles.groupBlock}>
              <View style={styles.badgeVerb}>
                <Text style={styles.badgeVerbText}>FİİL OLARAK ANLAMLARI</Text>
              </View>
              {verbSenses.map((item, idx) => (
                <View key={`v-${idx}`} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.titleTr}</Text>
                  <Text style={styles.cardDesc}>{item.descriptionTr}</Text>
                  <TouchableOpacity
                    style={styles.exampleBox}
                    onPress={() => speakEnglish(item.exampleEn)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.exampleHeader}>
                      <Text style={styles.speakerIcon}>🔊</Text>
                      <Text style={styles.exampleEn}>{item.exampleEn}</Text>
                    </View>
                    <Text style={styles.exampleTr}>{item.exampleTr}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {nounSenses.length > 0 && (
            <View style={styles.groupBlock}>
              <View style={styles.badgeNoun}>
                <Text style={styles.badgeNounText}>İSİM OLARAK ANLAMLARI</Text>
              </View>
              {nounSenses.map((item, idx) => (
                <View key={`n-${idx}`} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.titleTr}</Text>
                  <Text style={styles.cardDesc}>{item.descriptionTr}</Text>
                  <TouchableOpacity
                    style={styles.exampleBox}
                    onPress={() => speakEnglish(item.exampleEn)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.exampleHeader}>
                      <Text style={styles.speakerIcon}>🔊</Text>
                      <Text style={styles.exampleEn}>{item.exampleEn}</Text>
                    </View>
                    <Text style={styles.exampleTr}>{item.exampleTr}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 2. SEKME: PHRASAL VERBS */}
      {activeTab === 'phrasal' && hasPhrasal && (
        <View style={styles.contentWrapper}>
          {verb.phrasalVerbs?.map((pv, idx) => (
            <View key={`pv-${idx}`} style={styles.card}>
              <View style={styles.phraseRow}>
                <Text style={styles.phraseTitle}>{pv.phrase}</Text>
                <TouchableOpacity
                  style={styles.miniSpeakerBtn}
                  onPress={() => speakEnglish(pv.phrase)}
                >
                  <Text style={styles.miniSpeakerText}>🔊 Dinle</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardDesc}>{pv.meaningTr}</Text>
              <TouchableOpacity
                style={styles.exampleBox}
                onPress={() => speakEnglish(pv.exampleEn)}
                activeOpacity={0.7}
              >
                <View style={styles.exampleHeader}>
                  <Text style={styles.speakerIcon}>🔊</Text>
                  <Text style={styles.exampleEn}>{pv.exampleEn}</Text>
                </View>
                <Text style={styles.exampleTr}>{pv.exampleTr}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 3. SEKME: DEYİMLER (IDIOMS) */}
      {activeTab === 'idioms' && hasIdioms && (
        <View style={styles.contentWrapper}>
          {verb.idioms?.map((idItem, idx) => (
            <View key={`id-${idx}`} style={styles.card}>
              <View style={styles.phraseRow}>
                <Text style={styles.phraseTitle}>{idItem.idiom}</Text>
                <TouchableOpacity
                  style={styles.miniSpeakerBtn}
                  onPress={() => speakEnglish(idItem.idiom)}
                >
                  <Text style={styles.miniSpeakerText}>🔊 Dinle</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardDesc}>{idItem.meaningTr}</Text>
              <TouchableOpacity
                style={styles.exampleBox}
                onPress={() => speakEnglish(idItem.exampleEn)}
                activeOpacity={0.7}
              >
                <View style={styles.exampleHeader}>
                  <Text style={styles.speakerIcon}>🔊</Text>
                  <Text style={styles.exampleEn}>{idItem.exampleEn}</Text>
                </View>
                <Text style={styles.exampleTr}>{idItem.exampleTr}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#1E293B',
    fontWeight: '700',
  },
  contentWrapper: {
    gap: 12,
  },
  groupBlock: {
    gap: 10,
    marginBottom: 8,
  },
  badgeVerb: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeVerbText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  badgeNoun: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  badgeNounText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 6,
  },
  phraseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phraseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  miniSpeakerBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniSpeakerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  exampleBox: {
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  speakerIcon: {
    fontSize: 14,
  },
  exampleEn: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  exampleTr: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginLeft: 20,
  },
});
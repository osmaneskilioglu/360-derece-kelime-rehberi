// components/UsageSection.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Verb } from '../types/verb';

interface Props {
  verb: Verb;
}

export function UsageSection({ verb }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Anlam Katmanları & Kullanım</Text>
      
      {/* Senses (Anlamlar) */}
      {verb.senses && verb.senses.map((sense, index) => (
        <View key={`sense-${index}`} style={styles.card}>
          <Text style={styles.senseCategory}>{sense.category.toUpperCase()}</Text>
          <Text style={styles.senseTitle}>{sense.titleTr}</Text>
          <Text style={styles.senseDesc}>{sense.descriptionTr}</Text>

          {sense.exampleEn ? (
            <View style={styles.exampleBox}>
              <Text style={styles.exampleEn}>"{sense.exampleEn}"</Text>
              <Text style={styles.exampleTr}>{sense.exampleTr}</Text>
            </View>
          ) : null}
        </View>
      ))}

      {/* Phrasal Verbs (Öbeksi Fiiller) */}
      {verb.phrasalVerbs && verb.phrasalVerbs.length > 0 && (
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>Öbeksi Fiiller (Phrasal Verbs)</Text>
          {verb.phrasalVerbs.map((pv, idx) => (
            <View key={`pv-${idx}`} style={styles.subCard}>
              <Text style={styles.subCardTitle}>{pv.phrase}</Text>
              <Text style={styles.subCardMeaning}>{pv.meaningTr}</Text>
              <Text style={styles.subCardExample}>"{pv.exampleEn}" - {pv.exampleTr}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Idioms (Deyimler) */}
      {verb.idioms && verb.idioms.length > 0 && (
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>Deyimler (Idioms)</Text>
          {verb.idioms.map((idm, idx) => (
            <View key={`idm-${idx}`} style={styles.subCard}>
              <Text style={styles.subCardTitle}>{idm.idiom}</Text>
              <Text style={styles.subCardMeaning}>{idm.meaningTr}</Text>
              <Text style={styles.subCardExample}>"{idm.exampleEn}" - {idm.exampleTr}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  senseCategory: { fontSize: 10, fontWeight: '700', color: '#2563EB', marginBottom: 2, letterSpacing: 0.5 },
  senseTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  senseDesc: { fontSize: 14, color: '#475569', marginBottom: 10, lineHeight: 20 },
  exampleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  exampleEn: { fontSize: 14, fontStyle: 'italic', color: '#1E293B', fontWeight: '500' },
  exampleTr: { fontSize: 13, color: '#64748B', marginTop: 3 },
  subSection: { marginTop: 16 },
  subSectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  subCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subCardTitle: { fontSize: 16, fontWeight: '800', color: '#1D4ED8', marginBottom: 2 },
  subCardMeaning: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  subCardExample: { fontSize: 13, fontStyle: 'italic', color: '#64748B' },
});
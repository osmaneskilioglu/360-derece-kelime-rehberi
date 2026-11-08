// components/CollocationsSection.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Verb } from '../types/verb';

interface Props {
  verb: Verb;
}

export function CollocationsSection({ verb }: Props) {
  if (!verb.collocations || verb.collocations.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>6. Eş Dizimler (Collocations)</Text>
      <Text style={styles.sectionSubtitle}>
        Bu kelimenin doğal İngilizce akışında en sık birlikte kullanıldığı kalıplar:
      </Text>

      {verb.collocations.map((item, index) => (
        <View key={index} style={styles.card}>
          {/* Taşmayı önlemek için başlığı ve anlamı alt alta veya esnek yapıya aldık */}
          <View style={styles.headerRow}>
            <Text style={styles.collocationText}>{item.collocation}</Text>
            <Text style={styles.meaningText}>{item.meaningTr}</Text>
          </View>

          {item.usageNote ? (
            <Text style={styles.noteText}>💡 İpucu: {item.usageNote}</Text>
          ) : null}

          <View style={styles.exampleBox}>
            <Text style={styles.exampleEn}>"{item.exampleEn}"</Text>
            <Text style={styles.exampleTr}>{item.exampleTr}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 12, lineHeight: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'column', // Uzun metinlerin yan yana taşırmaması için alt alta (kolon) yaptık
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 2,
  },
  collocationText: { fontSize: 16, fontWeight: '700', color: '#2563EB' },
  meaningText: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  noteText: { fontSize: 12, color: '#D97706', fontWeight: '500', marginBottom: 8, backgroundColor: '#FEF3C7', padding: 8, borderRadius: 6, overflow: 'hidden' },
  exampleBox: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    marginTop: 4,
  },
  exampleEn: { fontSize: 13, fontStyle: 'italic', color: '#334155' },
  exampleTr: { fontSize: 12, color: '#64748B', marginTop: 2 },
});
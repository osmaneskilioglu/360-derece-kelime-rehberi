// components/PhraseCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { speakEnglish, AccentType } from '../services/speechService';
import { openYouGlish, openCambridge } from '../services/externalLinksService';

interface Props {
  phrase: {
    lemma: string;
    category: string;
    meaningTr: string[];
    usageNote?: string;
    exampleEn: string;
    exampleTr: string;
  };
  accent: AccentType;
  onToggleAccent: () => void;
}

export function PhraseCard({ phrase, accent, onToggleAccent }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.lemmaText}>{phrase.lemma}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{phrase.category}</Text>
        </View>
      </View>

      <Text style={styles.meaningText}>{phrase.meaningTr.join(', ')}</Text>

      {/* Seslendirme ve Dış Bağlantılar (YouGlish & Cambridge) */}
      <View style={styles.audioBar}>
        <TouchableOpacity style={styles.audioChip} onPress={() => speakEnglish(phrase.lemma, accent)}>
          <Text style={styles.audioChipText}>🔊 Dinle</Text>
        </TouchableOpacity>

        <View style={styles.externalLinksRow}>
          <TouchableOpacity style={styles.extBtn} onPress={() => openYouGlish(phrase.lemma)}>
            <Text style={styles.extBtnText}>🎥 YouGlish</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.extBtn} onPress={() => openCambridge(phrase.lemma)}>
            <Text style={styles.extBtnText}>📖 Cambridge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accentBtn} onPress={onToggleAccent}>
            <Text style={styles.accentBtnText}>{accent === 'en-US' ? '🇺🇸' : '🇬🇧'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {phrase.usageNote ? (
        <Text style={styles.noteText}>💡 İpucu: {phrase.usageNote}</Text>
      ) : null}

      <View style={styles.exampleBox}>
        <Text style={styles.exampleEn}>"{phrase.exampleEn}"</Text>
        <Text style={styles.exampleTr}>{phrase.exampleTr}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lemmaText: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase' },
  meaningText: { fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 10 },
  audioBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12, 
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  audioChip: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  audioChipText: { fontSize: 12, fontWeight: '600', color: '#1D4ED8' },
  externalLinksRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  extBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },
  extBtnText: { fontSize: 11, fontWeight: '700', color: '#334155' },
  accentBtn: { backgroundColor: '#0F172A', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },
  accentBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  noteText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  exampleBox: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  exampleEn: { fontSize: 14, fontStyle: 'italic', color: '#1E293B', fontWeight: '500' },
  exampleTr: { fontSize: 13, color: '#64748B', marginTop: 3 },
});
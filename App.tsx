// App.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Keyboard,
  Linking,
  StatusBar,
  Platform,
} from 'react-native';
import { ALL_WORDS, searchWords } from './services/searchService';
import { speakEnglish, AccentType } from './services/speechService';
import * as ExternalLinks from './services/externalLinksService';

const TOP_SAFE_MARGIN = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 12;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<any | null>(null);
  const [activeTenseGroup, setActiveTenseGroup] = useState<'present' | 'past' | 'future'>('present');
  const [accent, setAccent] = useState<AccentType>('en-US');

  const displayedWords = searchWords(searchQuery);

  const handleSpeak = (text: string, customAccent?: AccentType) => {
    if (!text) return;
    speakEnglish(text, customAccent || accent);
  };

  const handleOpenYouGlish = (word: string) => {
    const fn = (ExternalLinks as any).openYouGlish || (ExternalLinks as any).openYouglish;
    if (typeof fn === 'function') {
      fn(word);
    } else {
      Linking.openURL(`https://youglish.com/pronounce/${encodeURIComponent(word)}/english`);
    }
  };

  const handleOpenCambridge = (word: string) => {
    const fn = (ExternalLinks as any).openCambridge || (ExternalLinks as any).openCambridgeDictionary;
    if (typeof fn === 'function') {
      fn(word);
    } else {
      Linking.openURL(`https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(word)}`);
    }
  };

  // DETAY EKRANI
  if (selectedWord) {
    const filteredTenses = selectedWord.tenses?.filter((t: any) => t.time === activeTenseGroup) || [];

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.topNav}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedWord(null)}>
            <Text style={styles.backButtonText}>← Arama Ekranına Dön</Text>
          </TouchableOpacity>
          <Text style={styles.categoryBadge}>{selectedWord.categoryType}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.detailContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLemma}>{selectedWord.lemma}</Text>
                {selectedWord.ipa && <Text style={styles.detailIpa}>{selectedWord.ipa}</Text>}
              </View>

              {/* US ve UK Seslendirme Butonları */}
              <View style={styles.accentButtonsRow}>
                <TouchableOpacity
                  style={[styles.speakButton, accent === 'en-US' && styles.activeAccentBtn]}
                  onPress={() => {
                    setAccent('en-US');
                    handleSpeak(selectedWord.lemma, 'en-US');
                  }}
                >
                  <Text style={styles.speakButtonText}>🇺🇸 US 🔊</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.speakButton, accent === 'en-GB' && styles.activeAccentBtn]}
                  onPress={() => {
                    setAccent('en-GB');
                    handleSpeak(selectedWord.lemma, 'en-GB');
                  }}
                >
                  <Text style={styles.speakButtonText}>🇬🇧 UK 🔊</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.heroMeanings}>{selectedWord.meaningTr?.join(', ')}</Text>

            <View style={styles.externalLinksRow}>
              <TouchableOpacity style={styles.youglishBtn} onPress={() => handleOpenYouGlish(selectedWord.lemma)}>
                <Text style={styles.externalBtnText}>🎬 YouGlish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cambridgeBtn} onPress={() => handleOpenCambridge(selectedWord.lemma)}>
                <Text style={styles.externalBtnText}>📖 Cambridge</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* V1 - V2 - V3 Çekim Formları */}
          {selectedWord.forms && selectedWord.forms.v1 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Fiil Halleri (Dinlemek için dokun)</Text>
              <View style={styles.formsGrid}>
                <TouchableOpacity style={styles.formItem} onPress={() => handleSpeak(selectedWord.forms.v1)}>
                  <Text style={styles.formLabel}>V1 (Yalın)</Text>
                  <Text style={styles.formValue}>{selectedWord.forms.v1} 🔊</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formItem} onPress={() => handleSpeak(selectedWord.forms.v2)}>
                  <Text style={styles.formLabel}>V2 (Past)</Text>
                  <Text style={styles.formValue}>{selectedWord.forms.v2} 🔊</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formItem} onPress={() => handleSpeak(selectedWord.forms.v3)}>
                  <Text style={styles.formLabel}>V3 (Participle)</Text>
                  <Text style={styles.formValue}>{selectedWord.forms.v3} 🔊</Text>
                </TouchableOpacity>
                {selectedWord.forms.presentParticiple && (
                  <TouchableOpacity style={styles.formItem} onPress={() => handleSpeak(selectedWord.forms.presentParticiple)}>
                    <Text style={styles.formLabel}>V-ing</Text>
                    <Text style={styles.formValue}>{selectedWord.forms.presentParticiple} 🔊</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* 13 Zaman Tablosu */}
          {selectedWord.tenses && selectedWord.tenses.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Zaman Tablosu (13 Tense & Formüller)</Text>

              <View style={styles.tenseGroupTabs}>
                {(['present', 'past', 'future'] as const).map(grp => (
                  <TouchableOpacity
                    key={grp}
                    style={[styles.tenseTab, activeTenseGroup === grp && styles.activeTenseTab]}
                    onPress={() => setActiveTenseGroup(grp)}
                  >
                    <Text style={[styles.tenseTabText, activeTenseGroup === grp && styles.activeTenseTabText]}>
                      {grp === 'present' ? 'Present (4)' : grp === 'past' ? 'Past (4)' : 'Future (5)'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {filteredTenses.map((t: any) => (
                <View key={t.id} style={styles.tenseCard}>
                  <View style={styles.tenseHeaderRow}>
                    <Text style={styles.tenseName}>{t.name}</Text>
                    <Text style={styles.tenseNameTr}>{t.nameTr}</Text>
                  </View>
                  <Text style={styles.formulaText}>📐 Formül: {t.formula}</Text>

                  <View style={styles.conjugationBlock}>
                    <Text style={styles.conjTypeTitle}>➕ Olumlu (Dinlemek için cümleye dokun)</Text>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.affirmative.I)}>
                      <Text style={styles.conjLine}>• {t.forms.affirmative.I} 🔊</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.affirmative.heSheIt)}>
                      <Text style={styles.conjLine}>• {t.forms.affirmative.heSheIt} 🔊</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.affirmative.youWeThey)}>
                      <Text style={styles.conjLine}>• {t.forms.affirmative.youWeThey} 🔊</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.conjugationBlock}>
                    <Text style={styles.conjTypeTitle}>➖ Olumsuz (Negative)</Text>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.negative.I)}>
                      <Text style={styles.conjLine}>• {t.forms.negative.I} 🔊</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.negative.heSheIt)}>
                      <Text style={styles.conjLine}>• {t.forms.negative.heSheIt} 🔊</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.negative.youWeThey)}>
                      <Text style={styles.conjLine}>• {t.forms.negative.youWeThey} 🔊</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.conjugationBlock}>
                    <Text style={styles.conjTypeTitle}>❓ Soru (Interrogative)</Text>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.interrogative.I)}>
                      <Text style={styles.conjLine}>• {t.forms.interrogative.I} 🔊</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.interrogative.heSheIt)}>
                      <Text style={styles.conjLine}>• {t.forms.interrogative.heSheIt} 🔊</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSpeak(t.forms.interrogative.youWeThey)}>
                      <Text style={styles.conjLine}>• {t.forms.interrogative.youWeThey} 🔊</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Senses */}
          {selectedWord.senses && selectedWord.senses.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Anlam Katmanları & Örnek Cümleler</Text>
              {selectedWord.senses.map((sense: any, idx: number) => (
                <View key={idx} style={styles.senseCard}>
                  <Text style={styles.senseTitle}>{sense.titleTr}</Text>
                  {sense.descriptionTr && <Text style={styles.senseDesc}>{sense.descriptionTr}</Text>}
                  <TouchableOpacity onPress={() => handleSpeak(sense.exampleEn)}>
                    <Text style={styles.exampleEn}>🇬🇧 {sense.exampleEn} 🔊</Text>
                  </TouchableOpacity>
                  <Text style={styles.exampleTr}>🇹🇷 {sense.exampleTr}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Word Family */}
          {selectedWord.wordFamily && selectedWord.wordFamily.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Kelime Ailesi (Word Family)</Text>
              {selectedWord.wordFamily.map((fam: any, idx: number) => (
                <View key={idx} style={styles.familyCard}>
                  <View style={styles.familyTopRow}>
                    <TouchableOpacity onPress={() => handleSpeak(fam.word)}>
                      <Text style={styles.familyWord}>{fam.word} ({fam.partOfSpeech}) 🔊</Text>
                    </TouchableOpacity>
                    <Text style={styles.familyMeaning}>{fam.meaningTr}</Text>
                  </View>
                  {fam.exampleEn && (
                    <TouchableOpacity onPress={() => handleSpeak(fam.exampleEn)}>
                      <Text style={styles.exampleEn}>🇬🇧 {fam.exampleEn} 🔊</Text>
                    </TouchableOpacity>
                  )}
                  {fam.exampleTr && <Text style={styles.exampleTr}>🇹🇷 {fam.exampleTr}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Phrasal Verbs */}
          {selectedWord.phrasalVerbs && selectedWord.phrasalVerbs.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Phrasal Verbs (Deyimsel Fiiller)</Text>
              {selectedWord.phrasalVerbs.map((pv: any, idx: number) => (
                <View key={idx} style={styles.subItemCard}>
                  <TouchableOpacity onPress={() => handleSpeak(pv.phrase)}>
                    <Text style={styles.subItemTitle}>{pv.phrase} 🔊 — {pv.meaningTr}</Text>
                  </TouchableOpacity>
                  {pv.exampleEn && (
                    <TouchableOpacity onPress={() => handleSpeak(pv.exampleEn)}>
                      <Text style={styles.exampleEn}>🇬🇧 {pv.exampleEn} 🔊</Text>
                    </TouchableOpacity>
                  )}
                  {pv.exampleTr && <Text style={styles.exampleTr}>🇹🇷 {pv.exampleTr}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Idioms */}
          {selectedWord.idioms && selectedWord.idioms.length > 0 && (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Deyimler ve Kalıplar (Idioms)</Text>
              {selectedWord.idioms.map((idm: any, idx: number) => (
                <View key={idx} style={styles.subItemCard}>
                  <TouchableOpacity onPress={() => handleSpeak(idm.idiom)}>
                    <Text style={styles.subItemTitle}>{idm.idiom} 🔊 — {idm.meaningTr}</Text>
                  </TouchableOpacity>
                  {idm.exampleEn && (
                    <TouchableOpacity onPress={() => handleSpeak(idm.exampleEn)}>
                      <Text style={styles.exampleEn}>🇬🇧 {idm.exampleEn} 🔊</Text>
                    </TouchableOpacity>
                  )}
                  {idm.exampleTr && <Text style={styles.exampleTr}>🇹🇷 {idm.exampleTr}</Text>}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ANA ARAMA EKRANI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>360° İngilizce Morfoloji & Sözlük</Text>
        <Text style={styles.headerSub}>Toplam {ALL_WORDS.length} kelime, fiil ve kalıp hazır</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Kelime, V2/V3 hali veya Türkçe anlam ara..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setSearchQuery('')}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayedWords}
        keyExtractor={(item, index) => `${item.id || item.lemma}_${index}`}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordCard}
            onPress={() => {
              Keyboard.dismiss();
              setSelectedWord(item);
            }}
          >
            <View style={styles.wordCardHeader}>
              <View style={styles.wordTitleRow}>
                <Text style={styles.wordLemma}>{item.lemma}</Text>
                {item.ipa && <Text style={styles.wordIpa}>{item.ipa}</Text>}
              </View>
              <Text style={styles.categoryBadge}>{item.categoryType}</Text>
            </View>

            <Text style={styles.wordMeaning}>{item.meaningTr?.join(', ')}</Text>

            {item.forms?.v1 && (
              <Text style={styles.wordFormsPreview}>
                V1: {item.forms.v1}  •  V2: {item.forms.v2}  •  V3: {item.forms.v3}
              </Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: TOP_SAFE_MARGIN,
  },
  headerBox: { marginBottom: 14 },
  headerTitle: { fontSize: 21, fontWeight: 'bold', color: '#ffffff' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 3 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  searchBar: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  clearBtn: { position: 'absolute', right: 12, padding: 8 },
  clearBtnText: { color: '#aaa', fontSize: 16, fontWeight: 'bold' },
  listContainer: { paddingBottom: 30 },
  wordCard: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  wordCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  wordTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  wordLemma: { fontSize: 19, fontWeight: 'bold', color: '#ffffff' },
  wordIpa: { fontSize: 13, color: '#888' },
  categoryBadge: {
    fontSize: 11,
    color: '#38bdf8',
    backgroundColor: 'rgba(56,189,248,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '600',
  },
  wordMeaning: { fontSize: 14, color: '#d4d4d8', marginBottom: 4 },
  wordFormsPreview: { fontSize: 12, color: '#4ade80', marginTop: 4, fontWeight: '500' },

  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  backButton: {
    backgroundColor: '#262626',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  backButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  detailContainer: { paddingBottom: 50, paddingTop: 6 },
  heroCard: {
    backgroundColor: '#1e1e1e',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  detailLemma: { fontSize: 30, fontWeight: 'bold', color: '#ffffff' },
  detailIpa: { fontSize: 15, color: '#a1a1aa', marginTop: 2 },
  accentButtonsRow: { flexDirection: 'row', gap: 6 },
  speakButton: {
    backgroundColor: '#27272a',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  activeAccentBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#60a5fa',
  },
  speakButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  heroMeanings: { fontSize: 17, color: '#e4e4e7', marginTop: 12, marginBottom: 14, fontWeight: '500' },
  externalLinksRow: { flexDirection: 'row', gap: 10 },
  youglishBtn: {
    flex: 1,
    backgroundColor: '#b91c1c',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cambridgeBtn: {
    flex: 1,
    backgroundColor: '#1d4ed8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  externalBtnText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },

  sectionBox: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2e2e2e',
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#38bdf8', marginBottom: 12 },
  formsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  formItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#27272a',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  formLabel: { fontSize: 11, color: '#a1a1aa', marginBottom: 2 },
  formValue: { fontSize: 15, fontWeight: 'bold', color: '#4ade80' },

  tenseGroupTabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tenseTab: {
    flex: 1,
    backgroundColor: '#27272a',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  activeTenseTab: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
  tenseTabText: { color: '#a1a1aa', fontSize: 13, fontWeight: '600' },
  activeTenseTabText: { color: '#ffffff' },

  tenseCard: {
    backgroundColor: '#262626',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#363636',
  },
  tenseHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tenseName: { fontSize: 15, fontWeight: 'bold', color: '#fb923c' },
  tenseNameTr: { fontSize: 12, color: '#a1a1aa' },
  formulaText: { fontSize: 13, color: '#38bdf8', fontWeight: '600', marginBottom: 10 },
  conjugationBlock: { marginBottom: 8 },
  conjTypeTitle: { fontSize: 12, fontWeight: 'bold', color: '#d4d4d8', marginBottom: 2 },
  conjLine: { fontSize: 13, color: '#e4e4e7', paddingLeft: 4, lineHeight: 22 },

  senseCard: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#2e2e2e', paddingBottom: 10 },
  senseTitle: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', marginBottom: 2 },
  senseDesc: { fontSize: 13, color: '#a1a1aa', marginBottom: 6 },
  exampleEn: { fontSize: 14, color: '#4ade80', fontStyle: 'italic', marginTop: 4 },
  exampleTr: { fontSize: 13, color: '#a1a1aa', marginTop: 2 },

  familyCard: { backgroundColor: '#262626', padding: 10, borderRadius: 8, marginBottom: 8 },
  familyTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  familyWord: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  familyMeaning: { color: '#fbbf24', fontSize: 13, fontWeight: '600' },

  subItemCard: { backgroundColor: '#262626', padding: 10, borderRadius: 8, marginBottom: 8 },
  subItemTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
});
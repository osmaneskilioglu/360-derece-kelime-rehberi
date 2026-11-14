// App.tsx
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DepthSections } from './components/DepthSections';
import { TensesSection } from './components/TensesSection';
import { UsageSection } from './components/UsageSection';
import { VerbHeader } from './components/VerbHeader';
import { WordFamilySection } from './components/WordFamilySection';
import { getWordDepth } from './data/depthData';
import {
  fetchWordOnline,
  getSavedWordByLemma,
  getSavedWordsList,
  isWordSavedLocally,
  loadUserSavedWords,
  removeWordFromLocal,
  saveWordToLocal,
} from './services/hybridDictionaryService';
import { findVerb, searchWords } from './services/searchService';
import { speakEnglish } from './services/speechService';

const QUICK_PICKS = ['satisfy', 'decide', 'look', 'take', 'make', 'get', 'give', 'keep'];

export default function App() {
  const [query, setQuery] = useState('');
  const [savedWords, setSavedWords] = useState<any[]>([]);
  const [onlineResult, setOnlineResult] = useState<{ verb: any; depth: any } | null>(null);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [onlineError, setOnlineError] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  // Uygulama açıldığında kullanıcının lokale kaydettiği kelimeleri yükle
  useEffect(() => {
    loadUserSavedWords().then(() => {
      setSavedWords(getSavedWordsList());
    });
  }, [refreshTick]);

  const cleanQuery = query.trim();
  const localResult = findVerb(cleanQuery);
  const savedLocalMatch = !localResult && cleanQuery ? getSavedWordByLemma(cleanQuery) : null;

  // Aktif gösterilecek kelime (Önce çekirdek DB, sonra kullanıcının kaydettiği lokal DB, en son Online sonuç)
  const activeVerb =
    localResult?.verb ||
    savedLocalMatch?.verb ||
    (onlineResult?.verb?.lemma?.toLowerCase() === cleanQuery.toLowerCase()
      ? onlineResult.verb
      : null);

  const activeMatch =
    localResult?.match ||
    (activeVerb
      ? {
          kind: 'lemma',
          type: 'lemma',
          matchedTerm: activeVerb.lemma,
          matchedWord: activeVerb.lemma,
        }
      : null);

  const activeDepth =
    savedLocalMatch?.depth ||
    (onlineResult?.verb?.lemma?.toLowerCase() === activeVerb?.lemma?.toLowerCase()
      ? onlineResult?.depth
      : undefined) ||
    getWordDepth(activeVerb);

  const hasQuery = cleanQuery.length > 0;
  const suggestions = hasQuery && !activeVerb ? searchWords(cleanQuery).slice(0, 6) : [];
  const isSaved = isWordSavedLocally(activeVerb?.lemma);

  // Lokal veritabanında bulunamayan kelimeler için otomatik veya butonla Online arama
  const handleOnlineSearch = async (wordToFetch: string) => {
    const target = wordToFetch.trim();
    if (!target) return;
    setLoadingOnline(true);
    setOnlineError(false);
    const fetched = await fetchWordOnline(target);
    setLoadingOnline(false);
    if (fetched) {
      setOnlineResult(fetched);
    } else {
      setOnlineError(true);
    }
  };

  const handleToggleSaveLocal = async () => {
    if (!activeVerb) return;
    if (isSaved) {
      await removeWordFromLocal(activeVerb.lemma);
    } else {
      await saveWordToLocal(activeVerb, activeDepth);
    }
    setSavedWords(getSavedWordsList());
    setRefreshTick((t) => t + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {/* Üst Arama Kutusu ve Hızlı Çipler */}
      <View style={styles.searchBox}>
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setOnlineError(false);
          }}
          onSubmitEditing={() => {
            if (!localResult && !savedLocalMatch && cleanQuery) {
              handleOnlineSearch(cleanQuery);
            }
          }}
          placeholder="Kelime ara (lokalde yoksa online çeker)..."
          placeholderTextColor="#8A92AB"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={styles.input}
        />

        {/* Hızlı Seçim + Kullanıcının Lokale Kaydettiği Kelimeler */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
          keyboardShouldPersistTaps="handled"
        >
          {savedWords.map((sw) => {
            const active = cleanQuery.toLowerCase() === sw.lemma.toLowerCase();
            return (
              <Pressable
                key={`saved_${sw.lemma}`}
                onPress={() => setQuery(sw.lemma)}
                style={[styles.savedChip, active && styles.quickChipActive]}
              >
                <Text style={[styles.savedChipText, active && styles.quickChipTextActive]}>
                  📌 {sw.lemma}
                </Text>
              </Pressable>
            );
          })}

          {QUICK_PICKS.map((word) => {
            const active = cleanQuery.toLowerCase() === word;
            return (
              <Pressable
                key={word}
                onPress={() => setQuery(word)}
                style={[styles.quickChip, active && styles.quickChipActive]}
              >
                <Text style={[styles.quickChipText, active && styles.quickChipTextActive]}>
                  {word}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        key={activeVerb?.id ?? 'empty'}
        keyboardShouldPersistTaps="handled"
      >
        {activeVerb && activeMatch ? (
          <>
            {/* 1. KULLANICI İSTEĞİ: SAYFANIN EN ÜSTÜNDE SESLENDİRME (US/UK) VE LOKALE KAYDET BARI */}
            <View style={styles.topActionBar}>
              <View style={styles.audioGroup}>
                <Pressable
                  onPress={() => speakEnglish(activeVerb.lemma, 'en-US')}
                  style={({ pressed }) => [styles.audioBtn, pressed && styles.btnPressed]}
                >
                  <Text style={styles.audioBtnText}>🇺🇸 US Dinle 🔊</Text>
                </Pressable>

                <Pressable
                  onPress={() => speakEnglish(activeVerb.lemma, 'en-GB')}
                  style={({ pressed }) => [styles.audioBtnUk, pressed && styles.btnPressed]}
                >
                  <Text style={styles.audioBtnText}>🇬🇧 UK Dinle 🔊</Text>
                </Pressable>
              </View>

              <Pressable
                onPress={handleToggleSaveLocal}
                style={({ pressed }) => [
                  styles.saveLocalBtn,
                  isSaved && styles.saveLocalBtnActive,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={[styles.saveLocalBtnText, isSaved && styles.saveLocalBtnTextActive]}>
                  {isSaved ? '✅ Lokalde Kayıtlı' : '📥 Lokale Ekle'}
                </Text>
              </Pressable>
            </View>

            {/* Orijinal Bileşenlerin */}
            <VerbHeader verb={activeVerb} match={activeMatch} />
            <WordFamilySection verb={activeVerb} match={activeMatch} />
            <TensesSection verb={activeVerb} />
            <UsageSection verb={activeVerb} />
            <DepthSections lemma={activeVerb.lemma} depth={activeDepth} />
          </>
        ) : (
          <View style={styles.emptyBox}>
            {hasQuery ? (
              <View style={styles.onlineFallbackBox}>
                <Text style={styles.empty}>
                  "{cleanQuery}" çevrimdışı (offline) çekirdek sözlükte bulunamadı.
                </Text>

                {/* HİBRİT YAPI: Online Sözlükten Canlı Çekme Butonu */}
                <Pressable
                  onPress={() => handleOnlineSearch(cleanQuery)}
                  disabled={loadingOnline}
                  style={({ pressed }) => [
                    styles.onlineFetchBtn,
                    pressed && styles.btnPressed,
                  ]}
                >
                  {loadingOnline ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.onlineFetchBtnText}>
                      🌐 "{cleanQuery}" Kelimesini Online Sözlükten Getir
                    </Text>
                  )}
                </Pressable>

                {onlineError && (
                  <Text style={styles.errorText}>
                    Online veritabanında "{cleanQuery}" için kayıt bulunamadı veya internet bağlantısı yok.
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.empty}>
                Başlamak için yukarıdan bir kelime seç ya da arama kutusuna istediğin bir İngilizce kelimeyi yaz.
              </Text>
            )}

            {suggestions.length > 0 && (
              <View style={styles.suggestionList}>
                <Text style={styles.suggestionTitle}>Lokal veritabanındaki yakın sonuçlar:</Text>
                <View style={styles.suggestionWrap}>
                  {suggestions.map((item) => (
                    <Pressable
                      key={item.id || item.lemma}
                      onPress={() => setQuery(item.lemma)}
                      style={styles.quickChip}
                    >
                      <Text style={styles.quickChipText}>
                        {item.lemma} ({item.meaningTr?.[0]})
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 16,
    color: '#16213E',
    backgroundColor: '#F1F3FA',
  },
  quickRow: {
    paddingTop: 10,
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF2FC',
  },
  savedChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E2F3EA',
    borderWidth: 1,
    borderColor: '#1B6B44',
  },
  savedChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B6B44',
  },
  quickChipActive: {
    backgroundColor: '#16213E',
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16213E',
  },
  quickChipTextActive: {
    color: '#FFFFFF',
  },

  /* En Üst Seslendirme & Lokale Kaydet Barı */
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  audioGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  audioBtn: {
    backgroundColor: '#16213E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  audioBtnUk: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  audioBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  saveLocalBtn: {
    backgroundColor: '#EEF2FC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#16213E',
  },
  saveLocalBtnActive: {
    backgroundColor: '#E2F3EA',
    borderColor: '#1B6B44',
  },
  saveLocalBtnText: {
    color: '#16213E',
    fontSize: 13,
    fontWeight: '700',
  },
  saveLocalBtnTextActive: {
    color: '#1B6B44',
  },
  btnPressed: {
    opacity: 0.8,
  },

  emptyBox: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  onlineFallbackBox: {
    gap: 14,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5B6480',
  },
  onlineFetchBtn: {
    backgroundColor: '#16213E',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  onlineFetchBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    lineHeight: 19,
  },
  suggestionList: {
    marginTop: 20,
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6480',
  },
  suggestionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
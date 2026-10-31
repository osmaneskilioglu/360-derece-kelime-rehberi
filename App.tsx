// App.tsx
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VerbHeader } from './components/VerbHeader';
import { UsageSection } from './components/UsageSection';
import { WordFamilySection } from './components/WordFamilySection';
import { TensesSection } from './components/TensesSection';
import { findVerb, getSuggestions } from './services/searchService';
import { speakEnglish, AccentType } from './services/speechService';
import { mockVerbs } from './data/mockVerbs';

const QUICK_DERIVATIVES = [
  { word: 'dissatisfied', note: 'Olumsuz Sıfat' },
  { word: 'unbreakable', note: 'Zıt Sıfat' },
  { word: 'misunderstanding', note: 'Olumsuz İsim' },
  { word: 'indecisive', note: 'Olumsuz Sıfat' },
  { word: 'disagreement', note: 'Zıt İsim' },
  { word: 'disconnected', note: 'Olumsuz Sıfat' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [accent, setAccent] = useState<AccentType>('en-US');

  const result = findVerb(query);
  const hasQuery = query.trim().length > 0;

  const suggestions = hasQuery ? getSuggestions(query).slice(0, 5) : [];

  const handleSelectWord = (text: string) => {
    setQuery(text);
  };

  const toggleAccent = () => {
    setAccent((prev) => (prev === 'en-US' ? 'en-GB' : 'en-US'));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {/* Üst Arama Kutusu */}
      <View style={styles.searchBox}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Fiil veya türev ara (break, dissatisfied...)"
            placeholderTextColor="#8A92AB"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          {hasQuery && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setQuery('')}
            >
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Canlı Öneri Listesi */}
        {suggestions.length > 0 && !result && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((item: any, index: number) => {
              const wordText =
                typeof item === 'string' ? item : item?.word || item?.text || '';
              const typeText = typeof item === 'string' ? null : item?.type;

              return (
                <TouchableOpacity
                  key={`${wordText}-${index}`}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectWord(wordText)}
                >
                  <Text style={styles.suggestionWord}>{wordText}</Text>
                  {typeText ? (
                    <Text style={styles.suggestionType}>
                      {typeText === 'lemma' ? 'fiil' : typeText}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <ScrollView
        key={result?.verb ? result.verb.lemma : 'home'}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {result ? (
          <>
            {/* Ana Fiil Başlığı */}
            <VerbHeader verb={result.verb} match={result.match} />

            {/* Sesli Telaffuz Barı ve Aksan Seçici */}
            <View style={styles.audioBar}>
              <View style={styles.audioChipsRow}>
                <TouchableOpacity
                  style={styles.audioChip}
                  onPress={() => speakEnglish(result.verb.forms.v1, accent)}
                >
                  <Text style={styles.audioChipText}>
                    🔊 V1: {result.verb.forms.v1}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.audioChip}
                  onPress={() => speakEnglish(result.verb.forms.v2, accent)}
                >
                  <Text style={styles.audioChipText}>
                    🔊 V2: {result.verb.forms.v2}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.audioChip}
                  onPress={() => speakEnglish(result.verb.forms.v3, accent)}
                >
                  <Text style={styles.audioChipText}>
                    🔊 V3: {result.verb.forms.v3}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.accentBtn}
                onPress={toggleAccent}
              >
                <Text style={styles.accentBtnText}>
                  {accent === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 360° Anlamlar, Phrasal Verbs ve Deyimler */}
            <UsageSection verb={result.verb} />

            {/* Kelime Ailesi (Word Family) */}
            <WordFamilySection verb={result.verb} match={result.match} />

            {/* 12 Zaman Çekimi */}
            <TensesSection verb={result.verb} />
          </>
        ) : hasQuery ? (
          /* Arama Sonucu Bulunamadıysa */
          <View style={styles.notFoundBox}>
            <Text style={styles.notFoundTitle}>Sonuç Bulunamadı</Text>
            <Text style={styles.notFoundDesc}>
              "{query}" ile eşleşen bir kelime bulamadık. Aşağıdaki hazır kelimelerden birini seçerek test edebilirsiniz:
            </Text>
            <View style={styles.chipGrid}>
              {mockVerbs.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.quickChip}
                  onPress={() => handleSelectWord(v.lemma)}
                >
                  <Text style={styles.quickChipText}>{v.lemma}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* Başlangıç / Keşfet Ekranı (Boş Durum) */
          <View style={styles.homeContainer}>
            {/* Karşılama Kartı */}
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>360° İngilizce Fiil & Kelime Ailesi</Text>
              <Text style={styles.heroSubtitle}>
                Bir fiilin V1/V2/V3 çekimlerini, 12 zaman tablosunu, Phrasal Verb kalıplarını ve aynı kökten türeyen zıt anlamlı kelimeleri tek ekranda keşfedin.
              </Text>
            </View>

            {/* Ters Arama / Türev Deneme Etiketleri */}
            <Text style={styles.homeSectionTitle}>
              Türev ve Zıt Kelime Aramayı Dene
            </Text>
            <Text style={styles.homeSectionSub}>
              Sadece kök fiili değil, türetilmiş kelimeleri yazdığınızda da ana tabloya ulaşırsınız:
            </Text>
            <View style={styles.derivativeGrid}>
              {QUICK_DERIVATIVES.map((item) => (
                <TouchableOpacity
                  key={item.word}
                  style={styles.derivativeChip}
                  onPress={() => handleSelectWord(item.word)}
                >
                  <Text style={styles.derivativeWord}>{item.word}</Text>
                  <Text style={styles.derivativeNote}>{item.note}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tüm Fiil Kartları */}
            <Text style={[styles.homeSectionTitle, { marginTop: 24 }]}>
              Keşfedilecek Fiiller ({mockVerbs.length})
            </Text>
            <View style={styles.verbList}>
              {mockVerbs.map((verb) => (
                <TouchableOpacity
                  key={verb.id}
                  style={styles.verbCard}
                  onPress={() => handleSelectWord(verb.lemma)}
                  activeOpacity={0.75}
                >
                  <View style={styles.verbCardTop}>
                    <View style={styles.verbCardTitleRow}>
                      <Text style={styles.verbCardLemma}>{verb.lemma}</Text>
                      {verb.ipa ? (
                        <Text style={styles.verbCardIpa}>{verb.ipa}</Text>
                      ) : null}
                    </View>
                    <View
                      style={[
                        styles.regBadge,
                        verb.isRegular ? styles.regBadgeBlue : styles.regBadgeAmber,
                      ]}
                    >
                      <Text
                        style={[
                          styles.regBadgeText,
                          verb.isRegular
                            ? styles.regBadgeTextBlue
                            : styles.regBadgeTextAmber,
                        ]}
                      >
                        {verb.isRegular ? 'Regular' : 'Irregular'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.verbCardMeaning}>
                    {verb.meaningTr.join(', ')}
                  </Text>

                  <View style={styles.verbCardBottom}>
                    <Text style={styles.verbCardForms}>
                      {verb.forms.v1} → {verb.forms.v2} → {verb.forms.v3}
                    </Text>
                    <Text style={styles.verbCardCount}>
                      {verb.wordFamily.length} türev kelime ›
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchBox: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#0F172A',
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
  },
  audioBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 8,
  },
  audioChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  audioChip: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  audioChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  accentBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  accentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionWord: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  suggestionType: {
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  homeContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#CBD5E1',
  },
  homeSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  homeSectionSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  derivativeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  derivativeChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  derivativeWord: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  derivativeNote: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  verbList: {
    gap: 12,
    marginTop: 8,
  },
  verbCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  verbCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verbCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  verbCardLemma: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  verbCardIpa: {
    fontSize: 13,
    color: '#64748B',
  },
  regBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  regBadgeBlue: {
    backgroundColor: '#DBEAFE',
  },
  regBadgeAmber: {
    backgroundColor: '#FEF3C7',
  },
  regBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  regBadgeTextBlue: {
    color: '#1D4ED8',
  },
  regBadgeTextAmber: {
    color: '#B45309',
  },
  verbCardMeaning: {
    fontSize: 14,
    color: '#475569',
    marginTop: 6,
    marginBottom: 12,
  },
  verbCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  verbCardForms: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  verbCardCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  notFoundBox: {
    padding: 20,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  notFoundDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});
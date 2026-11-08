// components/TensesSection.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Verb } from '../types/verb';

interface Props {
  verb: Verb;
}

// Tüm zamanlar için profesyonel, sosyal ve iş hayatında geçerli gerçek hayat karşılığı rehberi
const TENSE_PSYCHOLOGY_MAP: Record<string, { vibe: string; nuance: string }> = {
  present_simple: {
    vibe: '"Genel olarak durum bu." Hayatın rutinlerini, değişmez kuralları ve alışkanlıkları anlatır.',
    nuance: 'Pratik kullanım: Kalıcı durumlar (örn: "I live in Istanbul", olumsuzda "I don\'t know").',
  },
  present_continuous: {
    vibe: '"Şu an bu sürecin ortasındayım." Anlık yapılan işleri veya bu döneme mahsus geçici durumları ifade eder.',
    nuance: 'Pratik kullanım: Günlük akıştaki geçici durumlar (örn: "I\'m working on a new project this week").',
  },
  present_perfect: {
    vibe: '"Zamanı boş ver, sonuca bak." Eylemin ne zaman yapıldığı değil, şu ana olan etkisi ve deneyim önemlidir.',
    nuance: 'Pratik kullanım: Yaşanmışlıklar (örn: "I\'ve already checked the reports", olumsuzda "I haven\'t seen it").',
  },
  present_perfectContinuous: {
    vibe: '"Bir süredir bununla uğraşıyorum." Geçmişten beri kesintisiz devam eden yoğun sürece vurgu yapar.',
    nuance: 'Pratik kullanım: Uzun süren işler (örn: "We\'ve been discussing this issue for hours").',
  },
  past_simple: {
    vibe: '"O olay bitti ve kapandı." Geçmişte belirli bir zamanda yaşanmış ve o an bitmiş eylemlerdir.',
    nuance: 'Pratik kullanım: Net geçmiş zaman (örn: "We signed the contract yesterday", olumsuzda "I didn\'t notice").',
  },
  past_continuous: {
    vibe: '"O sırada tam olarak bunu yapıyordum." Geçmişteki bir anda devam eden ve başka bir olayla bölünen süreç.',
    nuance: 'Pratik kullanım: Geçmişteki kesintili anlar (örn: "I was reviewing emails when you called").',
  },
  past_perfect: {
    vibe: '"O olaydan çok daha önce zaten gerçekleşmişti." Geçmişteki iki olay arasında öncelik sırası kurar.',
    nuance: 'Pratik kullanım: Geçmişin geçmişi (örn: "The system had already crashed before we logged in").',
  },
  past_perfectContinuous: {
    vibe: '"O olay olana kadar uzun süredir o işi yürütüyordum."',
    nuance: 'Pratik kullanım: Geçmişteki o ana kadarki yoğun süreç (örn: "He had been working there for 5 years").',
  },
  future_simple: {
    vibe: '"Şimdi karar verdim" veya "Bence ileride böyle olacak (tahmin)."',
    nuance: 'Pratik kullanım: Anlık kararlar ve genel tahminler (örn: "I\'ll handle this issue", olumsuzda "It won\'t take long").',
  },
  future_goingTo: {
    vibe: '"Kafama koydum, planımı yaptım" veya "Kanıtı var, geliyor gelmekte olan."',
    nuance: 'Pratik kullanım: Önceden niyet edilmiş planlar ve görünen kanıtlar (örn: "Look at those black clouds! It is going to rain").',
  },
  future_continuous: {
    vibe: '"Gelecekteki o saatte tam olarak bu işin ortasında olacağım."',
    nuance: 'Pratik kullanım: Gelecekteki meşguliyet (örn: "Tomorrow at 10 AM, I\'ll be attending a meeting").',
  },
  future_perfect: {
    vibe: '"Gelecekteki o tarihe kadar bu iş kesinlikle bitmiş olacak (Deadline)."',
    nuance: 'Pratik kullanım: Zaman sınırlı hedefler (örn: "We\'ll have completed the migration by Friday").',
  },
  future_perfectContinuous: {
    vibe: '"Gelecekteki o noktaya geldiğimde bu süreci uzun süredir yapıyor olacağım."',
    nuance: 'Pratik kullanım: Süre vurgusu (örn: "Next year, I\'ll have been managing this team for 3 years").',
  },
};

export function TensesSection({ verb }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'present' | 'past' | 'future'>('all');
  const [expandedTenseId, setExpandedTenseId] = useState<string | null>(null);

  if (!verb.tenses || verb.tenses.length === 0) return null;

  const filteredTenses = verb.tenses.filter((t) => {
    if (selectedFilter === 'all') return true;
    return t.time === selectedFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedTenseId(expandedTenseId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Zaman Çekimleri (Tenses)</Text>
      <Text style={styles.sectionSubtitle}>
        Formüllerin ötesinde, hem sosyal hem iş hayatında kabul gören doğal akışıyla zaman yapıları:
      </Text>

      {/* Filtre Butonları */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, selectedFilter === 'all' && styles.filterBtnActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            Tümü ({verb.tenses.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, selectedFilter === 'present' && styles.filterBtnActive]}
          onPress={() => setSelectedFilter('present')}
        >
          <Text style={[styles.filterText, selectedFilter === 'present' && styles.filterTextActive]}>
            Present
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, selectedFilter === 'past' && styles.filterBtnActive]}
          onPress={() => setSelectedFilter('past')}
        >
          <Text style={[styles.filterText, selectedFilter === 'past' && styles.filterTextActive]}>
            Past
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, selectedFilter === 'future' && styles.filterBtnActive]}
          onPress={() => setSelectedFilter('future')}
        >
          <Text style={[styles.filterText, selectedFilter === 'future' && styles.filterTextActive]}>
            Future
          </Text>
        </TouchableOpacity>
      </View>

      {/* Zaman Kartları */}
      {filteredTenses.map((t) => {
        const isExpanded = expandedTenseId === t.id;
        const psychology = TENSE_PSYCHOLOGY_MAP[t.id];

        return (
          <View key={t.id} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleExpand(t.id)}
              activeOpacity={0.8}
            >
              {/* Sol taraf: Zaman Adı */}
              <View style={styles.headerLeft}>
                <Text style={styles.tenseName}>{t.name}</Text>
                <Text style={styles.tenseNameTr}>{t.nameTr}</Text>
              </View>

              {/* Sağ taraf: Sıkışmayı önlemek için formül ve ok simgesi alt alta/ferah */}
              <View style={styles.headerRight}>
                <View style={styles.formulaBadge}>
                  <Text style={styles.formulaText}>{t.formula}</Text>
                </View>
                <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>

            {/* Psikolojik / Profesyonel Niyet Açıklaması */}
            {psychology && (
              <View style={styles.psychologyBox}>
                <Text style={styles.psychologyTitle}>🧠 Gerçek Hayat Karşılığı:</Text>
                <Text style={styles.psychologyVibe}>{psychology.vibe}</Text>
                <Text style={styles.psychologyNuance}>📌 {psychology.nuance}</Text>
              </View>
            )}

            {/* Geniş ve Ferah Çekim Alanı */}
            {isExpanded && (
              <View style={styles.detailsContainer}>
                {(['I', 'heSheIt', 'youWeThey'] as const).map((subj) => (
                  <View key={subj} style={styles.rowCard}>
                    <Text style={styles.rowPronoun}>
                      {subj === 'I' ? 'I (Ben)' : subj === 'heSheIt' ? 'He / She / It (O)' : 'You / We / They'}
                    </Text>
                    <View style={styles.rowForms}>
                      <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Olumlu (+)</Text>
                        <Text style={styles.formValue}>{t.forms.affirmative[subj]}</Text>
                      </View>
                      <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Olumsuz (-)</Text>
                        <Text style={styles.formValue}>{t.forms.negative[subj]}</Text>
                      </View>
                      <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Soru (?)</Text>
                        <Text style={styles.formValue}>{t.forms.interrogative[subj]}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 12, lineHeight: 18 },
  filterRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#FFFFFF' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Uzun başlıklarda hizalamayı düzelttik
  },
  headerLeft: {
    flex: 1,
    paddingRight: 8,
  },
  tenseName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  tenseNameTr: { fontSize: 11, color: '#64748B', marginTop: 1 },
  headerRight: { 
    alignItems: 'flex-end', 
    gap: 6,
  },
  formulaBadge: { 
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8,
  },
  formulaText: { fontSize: 11, fontWeight: '600', color: '#334155' },
  chevron: { fontSize: 12, color: '#64748B', fontWeight: '700', paddingHorizontal: 4 },
  psychologyBox: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  psychologyTitle: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginBottom: 3 },
  psychologyVibe: { fontSize: 12, color: '#334155', lineHeight: 17, marginBottom: 4 },
  psychologyNuance: { fontSize: 11, fontStyle: 'italic', color: '#64748B', lineHeight: 16 },
  detailsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    gap: 8,
  },
  rowCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rowPronoun: { fontSize: 12, fontWeight: '700', color: '#2563EB', marginBottom: 6 },
  rowForms: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  formItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  formLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 2 },
  formValue: { fontSize: 11, fontWeight: '600', color: '#0F172A', textAlign: 'center' },
});
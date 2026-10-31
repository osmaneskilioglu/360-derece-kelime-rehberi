// services/speechService.ts
import * as Speech from 'expo-speech';

export type AccentType = 'en-US' | 'en-GB';

export async function speakEnglish(text: string, accent: AccentType = 'en-US') {
  try {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }

    // Telefondaki tüm yüklü ses paketlerini getir
    const voices = await Speech.getAvailableVoicesAsync();

    // Önce seçilen aksana (en-US veya en-GB) tam uyan sesi ara (`en-US` veya `en_US` formatlarını kapsar)
    const targetPrefix = accent.toLowerCase().replace('_', '-');
    let matchedVoice = voices.find((v) =>
      v.language.toLowerCase().replace('_', '-').startsWith(targetPrefix)
    );

    // Tam aksan bulunamazsa telefondaki herhangi bir İngilizce ('en') sesi yakala
    if (!matchedVoice) {
      matchedVoice = voices.find((v) =>
        v.language.toLowerCase().startsWith('en')
      );
    }

    Speech.speak(text, {
      language: matchedVoice ? matchedVoice.language : accent,
      voice: matchedVoice?.identifier, // Türkçe motoru ezip İngilizce sesi zorlar
      rate: 0.88,
      pitch: 1.0,
    });
  } catch (error) {
    console.warn('Seslendirme hatası:', error);
  }
}
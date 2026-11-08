// services/speechService.ts
import * as Speech from 'expo-speech';

export type AccentType = 'en-US' | 'en-GB' | 'US' | 'UK';

export async function speakEnglish(
  text: string,
  accent: AccentType = 'en-US',
  rate: number = 0.85 // Daha anlaşılır ve net bir hız için biraz yavaşlattık
): Promise<void> {
  if (!text || !text.trim()) return;

  // Telefonun Türkçe dil ayarından etkilenmemesi için zorunlu İngilizce dili ve yerel ayar veriyoruz
  const language = accent === 'UK' || accent === 'en-GB' ? 'en-GB' : 'en-US';
  const cleanText = text.replace(/\//g, ' ').trim();

  try {
    // Çakışmaları önlemek için önce aktif okumayı durdur
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }

    // Doğrudan İngilizce ses motorunu tetikliyoruz
    Speech.speak(cleanText, {
      language: language,
      pitch: 1.0,
      rate: rate, // Doğal ve akıcı telaffuz hızı
    });
  } catch (error) {
    console.warn('Seslendirme hatası:', error);
  }
}

export async function stopSpeech(): Promise<void> {
  try {
    await Speech.stop();
  } catch (error) {
    console.warn('Ses durdurma hatası:', error);
  }
}

// Tüm bileşenlerle tam uyumluluk için alternatif isimlendirmeler
export const speakText = speakEnglish;
export const speak = speakEnglish;
export const speakWord = speakEnglish;

export default speakEnglish;
// services/speechService.ts
import * as Speech from 'expo-speech';

export type AccentType = 'en-US' | 'en-GB' | 'US' | 'UK';

let cachedVoices: Speech.Voice[] = [];

async function getEnglishVoiceIdentifier(targetLang: 'en-US' | 'en-GB'): Promise<string | undefined> {
  try {
    if (cachedVoices.length === 0) {
      cachedVoices = await Speech.getAvailableVoicesAsync();
    }
    if (!cachedVoices || cachedVoices.length === 0) return undefined;

    const normalizedTarget = targetLang.toLowerCase(); // 'en-us' veya 'en-gb'

    // 1. Tam eşleşen (en-US veya en-GB) ve yüksek kaliteli sesi bul
    const exactMatch = cachedVoices.find(
      (v) => v.language.toLowerCase().replace('_', '-') === normalizedTarget
    );
    if (exactMatch) return exactMatch.identifier;

    // 2. Bulamazsa herhangi bir 'en-' (İngilizce) ses motorunu bul (Türkçe motora düşmesini engeller)
    const anyEnglish = cachedVoices.find((v) =>
      v.language.toLowerCase().startsWith('en')
    );
    return anyEnglish?.identifier;
  } catch {
    return undefined;
  }
}

export async function speakEnglish(
  text: string,
  accent: AccentType = 'en-US',
  rate: number = 0.88
): Promise<void> {
  if (!text || !text.trim()) return;

  const targetLang: 'en-US' | 'en-GB' =
    accent === 'UK' || accent === 'en-GB' ? 'en-GB' : 'en-US';

  // "he/she/it" gibi ifadeleri doğal okuması için "/" işaretini boşluğa çevirir
  const cleanText = text.replace(/\//g, ' ').trim();

  try {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }

    // Telefonun içindeki gerçek İngilizce ses paketinin kimliğini (identifier) al
    const voiceId = await getEnglishVoiceIdentifier(targetLang);

    Speech.speak(cleanText, {
      language: targetLang,
      voice: voiceId, // Türkçe TTS motorunu bypass edip doğrudan İngilizce motoru zorlar
      pitch: 1.0,
      rate,
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

export const speakText = speakEnglish;
export const speak = speakEnglish;
export const speakWord = speakEnglish;

export default speakEnglish;
// services/externalLinksService.ts
import * as Linking from 'expo-linking';

export function openYouGlish(word: string) {
  const url = `https://youglish.com/pronounce/${encodeURIComponent(word)}/english`;
  Linking.openURL(url);
}

export function openCambridge(word: string) {
  const url = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(word)}`;
  Linking.openURL(url);
}
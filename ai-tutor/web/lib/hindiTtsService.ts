/**
 * Hindi TTS Service using Google Translate API
 * Generates audio URLs for Hindi text pronunciation
 */

export class HindiTTSService {
  private static readonly GOOGLE_TRANSLATE_URL = 'https://translate.google.com/translate_tts';

  /**
   * Generate Google Translate TTS URL for Hindi text
   * @param text Hindi text to pronounce
   * @returns URL to audio file
   */
  static generateAudioUrl(text: string): string {
    const params = new URLSearchParams({
      client: 'gtx',
      ie: 'UTF-8',
      q: text,
      tl: 'hi' // Hindi language
    });

    return `${this.GOOGLE_TRANSLATE_URL}?${params.toString()}`;
  }

  /**
   * Get pronunciation URLs for lesson audio steps
   * Maps sound names to Hindi text for pronunciation
   */
  static getHindiSoundUrl(soundKey: string): string {
    const soundMap: Record<string, string> = {
      // Vowels
      'hindi_a': 'अ', // Short a
      'hindi_aa': 'आ', // Long aa
      'hindi_i': 'इ', // Short i
      'hindi_ee': 'ई', // Long ee
      'hindi_u': 'उ', // Short u
      'hindi_uu': 'ऊ', // Long uu
      'hindi_ri': 'ऋ', // Ri
      'hindi_e': 'ए', // E
      'hindi_ai': 'ऐ', // AI
      'hindi_o': 'ओ', // O
      'hindi_au': 'औ', // AU
      'hindi_ang': 'अं', // Anusvara

      // Consonants - Ka group
      'hindi_ka': 'क', // Ka
      'hindi_kha': 'ख', // Kha
      'hindi_ga': 'ग', // Ga
      'hindi_gha': 'घ', // Gha

      // Consonants - Cha group
      'hindi_cha': 'च', // Cha
      'hindi_chha': 'छ', // Chha

      // Consonants - Ta group
      'hindi_ta': 'ट', // Ta (retroflex)

      // Consonants - Pa group
      'hindi_pa': 'प', // Pa
      'hindi_ba': 'ब', // Ba
      'hindi_ma': 'म', // Ma

      // Consonants - Ha
      'hindi_ha': 'ह' // Ha
    };

    const hindiText = soundMap[soundKey];
    if (!hindiText) {
      console.warn(`Sound key not found: ${soundKey}`);
      return '';
    }

    return this.generateAudioUrl(hindiText);
  }

  /**
   * Get word pronunciation URL
   * @param hindiWord Word in Hindi script
   */
  static getWordUrl(hindiWord: string): string {
    return this.generateAudioUrl(hindiWord);
  }

  /**
   * Get example sentence pronunciation
   * @param sentence Hindi sentence
   */
  static getSentenceUrl(sentence: string): string {
    return this.generateAudioUrl(sentence);
  }
}

/**
 * Board type for audio playback using Google Translate
 * Usage in lessons:
 * board: {
 *   type: "audio_playback_tts",
 *   data: {
 *     soundKey: "hindi_a", // or custom Hindi text
 *     headline: "अ की ध्वनि",
 *     prompt: "Press play and listen"
 *   }
 * }
 */
export interface TTSAudioBoardData {
  soundKey?: string; // Predefined sound key or custom Hindi text
  customText?: string; // Custom Hindi text (overrides soundKey)
  headline: string;
  prompt: string;
  autoPlay?: boolean; // Auto-play on load
}

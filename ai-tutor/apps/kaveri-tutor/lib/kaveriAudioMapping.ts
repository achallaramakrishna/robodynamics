/**
 * Kaveri Audio Mapping
 * Maps Hindi text to pre-recorded audio file URLs.
 * Returns null if no native audio is available (falls back to TTS).
 */

const AUDIO_MAP: Record<string, string> = {
  // Common Hindi words and phrases
  // Add mappings as audio files become available
};

export function getKaveriAudio(text: string): string | null {
  return AUDIO_MAP[text] || null;
}

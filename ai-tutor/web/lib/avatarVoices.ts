// Use only speakers accepted by Sarvam's current TTS validation list.
// "priya" is a safer warm English fallback for child-facing lessons.
const KID_FRIENDLY_SPEAKER = process.env.SARVAM_DEFAULT_KIDS_SPEAKER || "priya";

export const AVATAR_SPEAKER_MAP: Record<string, string> = {
  arya:  process.env.SARVAM_SPEAKER_ARYA  || "priya",
  ved:   process.env.SARVAM_SPEAKER_VED   || "aditya",
  tara:  process.env.SARVAM_SPEAKER_TARA  || "ritu",
  niva:  process.env.SARVAM_SPEAKER_NIVA  || "priya",
  raj:   process.env.SARVAM_SPEAKER_RAJ   || "aditya",   // Raj   → male voice
  nova:  process.env.SARVAM_SPEAKER_NOVA  || "priya",    // Nova  → female voice
  priya: process.env.SARVAM_SPEAKER_PRIYA || "priya",    // Priya → female voice
};

export function getSpeakerForAvatar(avatarId?: string): string {
  if (avatarId && AVATAR_SPEAKER_MAP[avatarId]) {
    return AVATAR_SPEAKER_MAP[avatarId];
  }
  return process.env.SARVAM_DEFAULT_SPEAKER || KID_FRIENDLY_SPEAKER;
}

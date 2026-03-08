export const AVATAR_SPEAKER_MAP: Record<string, string> = {
  arya: process.env.SARVAM_SPEAKER_ARYA || "priya",
  ved:  process.env.SARVAM_SPEAKER_VED  || "aditya",
  tara: process.env.SARVAM_SPEAKER_TARA || "ritu",
  niva: process.env.SARVAM_SPEAKER_NIVA || "rahul",
  raj:  process.env.SARVAM_SPEAKER_RAJ  || "kabir"   // male voice for Raj (bulbul:v3)
};

export function getSpeakerForAvatar(avatarId?: string): string {
  if (avatarId && AVATAR_SPEAKER_MAP[avatarId]) {
    return AVATAR_SPEAKER_MAP[avatarId];
  }
  return process.env.SARVAM_DEFAULT_SPEAKER || "priya";
}

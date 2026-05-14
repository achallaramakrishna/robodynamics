"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Loader } from "lucide-react";

interface AudioPlaybackTTSProps {
  soundKey?: string;
  customText?: string;
  headline?: string;
  prompt?: string;
  onPlayComplete?: () => void;
}

/**
 * AudioPlaybackTTS Component
 * Plays Hindi pronunciation via Google Translate TTS
 * Uses hindiTtsService to generate audio URLs
 */
export default function AudioPlaybackTTS({
  soundKey,
  customText,
  headline = "Listen to the sound",
  prompt = "Press play and listen carefully",
  onPlayComplete,
}: AudioPlaybackTTSProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");

  // Fetch Google TTS audio via our server proxy to avoid browser CORS issues.
  useEffect(() => {
    let cancelled = false;

    const generateAudioUrl = async () => {
      try {
        // Map sound keys to Hindi text
        const soundMap: Record<string, string> = {
          hindi_a: "अ",
          hindi_aa: "आ",
          hindi_i: "इ",
          hindi_ii: "ई",
          hindi_u: "उ",
          hindi_uu: "ऊ",
          hindi_ri: "ऋ",
          hindi_e: "ए",
          hindi_ai: "ऐ",
          hindi_o: "ओ",
          hindi_au: "औ",
          hindi_am: "अं",
          hindi_ah: "अः",
          hindi_ka: "क",
          hindi_kha: "ख",
          hindi_ga: "ग",
          hindi_gha: "घ",
          hindi_cha: "च",
          hindi_chha: "छ",
          hindi_ja: "ज",
          hindi_jha: "झ",
          hindi_ta: "ट",
          hindi_tha: "ठ",
          hindi_da: "ड",
          hindi_dha: "ढ",
          hindi_na_dental: "त",
          hindi_pa: "प",
          hindi_pha: "फ",
          hindi_ba: "ब",
          hindi_bha: "भ",
          hindi_ma: "म",
          hindi_ya: "य",
          hindi_ra: "र",
          hindi_la: "ल",
          hindi_va: "व",
          hindi_sha: "श",
          hindi_sha_palatal: "ष",
          hindi_sa: "स",
          hindi_ha: "ह",
        };

        const textToSpeak = customText || (soundKey ? soundMap[soundKey] : "");

        if (!textToSpeak) {
          console.warn("No text to speak provided");
          return;
        }

        const response = await fetch("/api/voice/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textToSpeak, languageCode: "hi-IN" }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.audioBase64 || cancelled) {
          console.warn("Failed to fetch Google TTS audio");
          return;
        }
        const mimeType = String(data.mimeType || "audio/mpeg");
        setAudioUrl(`data:${mimeType};base64,${data.audioBase64}`);
      } catch (error) {
        console.error("Error generating audio URL:", error);
      }
    };

    generateAudioUrl();
    return () => {
      cancelled = true;
    };
  }, [soundKey, customText]);

  const handlePlay = async () => {
    if (!audioRef.current || !audioUrl) return;

    try {
      setIsLoading(true);
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onPlayComplete) {
      onPlayComplete();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{headline}</h3>
      <p className="text-sm text-gray-600 mb-6">{prompt}</p>

      {/* Audio element (hidden) */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />

      {/* Play button */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handlePlay}
          disabled={isLoading || !audioUrl}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          {isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
        </button>

        <Volume2 className="w-5 h-5 text-blue-600" />
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Time display */}
        <div className="text-xs text-gray-600 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-3 bg-blue-100 rounded border border-blue-300">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Listen to the sound multiple times. Repeat it aloud after the audio finishes.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, Volume2 } from "lucide-react";

interface MouthPositionViewerProps {
  mouthType: "wide-open" | "round" | "smile" | "labial" | "consonant";
  vowels?: string[];
  description?: string;
  onUnderstand?: () => void;
}

/**
 * MouthPositionViewer Component
 * Displays SVG mouth position guides for proper Hindi articulation
 * Shows visual cue + description for pronunciation
 */
export default function MouthPositionViewer({
  mouthType,
  vowels = [],
  description,
  onUnderstand,
}: MouthPositionViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Mouth type configurations
  const mouthConfigs: Record<string, { title: string; svgPath: string; defaultDesc: string; tips: string[] }> = {
    "wide-open": {
      title: "Wide Open Mouth",
      svgPath: "/mouth-positions/mouth-wide-open.svg",
      defaultDesc: "Open your mouth very wide, like when you say 'Ah' at the doctor.",
      tips: [
        "Mouth opens wide and tall",
        "Jaw drops significantly",
        "Sound: अ (a) or आ (aa)",
      ],
    },
    round: {
      title: "Round Mouth",
      svgPath: "/mouth-positions/mouth-round.svg",
      defaultDesc: "Round your lips and push them forward, like when you say 'Ooh'.",
      tips: [
        "Lips form a small circle",
        "Lips pushed forward",
        "Sound: उ (u) or ऊ (uu)",
      ],
    },
    smile: {
      title: "Smile Mouth",
      svgPath: "/mouth-positions/mouth-smile.svg",
      defaultDesc: "Stretch your lips in a smile with a smaller opening.",
      tips: [
        "Lips stretched horizontally",
        "Mouth corners pulled back",
        "Sound: इ (i) or ई (ee)",
      ],
    },
    labial: {
      title: "Labial Sounds (Lips Together)",
      svgPath: "/mouth-positions/mouth-labial.svg",
      defaultDesc: "Lips touch or almost touch together for these consonant sounds.",
      tips: [
        "Lips nearly closed or together",
        "Sound produced by blocking airflow with lips",
        "Sound: प (pa), ब (ba), म (ma)",
      ],
    },
    consonant: {
      title: "Consonant Articulation",
      svgPath: "/mouth-positions/mouth-consonant.svg",
      defaultDesc: "Your tongue touches the roof or teeth of your mouth to create consonant sounds.",
      tips: [
        "Tongue position varies by consonant",
        "Creates stop or friction sound",
        "Sound: क (ka), ग (ga), ट (ta), etc.",
      ],
    },
  };

  const config = mouthConfigs[mouthType];
  if (!config) return null;

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-purple-600" />
          {config.title}
        </h3>
        {vowels.length > 0 && (
          <span className="text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            {vowels.join(", ")}
          </span>
        )}
      </div>

      {/* SVG Container */}
      <div className="bg-white rounded-lg border border-purple-200 p-6 mb-4 flex justify-center items-center min-h-[300px]">
        <div className="w-full max-w-xs">
          {/* SVG will be rendered here - for now showing placeholder */}
          <svg
            viewBox="0 0 400 300"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simple placeholder mouth shape based on type */}
            {mouthType === "wide-open" && (
              <>
                <ellipse cx="200" cy="150" rx="80" ry="120" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
                <path d="M 130 150 Q 200 200 270 150" fill="none" stroke="#333" strokeWidth="2" />
                <circle cx="160" cy="140" r="8" fill="#333" />
                <circle cx="240" cy="140" r="8" fill="#333" />
              </>
            )}
            {mouthType === "round" && (
              <>
                <circle cx="200" cy="150" r="60" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
                <circle cx="200" cy="150" r="40" fill="#FF69B4" stroke="#333" strokeWidth="1" />
                <circle cx="180" cy="130" r="8" fill="#333" />
                <circle cx="220" cy="130" r="8" fill="#333" />
              </>
            )}
            {mouthType === "smile" && (
              <>
                <ellipse cx="200" cy="160" rx="100" ry="50" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
                <path d="M 130 160 Q 200 180 270 160" fill="none" stroke="#333" strokeWidth="2" />
                <circle cx="160" cy="140" r="8" fill="#333" />
                <circle cx="240" cy="140" r="8" fill="#333" />
              </>
            )}
            {mouthType === "labial" && (
              <>
                <ellipse cx="200" cy="150" rx="50" ry="40" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
                <line x1="170" y1="150" x2="230" y2="150" stroke="#333" strokeWidth="2" />
                <circle cx="160" cy="140" r="8" fill="#333" />
                <circle cx="240" cy="140" r="8" fill="#333" />
              </>
            )}
            {mouthType === "consonant" && (
              <>
                <path d="M 100 80 Q 200 50 300 80 Q 300 120 200 150 Q 100 120 100 80 Z" fill="#F0E68C" stroke="#333" strokeWidth="2" />
                <ellipse cx="200" cy="110" rx="60" ry="30" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
                <path d="M 150 110 L 250 110" stroke="#666" strokeWidth="2" strokeDasharray="5,5" />
                <text x="200" y="200" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">
                  Tongue Position
                </text>
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 font-medium mb-4">{description || config.defaultDesc}</p>

      {/* Collapsible Tips */}
      <div className="border-t border-purple-200 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-purple-700 font-medium hover:text-purple-900 transition-colors"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
          Key Points
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2">
            {config.tips.map((tip, idx) => (
              <div key={idx} className="flex gap-2 text-sm text-gray-700">
                <span className="text-purple-600 font-bold">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {onUnderstand && (
        <button
          onClick={onUnderstand}
          className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all"
        >
          ✓ I understand the mouth position
        </button>
      )}
    </div>
  );
}

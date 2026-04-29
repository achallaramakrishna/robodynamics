"use client";

import { useState } from "react";
import { Zap, CheckCircle, XCircle } from "lucide-react";
import { RecallChallenge, spacedRepetitionService } from "@/lib/spacedRepetitionService";

interface SpacedRepetitionPromptProps {
  challenge: RecallChallenge;
  onSuccess?: (challenge: RecallChallenge) => void;
  onFailure?: (challenge: RecallChallenge) => void;
  onSkip?: () => void;
}

/**
 * SpacedRepetitionPrompt Component
 * Displays recall challenges injected during consonant lessons
 * Reinforces previously learned vowels using SM-2 algorithm
 */
export default function SpacedRepetitionPrompt({
  challenge,
  onSuccess,
  onFailure,
  onSkip,
}: SpacedRepetitionPromptProps) {
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Generate multiple choice options
  const allLetters = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं"];
  const correctLetter = challenge.promptLetterId.split("/")[0];

  const getRandomLetters = (correct: string, count: number = 3) => {
    const options = [correct];
    while (options.length < count) {
      const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
      if (!options.includes(randomLetter)) {
        options.push(randomLetter);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const options = getRandomLetters(correctLetter);

  // Difficulty label
  const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    hard: "bg-red-100 text-red-800 border-red-300",
  };

  // Handle answer submission
  const handleSelectOption = (selected: string) => {
    setSelectedOption(selected);
    const correct = selected === correctLetter;
    setIsCorrect(correct);
    setAnswered(true);

    // Record in spaced repetition service
    if (correct) {
      spacedRepetitionService.recordSuccess(correctLetter);
      onSuccess?.(challenge);
    } else {
      spacedRepetitionService.recordFailure(correctLetter);
      onFailure?.(challenge);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-300 shadow-lg">
      {/* Header with difficulty badge */}
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-amber-600" />
        <div>
          <h3 className="font-semibold text-gray-800">Quick Recall Challenge</h3>
          <p className="text-xs text-gray-600">You learned this {challenge.daysSinceLearning} days ago</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[challenge.difficulty]}`}>
          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
        </span>
      </div>

      {!answered ? (
        <>
          {/* Question */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-amber-200">
            <p className="text-center text-gray-600 mb-4">Can you identify this letter?</p>
            <div className="text-5xl font-bold text-center text-amber-700 mb-2">
              ?
            </div>
            <p className="text-center text-sm text-gray-500">You learned it in lesson {challenge.learnedLessonId}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {options.map((letter) => (
              <button
                key={letter}
                onClick={() => handleSelectOption(letter)}
                className="w-full py-4 px-4 bg-white border-2 border-amber-200 rounded-lg text-2xl font-bold text-gray-800 hover:bg-amber-50 hover:border-amber-400 transition-all hover:shadow-md"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Skip option */}
          <button
            onClick={onSkip}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
          >
            Skip this one
          </button>
        </>
      ) : (
        <>
          {/* Feedback */}
          <div
            className={`p-6 rounded-lg mb-6 flex flex-col items-center gap-3 ${
              isCorrect
                ? "bg-green-100 border border-green-300"
                : "bg-red-100 border border-red-300"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle className="w-8 h-8 text-green-600" />
                <p className="font-semibold text-green-900">Excellent! You remembered it!</p>
                <p className="text-sm text-green-800">Your knowledge is getting stronger.</p>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-600" />
                <p className="font-semibold text-red-900">Not quite! The answer was:</p>
                <div className="text-4xl font-bold text-red-700">{correctLetter}</div>
                <p className="text-sm text-red-800">We'll remind you again soon to strengthen this memory.</p>
              </>
            )}
          </div>

          {/* Continue button */}
          <button
            onClick={() => {
              setAnswered(false);
              setIsCorrect(null);
              setSelectedOption(null);
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all"
          >
            Continue
          </button>
        </>
      )}

      {/* Info box */}
      <div className="mt-6 p-3 bg-amber-100 rounded border border-amber-300">
        <p className="text-xs text-amber-900">
          💡 <strong>Why recall challenges?</strong> Reviewing letters at the right time helps you remember them forever!
        </p>
      </div>
    </div>
  );
}

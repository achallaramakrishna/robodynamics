"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Volume2, BookOpen, BarChart3, ArrowRight } from "lucide-react";
import AudioPlaybackTTS from "@/components/AudioPlaybackTTS";
import MouthPositionViewer from "@/components/MouthPositionViewer";
import SpacedRepetitionPrompt from "@/components/SpacedRepetitionPrompt";
import ParentDashboard from "@/components/ParentDashboard";
import { VAANI_L1_LESSONS } from "@/lib/vaaniLevel1Data";
import { parentAssessmentService, LetterAssessment } from "@/lib/parentAssessmentService";
import { spacedRepetitionService, RecallChallenge } from "@/lib/spacedRepetitionService";

type Phase = "loading" | "lesson" | "parent-dashboard" | "error";

interface LessonStep {
  label: string;
  skillTags?: string[];
  tutorText?: string;
  board?: {
    type: string;
    data?: Record<string, any>;
    assetPath?: string;
  };
}

interface CurrentLesson {
  lessonId: string;
  title: string;
  steps: LessonStep[];
  durationMin: number;
}

interface VaaniTutorClientProps {
  studentName: string;
  initialLevel: number;
  initialChapter: number;
}

/**
 * VaaniTutorClient Component
 * Main lesson player for Hindi language learning (Vaani)
 * Integrates all enhancement features:
 * - Google Translate TTS audio playback
 * - Mouth position SVG guides
 * - Spaced repetition recall challenges
 * - Parent assessment tracking
 */
export default function VaaniTutorClient({
  studentName,
  initialLevel = 1,
  initialChapter = 1,
}: VaaniTutorClientProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [currentLesson, setCurrentLesson] = useState<CurrentLesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [recallChallenge, setRecallChallenge] = useState<RecallChallenge | null>(null);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const lessonStartTimeRef = useRef<number | null>(null);

  // Load lesson on mount or when lesson ID changes
  useEffect(() => {
    const loadLesson = () => {
      try {
        setPhase("loading");

        // Get lesson from vaaniLevel1Data
        const lessonKey = `L${currentLevel}-C${String(currentChapter).padStart(2, "0")}-L01`;
        const lesson = VAANI_L1_LESSONS[lessonKey];

        if (!lesson) {
          setErrorMsg(`Lesson ${lessonKey} not found`);
          setPhase("error");
          return;
        }

        const lessonData: CurrentLesson = {
          lessonId: lesson.lesson.id,
          title: lesson.lesson.title,
          steps: lesson.steps,
          durationMin: lesson.lesson.durationMin,
        };

        setCurrentLesson(lessonData);
        setCurrentStepIndex(0);
        lessonStartTimeRef.current = Date.now();

        // Initialize assessment for this letter if not already done
        const letterId = lesson.lesson.id.includes("-L0") ? lesson.lesson.id.split("-")[1] : null;
        if (letterId) {
          const letterName = lesson.lesson.summary || "";
          const category = lesson.lesson.category === "Vowels" ? "vowel" : "consonant";
          parentAssessmentService.initializeLetterAssessment(
            letterId,
            lesson.lesson.id,
            letterName,
            category as "vowel" | "consonant"
          );
        }

        setPhase("lesson");
      } catch (error) {
        console.error("Error loading lesson:", error);
        setErrorMsg("Failed to load lesson");
        setPhase("error");
      }
    };

    loadLesson();
  }, [currentLevel, currentChapter]);

  // Get current step
  const getCurrentStep = (): LessonStep | null => {
    if (!currentLesson) return null;

    // Check if we need to inject a recall challenge
    if (recallChallenge && currentStepIndex === 2) {
      return {
        label: "Quick Recall",
        board: { type: "spaced_repetition" },
      };
    }

    return currentLesson.steps[currentStepIndex] || null;
  };

  // Handle step completion
  const handleStepComplete = () => {
    const step = getCurrentStep();
    if (!step) return;

    // Track recognition/writing attempts
    const lesson = currentLesson;
    if (lesson && lesson.lessonId) {
      const letterId = VAANI_L1_LESSONS[lesson.lessonId]?.lesson?.letterId;

      if (step.board?.type === "mcq" && letterId) {
        // Record successful recognition
        parentAssessmentService.recordRecognitionAttempt(
          letterId,
          true,
          500
        );
      }

      if (step.board?.type === "tracing_canvas" && letterId) {
        // Record successful writing
        parentAssessmentService.recordWritingAttempt(
          letterId,
          0.85, // Assume 85% quality
          1200
        );
      }
    }

    // Move to next step or next lesson
    if (currentStepIndex < (currentLesson?.steps.length || 0) - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleLessonComplete();
    }
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    const lesson = currentLesson;
    if (!lesson) return;

    // Record letter as learned in spaced repetition
    const letterId = vaaniLevel1Data[lesson.lessonId]?.letterId;
    if (letterId) {
      spacedRepetitionService.recordLetterLearned(
        letterId,
        lesson.lessonId,
        new Date()
      );
    }

    // Move to next lesson or chapter
    if (currentChapter < 8) {
      // Max 8 consonants per level
      setCurrentChapter(currentChapter + 1);
    } else {
      // Level complete - show parent dashboard
      setShowParentDashboard(true);
    }
  };

  // Render different board types
  const renderBoard = (step: LessonStep) => {
    if (!step.board) return null;

    const { type, data = {}, assetPath } = step.board;

    switch (type) {
      case "audio_playback_tts":
        return (
          <AudioPlaybackTTS
            soundKey={data.soundKey}
            customText={data.customText}
            headline={data.headline}
            prompt={data.prompt}
            onPlayComplete={handleStepComplete}
          />
        );

      case "mouth_position":
        return (
          <MouthPositionViewer
            mouthType={data.mouthType}
            vowels={data.vowels}
            description={data.description}
            onUnderstand={handleStepComplete}
          />
        );

      case "visual":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">{data.headline}</h3>
            {assetPath && (
              <img src={assetPath} alt={data.headline} className="w-full max-w-md mx-auto mb-4" />
            )}
            <p className="text-gray-700 mb-4">{data.prompt}</p>
            <button
              onClick={handleStepComplete}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        );

      case "mcq":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">{data.headline}</h3>
            <p className="text-gray-700 mb-4">{data.prompt}</p>
            <div className="space-y-3">
              {data.options?.map((option: string) => (
                <button
                  key={option}
                  onClick={() => handleStepComplete()}
                  className="w-full p-4 border border-blue-300 rounded-lg text-left hover:bg-blue-50 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case "text":
        return (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Parent Coaching</h3>
            <div className="text-gray-800 mb-6 whitespace-pre-wrap">{data.content}</div>
            <button
              onClick={handleStepComplete}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        );

      case "spaced_repetition":
        if (recallChallenge) {
          return (
            <SpacedRepetitionPrompt
              challenge={recallChallenge}
              onSuccess={() => {
                setRecallChallenge(null);
                handleStepComplete();
              }}
              onFailure={() => {
                setRecallChallenge(null);
                handleStepComplete();
              }}
              onSkip={() => {
                setRecallChallenge(null);
                handleStepComplete();
              }}
            />
          );
        }
        return null;

      default:
        return (
          <div className="text-gray-600 p-4">
            Board type "{type}" not yet implemented
          </div>
        );
    }
  };

  // Show parent dashboard
  if (showParentDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={() => setShowParentDashboard(false)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Lessons
        </button>
        <ParentDashboard
          studentName={studentName}
          onExportPDF={(report) => {
            console.log("Export PDF:", report);
          }}
        />
      </div>
    );
  }

  // Show error
  if (phase === "error") {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Error</h1>
          <p className="text-red-700">{errorMsg}</p>
        </div>
      </div>
    );
  }

  // Show loading
  if (phase === "loading" || !currentLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Main lesson view
  const step = getCurrentStep();
  const stepCount = currentLesson.steps.length;
  const progress = ((currentStepIndex + 1) / stepCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{currentLesson.title}</h1>
              <p className="text-sm text-gray-600">Level {currentLevel} • Lesson {currentChapter}</p>
            </div>
            <button
              onClick={() => setShowParentDashboard(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Progress
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Step {currentStepIndex + 1} of {stepCount}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {step && (
          <div className="space-y-6">
            {/* Step label */}
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <BookOpen className="w-4 h-4" />
              {step.label}
              {step.skillTags?.map((tag) => (
                <span
                  key={tag}
                  className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Tutor text */}
            {step.tutorText && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-gray-800">{step.tutorText}</p>
              </div>
            )}

            {/* Board/Content */}
            <div className="flex justify-center">{renderBoard(step)}</div>

            {/* Navigation */}
            {!step.board || step.board.type === "text" ? (
              <div className="flex justify-end">
                <button
                  onClick={handleStepComplete}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

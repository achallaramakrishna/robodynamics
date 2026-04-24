"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, Check, X, AlertCircle, Zap, BookOpen } from "lucide-react";
import SVGExplanationPlayer from "../../../components/SVGExplanationPlayer";
import MeeraInsights from "../../../components/MeeraInsights";
import { getChapterIntro, type IntroSlide } from "../../../lib/neetIntroConstants";

interface NeetQuestion {
  questionId: string;
  chapterCode: string;
  subject: string;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: string;
  explanation: string;
  allOptionExplanations?: Record<string, string>;
  difficulty: string;
  topic: string;
}

interface CheckAnswerResponse {
  isCorrect: boolean;
  correctOption: string;
  selectedOption: string;
  explanation: string;
  allOptionExplanations?: Record<string, string>;
  commonMistakeWarning?: string;
  encouragement: string;
  meeraMessage: string;
  scoreChange: number;
  newScore: number;
  correct: number;
  wrong: number;
}

interface NeetTutorClientProps {
  initialSubject: string;
  initialChapter: string;
  studentClass?: string | null;
}

export default function NeetTutorClient({
  initialSubject,
  initialChapter,
  studentClass,
}: NeetTutorClientProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<NeetQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckAnswerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [svgData, setSvgData] = useState<string | null>(null);
  const [subject] = useState(initialSubject.toLowerCase());
  const [chapter] = useState(initialChapter);
  const [pendingKickoff, setPendingKickoff] = useState<"welcome" | "ready">("welcome");
  const [currentIntroSlideIndex, setCurrentIntroSlideIndex] = useState(0);
  const [introSlides, setIntroSlides] = useState<IntroSlide[]>([]);
  const [exerciseGroups, setExerciseGroups] = useState<{ group: string; subtopic: string; status: string; accuracy: number }[]>([]);
  const [currentExerciseGroup, setCurrentExerciseGroup] = useState("A");
  const [suggestedNextAction, setSuggestedNextAction] = useState<"reteach" | "practice" | "continue" | null>(null);
  const [groupAttempts, setGroupAttempts] = useState<Record<string, { attempts: number; correct: number }>>({
    A: { attempts: 0, correct: 0 },
    B: { attempts: 0, correct: 0 },
    C: { attempts: 0, correct: 0 },
    D: { attempts: 0, correct: 0 },
  });
  const [showMeeraInsights, setShowMeeraInsights] = useState(false);

  // Initialize intro slides
  useEffect(() => {
    const chapterIntro = getChapterIntro(chapter);
    if (chapterIntro) {
      setIntroSlides(chapterIntro.slides);
      setCurrentIntroSlideIndex(0);
      setPendingKickoff("welcome");
    }
  }, [chapter]);

  // Initialize session only when user completes intro
  useEffect(() => {
    const initSession = async () => {
      if (pendingKickoff !== "ready") return;

      try {
        setLoading(true);
        const response = await fetch("/ai-tutor-api/neet/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            chapterCode: chapter,
            examTarget: "2027",
          }),
        });

        if (!response.ok) throw new Error("Failed to start session");

        const data = await response.json();
        setSessionId(data.sessionId);
        setQuestion(data.question);
        setScore(0);
        setQuestionCount(1);
        setSelectedOption(null);
        setIsSubmitted(false);
        setCheckResult(null);
        setShowExplanation(false);
        setError(null);
        setCurrentExerciseGroup("A");

        // Load exercise groups progress
        if (data.exerciseGroups) {
          setExerciseGroups(data.exerciseGroups);
          // Reconstruct groupAttempts from accuracy data
          const attempts: Record<string, { attempts: number; correct: number }> = {
            A: { attempts: 0, correct: 0 },
            B: { attempts: 0, correct: 0 },
            C: { attempts: 0, correct: 0 },
            D: { attempts: 0, correct: 0 },
          };
          for (const group of data.exerciseGroups) {
            if (group.accuracy > 0 && attempts[group.group]) {
              // Rough estimate: assume attempts based on accuracy (we'll refine with actual data from backend)
              attempts[group.group].accuracy = group.accuracy;
            }
          }
          setGroupAttempts(attempts);
        } else {
          // Default exercise groups
          setExerciseGroups([
            { group: "A", subtopic: "Foundation", status: "active", accuracy: 0 },
            { group: "B", subtopic: "Core Concepts", status: "locked", accuracy: 0 },
            { group: "C", subtopic: "Application", status: "locked", accuracy: 0 },
            { group: "D", subtopic: "Advanced", status: "locked", accuracy: 0 },
          ]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize session");
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [pendingKickoff, subject, chapter]);

  // Fetch SVG explanation when answer is revealed
  useEffect(() => {
    if (isSubmitted && checkResult?.isCorrect === false && question && !svgData) {
      const fetchSVG = async () => {
        try {
          const response = await fetch("/ai-tutor-api/neet/explain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: question.questionText,
              subject,
              chapterCode: chapter,
              options: question.options,
              correctOption: question.correctOption,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setSvgData(data.svg);
          }
        } catch (err) {
          console.error("Failed to fetch SVG explanation:", err);
        }
      };

      fetchSVG();
    }
  }, [isSubmitted, checkResult, question, subject, chapter, svgData]);

  const handleSelectOption = (option: string) => {
    if (!isSubmitted) {
      setSelectedOption(option);
    }
  };

  const handleIntroNext = () => {
    if (currentIntroSlideIndex < introSlides.length - 1) {
      setCurrentIntroSlideIndex(currentIntroSlideIndex + 1);
    } else {
      // Intro complete, start practice
      setPendingKickoff("ready");
    }
  };

  const handleIntroBack = () => {
    if (currentIntroSlideIndex > 0) {
      setCurrentIntroSlideIndex(currentIntroSlideIndex - 1);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !sessionId || !question) return;

    try {
      setLoading(true);
      const response = await fetch("/ai-tutor-api/neet/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: question.questionId,
          selectedOption,
        }),
      });

      if (!response.ok) throw new Error("Failed to check answer");

      const data = await response.json();
      setCheckResult(data);
      setIsSubmitted(true);
      setScore(data.newScore);
      setShowExplanation(!data.isCorrect); // Auto-open explanation for wrong answers

      // Update group attempts and correct count
      const isCorrect = data.isCorrect;
      const newGroupAttempts = { ...groupAttempts };
      newGroupAttempts[currentExerciseGroup] = {
        attempts: newGroupAttempts[currentExerciseGroup].attempts + 1,
        correct: newGroupAttempts[currentExerciseGroup].correct + (isCorrect ? 1 : 0),
      };
      setGroupAttempts(newGroupAttempts);

      // Calculate accuracy for current group
      const groupStats = newGroupAttempts[currentExerciseGroup];
      const groupAccuracy = Math.round((groupStats.correct / groupStats.attempts) * 100);

      // Update exercise groups with new accuracy and unlock next group if complete
      const updatedGroups = exerciseGroups.map((group) => {
        if (group.group === currentExerciseGroup) {
          return { ...group, accuracy: groupAccuracy };
        }
        // Unlock next group if current group has at least 1 correct answer
        if (isCorrect && groupStats.correct === 1) {
          const groupOrder = ["A", "B", "C", "D"];
          const currentIdx = groupOrder.indexOf(currentExerciseGroup);
          if (currentIdx >= 0 && currentIdx < groupOrder.length - 1) {
            const nextGroup = groupOrder[currentIdx + 1];
            if (group.group === nextGroup && group.status === "locked") {
              return { ...group, status: "active" };
            }
          }
        }
        return group;
      });
      setExerciseGroups(updatedGroups);

      // Save progress to backend
      const totalAttempts = Object.values(newGroupAttempts).reduce((sum, g) => sum + g.attempts, 0);
      const totalCorrect = Object.values(newGroupAttempts).reduce((sum, g) => sum + g.correct, 0);

      await fetch("/ai-tutor-api/neet/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          chapterCode: chapter,
          subject,
          exerciseGroups: updatedGroups,
          attempts: totalAttempts,
          correctCount: totalCorrect,
        }),
      }).catch(() => {}); // Silent fail for progress save

      // Get adaptive learning suggestion
      if (data.suggestedNextAction) {
        setSuggestedNextAction(data.suggestedNextAction);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check answer");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const response = await fetch("/ai-tutor-api/neet/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          chapterCode: chapter,
          exerciseGroup: currentExerciseGroup,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch next question");

      const data = await response.json();
      setQuestion(data.question);
      setSelectedOption(null);
      setIsSubmitted(false);
      setCheckResult(null);
      setShowExplanation(false);
      setSvgData(null);
      setQuestionCount((prev) => prev + 1);
      setSuggestedNextAction(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load next question");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchExerciseGroup = (group: string) => {
    if (exerciseGroups.find((g) => g.group === group)?.status !== "locked") {
      setCurrentExerciseGroup(group);
      setQuestionCount(1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setCheckResult(null);
      setShowExplanation(false);
      setSvgData(null);
      setSuggestedNextAction(null);
      // Fetch first question of new group
      if (sessionId) {
        handleNextQuestion();
      }
    }
  };

  // Show intro slides
  if (pendingKickoff === "welcome" && introSlides.length > 0) {
    const currentSlide = introSlides[currentIntroSlideIndex];
    const slideTypes = {
      explain: { icon: "📚", color: "from-blue-500 to-blue-600" },
      demo: { icon: "🎬", color: "from-purple-500 to-purple-600" },
      guided: { icon: "🎯", color: "from-green-500 to-green-600" },
    };
    const slideConfig = slideTypes[currentSlide.slide];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex flex-col">
        {/* Progress */}
        <div className="max-w-4xl mx-auto w-full mb-8">
          <div className="flex gap-2 mb-4">
            {introSlides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx === currentIntroSlideIndex
                    ? "bg-gradient-to-r from-purple-500 to-blue-500"
                    : idx < currentIntroSlideIndex
                    ? "bg-green-500"
                    : "bg-slate-700"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-slate-400">
            Slide {currentIntroSlideIndex + 1} of {introSlides.length}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-6">
            {/* Slide Type Badge */}
            <div className={`inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r ${slideConfig.color} rounded-lg`}>
              <span className="text-xl">{slideConfig.icon}</span>
              <span className="text-white font-semibold capitalize">{currentSlide.slide}</span>
            </div>

            {/* Slide Title */}
            <h2 className="text-3xl font-bold text-white mb-4">{currentSlide.title}</h2>

            {/* Slide Description */}
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">{currentSlide.description}</p>

            {/* Key Points */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Key Points:</h3>
              <ul className="space-y-3">
                {currentSlide.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-purple-300">{idx + 1}</span>
                    </div>
                    <span className="text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SVG Diagram (if applicable) */}
            {currentSlide.diagramSrc && (
              <div className="mb-8">
                <div className="bg-white rounded-lg p-6 border border-slate-600 overflow-auto" style={{ maxHeight: "400px" }}>
                  <img src={currentSlide.diagramSrc} alt={currentSlide.diagramCaption || "Diagram"} className="w-full h-auto" />
                </div>
                {currentSlide.diagramCaption && (
                  <p className="text-sm text-slate-400 mt-3 italic">{currentSlide.diagramCaption}</p>
                )}
              </div>
            )}

            {/* Demo Steps (if applicable) */}
            {currentSlide.demoSteps && (
              <div className="mb-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-4">Demo Steps:</h3>
                <ol className="space-y-2">
                  {currentSlide.demoSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="font-semibold text-blue-400 min-w-fit">{idx + 1}.</span>
                      <span className="text-slate-200">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Demo Speech (if applicable) */}
            {currentSlide.demoSpeech && (
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🎙️</span>
                  <div>
                    <h3 className="text-sm font-semibold text-purple-300 mb-2">Meera's Explanation:</h3>
                    <p className="text-slate-300 leading-relaxed italic">{currentSlide.demoSpeech}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex gap-4 justify-between">
            <button
              onClick={handleIntroBack}
              disabled={currentIntroSlideIndex === 0}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg font-semibold transition flex items-center gap-2"
            >
              ← Back
            </button>

            <div className="flex gap-4">
              {currentIntroSlideIndex < introSlides.length - 1 ? (
                <button
                  onClick={handleIntroNext}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleIntroNext}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  Start Practice
                  <Zap className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-purple-500/30 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-md w-full mx-4 p-6 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-300 font-medium mb-2">Error</p>
          <p className="text-red-200 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <p className="text-slate-300">No question available</p>
      </div>
    );
  }

  const subjectColor: Record<string, string> = {
    physics: "from-blue-500 to-blue-600",
    chemistry: "from-green-500 to-green-600",
    biology: "from-purple-500 to-purple-600",
  };

  const bgGradient = subjectColor[subject] || "from-blue-500 to-blue-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white font-bold text-sm`}>
              {subject.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </h1>
              <p className="text-sm text-slate-400">{chapter.replace("_", " ")}</p>
            </div>
          </div>
          <div className="flex gap-6 items-end">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{score}</p>
              <p className="text-xs text-slate-400">Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-300">{questionCount}</p>
              <p className="text-xs text-slate-400">Question</p>
            </div>
            {questionCount > 3 && (
              <button
                onClick={() => setShowMeeraInsights(!showMeeraInsights)}
                className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm transition flex items-center gap-1"
              >
                🎙️ Meera
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${bgGradient} transition-all duration-500`} style={{ width: "50%" }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Exercise Group Tabs */}
        <div className="mb-6 border-b border-slate-700">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {exerciseGroups.map((group) => {
              const isActive = group.group === currentExerciseGroup;
              const isLocked = group.status === "locked";
              const isCompleted = group.status === "completed";

              return (
                <button
                  key={group.group}
                  onClick={() => handleSwitchExerciseGroup(group.group)}
                  disabled={isLocked}
                  className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-purple-600 text-white border border-purple-500"
                      : isCompleted
                      ? "bg-green-900/40 text-green-300 border border-green-500/50"
                      : isLocked
                      ? "bg-slate-700/50 text-slate-500 border border-slate-600 cursor-not-allowed opacity-50"
                      : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
                  }`}
                >
                  <span className="text-sm font-bold">{group.group}</span>
                  <span className="text-xs text-slate-300 hidden sm:inline">
                    {group.subtopic}
                  </span>
                  {isCompleted && <Check className="w-4 h-4" />}
                  {isLocked && <span>🔒</span>}
                  {group.accuracy > 0 && (
                    <span className="text-xs ml-1">{Math.round(group.accuracy)}%</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-slate-400 mb-2">
            Complete each group to unlock the next level
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-6">
          {/* Question Text */}
          <h2 className="text-xl font-semibold text-white mb-8 leading-relaxed">
            {question.questionText}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {(["A", "B", "C", "D"] as const).map((option) => {
              const text = question.options[option];
              const isSelected = selectedOption === option;
              const isCorrect = option === question.correctOption;
              const isWrong = isSelected && !isCorrect && isSubmitted;
              const showAsCorrect = isSubmitted && isCorrect;

              let bgClass = "bg-slate-700 hover:bg-slate-600 border-slate-600";
              let borderClass = "border";

              if (isSubmitted) {
                if (showAsCorrect) {
                  bgClass = "bg-green-900/40 border-green-500/50";
                } else if (isWrong) {
                  bgClass = "bg-red-900/40 border-red-500/50";
                } else {
                  bgClass = "bg-slate-700 border-slate-600";
                }
              } else if (isSelected) {
                bgClass = "bg-purple-600/40 border-purple-500";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-lg ${borderClass} ${bgClass} transition-all duration-200 disabled:cursor-default`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded border-2 flex items-center justify-center font-semibold mt-0.5 ${
                      isSubmitted
                        ? showAsCorrect
                          ? "bg-green-500 border-green-400 text-white"
                          : isWrong
                          ? "bg-red-500 border-red-400 text-white"
                          : "bg-slate-600 border-slate-500 text-slate-300"
                        : isSelected
                        ? "bg-purple-500 border-purple-400 text-white"
                        : "bg-slate-600 border-slate-500 text-slate-300"
                    }`}>
                      {isSubmitted && showAsCorrect ? (
                        <Check className="w-4 h-4" />
                      ) : isSubmitted && isWrong ? (
                        <X className="w-4 h-4" />
                      ) : (
                        option
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-100">{text}</p>
                      {isSubmitted && checkResult?.allOptionExplanations?.[option] && (
                        <p className="text-xs text-slate-400 mt-2">
                          {checkResult.allOptionExplanations[option]}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Adaptive Learning Suggestion */}
          {isSubmitted && suggestedNextAction && (
            <div className="mb-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">💡</span>
                <h3 className="font-semibold text-purple-300">Meera's Recommendation:</h3>
              </div>
              {suggestedNextAction === "reteach" && (
                <p className="text-slate-300">
                  I noticed you're struggling with this concept. Let me explain it differently, or try a different approach.
                  Would you like me to reteach this topic before continuing?
                </p>
              )}
              {suggestedNextAction === "practice" && (
                <p className="text-slate-300">
                  Great effort! Let's practice more questions on this topic to build your confidence and speed.
                </p>
              )}
              {suggestedNextAction === "continue" && (
                <p className="text-slate-300">
                  Excellent! You're mastering this topic. Let's move to the next exercise group to deepen your understanding.
                </p>
              )}
            </div>
          )}

          {/* Feedback Section */}
          {isSubmitted && checkResult && (
            <div className={`p-4 rounded-lg mb-6 ${
              checkResult.isCorrect
                ? "bg-green-900/30 border border-green-500/30"
                : "bg-red-900/30 border border-red-500/30"
            }`}>
              <div className="flex items-start gap-3 mb-3">
                {checkResult.isCorrect ? (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold mb-1 ${
                    checkResult.isCorrect ? "text-green-300" : "text-red-300"
                  }`}>
                    {checkResult.isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-sm text-slate-300 mb-2">
                    {checkResult.meeraMessage}
                  </p>
                  {checkResult.commonMistakeWarning && (
                    <p className="text-xs text-slate-400 italic">
                      ⚠️ {checkResult.commonMistakeWarning}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-bold ${
                    checkResult.scoreChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {checkResult.scoreChange > 0 ? "+" : ""}{checkResult.scoreChange}
                  </p>
                </div>
              </div>

              {/* Main explanation */}
              {checkResult.explanation && (
                <div className="bg-slate-700/50 p-3 rounded mt-3 border border-slate-600">
                  <p className="text-sm text-slate-200">{checkResult.explanation}</p>
                </div>
              )}

              {/* SVG Explanation Button */}
              {!checkResult.isCorrect && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="mt-3 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {showExplanation ? "Hide" : "Meera Explains This"}
                </button>
              )}
            </div>
          )}

          {/* SVG Explanation Viewer */}
          {showExplanation && svgData && (
            <div className="mb-6">
              <SVGExplanationPlayer svgDataUrl={svgData} questionId={question.questionId} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption || loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? "Checking..." : "Check Answer"}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? "Loading..." : "Next Question"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Meera Insights Modal */}
      {showMeeraInsights && sessionId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Meera's Performance Analysis</h2>
              <button
                onClick={() => setShowMeeraInsights(false)}
                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MeeraInsights
                sessionId={sessionId}
                chapterCode={chapter}
                onClose={() => setShowMeeraInsights(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

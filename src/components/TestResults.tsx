import { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Award,
} from "lucide-react";
import { TestResult } from "../types";
import { sound } from "../utils/audio";

interface TestResultsProps {
  result: TestResult;
  onReviewAnswers: () => void;
  onRetakeTest: () => void;
  onGenerateWeakAreaTest: (weakTopics: string[]) => void;
  onGoToDashboard: () => void;
  onSaveToNotes: () => void;
}

export function TestResults({
  result,
  onReviewAnswers,
  onRetakeTest,
  onGenerateWeakAreaTest,
  onGoToDashboard,
  onSaveToNotes,
}: TestResultsProps) {
  const isPassing = result.percentage >= 60;
  const isHighScorer = result.percentage >= 80;

  useEffect(() => {
    if (isHighScorer) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#10b981", "#f59e0b", "#3b82f6"],
      });
    }
  }, [isHighScorer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getRatingBadge = (rating?: string, pct?: number) => {
    const p = pct ?? 0;
    if (rating === "Mastery" || p >= 90) {
      return {
        label: "Mastery Level",
        color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200",
        icon: Trophy,
      };
    }
    if (rating === "Proficient" || p >= 75) {
      return {
        label: "Proficient",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200",
        icon: Award,
      };
    }
    if (rating === "Developing" || p >= 50) {
      return {
        label: "Developing",
        color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200",
        icon: TrendingUp,
      };
    }
    return {
      label: "Needs Review",
      color: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200",
      icon: AlertCircle,
    };
  };

  const badgeInfo = getRatingBadge(result.feedback?.masteryRating, result.percentage);
  const BadgeIcon = badgeInfo.icon;

  const weakAreas = result.feedback?.improvements || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Hero Banner */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 px-6 py-8 sm:px-10 text-white text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Test Completed</span>
              </div>
              {result.examBoard && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 border border-emerald-300/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs">
                  <span>🇳🇬 {result.examBoard} {result.examYear ? `• Year ${result.examYear}` : ""}</span>
                  <span className="text-[10px] bg-emerald-400 text-emerald-950 px-1.5 py-0.5 rounded-md font-bold">
                    AI Practice
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isHighScorer ? "Outstanding Performance!" : isPassing ? "Good Effort! Keep Pushing." : "Great Practice! Review & Conquer."}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-100 max-w-xl">
              Subject: <span className="font-semibold text-white">{result.subject}</span> • Topic: <span className="font-semibold text-white">{result.topic}</span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm border border-white/15 shrink-0 self-center sm:self-auto">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-200">Your Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold">{result.score}</span>
              <span className="text-lg text-indigo-200 font-medium">/{result.total}</span>
            </div>
            <span className="mt-1 text-xs font-bold text-emerald-300">
              {result.percentage}% Accuracy
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 sm:px-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Correct</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">{result.score}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Incorrect</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">{result.total - result.score}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Time Taken</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">{formatTime(result.timeSpentSeconds)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${badgeInfo.color}`}>
              <BadgeIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rating</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">{badgeInfo.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback Section (Prompt Requirement: "You did well in...", "You need to improve...", Recommended topics) */}
      <div className="rounded-3xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-xs dark:border-indigo-950/60 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Gemini AI Tutor Feedback
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalized performance diagnosis based on your answers
              </p>
            </div>
          </div>
        </div>

        {/* Summary note from AI */}
        {result.feedback?.summary && (
          <div className="rounded-2xl bg-indigo-50/70 p-4 text-sm text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900/40 font-medium">
            "{result.feedback.summary}"
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Strengths: You did well in... */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>You did well in...</span>
            </div>
            {result.feedback?.strengths && result.feedback.strengths.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {result.feedback.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                You demonstrated solid baseline comprehension on the introductory problems.
              </p>
            )}
          </div>

          {/* Improvements: You need to improve... */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-3">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>You need to improve...</span>
            </div>
            {result.feedback?.improvements && result.feedback.improvements.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {result.feedback.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                No major weak points detected! Continue to challenge yourself with Hard tests.
              </p>
            )}
          </div>
        </div>

        {/* Recommended topics to revise */}
        {result.feedback?.recommendedTopics && result.feedback.recommendedTopics.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Recommended Topics to Revise
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.feedback.recommendedTopics.map((top, i) => (
                <span
                  key={i}
                  className="rounded-xl bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
                >
                  {top}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Special Feature: Generate another test based on weak areas */}
        {weakAreas.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-5 border border-indigo-200/80 dark:from-indigo-950/50 dark:to-purple-950/40 dark:border-indigo-800/60">
            <div>
              <h4 className="text-sm font-bold text-indigo-950 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Target Your Weak Spots
              </h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                Generate a personalized targeted test specifically focusing on where you lost points.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playSelect();
                onGenerateWeakAreaTest(weakAreas);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 transition-colors whitespace-nowrap"
            >
              <span>Practice Weak Areas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onGoToDashboard();
          }}
          className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 text-center"
        >
          Return to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              sound.playClick();
              onRetakeTest();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Test</span>
          </button>

          <button
            id="review-answers-btn"
            onClick={() => {
              sound.playSelect();
              onReviewAnswers();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Review All Answers & Explanations</span>
          </button>
        </div>
      </div>
    </div>
  );
}

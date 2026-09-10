import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Trophy,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Play,
  Calculator,
  Dna,
  FlaskConical,
  Atom,
  Code,
  Landmark,
  Globe,
  GraduationCap,
  FileText,
  School,
  Zap,
  Target,
  Brain,
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Subject, TestResult, UserStats, AccessStatus } from "../types";
import { NIGERIAN_EXAMS } from "../data/examData";
import { sound } from "../utils/audio";
import { PAYMENT_DETAILS } from "../utils/storage";

interface DashboardProps {
  stats: UserStats;
  recentTests: TestResult[];
  subjects: Subject[];
  onStartNewTest: (subject?: Subject) => void;
  onViewTestDetails: (result: TestResult) => void;
  onRetakeTest: (result: TestResult) => void;
  onPracticeWeakAreas: (weakAreas: string[]) => void;
  onGoToNotes: () => void;
  onGoToExamPrep: (examId?: "JAMB" | "WAEC" | "NECO" | "BECE") => void;
  onGoToCoach: () => void;
  onLaunchQuickPractice: (count: number) => void;
  accessStatus?: AccessStatus;
  onOpenPaymentModal?: () => void;
}

const ICON_MAP: Record<string, any> = {
  Calculator,
  BookOpen,
  Dna,
  FlaskConical,
  Atom,
  Code,
  Landmark,
  Globe,
  Sparkles,
};

export function Dashboard({
  stats,
  recentTests,
  subjects,
  onStartNewTest,
  onViewTestDetails,
  onRetakeTest,
  onPracticeWeakAreas,
  onGoToNotes,
  onGoToExamPrep,
  onGoToCoach,
  onLaunchQuickPractice,
  accessStatus,
  onOpenPaymentModal,
}: DashboardProps) {
  const [copiedQuick, setCopiedQuick] = useState(false);
  const hasWeakAreas = stats.weakTopics && stats.weakTopics.length > 0;

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(PAYMENT_DETAILS.accountNumber);
    setCopiedQuick(true);
    sound.playSelect();
    setTimeout(() => setCopiedQuick(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fadeIn">
      {/* 1. QUIZMASTER AI Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-950 p-6 sm:p-10 text-white shadow-md shadow-emerald-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span className="tracking-wider uppercase font-bold text-[11px]">QUIZMASTER AI</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              &gt; 👋 Welcome, Student!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Step-by-step examination prep for <strong>JAMB</strong>, <strong>WAEC</strong>, <strong>NECO</strong>, and <strong>BECE</strong>. AI practice questions, instant answer rationales, and adaptive mock testing.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                id="hero-exam-prep-btn"
                onClick={() => {
                  sound.playSelect();
                  onGoToExamPrep();
                }}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 transition-all"
              >
                <GraduationCap className="h-4 w-4 text-emerald-700" />
                <span>Exam Preparation</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onGoToCoach();
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-500/30 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-xs hover:bg-emerald-500/40 transition-colors"
              >
                <Brain className="h-4 w-4 text-amber-300" />
                <span>AI Exam Coach</span>
              </button>
            </div>
          </div>

          {/* Study Streak Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/15 text-center shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
              <Flame className="h-7 w-7 fill-amber-300 text-amber-300 animate-pulse" />
            </div>
            <span className="mt-2 text-2xl font-extrabold text-white">
              {stats.currentStreakDays} Day{stats.currentStreakDays === 1 ? "" : "s"}
            </span>
            <span className="text-xs text-emerald-200 font-medium">
              Study Streak
            </span>
          </div>
        </div>
      </div>

      {/* Access & ₦500 Payment Status Banner */}
      {accessStatus && (
        <div
          id="access-status-card"
          className={`rounded-2xl border p-5 transition-all shadow-xs ${
            accessStatus.hasPaid
              ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30"
              : accessStatus.isPaymentRequired
              ? "border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-800 dark:from-amber-950/40 dark:to-orange-950/30"
              : "border-indigo-100 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  accessStatus.hasPaid
                    ? "bg-emerald-600 text-white"
                    : accessStatus.isPaymentRequired
                    ? "bg-amber-600 text-white animate-bounce"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {accessStatus.hasPaid ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {accessStatus.hasPaid
                      ? "✨ ₦500 Premium Access Active"
                      : accessStatus.isPaymentRequired
                      ? "⚠️ Day 1 Free Access Ended — Pay ₦500 to Continue"
                      : "🎉 Day 1 Free Trial: Full Access Active"}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                      accessStatus.hasPaid
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : accessStatus.isPaymentRequired
                        ? "bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200"
                        : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    }`}
                  >
                    {accessStatus.hasPaid ? "Verified" : accessStatus.isPaymentRequired ? "₦500 Required" : "Day 1 Free"}
                  </span>
                </div>

                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {accessStatus.hasPaid ? (
                    <>
                      You have full unlocked access to all Nigerian CBT exams (JAMB, WAEC, NECO, BECE), AI coaching, and rationales.
                    </>
                  ) : accessStatus.isPaymentRequired ? (
                    <>
                      Your first day exam trial is complete! To practice today, please transfer <strong className="text-emerald-700 dark:text-emerald-400 font-bold">₦500</strong> to:
                      <span className="block mt-1 font-semibold text-slate-900 dark:text-white">
                        Bank: <strong className="text-emerald-700 dark:text-emerald-400">OPAY</strong> • Account: <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border font-mono text-emerald-700 dark:text-emerald-400">{PAYMENT_DETAILS.accountNumber}</code> • Name: <strong>{PAYMENT_DETAILS.accountName}</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      All tests and AI coach features are free for your first day. Starting tomorrow (Day 2), continue unlimited practice for just <strong>₦500</strong> paid to <strong>OPAY - {PAYMENT_DETAILS.accountName} ({PAYMENT_DETAILS.accountNumber})</strong>.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0 self-end sm:self-center">
              {!accessStatus.hasPaid && (
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-xs transition-colors"
                >
                  {copiedQuick ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedQuick ? "Copied 8035332548" : "Copy Account"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onOpenPaymentModal) onOpenPaymentModal();
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all ${
                  accessStatus.isPaymentRequired
                    ? "bg-amber-600 text-white hover:bg-amber-700 active:scale-95"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>
                  {accessStatus.hasPaid
                    ? "View Payment Details"
                    : accessStatus.isPaymentRequired
                    ? "Pay ₦500 / Confirm Transfer"
                    : "Payment Details (₦500)"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 🇳🇬 Dedicated Exam Preparation Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Exam Preparation
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select an exam board to start: Exam Prep → Select Exam → Select Subject → Select Year (2020–2026) → Select Topic → Start Test
            </p>
          </div>
          <button
            onClick={() => onGoToExamPrep()}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Open All Exams</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(NIGERIAN_EXAMS).map((exam) => {
            const Icon =
              exam.id === "JAMB"
                ? GraduationCap
                : exam.id === "WAEC"
                ? BookOpen
                : exam.id === "NECO"
                ? FileText
                : School;

            return (
              <div
                key={exam.id}
                onClick={() => {
                  sound.playSelect();
                  onGoToExamPrep(exam.id as any);
                }}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-emerald-500 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/70 cursor-pointer transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${exam.gradient} text-white shadow-2xs`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${exam.badgeBg}`}>
                      {exam.badge}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {exam.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {exam.shortName} • {exam.fullName}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>{exam.subjects.length} Subjects Available</span>
                  <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Prepare</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Practice Section */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Quick Practice
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select question volume to launch instant active recall drills
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onLaunchQuickPractice(10);
            }}
            className="group flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-2xs hover:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 transition-all"
          >
            <div>
              <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold dark:bg-blue-950 dark:text-blue-300">
                Speed Drill
              </span>
              <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                10 Questions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">~12 minutes sprint quiz</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Play className="h-4 w-4 fill-current" />
            </div>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onLaunchQuickPractice(20);
            }}
            className="group flex items-center justify-between rounded-2xl border border-emerald-300/80 bg-emerald-50/30 p-5 text-left shadow-2xs hover:border-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/20 transition-all ring-1 ring-emerald-500/20"
          >
            <div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold dark:bg-emerald-950 dark:text-emerald-300">
                Recommended
              </span>
              <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                20 Questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">~25 minutes focused practice</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Play className="h-4 w-4 fill-white" />
            </div>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onLaunchQuickPractice(50);
            }}
            className="group flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-2xs hover:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 transition-all"
          >
            <div>
              <span className="rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-bold dark:bg-purple-950 dark:text-purple-300">
                Full CBT Mock
              </span>
              <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                50 Questions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">~60 minutes exam simulation</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Play className="h-4 w-4 fill-current" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. Weak Areas Alert (if student has weak spots identified) */}
      {hasWeakAreas && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-amber-50 p-4 sm:px-6 border border-amber-200/80 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Priority Weak Topics Identified</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Targeted review suggested for:{" "}
                <span className="font-semibold">{(stats.weakTopics || []).slice(0, 3).join(", ")}</span>.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSelect();
              onPracticeWeakAreas(stats.weakTopics);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            <span>Practice Weak Areas</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 5. Your Progress (Comprehensive Metrics Breakdown) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Progress
            </h2>
          </div>
          <span className="text-xs text-slate-400">Cumulative performance record</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Tests Completed */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Tests completed</span>
              <Clock className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalTestsCompleted}
            </p>
            <span className="text-[10px] text-slate-400">Logged</span>
          </div>

          {/* Average Score */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Average score</span>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.averageScorePercentage}%
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">Accuracy</span>
          </div>

          {/* Best Score */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Best score</span>
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.bestScorePercentage || 88}%
            </p>
            <span className="text-[10px] text-slate-400">High score</span>
          </div>

          {/* Weakest Subject */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Weakest subject</span>
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <p className="mt-2 text-sm font-extrabold text-rose-600 dark:text-rose-400 truncate">
              {stats.weakestSubject || "Biology"}
            </p>
            <span className="text-[10px] text-slate-400">Focus needed</span>
          </div>

          {/* Strongest Subject */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Strongest subject</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <p className="mt-2 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 truncate">
              {stats.strongestSubject || "Chemistry"}
            </p>
            <span className="text-[10px] text-slate-400">Top mastery</span>
          </div>

          {/* Study Streak */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold">Study streak</span>
              <Flame className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats.currentStreakDays}d
            </p>
            <span className="text-[10px] text-slate-400">Daily streak</span>
          </div>
        </div>
      </div>

      {/* 6. Recent Tests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent Tests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review answers, explanations, and retake previous examination sessions
            </p>
          </div>
          <span className="text-xs text-slate-400">{recentTests.length} tests recorded</span>
        </div>

        {recentTests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTests.slice(0, 6).map((test, idx) => {
              const isHigh = test.percentage >= 80;
              const isMedium = test.percentage >= 60;
              const boardLabel = test.examBoard || "GENERAL";
              return (
                <div
                  key={`${test.id}-${idx}`}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 hover:border-emerald-500/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {boardLabel}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {test.subject.replace(/^(JAMB|WAEC|NECO|BECE):\s*/, "")}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                          isHigh
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : isMedium
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}
                      >
                        {test.percentage}%
                      </span>
                    </div>

                    <h4 className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                      {test.topic} {test.examYear ? `• Year ${test.examYear}` : ""}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        {test.score}/{test.total} Correct
                      </span>
                      <span>{new Date(test.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onRetakeTest(test);
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Retake</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playSelect();
                        onViewTestDetails(test);
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <span>Review</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No previous tests recorded. Launch an exam prep or quick practice test to begin!
            </p>
          </div>
        )}
      </div>

      {/* 7. General Syllabus Subjects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              All Syllabus Subjects
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any subject to practice custom topics and difficulty levels
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onStartNewTest();
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Custom Test Setup</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {subjects.slice(0, 8).map((sub) => {
            const Icon = ICON_MAP[sub.icon] || BookOpen;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  sound.playSelect();
                  onStartNewTest(sub);
                }}
                className="group flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-2xs hover:border-emerald-500 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/80 transition-all"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sub.color} text-white mb-2.5 shadow-2xs`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {sub.name}
                </h3>
                <span className="mt-1 text-[11px] text-slate-400">
                  {sub.popularTopics.length} core topics
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

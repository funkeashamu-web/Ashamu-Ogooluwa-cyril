/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { ExamPrep } from "./components/ExamPrep";
import { AiExamCoach } from "./components/AiExamCoach";
import { SubjectSelector } from "./components/SubjectSelector";
import { TestSetupModal } from "./components/TestSetupModal";
import { ActiveTest } from "./components/ActiveTest";
import { TestResults } from "./components/TestResults";
import { AnswerReview } from "./components/AnswerReview";
import { StudyNotes } from "./components/StudyNotes";
import { TestHistory } from "./components/TestHistory";
import { AchievementsModal } from "./components/AchievementsModal";
import { PaymentModal } from "./components/PaymentModal";
import { AppBlockedPaywall } from "./components/AppBlockedPaywall";
import { EducationalGames } from "./components/EducationalGames";
import { DEFAULT_SUBJECTS, DEFAULT_ACHIEVEMENTS, FALLBACK_QUESTIONS, getFallbackQuestions } from "./data/subjectData";
import {
  Subject,
  TestConfig,
  Question,
  TestResult,
  StudyNote,
  UserStats,
  Achievement,
  AccessStatus,
} from "./types";
import {
  getTestHistory,
  saveTestResult,
  getStudyNotes,
  getUserStats,
  saveUserStats,
  getAchievements,
  updateAchievements,
  getCustomSubjects,
  saveCustomSubject,
  getAccessStatus,
  recordFirstExamDateIfNeeded,
} from "./utils/storage";
import { sound } from "./utils/audio";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedExamForPrep, setSelectedExamForPrep] = useState<"JAMB" | "WAEC" | "NECO" | "BECE" | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem("testyourself_theme") === "dark" ||
      (!localStorage.getItem("testyourself_theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.isEnabled());

  // Data states
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  // Active Test States
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedSubjectForConfig, setSelectedSubjectForConfig] = useState<Subject | null>(null);
  const [currentTestConfig, setCurrentTestConfig] = useState<TestConfig | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Day 1 Free vs Day 2 ₦500 Payment Gate
  const [accessStatus, setAccessStatus] = useState<AccessStatus>(() => getAccessStatus());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Results & Review State
  const [activeResult, setActiveResult] = useState<TestResult | null>(null);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("testyourself_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("testyourself_theme", "light");
    }
  }, [isDarkMode]);

  // Load initial persistent data
  useEffect(() => {
    const loadedHistory = getTestHistory();
    setHistory(loadedHistory);

    const loadedNotes = getStudyNotes();
    setNotes(loadedNotes);

    const loadedStats = getUserStats();
    setStats(loadedStats);

    const loadedAchievements = getAchievements();
    setAchievements(loadedAchievements);

    const customSubs = getCustomSubjects();
    if (customSubs.length > 0) {
      setSubjects([...DEFAULT_SUBJECTS, ...customSubs]);
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleToggleSound = () => {
    const nextState = sound.toggleSound();
    setSoundEnabled(nextState);
  };

  const handleAddCustomSubject = (subjectOrName: any, desc?: string) => {
    let newSubject: Subject;
    if (typeof subjectOrName === "string") {
      newSubject = {
        id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: subjectOrName,
        icon: "Sparkles",
        color: "from-indigo-600 to-purple-600",
        bgLight: "bg-indigo-50/50",
        borderLight: "border-indigo-100",
        badgeColor: "bg-indigo-100 text-indigo-700",
        description: desc || "Custom user subject",
        popularTopics: ["Foundations", "Core Principles", "Advanced Concepts"],
      };
    } else {
      newSubject = subjectOrName;
    }
    saveCustomSubject(newSubject);
    setSubjects((prev) => [
      ...prev.filter((s) => s.id !== newSubject.id && s.name.toLowerCase() !== newSubject.name.toLowerCase()),
      newSubject,
    ]);
    sound.playSelect();
  };

  // Open Test Setup Modal
  const handleOpenTestSetup = (subject?: Subject) => {
    const currentAccess = getAccessStatus();
    if (currentAccess.isBlocked || currentAccess.isPaymentRequired) {
      sound.playWrong();
      setAccessStatus(currentAccess);
      return;
    }
    setSelectedSubjectForConfig(subject || subjects[0]);
    setIsConfigModalOpen(true);
  };

  // Generate Test Questions via Gemini API
  const handleStartTest = async (config: TestConfig) => {
    setIsConfigModalOpen(false);

    // Verify Day 1 vs Day 2 Payment Gate - strictly block if unpaid & Day 1 expired
    const currentAccess = getAccessStatus();
    if (currentAccess.isBlocked || currentAccess.isPaymentRequired) {
      sound.playWrong();
      setAccessStatus(currentAccess);
      return;
    }

    // Record first exam date if this is their first exam
    recordFirstExamDateIfNeeded();
    setAccessStatus(getAccessStatus());

    setIsGeneratingTest(true);
    setGenerationError(null);
    setCurrentTestConfig(config);

    const count = config.questionCount || config.count || 5;

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: config.subject,
          topic: config.topic,
          questionCount: count,
          difficulty: config.difficulty,
          questionType: config.questionType,
          examBoard: config.examBoard,
          examYear: config.examYear,
        }),
      });

      let questions: Question[] = [];

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          questions = data.questions;
        }
      }

      // Fallback if API fails or empty
      if (questions.length === 0) {
        console.warn("Using curated fallback questions for test configuration.");
        questions = getFallbackQuestions(
          config.subject,
          config.topic,
          count,
          config.difficulty,
          config.questionType
        );
      }

      setCurrentQuestions(questions);
      setIsGeneratingTest(false);
      setActiveTab("active-test");
      sound.playSelect();
    } catch (err: any) {
      console.error("Test generation error:", err);
      // Resilient fallback: user is never blocked even if network or server drops
      const fallbackSet = getFallbackQuestions(
        config.subject,
        config.topic,
        count,
        config.difficulty,
        config.questionType
      );
      setCurrentQuestions(fallbackSet);
      setIsGeneratingTest(false);
      setActiveTab("active-test");
      sound.playSelect();
    }
  };

  // Handle Test Submission & Grading
  const handleSubmitTest = async (
    userAnswers: Record<string, string>,
    flags: Record<string, boolean>,
    timeSpentSeconds: number
  ) => {
    if (!currentTestConfig || currentQuestions.length === 0) return;

    // Automatic Marking
    let correctCount = 0;
    currentQuestions.forEach((q) => {
      const uAns = (userAnswers[q.id] || "").trim().toLowerCase();
      const cAns = (q.correctAnswer || "").trim().toLowerCase();
      if (uAns === cAns) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / currentQuestions.length) * 100);

    // Build partial result
    const partialResult: TestResult = {
      id: `test_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      subject: currentTestConfig.subject,
      topic: currentTestConfig.topic,
      difficulty: currentTestConfig.difficulty,
      questionType: currentTestConfig.questionType,
      score: correctCount,
      total: currentQuestions.length,
      percentage,
      timeSpentSeconds,
      totalTimeAllowedSeconds: currentTestConfig.timeLimitSeconds,
      date: new Date().toISOString(),
      userAnswers,
      flags,
      questions: currentQuestions,
      examBoard: currentTestConfig.examBoard,
      examYear: currentTestConfig.examYear,
      isExamPrep: currentTestConfig.isExamPrep,
    };

    // Update Local Stats & Persistence right away
    const updatedStats = saveTestResult(partialResult);
    setStats(updatedStats);
    setHistory(getTestHistory());
    setAchievements(getAchievements());

    setActiveResult(partialResult);
    setActiveTab("results");

    // Request AI feedback in background (Gemini)
    try {
      const res = await fetch("/api/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: currentTestConfig.subject,
          topic: currentTestConfig.topic,
          score: correctCount,
          total: currentQuestions.length,
          percentage,
          difficulty: currentTestConfig.difficulty,
          userAnswers,
          questions: currentQuestions,
        }),
      });

      if (res.ok) {
        const feedback = await res.json();
        const fullResult: TestResult = {
          ...partialResult,
          feedback: {
            strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
            improvements: Array.isArray(feedback.improvements) ? feedback.improvements : [],
            recommendedTopics: Array.isArray(feedback.recommendedTopics)
              ? feedback.recommendedTopics
              : [],
            summary: feedback.summary || "Good completion of test exercises.",
            masteryRating: feedback.masteryRating || (percentage >= 80 ? "Mastery" : "Proficient"),
          },
        };
        saveTestResult(fullResult);
        setActiveResult(fullResult);
        setHistory(getTestHistory());
      }
    } catch (err) {
      console.warn("Feedback generation failed:", err);
    }
  };

  // Quick action: Generate targeted test based on weak spots
  const handlePracticeWeakAreas = (weakAreas: string[]) => {
    const currentAccess = getAccessStatus();
    if (currentAccess.isBlocked || currentAccess.isPaymentRequired) {
      sound.playWrong();
      setAccessStatus(currentAccess);
      return;
    }
    const primaryTopic = weakAreas[0] || "Foundational Concepts";
    handleStartTest({
      subject: activeResult?.subject || subjects[0]?.name || "Mathematics",
      topic: primaryTopic,
      count: 5,
      difficulty: "Medium",
      questionType: "Multiple choice",
      timeLimitSeconds: 300,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      {/* Primary Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        toggleSound={handleToggleSound}
        streak={stats.currentStreakDays}
        accessStatus={accessStatus}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
      />

      {/* Main Body Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* If App is Blocked due to Day 1 trial expired and user hasn't paid: Block Entire App */}
        {accessStatus.isBlocked ? (
          <AppBlockedPaywall
            accessStatus={accessStatus}
            onPaymentConfirmed={() => {
              const updated = getAccessStatus();
              setAccessStatus(updated);
              setIsPaymentModalOpen(false);
            }}
            onStatusChange={() => {
              setAccessStatus(getAccessStatus());
            }}
          />
        ) : (
          <>
            {/* Day 1 Free Trial Notification Banner */}
            {accessStatus.isDay1 && !accessStatus.hasPaid && (
              <div
                id="day1-free-trial-banner"
                className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-emerald-300/80 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 p-4 sm:px-5 dark:border-emerald-700/60 dark:bg-emerald-950/20 shadow-xs animate-fadeIn"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs font-black text-xs shrink-0">
                    Day 1
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
                      🎉 Day 1 Free Access Active — Take Unlimited CBT Exams Today!
                    </p>
                    <p className="text-[11px] sm:text-xs text-emerald-800/80 dark:text-emerald-300/70">
                      Day one is completely free. Starting tomorrow (Day 2), continue unlimited practice for ₦500 to OPAY.
                    </p>
                  </div>
                </div>
                <button
                  id="day1-banner-pay-btn"
                  onClick={() => {
                    sound.playClick();
                    setIsPaymentModalOpen(true);
                  }}
                  className="shrink-0 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 transition-colors shadow-xs cursor-pointer"
                >
                  View ₦500 OPAY Info
                </button>
              </div>
            )}

            {/* Loading / AI Generation Overlay */}
            {isGeneratingTest && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-inner">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <span>Gemini is Crafting Your Test...</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                    Synthesizing challenging problems, accurate answer options, and step-by-step explanations for {currentTestConfig?.subject} ({currentTestConfig?.topic}).
                  </p>
                </div>
              </div>
            )}

            {/* View Routing */}
            {!isGeneratingTest && (
              <>
            {activeTab === "dashboard" && (
              <Dashboard
                stats={stats}
                recentTests={history}
                subjects={subjects}
                onStartNewTest={(sub) => handleOpenTestSetup(sub)}
                onViewTestDetails={(result) => {
                  setActiveResult(result);
                  setActiveTab("results");
                }}
                onRetakeTest={(result) => {
                  handleStartTest({
                    subject: result.subject,
                    topic: result.topic,
                    count: result.total,
                    difficulty: result.difficulty,
                    questionType: result.questionType,
                    timeLimitSeconds: result.timeSpentSeconds || 600,
                    examBoard: result.examBoard,
                    examYear: result.examYear,
                    isExamPrep: result.isExamPrep,
                  });
                }}
                onPracticeWeakAreas={handlePracticeWeakAreas}
                onGoToNotes={() => setActiveTab("notes")}
                onGoToExamPrep={(examId) => {
                  setSelectedExamForPrep(examId || null);
                  setActiveTab("exam-prep");
                }}
                onGoToCoach={() => setActiveTab("ai-coach")}
                onLaunchQuickPractice={(count) => {
                  handleStartTest({
                    subject: "JAMB: Use of English",
                    topic: "Lexis, Structure and Comprehension",
                    count,
                    questionCount: count,
                    difficulty: "Medium",
                    questionType: "Multiple choice",
                    timeLimitSeconds: count === 10 ? 12 * 60 : count === 20 ? 25 * 60 : 60 * 60,
                    examBoard: "JAMB",
                    examYear: "2024",
                    isExamPrep: true,
                  });
                }}
                accessStatus={accessStatus}
                onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
                onGoToGames={() => setActiveTab("games")}
              />
            )}

            {activeTab === "games" && (
              <EducationalGames
                accessStatus={accessStatus}
                onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
                onGoToTest={() => setActiveTab("test")}
                onGoToExamPrep={() => setActiveTab("exam-prep")}
              />
            )}

            {activeTab === "exam-prep" && (
              <ExamPrep
                initialExamId={selectedExamForPrep}
                onStartExamTest={handleStartTest}
                onGoToCoach={() => setActiveTab("ai-coach")}
                accessStatus={accessStatus}
                onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              />
            )}

            {activeTab === "ai-coach" && (
              <AiExamCoach
                stats={stats}
                recentTests={history}
                onStartTest={handleStartTest}
                onGoToNotes={() => setActiveTab("notes")}
                onGoToExamPrep={(examId) => {
                  setSelectedExamForPrep(examId || null);
                  setActiveTab("exam-prep");
                }}
              />
            )}

            {(activeTab === "subjects" || activeTab === "test") && (
              <SubjectSelector
                subjects={subjects}
                onSelectSubject={(subject) => handleOpenTestSetup(subject)}
                onAddCustomSubject={handleAddCustomSubject}
              />
            )}

            {activeTab === "active-test" && currentTestConfig && (
              <ActiveTest
                config={currentTestConfig}
                questions={currentQuestions}
                onSubmit={handleSubmitTest}
                onExit={() => setActiveTab("dashboard")}
              />
            )}

            {activeTab === "results" && activeResult && (
              <TestResults
                result={activeResult}
                onReviewAnswers={() => setActiveTab("review")}
                onRetakeTest={() => {
                  handleStartTest({
                    subject: activeResult.subject,
                    topic: activeResult.topic,
                    count: activeResult.total,
                    difficulty: activeResult.difficulty,
                    questionType: activeResult.questionType,
                    timeLimitSeconds: activeResult.timeSpentSeconds || 600,
                  });
                }}
                onGenerateWeakAreaTest={handlePracticeWeakAreas}
                onGoToDashboard={() => setActiveTab("dashboard")}
                onSaveToNotes={() => setActiveTab("notes")}
              />
            )}

            {activeTab === "review" && activeResult && (
              <AnswerReview
                result={activeResult}
                onBackToResults={() => setActiveTab("results")}
                onGoToDashboard={() => setActiveTab("dashboard")}
              />
            )}

            {activeTab === "notes" && (
              <StudyNotes
                notes={notes}
                subjects={subjects}
                onNotesUpdated={() => setNotes(getStudyNotes())}
                onGenerateTestFromTopic={(subject, topic) => {
                  handleStartTest({
                    subject,
                    topic,
                    count: 5,
                    difficulty: "Medium",
                    questionType: "Multiple choice",
                    timeLimitSeconds: 300,
                  });
                }}
              />
            )}

            {activeTab === "history" && (
              <TestHistory
                history={history}
                subjects={subjects}
                onHistoryUpdated={() => {
                  setHistory(getTestHistory());
                  setStats(getUserStats());
                }}
                onViewTestDetails={(result) => {
                  setActiveResult(result);
                  setActiveTab("results");
                }}
                onRetakeTest={(result) => {
                  handleStartTest({
                    subject: result.subject,
                    topic: result.topic,
                    count: result.total,
                    difficulty: result.difficulty,
                    questionType: result.questionType,
                    timeLimitSeconds: result.timeSpentSeconds || 600,
                  });
                }}
              />
            )}

            {activeTab === "achievements" && (
              <AchievementsModal achievements={achievements} />
            )}
          </>
        )}
          </>
        )}
      </main>

      {/* Test Setup Modal Dialog */}
      {isConfigModalOpen && selectedSubjectForConfig && (
        <TestSetupModal
          isOpen={isConfigModalOpen}
          subject={selectedSubjectForConfig}
          onClose={() => setIsConfigModalOpen(false)}
          onStartTest={handleStartTest}
        />
      )}

      {/* Payment Gate Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        accessStatus={accessStatus}
        onPaymentConfirmed={() => {
          setAccessStatus(getAccessStatus());
        }}
        onStatusUpdated={() => {
          setAccessStatus(getAccessStatus());
        }}
      />
    </div>
  );
}

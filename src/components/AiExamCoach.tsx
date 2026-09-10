import { useState, useEffect } from "react";
import {
  Sparkles,
  Target,
  Brain,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Award,
  Zap,
  Flame,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { UserStats, TestResult, TestConfig, DifficultyLevel } from "../types";
import { NIGERIAN_EXAMS } from "../data/examData";
import { sound } from "../utils/audio";

interface AiExamCoachProps {
  stats: UserStats;
  recentTests: TestResult[];
  onStartTest: (config: TestConfig) => void;
  onGoToNotes: () => void;
  onGoToExamPrep: (examId?: "JAMB" | "WAEC" | "NECO" | "BECE") => void;
}

export function AiExamCoach({
  stats,
  recentTests,
  onStartTest,
  onGoToNotes,
  onGoToExamPrep,
}: AiExamCoachProps) {
  const [selectedExam, setSelectedExam] = useState<"JAMB" | "WAEC" | "NECO" | "BECE">("JAMB");
  const [weeksCount, setWeeksCount] = useState<number>(4);
  const [dailyHours, setDailyHours] = useState<number>(2);

  // AI Study plan state
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [expandedWeek, setExpandedWeek] = useState<number>(1);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState<boolean>(false);

  // Fetch initial recommendations & study plan
  useEffect(() => {
    fetchRecommendations();
    fetchStudyPlan();
  }, [selectedExam]);

  const fetchRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const res = await fetch("/api/exam-coach/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examBoard: selectedExam,
          stats,
          recentScores: recentTests.map((t) => ({
            subject: t.subject,
            percentage: t.percentage,
            examBoard: t.examBoard,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (e) {
      console.log("Using cached recommendations");
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const fetchStudyPlan = async () => {
    setIsLoadingPlan(true);
    try {
      const res = await fetch("/api/exam-coach/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examBoard: selectedExam,
          weeksCount,
          hoursPerDay: dailyHours,
          weakAreas: stats.weakTopics || [],
          subjects:
            selectedExam === "JAMB"
              ? ["Use of English", "Mathematics", "Physics", "Chemistry"]
              : ["Mathematics", "English Language", "Biology", "Economics"],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setStudyPlan(data);
      }
    } catch (e) {
      console.log("Using cached study plan");
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleLaunchQuickMock = (count: number, timeMins: number) => {
    sound.playSuccess();
    const targetSubject = stats.weakestSubject || "Mathematics";
    onStartTest({
      subject: `${selectedExam}: ${targetSubject}`,
      topic: stats.weakTopics && stats.weakTopics.length > 0 ? stats.weakTopics[0] : "Mixed High-Yield Syllabus Questions",
      count,
      questionCount: count,
      difficulty: "Medium",
      questionType: "Multiple choice",
      timeLimitSeconds: timeMins * 60,
      examBoard: selectedExam,
      examYear: "2024",
      isExamPrep: true,
    });
  };

  const handleLaunchRecommendedTopic = (item: { subject: string; topic: string }) => {
    sound.playSelect();
    onStartTest({
      subject: `${selectedExam}: ${item.subject}`,
      topic: item.topic,
      count: 15,
      questionCount: 15,
      difficulty: "Medium",
      questionType: "Multiple choice",
      timeLimitSeconds: 20 * 60,
      examBoard: selectedExam,
      examYear: "2024",
      isExamPrep: true,
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/30">
              <Brain className="h-3.5 w-3.5" />
              <span>Personalized Academic Mentor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Exam Coach & Performance Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
              Analyzes your quiz history, identifies weak syllabus areas, creates tailored mock exams, and generates an optimized revision timetable.
            </p>
          </div>

          {/* Exam Selector Pill */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 self-start md:self-auto">
            {(["JAMB", "WAEC", "NECO", "BECE"] as const).map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  sound.playClick();
                  setSelectedExam(ex);
                }}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedExam === ex
                    ? "bg-white text-indigo-950 shadow-sm"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Diagnostic Summary & Weak Area Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Diagnostic Card */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedExam} Diagnostic Evaluation
                </h3>
                <span className="text-xs text-slate-400">Automated performance profile</span>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                fetchRecommendations();
              }}
              title="Refresh AI analysis"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingRecs ? "animate-spin" : ""}`} />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {recommendations?.summary ||
              `Based on your tests in ${selectedExam}, your performance shows solid foundational competency. Focused practice on problem-solving speed will boost your percentile.`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 block font-semibold">Current Accuracy</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                {stats.averageScorePercentage}%
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 block font-semibold">Best Score</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {stats.bestScorePercentage || 88}%
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 block font-semibold">Strongest</span>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 truncate block mt-0.5">
                {stats.strongestSubject || "Chemistry"}
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 block font-semibold">Priority Focus</span>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 truncate block mt-0.5">
                {stats.weakestSubject || "Biology"}
              </span>
            </div>
          </div>
        </div>

        {/* Identified Weak Areas */}
        <div className="rounded-3xl border border-amber-200/80 bg-amber-50/50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-bold">Identified Weak Areas</h3>
          </div>

          <p className="text-xs text-amber-800 dark:text-amber-300/80 leading-relaxed">
            Topics where mistakes were clustered in recent tests:
          </p>

          <div className="space-y-2">
            {(recommendations?.weakAreasIdentified || stats.weakTopics || [
              "Cellular Respiration and Energy Cycles",
              "Surds and Quadratic Sign Conventions",
              "Comprehension Deductive Inference",
            ]).slice(0, 4).map((area: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-white/90 dark:bg-slate-900/90 px-3 py-2 border border-amber-200/60 dark:border-amber-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <span className="truncate pr-2">{area}</span>
                <span className="text-[10px] text-amber-600 font-bold uppercase shrink-0">
                  Revise
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleLaunchQuickMock(15, 20)}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
          >
            <span>Practice Weak Areas Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Personalized Mock Exam Center */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <span>Personalized Mock Exams for {selectedExam}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calibrated practice exams to build speed, accuracy, and test-taking confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-4">
            <div>
              <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[10px] font-bold dark:bg-blue-950/60 dark:text-blue-300">
                Speed Drill
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                10-Question Sprint
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fast-paced active recall test. 12 minutes countdown timer. Perfect for daily warmups.
              </p>
            </div>
            <button
              onClick={() => handleLaunchQuickMock(10, 12)}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Start 10 Questions</span>
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-200/90 bg-white p-5 dark:border-emerald-900/60 dark:bg-slate-900 ring-1 ring-emerald-500/20 flex flex-col justify-between space-y-4">
            <div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold dark:bg-emerald-950/60 dark:text-emerald-300">
                Recommended
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                20-Question Targeted Mock
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Balanced topic depth focusing on your priority improvement areas. 25 minutes timer.
              </p>
            </div>
            <button
              onClick={() => handleLaunchQuickMock(20, 25)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Start 20 Questions</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-4">
            <div>
              <span className="rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-[10px] font-bold dark:bg-purple-950/60 dark:text-purple-300">
                Full CBT Simulation
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                50-Question Full Simulator
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Full realistic examination simulation with 60-minute countdown timer and comprehensive grading.
              </p>
            </div>
            <button
              onClick={() => handleLaunchQuickMock(50, 60)}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Start 50 Questions</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recommended Topics to Revise */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Recommended Topics to Revise
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            High-yield topics curated by your AI Coach based on official {selectedExam} syllabus weightings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(recommendations?.recommendedTopics || [
            {
              subject: "Mathematics",
              topic: "Algebra & Logarithmic Indices",
              priority: "High",
              reason: "Frequent in Section A calculation questions",
            },
            {
              subject: "Use of English",
              topic: "Lexis, Concord & Antonyms",
              priority: "High",
              reason: "Essential for speed in compulsory paper",
            },
            {
              subject: "Physics",
              topic: "Newtonian Mechanics & Gas Laws",
              priority: "Medium",
              reason: "Key topic with high question frequency",
            },
          ]).map((item: any, idx: number) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                    {item.subject}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.priority === "High"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  {item.topic}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.reason}
                </p>
              </div>

              <button
                onClick={() => handleLaunchRecommendedTopic(item)}
                className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Practice Topic Quiz</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. AI Study Plan Generator (Personalized Timetable) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Personalized Study Plan & Timetable
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              AI-generated multi-week revision schedule targeting high-yield syllabus areas for {selectedExam}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Weeks:</span>
              <select
                value={weeksCount}
                onChange={(e) => setWeeksCount(Number(e.target.value))}
                className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
              >
                <option value={2}>2 Weeks</option>
                <option value={4}>4 Weeks</option>
                <option value={6}>6 Weeks</option>
                <option value={8}>8 Weeks</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Daily:</span>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
              >
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
                <option value={4}>4 Hours</option>
              </select>
            </div>

            <button
              onClick={fetchStudyPlan}
              disabled={isLoadingPlan}
              className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingPlan ? "animate-spin" : ""}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {studyPlan && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100 text-xs text-indigo-900 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:text-indigo-200">
              <span className="font-bold block text-sm">{studyPlan.planTitle}</span>
              <p className="mt-1 leading-relaxed">{studyPlan.overview}</p>
            </div>

            {/* Weeks Accordion */}
            <div className="space-y-3">
              {studyPlan.weeks?.map((wk: any) => {
                const isOpen = expandedWeek === wk.weekNumber;
                return (
                  <div
                    key={wk.weekNumber}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedWeek(isOpen ? 0 : wk.weekNumber)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs">
                          W{wk.weekNumber}
                        </span>
                        <div>
                          <span>Week {wk.weekNumber}: {wk.theme}</span>
                          <span className="text-[11px] text-slate-400 block font-normal">
                            Goal: {wk.mockTestGoal}
                          </span>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-200/60 dark:border-slate-800">
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Daily Revision Tasks:
                          </span>
                          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                            {wk.dailySchedule?.map((task: string, tIdx: number) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">•</span>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Exam Day Strategies & Revision Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span>{selectedExam} CBT Tactics</span>
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {studyPlan.examStrategies?.map((strat: string, sIdx: number) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{strat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>Active Recall Tips</span>
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {studyPlan.topRevisionTips?.map((tip: string, tIdx: number) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">★</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

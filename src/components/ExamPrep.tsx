import { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  FileText,
  School,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  Layers,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shuffle,
  Compass,
  Zap,
  CreditCard,
} from "lucide-react";
import { NIGERIAN_EXAMS, EXAM_YEARS, ExamBoardInfo, ExamYearType } from "../data/examData";
import { TestConfig, DifficultyLevel, QuestionTypeOption, AccessStatus } from "../types";
import { sound } from "../utils/audio";
import { PAYMENT_DETAILS } from "../utils/storage";

interface ExamPrepProps {
  initialExamId?: "JAMB" | "WAEC" | "NECO" | "BECE" | null;
  onStartExamTest: (config: TestConfig) => void;
  onGoToCoach: () => void;
  accessStatus?: AccessStatus;
  onOpenPaymentModal?: () => void;
}

const EXAM_ICONS: Record<string, any> = {
  GraduationCap,
  BookOpen,
  FileText,
  School,
};

export function ExamPrep({
  initialExamId,
  onStartExamTest,
  onGoToCoach,
  accessStatus,
  onOpenPaymentModal,
}: ExamPrepProps) {
  // Navigation step: 1: Select Exam -> 2: Select Subject -> 3: Select Year -> 4: Select Topic -> 5: Launch / Config
  const [currentStep, setCurrentStep] = useState<number>(initialExamId ? 2 : 1);
  const [selectedExamId, setSelectedExamId] = useState<"JAMB" | "WAEC" | "NECO" | "BECE">(
    initialExamId || "JAMB"
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [customYearStart, setCustomYearStart] = useState<string>("2021");
  const [customYearEnd, setCustomYearEnd] = useState<string>("2025");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopicInput, setCustomTopicInput] = useState<string>("");

  // Test setup settings
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Medium");
  const [questionType, setQuestionType] = useState<QuestionTypeOption>("Multiple choice");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(25);

  const activeExam: ExamBoardInfo = NIGERIAN_EXAMS[selectedExamId] || NIGERIAN_EXAMS.JAMB;
  const activeSubject = activeExam.subjects.find((s) => s.id === selectedSubjectId);

  // Group subjects by category
  const categories = Array.from(
    new Set(activeExam.subjects.map((s) => s.category))
  );

  const resolvedYearString =
    selectedYear === "Custom Year Range"
      ? `${customYearStart}–${customYearEnd}`
      : selectedYear === "Random Year"
      ? "Random Year (2020–2026)"
      : selectedYear;

  const resolvedTopicString =
    selectedTopic === "custom"
      ? customTopicInput.trim() || "Comprehensive Exam Drill"
      : selectedTopic || activeSubject?.topics[0] || "All Syllabus Topics";

  const handleSelectExam = (examId: "JAMB" | "WAEC" | "NECO" | "BECE") => {
    sound.playSelect();
    setSelectedExamId(examId);
    setSelectedSubjectId("");
    setSelectedTopic("");
    setCurrentStep(2);
  };

  const handleSelectSubject = (subjectId: string) => {
    sound.playSelect();
    setSelectedSubjectId(subjectId);
    const sub = activeExam.subjects.find((s) => s.id === subjectId);
    if (sub && sub.topics.length > 0) {
      setSelectedTopic(sub.topics[0]);
    }
    setCurrentStep(3);
  };

  const handleSelectYear = (year: string) => {
    sound.playClick();
    setSelectedYear(year);
  };

  const handleConfirmYear = () => {
    sound.playSelect();
    setCurrentStep(4);
  };

  const handleSelectTopic = (topic: string) => {
    sound.playSelect();
    setSelectedTopic(topic);
    setCurrentStep(5);
  };

  const handleLaunchTest = () => {
    if (!activeSubject) return;

    if (accessStatus?.isPaymentRequired) {
      sound.playWrong();
      if (onOpenPaymentModal) onOpenPaymentModal();
      return;
    }

    sound.playSuccess();
    const config: TestConfig = {
      subject: `${activeExam.shortName}: ${activeSubject.name}`,
      topic: resolvedTopicString,
      count: questionCount,
      questionCount,
      difficulty,
      questionType,
      timeLimitSeconds: timeLimitMinutes * 60,
      examBoard: activeExam.id,
      examYear: resolvedYearString,
      isExamPrep: true,
    };

    onStartExamTest(config);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-md shadow-emerald-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-400/30">
              <span>🇳🇬 Official Nigerian Examination Prep</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              JAMB • WAEC • NECO • BECE Examination Portal
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Step-by-step exam preparation powered by AI. Calibrated to official Nigerian curricula, past syllabus patterns (2020–2026), and CBT speed requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                onGoToCoach();
              }}
              className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>AI Exam Coach</span>
            </button>
          </div>
        </div>

        {/* Multi-step Breadcrumb Trail */}
        <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          {[
            { step: 1, label: "1. Select Exam" },
            { step: 2, label: "2. Select Subject" },
            { step: 3, label: "3. Select Year" },
            { step: 4, label: "4. Select Topic" },
            { step: 5, label: "5. Start Test" },
          ].map((item, idx) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="flex items-center gap-2 shrink-0">
                <button
                  disabled={currentStep < item.step}
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(item.step);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    isCurrent
                      ? "bg-white text-emerald-900 shadow-sm"
                      : isCompleted
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "text-emerald-300/60 cursor-not-allowed"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  ) : (
                    <span className="text-[11px] opacity-80">{item.step}</span>
                  )}
                  <span>{item.label}</span>
                </button>
                {idx < 4 && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Select Exam (JAMB, WAEC, NECO, BECE) */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Step 1: Choose Your Examination Board
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the exam you are preparing for to align syllabus standards and test formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.values(NIGERIAN_EXAMS).map((exam) => {
              const Icon = EXAM_ICONS[exam.iconName] || GraduationCap;
              const isSelected = selectedExamId === exam.id;

              return (
                <div
                  key={exam.id}
                  onClick={() => handleSelectExam(exam.id as any)}
                  className={`group relative flex flex-col justify-between rounded-3xl border p-6 text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/20 shadow-md"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-emerald-500/70 hover:shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${exam.gradient} text-white shadow-xs`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${exam.badgeBg}`}>
                        {exam.badge}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {exam.name}
                    </h3>
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {exam.fullName}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {exam.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {exam.subjects.length} Syllabi Subjects Available
                    </span>
                    <button className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Select Exam</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Select Subject */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Exam</span>
                </button>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  {activeExam.name}
                </span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Step 2: Select {activeExam.shortName} Subject
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a subject to practice questions calibrated to official {activeExam.shortName} standards.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {categories.map((cat) => {
              const subsInCat = activeExam.subjects.filter((s) => s.category === cat);
              return (
                <div key={cat} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {cat} Subjects
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {subsInCat.map((sub) => {
                      const isSelected = selectedSubjectId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubject(sub.id)}
                          className={`group flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30"
                              : "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-emerald-500/70 hover:shadow-xs"
                          }`}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {sub.name}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {sub.topics.length} topics
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {sub.syllabusSummary}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Select Year */}
      {currentStep === 3 && activeSubject && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Subject</span>
                </button>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  {activeExam.shortName} • {activeSubject.name}
                </span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Step 3: Choose Benchmark Examination Year
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a benchmark year or range to calibrate question styles, syllabi patterns, and difficulty levels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {EXAM_YEARS.map((yr) => {
              const isSelected = selectedYear === yr;
              const isSpecial = yr === "All Years" || yr === "Random Year" || yr === "Custom Year Range";

              return (
                <button
                  key={yr}
                  onClick={() => handleSelectYear(yr)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold shadow-xs"
                      : "border-slate-200/90 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:border-emerald-500/70"
                  }`}
                >
                  <div className="mb-2">
                    {yr === "Random Year" ? (
                      <Shuffle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : yr === "All Years" ? (
                      <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : yr === "Custom Year Range" ? (
                      <Compass className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Calendar className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <span className="text-sm font-bold">{yr}</span>
                  <span className="mt-1 text-[10px] text-slate-400">
                    {yr === "2026"
                      ? "Latest 2026 Model"
                      : isSpecial
                      ? "Curriculum Blend"
                      : "Syllabus Standard"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Year Range Input */}
          {selectedYear === "Custom Year Range" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-center gap-4">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Specify Year Range:
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={customYearStart}
                  onChange={(e) => setCustomYearStart(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900"
                >
                  {["2020", "2021", "2022", "2023", "2024"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-400 font-semibold">to</span>
                <select
                  value={customYearEnd}
                  onChange={(e) => setCustomYearEnd(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900"
                >
                  {["2022", "2023", "2024", "2025", "2026"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleConfirmYear}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <span>Next: Select Topic</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Select Topic */}
      {currentStep === 4 && activeSubject && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Year</span>
                </button>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  {activeExam.shortName} • {activeSubject.name} • {resolvedYearString}
                </span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Step 4: Select Syllabus Topic or Custom Focus
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick a core topic from the official syllabus or type a custom focus area.
              </p>
            </div>
          </div>

          {/* Quick All-Topics Option */}
          <button
            onClick={() => handleSelectTopic("Comprehensive All-Syllabus Drill")}
            className="w-full flex items-center justify-between rounded-2xl border-2 border-dashed border-emerald-400/80 bg-emerald-50/50 p-4 text-left dark:border-emerald-700/60 dark:bg-emerald-950/20 hover:bg-emerald-100/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Full Syllabus Mixed Test (Recommended)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  A representative mix of questions across all major {activeSubject.name} syllabus topics.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <span>Select</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>

          {/* Specific Syllabus Topics */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Specific Syllabus Topics ({activeSubject.topics.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSubject.topics.map((t) => (
                <button
                  key={t}
                  onClick={() => handleSelectTopic(t)}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 text-left text-xs font-semibold transition-all ${
                    selectedTopic === t
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-slate-200/80 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:border-emerald-500/70"
                  }`}
                >
                  <span className="truncate pr-2">{t}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic Option */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Or Enter Your Own Custom Topic:
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Photosynthesis & Light Phase Reactions, Quadratic Word Problems..."
                value={customTopicInput}
                onChange={(e) => {
                  setCustomTopicInput(e.target.value);
                  setSelectedTopic("custom");
                }}
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                disabled={!customTopicInput.trim()}
                onClick={() => handleSelectTopic("custom")}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                Use Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Test Setup & Launch */}
      {currentStep === 5 && activeSubject && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Topics</span>
                </button>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Step 5: Configure & Launch {activeExam.shortName} Test
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confirm your test settings before beginning the AI-generated exam session.
              </p>
            </div>
          </div>

          {/* Test Summary Card */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-3 dark:border-emerald-900/40">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Exam Configuration Summary
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                {activeExam.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Subject</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {activeSubject.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Benchmark Year</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {resolvedYearString}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block font-medium">Topic Focus</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm truncate block">
                  {resolvedTopicString}
                </span>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Number of Questions */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Number of Questions</span>
                <span className="text-emerald-600 font-extrabold">{questionCount} Questions</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 40].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => {
                      sound.playClick();
                      setQuestionCount(cnt);
                      if (cnt === 10) setTimeLimitMinutes(12);
                      if (cnt === 20) setTimeLimitMinutes(25);
                      if (cnt === 40) setTimeLimitMinutes(activeExam.recommendedMinutes);
                    }}
                    className={`rounded-xl border py-2 text-xs font-bold transition-colors ${
                      questionCount === cnt
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                {questionCount >= 40 ? "Full standard exam CBT simulator" : "Quick focused drill"}
              </p>
            </div>

            {/* Time Limit */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Countdown Timer</span>
                <span className="text-emerald-600 font-extrabold">
                  {timeLimitMinutes > 0 ? `${timeLimitMinutes} Mins` : "Untimed"}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      sound.playClick();
                      setTimeLimitMinutes(mins);
                    }}
                    className={`rounded-xl border py-2 text-xs font-bold transition-colors ${
                      timeLimitMinutes === mins
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Practice speed pacing under exam pressure
              </p>
            </div>

            {/* Difficulty Level */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Rigor Level</span>
                <span className="text-emerald-600 font-extrabold">{difficulty}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Easy", "Medium", "Hard"] as DifficultyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      sound.playClick();
                      setDifficulty(lvl);
                    }}
                    className={`rounded-xl border py-2 text-xs font-bold transition-colors ${
                      difficulty === lvl
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Calibrated to authentic examination depth
              </p>
            </div>
          </div>

          {/* Payment Requirement Alert if Day 2 */}
          {accessStatus?.isPaymentRequired && (
            <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200 text-xs flex items-start gap-3 shadow-xs">
              <CreditCard className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-sm block text-amber-900 dark:text-amber-100">
                  Day 1 Free Trial Ended — ₦500 Payment Required
                </span>
                <p className="mt-1 text-amber-800 dark:text-amber-300 leading-relaxed">
                  To continue taking official {activeExam.shortName} CBT tests and accessing step-by-step AI answer explanations, please transfer <strong>₦500</strong> to:
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl bg-white/90 p-2.5 dark:bg-slate-900/90 border border-amber-200 dark:border-amber-800 font-mono text-xs">
                  <span>Bank: <strong className="text-emerald-700 dark:text-emerald-400">OPAY</strong></span>
                  <span>•</span>
                  <span>Account: <strong className="text-emerald-700 dark:text-emerald-400">{PAYMENT_DETAILS.accountNumber}</strong></span>
                  <span>•</span>
                  <span>Name: <strong>{PAYMENT_DETAILS.accountName}</strong></span>
                  <span>•</span>
                  <span>Amount: <strong className="text-emerald-700 dark:text-emerald-400">₦500</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Academic Integrity Notice as instructed */}
          <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200 text-xs flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">AI Practice Questions Notice</span>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300/90 leading-relaxed">
                These questions are dynamically formulated by AI aligned with official {activeExam.shortName} syllabus standards and benchmarked against {resolvedYearString} curriculum requirements. They provide authentic practice and active recall without claiming to be leaked official examination papers.
              </p>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-2 flex justify-end">
            {accessStatus?.isPaymentRequired ? (
              <button
                onClick={() => {
                  sound.playClick();
                  if (onOpenPaymentModal) onOpenPaymentModal();
                }}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:from-amber-700 hover:to-orange-700 transition-all active:scale-[0.98]"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pay ₦500 to Start Test (Day 2 Access)</span>
              </button>
            ) : (
              <button
                onClick={handleLaunchTest}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Start {activeExam.shortName} Test ({questionCount} Questions)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

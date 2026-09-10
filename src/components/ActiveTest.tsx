import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Flag,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  CheckCircle2,
  Grid,
  X,
  AlertTriangle,
} from "lucide-react";
import { Question, TestConfig } from "../types";
import { sound } from "../utils/audio";
import { toggleSaveQuestion, isQuestionSaved } from "../utils/storage";

interface ActiveTestProps {
  config: TestConfig;
  questions: Question[];
  onSubmit: (userAnswers: Record<string, string>, flags: Record<string, boolean>, timeSpentSeconds: number) => void;
  onExit: () => void;
}

export function ActiveTest({ config, questions, onSubmit, onExit }: ActiveTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer logic
  const totalAllowedSeconds = config.timeLimitSeconds;
  const [secondsRemaining, setSecondsRemaining] = useState(totalAllowedSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Initialize saved status
  useEffect(() => {
    const status: Record<string, boolean> = {};
    questions.forEach((q) => {
      status[q.id] = isQuestionSaved(q.id);
    });
    setSavedStatus(status);
  }, [questions]);

  // Reset hint when switching questions
  useEffect(() => {
    setShowHint(false);
  }, [currentIndex]);

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (totalAllowedSeconds > 0) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            sound.playFanfare();
            onSubmit(userAnswers, flags, totalAllowedSeconds);
            return 0;
          }
          if (prev <= 10) {
            sound.playTick();
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [totalAllowedSeconds, onSubmit, userAnswers, flags]);

  const handleSelectOption = useCallback(
    (option: string) => {
      sound.playSelect();
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: option,
      }));
    },
    [currentQuestion?.id]
  );

  const handleToggleFlag = () => {
    sound.playClick();
    setFlags((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleToggleSave = () => {
    sound.playClick();
    const isNowSaved = toggleSaveQuestion({
      id: currentQuestion.id,
      question: currentQuestion,
      savedAt: new Date().toISOString(),
    });
    setSavedStatus((prev) => ({
      ...prev,
      [currentQuestion.id]: isNowSaved,
    }));
  };

  // Keyboard shortcut listener for numbers 1-4, N for next, P for prev
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a text input (for short answers)
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (currentQuestion.type === "multiple_choice" && currentQuestion.options) {
        if (["1", "2", "3", "4"].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (currentQuestion.options[idx]) {
            handleSelectOption(currentQuestion.options[idx]);
          }
        }
      }

      if (e.key === "ArrowRight" && currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentQuestion, handleSelectOption, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ""
  ).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Test Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:px-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to exit? Your current test progress will be lost.")) {
                onExit();
              }
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            title="Exit Test"
          >
            <X className="h-5 w-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                {config.subject}
              </h1>
              {config.examBoard && (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  🇳🇬 {config.examBoard} {config.examYear ? `• ${config.examYear}` : ""}
                </span>
              )}
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {config.difficulty}
              </span>
              {config.isExamPrep && (
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  AI Practice Questions
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Topic: {config.topic}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Question Grid Overview Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowGridModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline">
              {answeredCount}/{questions.length} Answered
            </span>
          </button>

          {/* Timer */}
          {totalAllowedSeconds > 0 ? (
            <div
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold font-mono tracking-wide border ${
                secondsRemaining < 60
                  ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-400"
                  : "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          )}

          {/* Quick Submit Button */}
          <button
            id="submit-test-btn"
            onClick={() => {
              sound.playClick();
              setShowSubmitConfirm(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{progressPercent}% completed</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        {/* Question Header meta */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {currentIndex + 1}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {currentQuestion.topic || config.topic}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Flag for Review */}
            <button
              onClick={handleToggleFlag}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                flags[currentQuestion.id]
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
              }`}
              title="Flag this question to review before submitting"
            >
              <Flag className={`h-3.5 w-3.5 ${flags[currentQuestion.id] ? "fill-amber-600 text-amber-600" : ""}`} />
              <span className="hidden sm:inline">
                {flags[currentQuestion.id] ? "Flagged" : "Flag"}
              </span>
            </button>

            {/* Save / Bookmark Question */}
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                savedStatus[currentQuestion.id]
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
              }`}
              title="Bookmark question to practice later"
            >
              <Bookmark className={`h-3.5 w-3.5 ${savedStatus[currentQuestion.id] ? "fill-blue-600 text-blue-600" : ""}`} />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold leading-relaxed text-slate-900 dark:text-white">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options / Answer Input */}
        <div className="space-y-3 pt-2">
          {currentQuestion.type === "multiple_choice" && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const letters = ["A", "B", "C", "D", "E"];
                const letter = letters[idx] || `${idx + 1}`;
                const isSelected = userAnswers[currentQuestion.id] === option;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs ring-2 ring-indigo-600/30 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-white"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base font-medium">
                        {option}
                      </span>
                    </div>

                    <div className="ml-2 shrink-0 text-slate-300 dark:text-slate-700 hidden sm:block text-[11px] font-mono">
                      [Key {idx + 1}]
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "true_false" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["True", "False"].map((opt) => {
                const isSelected = userAnswers[currentQuestion.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`flex items-center justify-center gap-3 rounded-2xl border py-5 text-center transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-950 shadow-xs ring-2 ring-indigo-600/30 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-white"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <span className="text-lg font-bold">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "short_answer" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Type your answer here:
              </label>
              <textarea
                rows={3}
                value={userAnswers[currentQuestion.id] || ""}
                onChange={(e) => {
                  setUserAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: e.target.value,
                  }));
                }}
                placeholder="Write your explanation or key answer..."
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Hint Accordion */}
        <div className="pt-2">
          {showHint ? (
            <div className="rounded-2xl bg-amber-50/80 p-4 border border-amber-200/80 text-xs text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-200">
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-amber-600" />
                  AI Study Hint:
                </span>
                <button
                  onClick={() => setShowHint(false)}
                  className="text-[11px] underline opacity-80 hover:opacity-100"
                >
                  Hide
                </button>
              </div>
              <p className="leading-relaxed">
                {currentQuestion.hint || "Review the key relationships in this formula or concept."}
              </p>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Need a hint?</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Buttons: Previous, Next / Submit */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            if (currentIndex > 0) setCurrentIndex((i) => i - 1);
          }}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {isLastQuestion ? (
          <button
            onClick={() => {
              sound.playClick();
              setShowSubmitConfirm(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Finish & Submit Test</span>
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
            }}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 transition-colors"
          >
            <span>Next Question</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Question Grid Modal */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Test Question Navigator
              </h3>
              <button
                onClick={() => setShowGridModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-indigo-600" /> Answered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md border border-slate-300 bg-white dark:bg-slate-800" /> Unanswered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-amber-400" /> Flagged
              </span>
            </div>

            <div className="mt-5 grid grid-cols-5 sm:grid-cols-8 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isFlagged = !!flags[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={`${q.id}-${idx}`}
                    onClick={() => {
                      sound.playClick();
                      setCurrentIndex(idx);
                      setShowGridModal(false);
                    }}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all border ${
                      isCurrent
                        ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900"
                        : ""
                    } ${
                      isAnswered
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGridModal(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                Close Navigator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Test for Marking?
              </h3>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-800/60">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Questions Answered:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {answeredCount} of {questions.length}
                </span>
              </div>
              {questions.length - answeredCount > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Unanswered Questions:
                  </span>
                  <span>{questions.length - answeredCount}</span>
                </div>
              )}
              {Object.values(flags).filter(Boolean).length > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>Flagged for Review:</span>
                  <span className="font-bold">
                    {Object.values(flags).filter(Boolean).length}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Keep Testing
              </button>
              <button
                onClick={() => {
                  sound.playFanfare();
                  setShowSubmitConfirm(false);
                  onSubmit(userAnswers, flags, elapsedSeconds);
                }}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-indigo-500"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  FilePlus,
  ArrowLeft,
  Filter,
  Sparkles,
  HelpCircle,
  Flag,
} from "lucide-react";
import { TestResult, Question, StudyNote } from "../types";
import { sound } from "../utils/audio";
import { toggleSaveQuestion, isQuestionSaved, saveStudyNote } from "../utils/storage";

interface AnswerReviewProps {
  result: TestResult;
  onBackToResults: () => void;
  onGoToDashboard: () => void;
}

export function AnswerReview({ result, onBackToResults, onGoToDashboard }: AnswerReviewProps) {
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect" | "flagged">("all");
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    result.questions.forEach((q) => {
      map[q.id] = isQuestionSaved(q.id);
    });
    return map;
  });
  const [savedNotesToast, setSavedNotesToast] = useState<string | null>(null);

  const filteredQuestions = result.questions.filter((q) => {
    const isCorrect =
      (result.userAnswers[q.id] || "").trim().toLowerCase() ===
      (q.correctAnswer || "").trim().toLowerCase();
    const isFlagged = !!result.flags[q.id];

    if (filter === "correct") return isCorrect;
    if (filter === "incorrect") return !isCorrect;
    if (filter === "flagged") return isFlagged;
    return true;
  });

  const handleToggleSave = (q: Question) => {
    sound.playClick();
    const isNowSaved = toggleSaveQuestion({
      id: q.id,
      question: q,
      savedAt: new Date().toISOString(),
    });
    setSavedStatus((prev) => ({ ...prev, [q.id]: isNowSaved }));
  };

  const handleQuickSaveNote = (q: Question, idx: number) => {
    sound.playSelect();
    const note: StudyNote = {
      id: `note_${Date.now()}`,
      subject: result.subject,
      topic: q.topic || result.topic,
      title: `${result.subject} Revision: ${q.topic || "Core Question"}`,
      overview: q.question,
      keyConcepts: [
        {
          title: "Correct Principle",
          content: `Correct Answer: ${q.correctAnswer}. ${q.explanation}`,
          formulaOrFact: q.hint || undefined,
        },
      ],
      commonMistakes: [
        "Pay special attention to phrasing and units in this question type.",
      ],
      summary: `Reviewed during test on ${new Date().toLocaleDateString()}.`,
      createdAt: new Date().toISOString(),
      isStarred: true,
    };
    saveStudyNote(note);
    setSavedNotesToast(`Saved Question #${idx + 1} to your Study Notes!`);
    setTimeout(() => setSavedNotesToast(null), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Toast alert */}
      {savedNotesToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>{savedNotesToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:px-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToResults();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Score</span>
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Reviewing {result.subject} ({result.score}/{result.total})
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl dark:bg-slate-800 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
              filter === "all"
                ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            All ({result.questions.length})
          </button>
          <button
            onClick={() => setFilter("correct")}
            className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
              filter === "correct"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-slate-500 hover:text-emerald-600 dark:text-slate-400"
            }`}
          >
            Correct ({result.score})
          </button>
          <button
            onClick={() => setFilter("incorrect")}
            className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
              filter === "incorrect"
                ? "bg-rose-600 text-white shadow-2xs"
                : "text-slate-500 hover:text-rose-600 dark:text-slate-400"
            }`}
          >
            Incorrect ({result.total - result.score})
          </button>
          <button
            onClick={() => setFilter("flagged")}
            className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
              filter === "flagged"
                ? "bg-amber-600 text-white shadow-2xs"
                : "text-slate-500 hover:text-amber-600 dark:text-slate-400"
            }`}
          >
            Flagged ({Object.values(result.flags).filter(Boolean).length})
          </button>
        </div>
      </div>

      {/* List of Questions with Answers and Detailed Explanations */}
      <div className="space-y-5">
        {filteredQuestions.map((q, idx) => {
          const userAnswer = result.userAnswers[q.id];
          const isCorrect =
            (userAnswer || "").trim().toLowerCase() ===
            (q.correctAnswer || "").trim().toLowerCase();
          const isFlagged = !!result.flags[q.id];
          const isSaved = savedStatus[q.id];

          return (
            <div
              key={`${q.id}-${idx}`}
              className={`rounded-3xl border bg-white p-6 sm:p-7 shadow-xs dark:bg-slate-900 transition-all ${
                isCorrect
                  ? "border-emerald-200/80 dark:border-emerald-900/50"
                  : "border-rose-200/80 dark:border-rose-900/50"
              }`}
            >
              {/* Question Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold text-white ${
                      isCorrect ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <XCircle className="h-4 w-4" /> Incorrect
                      </span>
                    )}
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {q.topic || result.topic}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isFlagged && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                      <Flag className="h-3 w-3 fill-amber-600" /> Flagged
                    </span>
                  )}

                  {/* Bookmark Question */}
                  <button
                    onClick={() => handleToggleSave(q)}
                    className={`rounded-lg p-1.5 transition-colors ${
                      isSaved
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-950/40"
                        : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    title="Bookmark for future practice"
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-blue-600" : ""}`} />
                  </button>

                  {/* Add to Study Notes */}
                  <button
                    onClick={() => handleQuickSaveNote(q, idx)}
                    className="flex items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                    title="Add this question & explanation to Study Notes"
                  >
                    <FilePlus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Save to Notes</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                {q.question}
              </h3>

              {/* Multiple Choice Options Comparison */}
              {q.type === "multiple_choice" && q.options && (
                <div className="mt-4 grid grid-cols-1 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = (userAnswer || "").trim() === opt.trim();
                    const isTheCorrectAnswer = (q.correctAnswer || "").trim() === opt.trim();

                    let borderStyle = "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50";
                    let badge = null;

                    if (isTheCorrectAnswer) {
                      borderStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 dark:bg-emerald-950/40 dark:text-white ring-1 ring-emerald-500";
                      badge = (
                        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
                          Correct Answer
                        </span>
                      );
                    } else if (isUserChoice && !isCorrect) {
                      borderStyle = "border-rose-500 bg-rose-50/80 text-rose-950 dark:bg-rose-950/40 dark:text-white ring-1 ring-rose-500";
                      badge = (
                        <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">
                          Your Choice
                        </span>
                      );
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center justify-between rounded-xl border p-3 text-xs sm:text-sm font-medium ${borderStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold opacity-70">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        {badge}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* True/False or Short Answer Comparison */}
              {q.type !== "multiple_choice" && (
                <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs sm:text-sm dark:bg-slate-800/50">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 w-28 shrink-0">
                      Your Answer:
                    </span>
                    <span
                      className={`font-bold ${
                        isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {userAnswer || "(Unanswered)"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 w-28 shrink-0">
                      Correct Answer:
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {q.correctAnswer}
                    </span>
                  </div>
                </div>
              )}

              {/* Deep Step-by-Step AI Explanation */}
              <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Explanation & Concept Guide</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {q.explanation}
                </p>
                {q.hint && (
                  <div className="mt-2.5 pt-2 border-t border-indigo-100/80 dark:border-indigo-900/50 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Key takeaway: {q.hint}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <p className="text-slate-500">No questions matched the selected filter.</p>
          </div>
        )}
      </div>

      {/* Bottom return controls */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onBackToResults();
          }}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Back to Score Card
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onGoToDashboard();
          }}
          className="rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-indigo-500"
        >
          Finish Review & Go to Dashboard
        </button>
      </div>
    </div>
  );
}

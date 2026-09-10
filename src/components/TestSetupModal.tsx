import { useState } from "react";
import {
  Sparkles,
  X,
  Clock,
  HelpCircle,
  BarChart,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Subject, TestConfig, DifficultyLevel, QuestionTypeOption } from "../types";
import { sound } from "../utils/audio";

interface TestSetupModalProps {
  subject: Subject;
  initialTopic?: string;
  weakAreas?: string[];
  onClose: () => void;
  onStartTest: (config: TestConfig) => void;
  isLoading?: boolean;
  isOpen?: boolean;
}

export function TestSetupModal({
  subject,
  initialTopic,
  weakAreas,
  onClose,
  onStartTest,
  isLoading = false,
}: TestSetupModalProps) {
  const [topic, setTopic] = useState(
    initialTopic || (subject.popularTopics.length > 0 ? subject.popularTopics[0] : "General")
  );
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [isCustomTopic, setIsCustomTopic] = useState(false);

  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Medium");
  const [questionType, setQuestionType] = useState<QuestionTypeOption>("Multiple choice");
  const [timeLimitOption, setTimeLimitOption] = useState<number>(60); // seconds per question (60 = 1 min/q)

  const handleStart = () => {
    sound.playSelect();
    const finalTopic = isCustomTopic && customTopicInput.trim() ? customTopicInput.trim() : topic;
    const totalTime = timeLimitOption === 0 ? 0 : timeLimitOption * questionCount;

    onStartTest({
      subject: subject.name,
      topic: finalTopic,
      count: questionCount,
      difficulty,
      questionType,
      timeLimitSeconds: totalTime,
      weakAreas,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          disabled={isLoading}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Configure Your Test
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Subject: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{subject.name}</span>
            </p>
          </div>
        </div>

        {/* Weak Areas Banner if applicable */}
        {weakAreas && weakAreas.length > 0 && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3.5 border border-amber-200/80 text-xs text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Targeting Weak Areas:</span> Questions will focus on concepts you recently found challenging ({weakAreas.join(", ")}).
            </div>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {/* 1. Topic Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
                Select Topic
              </label>
              <button
                type="button"
                onClick={() => setIsCustomTopic(!isCustomTopic)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isCustomTopic ? "Choose from standard topics" : "+ Enter custom topic"}
              </button>
            </div>

            {isCustomTopic ? (
              <div>
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="e.g. Mendelian Genetics, Quadratic Formula, French Revolution..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {subject.popularTopics.map((top) => {
                  const isSelected = topic === top;
                  return (
                    <button
                      key={top}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setTopic(top);
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all text-left ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {top}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Number of Questions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 50].map((count) => {
                const isSelected = questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setQuestionCount(count);
                    }}
                    className={`rounded-xl py-2.5 text-center text-sm font-semibold transition-all border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Difficulty Level */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
              <BarChart className="h-3.5 w-3.5 text-indigo-500" />
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Easy", "Medium", "Hard"] as DifficultyLevel[]).map((lvl) => {
                const isSelected = difficulty === lvl;
                const colors: Record<DifficultyLevel, string> = {
                  Easy: "hover:border-emerald-300",
                  Medium: "hover:border-amber-300",
                  Hard: "hover:border-rose-300",
                };
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setDifficulty(lvl);
                    }}
                    className={`rounded-xl py-2.5 text-center text-xs font-bold transition-all border ${colors[lvl]} ${
                      isSelected
                        ? lvl === "Easy"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : lvl === "Medium"
                          ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                          : "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Question Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
              Question Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  "Multiple choice",
                  "True/False",
                  "Short answer",
                  "Mixed",
                ] as QuestionTypeOption[]
              ).map((qType) => {
                const isSelected = questionType === qType;
                return (
                  <button
                    key={qType}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setQuestionType(qType);
                    }}
                    className={`rounded-xl py-2 px-2 text-center text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {qType}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Time Limit */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              Timer Pace
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "No Timer", seconds: 0 },
                { label: "30s / q", seconds: 30 },
                { label: "1 min / q", seconds: 60 },
                { label: "2 min / q", seconds: 120 },
              ].map((opt) => {
                const isSelected = timeLimitOption === opt.seconds;
                return (
                  <button
                    key={opt.seconds}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimeLimitOption(opt.seconds);
                    }}
                    className={`rounded-xl py-2 text-center text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading Overlay or Action Button */}
        {isLoading ? (
          <div className="mt-8 rounded-2xl bg-indigo-50/80 p-6 text-center dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              Google Gemini is Generating Your Test...
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Crafting {questionCount} {difficulty} questions for {subject.name}: {topic}.
              Formulating step-by-step explanations and hints.
            </p>
          </div>
        ) : (
          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              id="confirm-start-test-btn"
              onClick={handleStart}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-blue-500 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate & Begin Test</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

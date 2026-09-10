import { useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  Trash2,
  Download,
  RotateCcw,
  BookOpen,
  TrendingUp,
  Award,
  Search,
  ChevronRight,
} from "lucide-react";
import { TestResult, Subject } from "../types";
import { sound } from "../utils/audio";
import { deleteTestResult, exportUserData } from "../utils/storage";

interface TestHistoryProps {
  history: TestResult[];
  subjects: Subject[];
  onHistoryUpdated: () => void;
  onViewTestDetails: (result: TestResult) => void;
  onRetakeTest: (result: TestResult) => void;
}

export function TestHistory({
  history,
  subjects,
  onHistoryUpdated,
  onViewTestDetails,
  onRetakeTest,
}: TestHistoryProps) {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter((item) => {
    const matchesSubject = selectedSubject === "all" || item.subject === selectedSubject;
    const matchesSearch =
      !searchQuery ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleDelete = (id: string) => {
    sound.playClick();
    if (window.confirm("Remove this test record from your history?")) {
      deleteTestResult(id);
      onHistoryUpdated();
    }
  };

  const handleExportData = () => {
    sound.playClick();
    const data = exportUserData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TestYourself_Backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Performance trends metrics
  const totalTests = history.length;
  const avgScore =
    totalTests > 0
      ? Math.round(history.reduce((acc, h) => acc + h.percentage, 0) / totalTests)
      : 0;
  const totalQuestions = history.reduce((acc, h) => acc + h.total, 0);

  // Subject performance breakdown
  const subjectMap: Record<string, { totalPct: number; count: number }> = {};
  history.forEach((h) => {
    if (!subjectMap[h.subject]) {
      subjectMap[h.subject] = { totalPct: 0, count: 0 };
    }
    subjectMap[h.subject].totalPct += h.percentage;
    subjectMap[h.subject].count += 1;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Test History & Performance
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your historical scores, examine past mistakes, and view your score trajectory.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export History Data</span>
        </button>
      </div>

      {/* Analytics Trends Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Tests Completed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalTests}
          </p>
          <span className="text-xs text-slate-400">{totalQuestions} total questions answered</span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Cumulative Average Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {avgScore}%
          </p>
          <span className="text-xs text-emerald-600 font-semibold">
            {avgScore >= 75 ? "Strong Mastery Level" : "Solid Progression"}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Best Performing Subject
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          {Object.keys(subjectMap).length > 0 ? (
            (() => {
              const best = Object.entries(subjectMap).sort(
                (a, b) => b[1].totalPct / b[1].count - a[1].totalPct / a[1].count
              )[0];
              const bestAvg = Math.round(best[1].totalPct / best[1].count);
              return (
                <div>
                  <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white truncate">
                    {best[0]}
                  </p>
                  <span className="text-xs text-amber-600 font-bold">
                    {bestAvg}% average score
                  </span>
                </div>
              );
            })()
          ) : (
            <p className="mt-2 text-sm text-slate-400">Take tests to unlock</p>
          )}
        </div>
      </div>

      {/* Subject Performance Trajectory Bars */}
      {Object.keys(subjectMap).length > 0 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Subject Accuracy Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(subjectMap).map(([subName, data]) => {
              const pct = Math.round(data.totalPct / data.count);
              return (
                <div key={subName} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{subName}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {pct}% ({data.count} {data.count === 1 ? "test" : "tests"})
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 80
                          ? "bg-emerald-500"
                          : pct >= 60
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSubject === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            All Subjects
          </button>
          {subjects.map((sub) => {
            const hasHistory = history.some((h) => h.subject === sub.name);
            if (!hasHistory) return null;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.name)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubject === sub.name
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test topics..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.map((test, idx) => {
          const isHigh = test.percentage >= 80;
          const isMedium = test.percentage >= 60;
          const formattedDate = new Date(test.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={`${test.id}-${idx}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-sm ${
                    isHigh
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : isMedium
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}
                >
                  {test.percentage}%
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {test.subject}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {test.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Topic: <span className="font-semibold text-slate-700 dark:text-slate-300">{test.topic}</span>
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      {test.score}/{test.total} Correct
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.round(test.timeSpentSeconds)}s used
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => {
                    sound.playClick();
                    onRetakeTest(test);
                  }}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Retake this test"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retake</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSelect();
                    onViewTestDetails(test);
                  }}
                  className="flex items-center gap-1 rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Review</span>
                </button>

                <button
                  onClick={() => handleDelete(test.id)}
                  className="rounded-xl p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Delete record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHistory.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <Clock className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Test Records Found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Completed tests, scores, and AI diagnostic feedback will be automatically logged here.
          </p>
        </div>
      )}
    </div>
  );
}

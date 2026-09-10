import { useState, FormEvent } from "react";
import {
  BookOpen,
  PlusCircle,
  Search,
  Sparkles,
  Star,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { StudyNote, Subject } from "../types";
import { sound } from "../utils/audio";
import { saveStudyNote, deleteStudyNote } from "../utils/storage";

interface StudyNotesProps {
  notes: StudyNote[];
  subjects: Subject[];
  onNotesUpdated: () => void;
  onGenerateTestFromTopic: (subject: string, topic: string) => void;
}

export function StudyNotes({
  notes,
  subjects,
  onNotesUpdated,
  onGenerateTestFromTopic,
}: StudyNotesProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyStarred, setOnlyStarred] = useState(false);

  // AI Notes Generator State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSubject, setAiSubject] = useState(subjects[0]?.name || "Mathematics");
  const [aiTopic, setAiTopic] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Manual Note Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualSubject, setManualSubject] = useState(subjects[0]?.name || "Mathematics");
  const [manualTopic, setManualTopic] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [manualFormula, setManualFormula] = useState("");

  const filteredNotes = notes.filter((n) => {
    const matchesSub = selectedSubject === "all" || n.subject === selectedSubject;
    const matchesStar = !onlyStarred || n.isStarred;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.topic.toLowerCase().includes(q) ||
      (n.overview || "").toLowerCase().includes(q) ||
      n.keyConcepts.some(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q) ||
          (c.formulaOrFact || "").toLowerCase().includes(q)
      );
    return matchesSub && matchesStar && matchesSearch;
  });

  const handleToggleStar = (note: StudyNote) => {
    sound.playClick();
    const updated: StudyNote = { ...note, isStarred: !note.isStarred };
    saveStudyNote(updated);
    onNotesUpdated();
  };

  const handleDelete = (id: string) => {
    sound.playClick();
    if (window.confirm("Delete this revision note?")) {
      deleteStudyNote(id);
      onNotesUpdated();
    }
  };

  const handleGenerateAiNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    sound.playSelect();
    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch("/api/generate-study-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: aiSubject,
          topic: aiTopic.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate AI study note. Please try again.");
      }

      const data = await res.json();
      const newNote: StudyNote = {
        id: `note_${Date.now()}`,
        subject: aiSubject,
        topic: aiTopic.trim(),
        title: data.title || `${aiSubject}: ${aiTopic}`,
        overview: data.overview || "",
        keyConcepts: Array.isArray(data.keyConcepts) ? data.keyConcepts : [],
        commonMistakes: Array.isArray(data.commonMistakes) ? data.commonMistakes : [],
        summary: data.summary || "",
        createdAt: new Date().toISOString(),
        isStarred: true,
      };

      saveStudyNote(newNote);
      onNotesUpdated();
      setIsAiLoading(false);
      setShowAiModal(false);
      setAiTopic("");
    } catch (err: any) {
      setAiError(err.message || "Failed to generate note.");
      setIsAiLoading(false);
    }
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    sound.playSelect();
    const newNote: StudyNote = {
      id: `note_${Date.now()}`,
      subject: manualSubject,
      topic: manualTopic.trim() || "Core Concepts",
      title: manualTitle.trim(),
      overview: manualContent.slice(0, 120),
      keyConcepts: [
        {
          title: "Important Point",
          content: manualContent.trim(),
          formulaOrFact: manualFormula.trim() || undefined,
        },
      ],
      createdAt: new Date().toISOString(),
      isStarred: false,
    };

    saveStudyNote(newNote);
    onNotesUpdated();
    setShowManualModal(false);
    setManualTitle("");
    setManualTopic("");
    setManualContent("");
    setManualFormula("");
  };

  const exportNotesAsText = () => {
    sound.playClick();
    const text = notes
      .map(
        (n) => `==============================\n${n.subject.toUpperCase()} - ${n.topic}\nTitle: ${n.title}\nDate: ${new Date(n.createdAt).toLocaleDateString()}\n\nOverview:\n${n.overview || "N/A"}\n\nKey Points:\n${n.keyConcepts.map((c) => `• ${c.title}: ${c.content}${c.formulaOrFact ? ` [Formula: ${c.formulaOrFact}]` : ""}`).join("\n")}\n\nCommon Traps:\n${(n.commonMistakes || []).map((m) => `- ${m}`).join("\n")}\n`
      )
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TestYourself_StudyNotes_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Study & Revision Notebook
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Organize formulas, key principles, and AI-generated exam cheat-sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportNotesAsText}
            disabled={notes.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Notes</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowManualModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Note</span>
          </button>

          <button
            id="ai-generate-notes-btn"
            onClick={() => {
              sound.playSelect();
              setShowAiModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-indigo-500 hover:to-blue-500 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Generate Revision Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSubject === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            All Subjects ({notes.length})
          </button>
          {subjects.map((sub) => {
            const count = notes.filter((n) => n.subject === sub.name).length;
            if (count === 0) return null;
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
                {sub.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Star Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyStarred(!onlyStarred)}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors border ${
              onlyStarred
                ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${onlyStarred ? "fill-amber-500 text-amber-500" : ""}`} />
            <span>Starred</span>
          </button>

          <div className="relative w-full md:w-56">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotes.map((note, idx) => (
          <div
            key={`${note.id}-${idx}`}
            className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all"
          >
            <div>
              {/* Note Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {note.subject}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {note.topic}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
                    {note.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleStar(note)}
                    className="p-1 text-slate-300 hover:text-amber-500"
                    title={note.isStarred ? "Starred" : "Star this note"}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        note.isStarred
                          ? "fill-amber-500 text-amber-500"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 dark:text-slate-600"
                    title="Delete Note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Note Overview */}
              {note.overview && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic mb-3">
                  "{note.overview}"
                </p>
              )}

              {/* Key Concepts */}
              <div className="space-y-2.5 my-3">
                {note.keyConcepts.map((concept, cIdx) => (
                  <div
                    key={cIdx}
                    className="rounded-2xl bg-slate-50/80 p-3 text-xs dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {concept.title}
                    </div>
                    <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {concept.content}
                    </p>
                    {concept.formulaOrFact && (
                      <div className="mt-2 rounded-lg bg-indigo-50/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                        {concept.formulaOrFact}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Common Pitfalls / Traps if any */}
              {note.commonMistakes && note.commonMistakes.length > 0 && (
                <div className="mt-3 rounded-2xl bg-amber-50/50 p-3 text-xs text-amber-900 dark:bg-amber-950/20 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/30">
                  <span className="font-bold flex items-center gap-1 mb-1">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                    Common Exam Traps:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {note.commonMistakes.map((mis, mIdx) => (
                      <li key={mIdx}>{mis}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Note Footer with Test CTA */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => {
                  sound.playSelect();
                  onGenerateTestFromTopic(note.subject, note.topic);
                }}
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Test this topic</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <BookOpen className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Study Notes Found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Save explanations directly from tests, add custom notes, or let Google Gemini generate a high-yield study sheet.
          </p>
          <button
            onClick={() => setShowAiModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Study Sheet with Gemini</span>
          </button>
        </div>
      )}

      {/* AI Generate Notes Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-5 w-5" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Revision Generator
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                disabled={isAiLoading}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiNote} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Subject
                </label>
                <select
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Specific Topic or Concept
                </label>
                <input
                  type="text"
                  required
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis & Calvin Cycle, Ohm's Law, SQL Joins..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {aiError && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              {isAiLoading ? (
                <div className="py-4 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Gemini is synthesizing high-yield study notes...
                  </p>
                </div>
              ) : (
                <div className="mt-6 flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-500"
                  >
                    Generate Sheet
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Manual Add Note Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Revision Note
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <select
                    value={manualSubject}
                    onChange={(e) => setManualSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={manualTopic}
                    onChange={(e) => setManualTopic(e.target.value)}
                    placeholder="e.g. Thermodynamics"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. First Law of Thermodynamics & Heat Engines"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Key Concepts & Explanations
                </label>
                <textarea
                  rows={4}
                  required
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Write the core takeaways, definitions, and rules..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Formula or Key Mnemonic (Optional)
                </label>
                <input
                  type="text"
                  value={manualFormula}
                  onChange={(e) => setManualFormula(e.target.value)}
                  placeholder="e.g. ΔU = Q - W"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-500"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

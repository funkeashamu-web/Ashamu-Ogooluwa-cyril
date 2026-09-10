import { useState, FormEvent } from "react";
import {
  Calculator,
  BookOpen,
  Dna,
  FlaskConical,
  Atom,
  Code,
  Landmark,
  Globe,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Search,
} from "lucide-react";
import { Subject } from "../types";
import { sound } from "../utils/audio";

interface SubjectSelectorProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject, initialTopic?: string) => void;
  onAddCustomSubject: (subjectOrName: any, desc?: string) => void;
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

export function SubjectSelector({
  subjects,
  onSelectSubject,
  onAddCustomSubject,
}: SubjectSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.popularTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onAddCustomSubject(customName.trim(), customDesc.trim());
    setCustomName("");
    setCustomDesc("");
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Choose Your Subject
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select an academic subject or create your own custom domain to test.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="subject-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects or topics..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <button
            id="add-custom-subject-btn"
            onClick={() => {
              sound.playClick();
              setShowCustomModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Custom Subject</span>
            <span className="sm:hidden">Custom</span>
          </button>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((subject) => {
          const Icon = ICON_MAP[subject.icon] || BookOpen;
          return (
            <div
              key={subject.id}
              id={`subject-card-${subject.id}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/70 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${subject.color} text-white shadow-xs`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${subject.badgeColor}`}
                  >
                    {subject.popularTopics.length} Topics
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {subject.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {subject.description}
                </p>

                {/* Popular Topics Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(subject.popularTopics || []).slice(0, 3).map((topic, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playSelect();
                        onSelectSubject(subject, topic);
                      }}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                  {(subject.popularTopics || []).length > 3 && (
                    <span className="rounded-md px-1.5 py-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      +{(subject.popularTopics || []).length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => {
                    sound.playSelect();
                    onSelectSubject(subject);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2 px-4 text-xs font-semibold text-white shadow-xs hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 transition-colors"
                >
                  <span>Configure Test</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">
            No subjects matched "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setCustomName(searchQuery);
              setShowCustomModal(true);
            }}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create custom subject for "{searchQuery}"</span>
          </button>
        </div>
      )}

      {/* Custom Subject Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Custom Subject
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Add any field of study, topic, or specialized exam curriculum.
            </p>

            <form onSubmit={handleCustomSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. World History, Macroeconomics, French, Biochemistry"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Brief Description or Key Areas
                </label>
                <input
                  type="text"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="e.g. Key revolutions, treaties, timeline and historical causes"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                >
                  Add & Start Testing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

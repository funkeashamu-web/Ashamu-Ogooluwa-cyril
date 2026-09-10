import {
  Trophy,
  Award,
  Flame,
  Zap,
  GraduationCap,
  Target,
  Compass,
  FileText,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Achievement } from "../types";

interface AchievementsModalProps {
  achievements: Achievement[];
}

const ICON_MAP: Record<string, any> = {
  Trophy,
  Award,
  Flame,
  Zap,
  GraduationCap,
  Target,
  Compass,
  FileText,
};

export function AchievementsModal({ achievements }: AchievementsModalProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Badges & Milestones
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Earn student achievements as you practice, improve scores, and build revision streaks.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
          <Trophy className="h-4 w-4 text-indigo-600" />
          <span>
            {unlockedCount} of {achievements.length} Unlocked
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => {
          const Icon = ICON_MAP[ach.icon] || Award;
          return (
            <div
              key={ach.id}
              className={`flex flex-col justify-between rounded-3xl border p-5 transition-all ${
                ach.unlocked
                  ? "border-indigo-200/80 bg-white shadow-xs dark:border-indigo-900/50 dark:bg-slate-900"
                  : "border-slate-200/50 bg-slate-50/60 opacity-70 dark:border-slate-800 dark:bg-slate-900/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      ach.unlocked
                        ? "bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-xs"
                        : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {ach.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {ach.unlockedAt && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Earned {new Date(ach.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

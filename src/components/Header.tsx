import {
  Flame,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  BookOpen,
  Clock,
  LayoutDashboard,
  GraduationCap,
  Brain,
  FileText,
  CreditCard,
  CheckCircle2,
  Lock,
  Gamepad2,
} from "lucide-react";
import { sound } from "../utils/audio";
import { AccessStatus } from "../types";

interface HeaderProps {
  currentTab?: any;
  activeTab?: any;
  onTabChange?: (tab: any) => void;
  setActiveTab?: (tab: any) => void;
  streakDays?: number;
  streak?: number;
  theme?: "light" | "dark";
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  toggleTheme?: () => void;
  isMuted?: boolean;
  soundEnabled?: boolean;
  onToggleMute?: () => void;
  toggleSound?: () => void;
  accessStatus?: AccessStatus;
  onOpenPaymentModal?: () => void;
}

export function Header(props: HeaderProps) {
  const currentTab = props.activeTab || props.currentTab || "dashboard";
  const onTabChange = props.setActiveTab || props.onTabChange || (() => {});
  const streakDays = props.streak ?? props.streakDays ?? 1;
  const isDark = props.isDarkMode ?? (props.theme === "dark");
  const onToggleTheme = props.toggleTheme || props.onToggleTheme || (() => {});
  const isMuted = props.soundEnabled !== undefined ? !props.soundEnabled : (props.isMuted ?? false);
  const onToggleMute = props.toggleSound || props.onToggleMute || (() => {});
  const accessStatus = props.accessStatus;
  const onOpenPaymentModal = props.onOpenPaymentModal;
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "exam-prep", label: "Exam Prep", icon: GraduationCap },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "ai-coach", label: "AI Coach", icon: Brain },
    { id: "test", label: "Custom Test", icon: BookOpen },
    { id: "notes", label: "Study Notes", icon: FileText },
    { id: "history", label: "History", icon: Clock },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          id="app-brand"
          onClick={() => {
            sound.playClick();
            onTabChange("dashboard");
          }}
          className="flex cursor-pointer items-center gap-3 select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-sm shadow-emerald-500/30">
            <span className="text-base font-black tracking-tight">QM</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                QUIZMASTER AI
              </span>
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                CBT & AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              JAMB • WAEC • NECO • BECE
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  sound.playClick();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Streak, Sound, Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Access / Subscription Status Badge */}
          {accessStatus && (
            <button
              id="access-status-badge-btn"
              type="button"
              onClick={() => {
                sound.playClick();
                if (onOpenPaymentModal) onOpenPaymentModal();
              }}
              title="Click to view exam access and transfer details"
              className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-bold transition-all ${
                accessStatus.hasPaid
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  : accessStatus.isBlocked
                  ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700 animate-pulse"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
              }`}
            >
              {accessStatus.hasPaid ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">₦500 Unlocked</span>
                  <span className="sm:hidden">Unlocked</span>
                </>
              ) : accessStatus.isBlocked ? (
                <>
                  <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>App Locked • Pay ₦500</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="hidden sm:inline">Day 1 Free Trial</span>
                  <span className="sm:hidden">Day 1 Free</span>
                </>
              )}
            </button>
          )}

          {/* Daily Streak Pill */}
          <div
            id="streak-indicator"
            title={`${streakDays} Day Daily Test Streak!`}
            className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
          >
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleMute}
            title={isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleTheme();
            }}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 justify-around bg-slate-50/80 dark:bg-slate-900/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                onTabChange(item.id);
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

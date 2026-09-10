import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  Zap,
  Shuffle,
  HelpCircle,
  Timer,
  Trophy,
  Star,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { EducationalGameId, GameStats, AccessStatus } from "../types";
import { getGameStats } from "../utils/storage";
import { sound } from "../utils/audio";
import { SpeedMatchGame } from "./games/SpeedMatchGame";
import { SpeedMathGame } from "./games/SpeedMathGame";
import { WordScrambleGame } from "./games/WordScrambleGame";
import { FactSprintGame } from "./games/FactSprintGame";

interface EducationalGamesProps {
  accessStatus?: AccessStatus;
  onOpenPaymentModal?: () => void;
  onGoToTest?: () => void;
  onGoToExamPrep?: () => void;
}

export function EducationalGames({
  accessStatus,
  onOpenPaymentModal,
  onGoToTest,
  onGoToExamPrep,
}: EducationalGamesProps) {
  const [activeGame, setActiveGame] = useState<EducationalGameId | null>(null);
  const [stats, setStats] = useState<GameStats>(getGameStats());

  useEffect(() => {
    setStats(getGameStats());
  }, [activeGame]);

  const handleLaunchGame = (gameId: EducationalGameId) => {
    sound.playClick();
    setActiveGame(gameId);
  };

  const handleBackToHub = () => {
    setActiveGame(null);
    setStats(getGameStats());
  };

  // Render individual active game
  if (activeGame === "speed-match") {
    return <SpeedMatchGame onBack={handleBackToHub} onGameComplete={() => setStats(getGameStats())} />;
  }
  if (activeGame === "speed-math") {
    return <SpeedMathGame onBack={handleBackToHub} onGameComplete={() => setStats(getGameStats())} />;
  }
  if (activeGame === "word-scramble") {
    return <WordScrambleGame onBack={handleBackToHub} onGameComplete={() => setStats(getGameStats())} />;
  }
  if (activeGame === "fact-sprint") {
    return <FactSprintGame onBack={handleBackToHub} onGameComplete={() => setStats(getGameStats())} />;
  }

  const GAME_CARDS: Array<{
    id: EducationalGameId;
    title: string;
    badge: string;
    category: string;
    description: string;
    duration: string;
    accentColor: string;
    bgHover: string;
    icon: any;
    bestScore: number;
    benefits: string[];
  }> = [
    {
      id: "speed-match",
      title: "Speed Match",
      badge: "Memory & Recall",
      category: "Biology, Chemistry, Physics & Formulas",
      description: "Flip and match scientific laws, formulas, vocabulary, and historic events as fast as you can.",
      duration: "~1 - 2 mins",
      accentColor: "from-emerald-500 to-teal-600",
      bgHover: "hover:border-emerald-400 dark:hover:border-emerald-500",
      icon: Brain,
      bestScore: stats.bestScores["speed-match"] || 0,
      benefits: ["Formula memorization", "Concept definition pairing", "Combo streak multipliers"],
    },
    {
      id: "speed-math",
      title: "Speed Math Blitz",
      badge: "60s Mental Math",
      category: "JAMB Arithmetic & Quick Algebra",
      description: "Solve rapid mental calculations, percentages, squares, and algebraic equations in a 60-second frenzy.",
      duration: "60 seconds",
      accentColor: "from-indigo-500 to-blue-600",
      bgHover: "hover:border-indigo-400 dark:hover:border-indigo-500",
      icon: Zap,
      bestScore: stats.bestScores["speed-math"] || 0,
      benefits: ["Builds calculation speed", "Multipliers up to 2.5x", "Essential for JAMB time pressure"],
    },
    {
      id: "word-scramble",
      title: "Word Scramble",
      badge: "Vocabulary Master",
      category: "Use of English Lexis & Scientific Terms",
      description: "Unscramble essential high-frequency examination terms, figures of speech, and scientific concepts.",
      duration: "~2 - 3 mins",
      accentColor: "from-teal-500 to-cyan-600",
      bgHover: "hover:border-teal-400 dark:hover:border-teal-500",
      icon: Shuffle,
      bestScore: stats.bestScores["word-scramble"] || 0,
      benefits: ["WAEC/JAMB Lexis & Structure", "Contextual clues and hints", "Spelling accuracy"],
    },
    {
      id: "fact-sprint",
      title: "True or False Sprint",
      badge: "45s Lightning Fact Check",
      category: "High-Yield Syllabus Facts",
      description: "Fast-fire sprint testing key syllabus facts across Sciences, Mathematics, History, and Government.",
      duration: "45 seconds",
      accentColor: "from-rose-500 to-orange-600",
      bgHover: "hover:border-rose-400 dark:hover:border-rose-500",
      icon: HelpCircle,
      bestScore: stats.bestScores["fact-sprint"] || 0,
      benefits: ["Exposes common exam traps", "Instant explanations", "Rapid concept reinforcement"],
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hub Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-950 p-6 sm:p-10 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur border border-white/10">
            <Gamepad2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Interactive Learning Center</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Educational Games & Brain Drills
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Turn exam preparation into an engaging daily habit. Sharpen your mental calculation speed, lexis recall, and scientific fact retention through rapid-fire interactive drills.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleLaunchGame("speed-math")}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              <span>Quick Start: 60s Math Blitz</span>
            </button>
            <button
              onClick={() => handleLaunchGame("speed-match")}
              className="flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 backdrop-blur transition-all cursor-pointer border border-white/15 active:scale-95"
            >
              <Brain className="h-4 w-4" />
              <span>Play Speed Match</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Global Games Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Drills Played
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {stats.totalGamesPlayed}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-400">
            <Star className="h-5 w-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Stars Earned
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {stats.totalStarsEarned}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Longest Streak
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {stats.longestStreak}x
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Highest Score
            </span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {Math.max(0, ...(Object.values(stats.bestScores) as number[])).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Games Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Choose an Educational Game
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each game targets specific exam skills: speed, vocabulary, formula memory, and syllabus knowledge.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {GAME_CARDS.map((game) => {
            const IconComponent = game.icon;

            return (
              <div
                key={game.id}
                className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 shadow-xs hover:shadow-md ${game.bgHover}`}
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${game.accentColor} text-white shadow-md shadow-emerald-500/20`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {game.category}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {game.title}
                        </h3>
                      </div>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {game.duration}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="space-y-1.5 pt-1">
                    {game.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls & Score */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span>
                      High Score:{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {game.bestScore > 0 ? game.bestScore.toLocaleString() : "—"}
                      </strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleLaunchGame(game.id)}
                    className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-400 dark:hover:text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Play Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Value Explainer Banner */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              Why Practice with Educational Games?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              JAMB CBT requires answering 180 questions in only 120 minutes (~40 seconds per question). These drills build rapid calculation reflexes and instant keyword recall.
            </p>
          </div>
        </div>

        {onGoToExamPrep && (
          <button
            onClick={() => {
              sound.playClick();
              onGoToExamPrep();
            }}
            className="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 shadow-xs transition-colors cursor-pointer"
          >
            Take Full CBT Exam
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Timer,
  RotateCcw,
  Award,
  ArrowLeft,
  Flame,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../../utils/audio";
import { generateSpeedMathProblem, MathProblem } from "../../data/gameData";
import { saveGameScore } from "../../utils/storage";

interface SpeedMathGameProps {
  onBack: () => void;
  onGameComplete?: () => void;
}

export function SpeedMathGame({ onBack, onGameComplete }: SpeedMathGameProps) {
  const TOTAL_DURATION_SECONDS = 60;

  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_DURATION_SECONDS);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [score, setScore] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [lastFeedback, setLastFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Start new game
  const startGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeLeft(TOTAL_DURATION_SECONDS);
    setScore(0);
    setSolvedCount(0);
    setWrongCount(0);
    setStreak(0);
    setBestStreak(0);
    setIsGameOver(false);
    setIsNewHigh(false);
    setSelectedOption(null);
    setLastFeedback(null);
    setCurrentProblem(generateSpeedMathProblem(1));
    setIsGameStarted(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        if (prev <= 6) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // When time runs out
  useEffect(() => {
    if (timeLeft === 0 && isGameStarted && !isGameOver) {
      endGame();
    }
  }, [timeLeft, isGameStarted, isGameOver]);

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsGameOver(true);

    // Calculate stars: 3 stars if score >= 1500, 2 stars if score >= 800
    let stars = 1;
    if (score >= 1500) stars = 3;
    else if (score >= 800) stars = 2;

    const totalAttempts = solvedCount + wrongCount;
    const accuracy = totalAttempts > 0 ? Math.round((solvedCount / totalAttempts) * 100) : 0;

    const result = saveGameScore({
      gameId: "speed-math",
      score,
      stars,
      accuracy,
      date: new Date().toISOString(),
      category: "Mental Mathematics",
      streak: bestStreak,
    });

    setIsNewHigh(result.isNewHigh);

    sound.playFanfare();
    confetti({
      particleCount: score >= 1500 ? 100 : 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (onGameComplete) onGameComplete();
  };

  // Handle Option Click
  const handleAnswerSelect = (option: number) => {
    if (isGameOver || !currentProblem || selectedOption !== null) return;

    setSelectedOption(option);
    const isCorrect = option === currentProblem.answer;

    if (isCorrect) {
      sound.playCorrect();
      setLastFeedback("correct");

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      // Score computation: base 100 + streak multiplier
      const multiplier = nextStreak >= 5 ? 2.5 : nextStreak >= 3 ? 1.8 : 1.0;
      const pointsEarned = Math.round(100 * multiplier);

      setScore((s) => s + pointsEarned);
      setSolvedCount((c) => c + 1);

      // Transition to next problem quickly
      setTimeout(() => {
        setSelectedOption(null);
        setLastFeedback(null);
        const nextLevel = Math.min(5, Math.floor(solvedCount / 4) + 1);
        setCurrentProblem(generateSpeedMathProblem(nextLevel));
      }, 300);
    } else {
      sound.playWrong();
      setLastFeedback("wrong");
      setStreak(0);
      setWrongCount((w) => w + 1);

      // Show correct answer briefly then move on
      setTimeout(() => {
        setSelectedOption(null);
        setLastFeedback(null);
        const nextLevel = Math.min(5, Math.floor(solvedCount / 4) + 1);
        setCurrentProblem(generateSpeedMathProblem(nextLevel));
      }, 700);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Speed Math Blitz
              </h2>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                60s Rapid Fire
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Solve rapid arithmetic, algebra, percentages, and roots against the clock.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            startGame();
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset 60s</span>
        </button>
      </div>

      {/* Game HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Timer Bar */}
        <div
          className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-colors shadow-xs ${
            timeLeft <= 10
              ? "border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/40 animate-pulse"
              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              timeLeft <= 10
                ? "bg-rose-600 text-white"
                : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
            }`}
          >
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Time Left
            </span>
            <p
              className={`text-lg font-black ${
                timeLeft <= 10 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"
              }`}
            >
              {timeLeft}s
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Score
            </span>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {score.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Solved Count */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Solved
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {solvedCount}
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Flame className={`h-5 w-5 ${streak >= 3 ? "animate-bounce text-amber-500" : ""}`} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Multiplier
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1">
              <span>{streak}x</span>
              {streak >= 3 && (
                <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                  {streak >= 5 ? "2.5x BOOST" : "1.8x BOOST"}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Active Problem Card */}
      {!isGameOver && currentProblem && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 dark:border-slate-800 dark:bg-slate-900 shadow-sm text-center space-y-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Zap className="h-3.5 w-3.5 text-indigo-500" />
            <span>{currentProblem.category}</span>
          </div>

          <div className="py-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              {currentProblem.prompt}
            </h1>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            {currentProblem.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === currentProblem.answer;

              let btnStyle =
                "border-2 border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-400 text-slate-900 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-white";

              if (selectedOption !== null) {
                if (isCorrectAnswer) {
                  btnStyle =
                    "border-2 border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 scale-102";
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle =
                    "border-2 border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedOption !== null}
                  className={`flex h-16 sm:h-20 items-center justify-center rounded-2xl text-2xl sm:text-3xl font-black transition-all cursor-pointer select-none shadow-xs ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Quick Feedback Flash */}
          {lastFeedback && (
            <div className="flex items-center justify-center gap-2 pt-2 animate-fadeIn">
              {lastFeedback === "correct" ? (
                <span className="flex items-center gap-1.5 text-sm font-black text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Correct!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-black text-rose-600 dark:text-rose-400">
                  <XCircle className="h-4 w-4" /> Answer: {currentProblem.answer}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="rounded-3xl border-2 border-indigo-400 bg-gradient-to-b from-indigo-500/10 via-white to-indigo-500/5 p-6 sm:p-10 dark:border-indigo-600 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 shadow-xl text-center space-y-6 animate-scaleUp">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Award className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Time's Up!
              </h3>
              {isNewHigh && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                  NEW RECORD!
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Excellent calculation speed! Keep training your mental math reflexes.
            </p>
          </div>

          {/* Score Display */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 max-w-sm mx-auto dark:border-indigo-800 dark:bg-indigo-950/50">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Total Points
            </span>
            <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
              {score.toLocaleString()}
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Solved</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{solvedCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Accuracy</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                {solvedCount + wrongCount > 0
                  ? Math.round((solvedCount / (solvedCount + wrongCount)) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Max Streak</span>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">{bestStreak}x</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Speed</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                {(solvedCount / (TOTAL_DURATION_SECONDS / 60)).toFixed(1)}/min
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                startGame();
              }}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-bold text-sm shadow-md cursor-pointer transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Again (60s)</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 px-5 py-2.5 font-bold text-sm shadow-xs cursor-pointer transition-colors"
            >
              <span>Back to Games Hub</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

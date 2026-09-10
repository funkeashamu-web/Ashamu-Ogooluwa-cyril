import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  ArrowLeft,
  Flame,
  HelpCircle,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../../utils/audio";
import { TRUE_FALSE_QUESTIONS, TrueFalseQuestion } from "../../data/gameData";
import { saveGameScore } from "../../utils/storage";

interface FactSprintGameProps {
  onBack: () => void;
  onGameComplete?: () => void;
}

interface AnsweredQuestion {
  question: TrueFalseQuestion;
  userChoseTrue: boolean;
  isCorrect: boolean;
}

export function FactSprintGame({ onBack, onGameComplete }: FactSprintGameProps) {
  const SPRINT_SECONDS = 45;

  const [timeLeft, setTimeLeft] = useState<number>(SPRINT_SECONDS);
  const [questionPool, setQuestionPool] = useState<TrueFalseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [answeredList, setAnsweredList] = useState<AnsweredQuestion[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  const startSprint = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const shuffled = [...TRUE_FALSE_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestionPool(shuffled);
    setCurrentIndex(0);
    setTimeLeft(SPRINT_SECONDS);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setIsGameOver(false);
    setAnsweredList([]);
    setLastFeedback(null);
    setIsNewHigh(false);

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
    startSprint();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !isGameOver) {
      endSprint();
    }
  }, [timeLeft, isGameOver]);

  const endSprint = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsGameOver(true);

    let stars = 1;
    if (score >= 1200) stars = 3;
    else if (score >= 600) stars = 2;

    const total = answeredList.length;
    const correctCount = answeredList.filter((a) => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const result = saveGameScore({
      gameId: "fact-sprint",
      score,
      stars,
      accuracy,
      date: new Date().toISOString(),
      category: "True/False Exam Facts",
      streak: bestStreak,
    });

    setIsNewHigh(result.isNewHigh);

    sound.playFanfare();
    confetti({
      particleCount: score >= 1000 ? 100 : 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (onGameComplete) onGameComplete();
  };

  const handleChoice = (choseTrue: boolean) => {
    if (isGameOver || currentIndex >= questionPool.length) return;

    const q = questionPool[currentIndex];
    const isCorrect = choseTrue === q.isTrue;

    if (isCorrect) {
      sound.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      const multiplier = nextStreak >= 5 ? 2.2 : nextStreak >= 3 ? 1.6 : 1.0;
      const points = Math.round(100 * multiplier);
      setScore((s) => s + points);

      setLastFeedback({
        correct: true,
        explanation: q.explanation,
      });
    } else {
      sound.playWrong();
      setStreak(0);
      setLastFeedback({
        correct: false,
        explanation: q.explanation,
      });
    }

    setAnsweredList((prev) => [
      ...prev,
      {
        question: q,
        userChoseTrue: choseTrue,
        isCorrect,
      },
    ]);

    // Advance to next question immediately
    setTimeout(() => {
      const nextIdx = currentIndex + 1;
      if (nextIdx < questionPool.length) {
        setCurrentIndex(nextIdx);
      } else {
        // Recycle pool if all answered
        const reshuffled = [...TRUE_FALSE_QUESTIONS].sort(() => Math.random() - 0.5);
        setQuestionPool(reshuffled);
        setCurrentIndex(0);
      }
      setLastFeedback(null);
    }, 450);
  };

  const currentQ = questionPool[currentIndex];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
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
                True or False Sprint
              </h2>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                45s Fact Check
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rapidly verify WAEC and JAMB facts across Biology, Physics, Chemistry, Government, and Math.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            startSprint();
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset 45s</span>
        </button>
      </div>

      {/* HUD Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
            }`}
          >
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Timer
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

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Score
            </span>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {score.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Flame className={`h-5 w-5 ${streak >= 3 ? "animate-bounce text-amber-500" : ""}`} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Streak
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1">
              <span>{streak}x</span>
              {streak >= 3 && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {streak >= 5 ? "2.2x" : "1.6x"}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Answered
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {answeredList.length}
            </p>
          </div>
        </div>
      </div>

      {/* Active Question Statement */}
      {!isGameOver && currentQ && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <HelpCircle className="h-3.5 w-3.5 text-rose-500" />
            <span>Subject: {currentQ.subject}</span>
          </div>

          <div className="py-4 max-w-2xl mx-auto min-h-[110px] flex items-center justify-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-relaxed">
              "{currentQ.statement}"
            </h1>
          </div>

          {/* Feedback pill */}
          {lastFeedback && (
            <div
              className={`p-3 rounded-xl text-xs sm:text-sm font-bold animate-fadeIn max-w-xl mx-auto flex items-center justify-center gap-2 ${
                lastFeedback.correct
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
              }`}
            >
              {lastFeedback.correct ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span>{lastFeedback.explanation}</span>
            </div>
          )}

          {/* Big TRUE / FALSE Decision Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
            <button
              onClick={() => handleChoice(true)}
              className="flex h-16 sm:h-20 items-center justify-center gap-2 rounded-2xl border-2 border-emerald-500 bg-emerald-600 hover:bg-emerald-700 text-white text-xl sm:text-2xl font-black shadow-md cursor-pointer transition-all active:scale-95"
            >
              <CheckCircle2 className="h-6 w-6" />
              <span>TRUE</span>
            </button>

            <button
              onClick={() => handleChoice(false)}
              className="flex h-16 sm:h-20 items-center justify-center gap-2 rounded-2xl border-2 border-rose-500 bg-rose-600 hover:bg-rose-700 text-white text-xl sm:text-2xl font-black shadow-md cursor-pointer transition-all active:scale-95"
            >
              <XCircle className="h-6 w-6" />
              <span>FALSE</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over Summary & Review */}
      {isGameOver && (
        <div className="rounded-3xl border-2 border-rose-400 bg-gradient-to-b from-rose-500/10 via-white to-rose-500/5 p-6 sm:p-10 dark:border-rose-600 dark:from-rose-950/40 dark:via-slate-900 dark:to-rose-950/20 shadow-xl space-y-6 animate-scaleUp">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-500/30">
              <Award className="h-8 w-8" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Sprint Complete!
              </h3>
              {isNewHigh && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                  NEW HIGH SCORE!
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              You answered {answeredList.length} statements in 45 seconds!
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 max-w-sm mx-auto text-center dark:border-rose-800 dark:bg-rose-950/50">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              Total Points
            </span>
            <p className="text-4xl font-black text-rose-700 dark:text-rose-300">
              {score.toLocaleString()}
            </p>
          </div>

          {/* Review of Questions */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-500" />
              <span>Review Your Answers:</span>
            </h4>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 text-left">
              {answeredList.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs sm:text-sm ${
                    item.isCorrect
                      ? "border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-rose-200 bg-rose-50/70 text-rose-950 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {item.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold">
                        "{item.question.statement}"
                      </p>
                      <p className="text-xs opacity-90 mt-1">
                        Correct: <span className="font-extrabold">{item.question.isTrue ? "TRUE" : "FALSE"}</span> • Your answer: <span className="font-extrabold">{item.userChoseTrue ? "TRUE" : "FALSE"}</span>
                      </p>
                      <p className="text-xs opacity-80 mt-1 italic">
                        {item.question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                startSprint();
              }}
              className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 font-bold text-sm shadow-md cursor-pointer transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Sprint Again (45s)</span>
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

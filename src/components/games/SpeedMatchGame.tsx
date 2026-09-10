import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Clock,
  Zap,
  Award,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../../utils/audio";
import { SPEED_MATCH_PAIRS, MatchPair } from "../../data/gameData";
import { saveGameScore } from "../../utils/storage";

interface SpeedMatchGameProps {
  onBack: () => void;
  onGameComplete?: () => void;
}

interface GameCard {
  cardId: string; // unique card id in game
  pairId: string; // links term to its match
  text: string;
  type: "term" | "match";
  category: string;
  hint?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function SpeedMatchGame({ onBack, onGameComplete }: SpeedMatchGameProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(6);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);

  const timerRef = useRef<any>(null);

  const categories = ["All", "Sciences", "Mathematics", "English", "Social Sciences"];

  // Initialize game cards based on category
  const initializeGame = (cat: string = selectedCategory) => {
    if (timerRef.current) clearInterval(timerRef.current);

    let pool = SPEED_MATCH_PAIRS;
    if (cat !== "All") {
      pool = SPEED_MATCH_PAIRS.filter((p) => p.category === cat);
    }
    // Pick 6 random pairs
    const shuffledPairs = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    const pairCount = shuffledPairs.length;
    setTotalPairs(pairCount);

    const generatedCards: GameCard[] = [];
    shuffledPairs.forEach((pair, idx) => {
      generatedCards.push({
        cardId: `term_${pair.id}_${idx}`,
        pairId: pair.id,
        text: pair.term,
        type: "term",
        category: pair.category,
        hint: pair.hint,
        isFlipped: false,
        isMatched: false,
      });
      generatedCards.push({
        cardId: `match_${pair.id}_${idx}`,
        pairId: pair.id,
        text: pair.match,
        type: "match",
        category: pair.category,
        hint: pair.hint,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the cards thoroughly
    const finalShuffled = generatedCards.sort(() => Math.random() - 0.5);

    setCards(finalShuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairsCount(0);
    setSecondsElapsed(0);
    setIsCompleted(false);
    setStreak(0);
    setBestStreak(0);
    setScore(0);
    setIsNewHigh(false);
    setStars(0);
    setIsGameActive(true);

    // Start timer
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    initializeGame(selectedCategory);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedCategory]);

  // Handle card click
  const handleCardClick = (index: number) => {
    if (!isGameActive || isCompleted) return;
    if (cards[index].isMatched || cards[index].isFlipped) return;
    if (flippedCards.length >= 2) return;

    sound.playSelect();

    // Flip the card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      // Check for match
      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // MATCH!
        sound.playCorrect();
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak > bestStreak) setBestStreak(nextStreak);

        // Calculate points (base + streak bonus - time deduction)
        const pairPoints = 250 + nextStreak * 50;
        setScore((prev) => prev + pairPoints);

        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c, i) =>
              i === firstIdx || i === secondIdx
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedCards([]);
          const nextMatched = matchedPairsCount + 1;
          setMatchedPairsCount(nextMatched);

          // Check Win Condition
          if (nextMatched === totalPairs) {
            handleVictory(nextStreak);
          }
        }, 300);
      } else {
        // MISMATCH!
        sound.playWrong();
        setStreak(0);
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c, i) =>
              i === firstIdx || i === secondIdx
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const handleVictory = (finalStreak: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsCompleted(true);
    setIsGameActive(false);

    // Calculate stars: 3 stars if moves <= totalPairs * 2 and under 60s
    let calculatedStars = 1;
    if (moves <= totalPairs * 1.5 && secondsElapsed <= 45) {
      calculatedStars = 3;
    } else if (moves <= totalPairs * 2.2 && secondsElapsed <= 75) {
      calculatedStars = 2;
    }
    setStars(calculatedStars);

    // Final total score computation
    const timeBonus = Math.max(0, 500 - secondsElapsed * 6);
    const efficiencyBonus = Math.max(0, 400 - (moves - totalPairs) * 30);
    const finalScore = score + 1000 + timeBonus + efficiencyBonus;
    setScore(finalScore);

    // Save score
    const result = saveGameScore({
      gameId: "speed-match",
      score: finalScore,
      stars: calculatedStars,
      accuracy: Math.round((totalPairs / Math.max(moves, 1)) * 100),
      date: new Date().toISOString(),
      category: selectedCategory,
      streak: Math.max(finalStreak, bestStreak),
    });

    setIsNewHigh(result.isNewHigh);

    sound.playFanfare();
    confetti({
      particleCount: calculatedStars === 3 ? 120 : 60,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (onGameComplete) onGameComplete();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Navigation & Header */}
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
                Speed Match
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                Memory Drill
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Flip and connect scientific concepts, exam formulas, and definitions.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              initializeGame();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
          Subject:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick();
              setSelectedCategory(cat);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Game Status HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Time
            </span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {formatTime(secondsElapsed)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Moves
            </span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {moves}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Matched
            </span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {matchedPairsCount} / {totalPairs}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <Flame className={`h-5 w-5 ${streak >= 2 ? "animate-bounce text-amber-500" : ""}`} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Streak Combo
            </span>
            <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1">
              <span>{streak}x</span>
              {streak >= 2 && (
                <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 animate-pulse">
                  +{streak * 50} pts
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const isFlipped = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.cardId}
              onClick={() => handleCardClick(idx)}
              disabled={card.isMatched || isCompleted}
              className={`relative flex min-h-[110px] sm:min-h-[125px] w-full flex-col items-center justify-center rounded-2xl p-4 text-center transition-all duration-300 select-none cursor-pointer ${
                card.isMatched
                  ? "border-2 border-emerald-400 bg-emerald-50/80 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200 opacity-90 shadow-none scale-95"
                  : isFlipped
                  ? "border-2 border-indigo-500 bg-white text-slate-900 dark:border-indigo-400 dark:bg-slate-800 dark:text-white shadow-md scale-102"
                  : "border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400 hover:border-slate-300 hover:from-white hover:to-slate-50 dark:border-slate-800 dark:from-slate-800/80 dark:to-slate-900 dark:text-slate-500 dark:hover:border-slate-700 shadow-xs"
              }`}
            >
              {isFlipped ? (
                <div className="flex flex-col items-center justify-center space-y-1.5 animate-fadeIn">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      card.type === "term"
                        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                        : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                    }`}
                  >
                    {card.type === "term" ? "Concept / Term" : "Definition"}
                  </span>
                  <p
                    className={`font-extrabold leading-snug ${
                      card.type === "term"
                        ? "text-sm sm:text-base text-slate-900 dark:text-white"
                        : "text-xs sm:text-xs text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {card.text}
                  </p>
                  {card.isMatched && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Matched
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    Tap to Flip
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Victory Modal */}
      {isCompleted && (
        <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-b from-emerald-500/10 via-white to-emerald-500/5 p-6 sm:p-8 dark:border-emerald-600 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 shadow-xl text-center space-y-5 animate-scaleUp">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <Award className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                All Pairs Matched!
              </h3>
              {isNewHigh && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                  NEW RECORD!
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Outstanding recall and concept recognition!
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`h-8 w-8 transition-transform duration-300 ${
                  starIdx <= stars
                    ? "fill-amber-400 text-amber-400 scale-110"
                    : "text-slate-300 dark:text-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Final Score</span>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{score.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Time</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{formatTime(secondsElapsed)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Moves Taken</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{moves}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Max Streak</span>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">{bestStreak}x</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                initializeGame();
              }}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 font-bold text-sm shadow-md cursor-pointer transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Again</span>
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

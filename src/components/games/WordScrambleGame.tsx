import React, { useState, useEffect } from "react";
import {
  Shuffle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Award,
  ArrowLeft,
  Flame,
  Star,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../../utils/audio";
import { SCRAMBLE_WORDS, ScrambleWord } from "../../data/gameData";
import { saveGameScore } from "../../utils/storage";

interface WordScrambleGameProps {
  onBack: () => void;
  onGameComplete?: () => void;
}

export function WordScrambleGame({ onBack, onGameComplete }: WordScrambleGameProps) {
  const TOTAL_ROUNDS = 5;

  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [wordList, setWordList] = useState<ScrambleWord[]>([]);
  const [currentWord, setCurrentWord] = useState<ScrambleWord | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [revealedHintCount, setRevealedHintCount] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);

  // Initialize game session with 5 random words
  const initGame = () => {
    const shuffled = [...SCRAMBLE_WORDS].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS);
    setWordList(shuffled);
    setRoundIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setIsGameOver(false);
    setIsNewHigh(false);

    loadWord(shuffled[0]);
  };

  const scrambleString = (str: string): string[] => {
    const arr = str.split("");
    let scrambled = [...arr].sort(() => Math.random() - 0.5);
    // Ensure it's not identical to original
    if (scrambled.join("") === str && str.length > 2) {
      scrambled.reverse();
    }
    return scrambled;
  };

  const loadWord = (wordObj: ScrambleWord) => {
    setCurrentWord(wordObj);
    setScrambledLetters(scrambleString(wordObj.word));
    setUserLetters([]);
    setRevealedHintCount(0);
    setIsSolved(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Handle clicking a scrambled letter tile
  const handleLetterClick = (letter: string, indexInScramble: number) => {
    if (isSolved || !currentWord) return;

    sound.playSelect();

    // Move letter from scrambled pool to user answer
    const newScrambled = [...scrambledLetters];
    newScrambled.splice(indexInScramble, 1);
    setScrambledLetters(newScrambled);

    const newUserLetters = [...userLetters, letter];
    setUserLetters(newUserLetters);

    // If all letters placed, check match
    if (newUserLetters.length === currentWord.word.length) {
      checkWordAnswer(newUserLetters.join(""));
    }
  };

  // Remove letter from user answer back to scrambled pool
  const handleUserLetterClick = (letter: string, indexInUser: number) => {
    if (isSolved) return;

    sound.playClick();
    const newUserLetters = [...userLetters];
    newUserLetters.splice(indexInUser, 1);
    setUserLetters(newUserLetters);

    setScrambledLetters((prev) => [...prev, letter]);
  };

  // Clear all entered letters
  const handleClear = () => {
    if (isSolved || !currentWord) return;
    sound.playClick();
    setScrambledLetters(scrambleString(currentWord.word));
    setUserLetters([]);
  };

  // Reveal a hint letter
  const handleHint = () => {
    if (isSolved || !currentWord) return;
    if (revealedHintCount >= currentWord.word.length - 1) return;

    sound.playSelect();
    const nextIdx = revealedHintCount;
    const targetChar = currentWord.word[nextIdx];

    // Find targetChar in scrambledLetters or userLetters
    let foundInScramble = scrambledLetters.indexOf(targetChar);
    if (foundInScramble !== -1) {
      const newScrambled = [...scrambledLetters];
      newScrambled.splice(foundInScramble, 1);
      setScrambledLetters(newScrambled);
    }

    setRevealedHintCount((h) => h + 1);
    // Deduct 20 points penalty for hint
    setScore((s) => Math.max(0, s - 20));
  };

  // Skip word
  const handleSkip = () => {
    if (isSolved || !currentWord) return;
    sound.playWrong();
    setStreak(0);
    nextRound();
  };

  const checkWordAnswer = (attempt: string) => {
    if (!currentWord) return;

    if (attempt.toUpperCase() === currentWord.word) {
      // CORRECT!
      sound.playCorrect();
      setIsSolved(true);

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      const basePoints = currentWord.difficulty === "Hard" ? 300 : currentWord.difficulty === "Medium" ? 200 : 150;
      const hintPenalty = revealedHintCount * 30;
      const streakBonus = nextStreak * 50;
      const points = Math.max(50, basePoints - hintPenalty + streakBonus);

      setScore((s) => s + points);
    } else {
      // INCORRECT
      sound.playWrong();
    }
  };

  const nextRound = () => {
    const nextIdx = roundIndex + 1;
    if (nextIdx < wordList.length) {
      setRoundIndex(nextIdx);
      loadWord(wordList[nextIdx]);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setIsGameOver(true);

    let stars = 1;
    if (score >= 1000) stars = 3;
    else if (score >= 600) stars = 2;

    const result = saveGameScore({
      gameId: "word-scramble",
      score,
      stars,
      accuracy: Math.round((streak / TOTAL_ROUNDS) * 100),
      date: new Date().toISOString(),
      category: "English & Science Vocabulary",
      streak: bestStreak,
    });

    setIsNewHigh(result.isNewHigh);

    sound.playFanfare();
    confetti({
      particleCount: stars === 3 ? 100 : 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (onGameComplete) onGameComplete();
  };

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
                Word Scramble
              </h2>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950/80 dark:text-teal-300">
                Lexis & Terminology
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unscramble high-yield JAMB/WAEC vocabulary, biology, and chemistry terms.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            initGame();
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {/* Progress & HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
            <Shuffle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Round
            </span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {roundIndex + 1} of {TOTAL_ROUNDS}
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
            <p className="text-base font-black text-indigo-600 dark:text-indigo-400">
              {score.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Flame className={`h-5 w-5 ${streak >= 2 ? "animate-bounce text-amber-500" : ""}`} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Streak
            </span>
            <p className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1">
              <span>{streak}x</span>
              {streak >= 2 && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  +{streak * 50} pts
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Difficulty
            </span>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {currentWord?.difficulty || "Medium"}
            </p>
          </div>
        </div>
      </div>

      {/* Active Word Card */}
      {!isGameOver && currentWord && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-8">
          {/* Clue and Category */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <span>Category: {currentWord.category}</span>
            </div>

            <div className="max-w-xl mx-auto">
              <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                Definition / Clue:
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed italic">
                "{currentWord.clue}"
              </p>
            </div>
          </div>

          {/* User Answer Slot Boxes */}
          <div className="space-y-2 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Your Answer (Tap a letter to return it):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 min-h-[56px]">
              {Array.from({ length: currentWord.word.length }).map((_, idx) => {
                const letter = userLetters[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => letter && handleUserLetterClick(letter, idx)}
                    disabled={isSolved || !letter}
                    className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl text-xl sm:text-2xl font-black transition-all cursor-pointer ${
                      letter
                        ? isSolved
                          ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                          : "border-2 border-indigo-500 bg-indigo-50/50 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-200 shadow-sm scale-102"
                        : "border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40"
                    }`}
                  >
                    {letter || ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrambled Letters Pool */}
          {!isSolved && (
            <div className="space-y-3 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Available Scrambled Letters:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {scrambledLetters.map((char, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLetterClick(char, idx)}
                    className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl sm:text-2xl font-black text-slate-900 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:hover:border-indigo-500 shadow-xs cursor-pointer select-none transition-transform active:scale-95"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Solved Banner */}
          {isSolved && (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center dark:border-emerald-700 dark:bg-emerald-950/40 space-y-3 animate-scaleUp">
              <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm sm:text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Brilliant! The word is "{currentWord.word}"</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {currentWord.clue}
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  nextRound();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 font-bold text-sm shadow-md cursor-pointer transition-colors"
              >
                <span>Next Word</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Action Helper Controls */}
          {!isSolved && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
              <button
                onClick={handleHint}
                className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60 cursor-pointer shadow-xs"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Hint (-20 pts)</span>
              </button>
              <button
                onClick={handleSkip}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 cursor-pointer shadow-xs"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                <span>Skip</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Game Over Summary */}
      {isGameOver && (
        <div className="rounded-3xl border-2 border-teal-400 bg-gradient-to-b from-teal-500/10 via-white to-teal-500/5 p-6 sm:p-10 dark:border-teal-600 dark:from-teal-950/40 dark:via-slate-900 dark:to-teal-950/20 shadow-xl text-center space-y-6 animate-scaleUp">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-500/30">
            <Award className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Game Completed!
              </h3>
              {isNewHigh && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                  NEW RECORD!
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Mastering technical terminology and lexis boosts your JAMB and WAEC scores significantly.
            </p>
          </div>

          <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 max-w-sm mx-auto dark:border-teal-800 dark:bg-teal-950/50">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Total Score
            </span>
            <p className="text-4xl font-black text-teal-700 dark:text-teal-300">
              {score.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                initGame();
              }}
              className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 font-bold text-sm shadow-md cursor-pointer transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Another Round</span>
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

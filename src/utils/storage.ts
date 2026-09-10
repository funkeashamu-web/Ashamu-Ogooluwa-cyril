import {
  TestResult,
  StudyNote,
  SavedQuestion,
  Achievement,
  UserStats,
  PaymentRecord,
  AccessStatus,
  EducationalGameId,
  GameScoreRecord,
  GameStats,
} from "../types";
import { DEFAULT_ACHIEVEMENTS } from "../data/subjectData";

const STORAGE_KEYS = {
  TEST_HISTORY: "test_yourself_history",
  STUDY_NOTES: "test_yourself_notes",
  SAVED_QUESTIONS: "test_yourself_saved_questions",
  ACHIEVEMENTS: "test_yourself_achievements",
  USER_STATS: "test_yourself_user_stats",
  THEME: "test_yourself_theme",
  SOUND_MUTED: "test_yourself_sound_muted",
  CUSTOM_SUBJECTS: "test_yourself_custom_subjects",
  FIRST_EXAM_DATE: "test_yourself_first_exam_date",
  PAYMENT_RECORD: "test_yourself_payment_record",
  GAME_SCORES: "quizmaster_game_scores",
  GAME_STATS: "quizmaster_game_stats",
};

export const PAYMENT_DETAILS = {
  amountNaira: 500,
  amountFormatted: "₦500",
  bankName: "OPAY",
  accountNumber: "8035332548",
  accountName: "ASHAMU ADEFUNKE TEMITOPE",
  supportedBanks: [
    "OPay",
    "PalmPay",
    "Moniepoint",
    "Kuda Bank",
    "Access Bank",
    "GTBank (Guaranty Trust)",
    "First Bank of Nigeria",
    "Zenith Bank",
    "United Bank for Africa (UBA)",
    "Stanbic IBTC",
  ],
  whatsappNumber: "+2348035332548",
  whatsappFormatted: "08035332548",
};

// Initial sample tests illustrating Nigerian Exam prep results if student has no history
const SAMPLE_EXAM_TESTS: TestResult[] = [
  {
    id: "sample_jamb_math",
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    subject: "Mathematics",
    topic: "Algebra & Logarithms",
    difficulty: "Medium",
    questionType: "Multiple choice",
    score: 16,
    total: 20,
    percentage: 82,
    timeSpentSeconds: 980,
    totalTimeAllowedSeconds: 1500,
    examBoard: "JAMB",
    examYear: "2024",
    isExamPrep: true,
    questions: [],
    userAnswers: {},
    flags: {},
    feedback: {
      strengths: ["Algebraic factorization", "Logarithmic index laws"],
      improvements: ["Quadratic formula sign conventions"],
      recommendedTopics: ["Surds & Matrices"],
      summary: "Strong performance on JAMB speed calculus and algebra. Focus on surds simplification.",
      masteryRating: "Mastery",
    },
  },
  {
    id: "sample_waec_bio",
    date: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    subject: "Biology",
    topic: "Ecology & Genetics",
    difficulty: "Medium",
    questionType: "Multiple choice",
    score: 15,
    total: 20,
    percentage: 74,
    timeSpentSeconds: 1120,
    totalTimeAllowedSeconds: 1500,
    examBoard: "WAEC",
    examYear: "2023",
    isExamPrep: true,
    questions: [],
    userAnswers: {},
    flags: {},
    feedback: {
      strengths: ["Food chain trophic levels", "Mendelian ratios"],
      improvements: ["Cellular respiration electron transport"],
      recommendedTopics: ["Plant Physiology", "Homeostasis"],
      summary: "Good grasp of WASSCE ecological concepts and heredity.",
      masteryRating: "Proficient",
    },
  },
  {
    id: "sample_neco_chem",
    date: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    subject: "Chemistry",
    topic: "Stoichiometry & Periodic Table",
    difficulty: "Medium",
    questionType: "Multiple choice",
    score: 18,
    total: 20,
    percentage: 88,
    timeSpentSeconds: 920,
    totalTimeAllowedSeconds: 1500,
    examBoard: "NECO",
    examYear: "2024",
    isExamPrep: true,
    questions: [],
    userAnswers: {},
    flags: {},
    feedback: {
      strengths: ["Mole calculations", "Periodic ionization trends"],
      improvements: ["Redox oxidation number assignment"],
      recommendedTopics: ["Organic Chemistry"],
      summary: "Excellent NECO chemistry foundation. High score on gas stoichiometry.",
      masteryRating: "Mastery",
    },
  },
];

// --- Test History ---
export function getStoredTestHistory(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(SAMPLE_EXAM_TESTS));
      return SAMPLE_EXAM_TESTS;
    }
    const parsed: TestResult[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return SAMPLE_EXAM_TESTS;
    }

    // Strictly deduplicate by id to prevent duplicate keys in React render lists
    const seen = new Set<string>();
    const deduplicated: TestResult[] = [];
    let hadDuplicates = false;

    for (const item of parsed) {
      if (!item) continue;
      const id = item.id || `test_migrated_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      if (seen.has(id)) {
        hadDuplicates = true;
        continue;
      }
      seen.add(id);
      deduplicated.push({ ...item, id });
    }

    // If duplicates were discovered in storage, clean up localStorage immediately
    if (hadDuplicates) {
      localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(deduplicated));
    }

    return deduplicated;
  } catch (e) {
    console.error("Failed to load test history:", e);
    return SAMPLE_EXAM_TESTS;
  }
}

export function saveTestResult(result: TestResult): UserStats {
  try {
    const history = getStoredTestHistory();
    const existingIndex = history.findIndex((h) => h.id === result.id);
    let updated: TestResult[];
    let stats: UserStats;

    if (existingIndex >= 0) {
      // Update existing result (e.g. adding AI feedback), do NOT re-increment stats
      updated = [...history];
      updated[existingIndex] = { ...updated[existingIndex], ...result };
      stats = getStoredUserStats();
    } else {
      updated = [result, ...history.filter((h) => h.id !== result.id)];
      stats = updateUserStatsAfterTest(result);
      checkAndUnlockAchievements(result);
    }

    localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(updated));
    return stats;
  } catch (e) {
    console.error("Failed to save test result:", e);
    return getStoredUserStats();
  }
}

export function deleteTestResult(id: string): void {
  try {
    const history = getStoredTestHistory().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to delete test:", e);
  }
}

// --- Study Notes ---
export function getStoredStudyNotes(): StudyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_NOTES);
    if (!raw) {
      // Seed default initial note
      const initialNotes: StudyNote[] = [
        {
          id: "seed_note_1",
          subject: "Mathematics",
          topic: "Calculus (Derivatives)",
          title: "Power Rule & Chain Rule Essentials",
          overview: "Core rules for taking single-variable derivatives in AP/A-level exams.",
          keyConcepts: [
            {
              title: "Power Rule",
              content: "For any term x^n, d/dx(x^n) = n * x^(n-1).",
              formulaOrFact: "d/dx(x^n) = n·x^(n-1)",
            },
            {
              title: "Chain Rule",
              content: "Used for composite functions f(g(x)). Take the derivative of the outer function evaluated at the inner, times the derivative of the inner.",
              formulaOrFact: "d/dx[f(g(x))] = f'(g(x)) · g'(x)",
            },
          ],
          commonMistakes: [
            "Forgetting to multiply by the inner derivative in chain rule problems.",
            "Confusing the derivative of constants with zero vs keeping them.",
          ],
          summary: "Master the power rule first, then unpack composite expressions from the outside in.",
          createdAt: new Date().toISOString(),
          isStarred: true,
        },
      ];
      localStorage.setItem(STORAGE_KEYS.STUDY_NOTES, JSON.stringify(initialNotes));
      return initialNotes;
    }
    const parsed: StudyNote[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    const deduplicated: StudyNote[] = [];
    let hadDuplicates = false;

    for (const note of parsed) {
      if (!note) continue;
      const id = note.id || `note_migrated_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      if (seen.has(id)) {
        hadDuplicates = true;
        continue;
      }
      seen.add(id);
      deduplicated.push({ ...note, id });
    }

    if (hadDuplicates) {
      localStorage.setItem(STORAGE_KEYS.STUDY_NOTES, JSON.stringify(deduplicated));
    }

    return deduplicated;
  } catch (e) {
    console.error("Failed to load study notes:", e);
    return [];
  }
}

export function saveStudyNote(note: StudyNote): void {
  try {
    const notes = getStoredStudyNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    let updated: StudyNote[];
    if (existingIndex >= 0) {
      updated = [...notes];
      updated[existingIndex] = note;
    } else {
      updated = [note, ...notes];
    }
    localStorage.setItem(STORAGE_KEYS.STUDY_NOTES, JSON.stringify(updated));
    checkNoteAchievements();
  } catch (e) {
    console.error("Failed to save study note:", e);
  }
}

export function deleteStudyNote(id: string): void {
  try {
    const notes = getStoredStudyNotes().filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDY_NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error("Failed to delete study note:", e);
  }
}

// --- Saved Questions (Bookmarks) ---
export function getStoredSavedQuestions(): SavedQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_QUESTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleSaveQuestion(saved: SavedQuestion): boolean {
  try {
    const existing = getStoredSavedQuestions();
    const foundIndex = existing.findIndex((q) => q.question.id === saved.question.id);
    let updated: SavedQuestion[];
    let isNowSaved = false;

    if (foundIndex >= 0) {
      updated = existing.filter((q) => q.question.id !== saved.question.id);
      isNowSaved = false;
    } else {
      updated = [saved, ...existing];
      isNowSaved = true;
    }

    localStorage.setItem(STORAGE_KEYS.SAVED_QUESTIONS, JSON.stringify(updated));
    return isNowSaved;
  } catch (e) {
    console.error("Failed to toggle save question:", e);
    return false;
  }
}

export function isQuestionSaved(questionId: string): boolean {
  const existing = getStoredSavedQuestions();
  return existing.some((q) => q.question.id === questionId);
}

// --- User Stats & Streaks ---
export function getStoredUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        bestScorePercentage: parsed.bestScorePercentage ?? parsed.averageScorePercentage ?? 88,
        strongestSubject: parsed.strongestSubject || "Chemistry",
        weakestSubject: parsed.weakestSubject || "Biology",
        examScores: parsed.examScores || {},
        ...parsed,
      };
    }
  } catch (e) {
    console.error("Failed to load user stats:", e);
  }

  return {
    totalTestsCompleted: 3,
    totalQuestionsAnswered: 60,
    totalCorrectAnswers: 49,
    averageScorePercentage: 81,
    bestScorePercentage: 88,
    strongestSubject: "Chemistry",
    weakestSubject: "Biology",
    currentStreakDays: 4,
    lastTestDate: new Date().toISOString().split("T")[0],
    subjectScores: {
      Mathematics: { totalScore: 16, totalPossible: 20, count: 1 },
      Biology: { totalScore: 15, totalPossible: 20, count: 1 },
      Chemistry: { totalScore: 18, totalPossible: 20, count: 1 },
    },
    examScores: {
      JAMB: { totalScore: 16, totalPossible: 20, count: 1 },
      WAEC: { totalScore: 15, totalPossible: 20, count: 1 },
      NECO: { totalScore: 18, totalPossible: 20, count: 1 },
    },
    weakTopics: ["Cellular Respiration", "Surds Simplification", "Quadratic Sign Conventions"],
  };
}

function updateUserStatsAfterTest(result: TestResult): UserStats {
  const stats = getStoredUserStats();
  const today = new Date().toISOString().split("T")[0];

  // Streak logic
  let streak = stats.currentStreakDays;
  if (!stats.lastTestDate) {
    streak = 1;
  } else {
    const lastDate = new Date(stats.lastTestDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  const newTotalTests = stats.totalTestsCompleted + 1;
  const newTotalQuestions = stats.totalQuestionsAnswered + result.total;
  const newTotalCorrect = stats.totalCorrectAnswers + result.score;
  const newAvgPct = Math.round((newTotalCorrect / Math.max(newTotalQuestions, 1)) * 100);
  const newBestScore = Math.max(stats.bestScorePercentage || 0, result.percentage);

  // Subject scores
  const subKey = result.subject;
  const currentSub = stats.subjectScores[subKey] || { totalScore: 0, totalPossible: 0, count: 0 };
  const updatedSub = {
    totalScore: currentSub.totalScore + result.score,
    totalPossible: currentSub.totalPossible + result.total,
    count: currentSub.count + 1,
  };

  const updatedSubjectScores = {
    ...stats.subjectScores,
    [subKey]: updatedSub,
  };

  // Exam scores
  const updatedExamScores = { ...(stats.examScores || {}) };
  if (result.examBoard) {
    const currentExam = updatedExamScores[result.examBoard] || { totalScore: 0, totalPossible: 0, count: 0 };
    updatedExamScores[result.examBoard] = {
      totalScore: currentExam.totalScore + result.score,
      totalPossible: currentExam.totalPossible + result.total,
      count: currentExam.count + 1,
    };
  }

  // Calculate strongest and weakest subject
  let strongestSubject = stats.strongestSubject || subKey;
  let weakestSubject = stats.weakestSubject || subKey;
  let highestPct = -1;
  let lowestPct = 101;

  Object.entries(updatedSubjectScores).forEach(([name, data]) => {
    if (data.totalPossible > 0) {
      const pct = Math.round((data.totalScore / data.totalPossible) * 100);
      if (pct > highestPct) {
        highestPct = pct;
        strongestSubject = name;
      }
      if (pct < lowestPct) {
        lowestPct = pct;
        weakestSubject = name;
      }
    }
  });

  // Weak areas
  let weakTopics = [...(stats.weakTopics || [])];
  if (result.feedback?.improvements) {
    result.feedback.improvements.forEach((imp) => {
      if (!weakTopics.includes(imp)) {
        weakTopics.unshift(imp);
      }
    });
  } else if (result.percentage < 60) {
    const topicLabel = `${result.subject}: ${result.topic}`;
    if (!weakTopics.includes(topicLabel)) {
      weakTopics.unshift(topicLabel);
    }
  }
  weakTopics = weakTopics.slice(0, 8);

  const updatedStats: UserStats = {
    totalTestsCompleted: newTotalTests,
    totalQuestionsAnswered: newTotalQuestions,
    totalCorrectAnswers: newTotalCorrect,
    averageScorePercentage: newAvgPct,
    bestScorePercentage: newBestScore,
    strongestSubject,
    weakestSubject,
    currentStreakDays: streak,
    lastTestDate: today,
    subjectScores: updatedSubjectScores,
    examScores: updatedExamScores,
    weakTopics,
  };

  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats));
  return updatedStats;
}

// --- Achievements ---
export function getStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_ACHIEVEMENTS;
}

function checkAndUnlockAchievements(result: TestResult): void {
  const achievements = getStoredAchievements();
  const history = getStoredTestHistory();
  const stats = getStoredUserStats();

  let modified = false;

  achievements.forEach((ach) => {
    if (ach.unlocked) return;

    if (ach.id === "first_test") {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      modified = true;
    } else if (ach.id === "high_flyer" && result.percentage >= 90) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      modified = true;
    } else if (ach.id === "perfectionist" && result.percentage === 100 && result.total >= 5) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      modified = true;
    } else if (ach.id === "streak_3" && stats.currentStreakDays >= 3) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      modified = true;
    } else if (ach.id === "streak_7" && stats.currentStreakDays >= 7) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      modified = true;
    } else if (ach.id === "century_club" && stats.totalQuestionsAnswered >= 100) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      modified = true;
    } else if (ach.id === "polymath") {
      const distinctSubjects = new Set(history.map((h) => h.subject));
      if (distinctSubjects.size >= 4) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        modified = true;
      }
    }
  });

  if (modified) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }
}

function checkNoteAchievements(): void {
  const achievements = getStoredAchievements();
  const notes = getStoredStudyNotes();
  const noteAch = achievements.find((a) => a.id === "note_taker");
  if (noteAch && !noteAch.unlocked && notes.length >= 3) {
    noteAch.unlocked = true;
    noteAch.unlockedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }
}

// --- Sound Preference ---
export function getSoundMuted(): boolean {
  return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === "true";
}

export function setSoundMuted(muted: boolean): void {
  localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, muted ? "true" : "false");
}

// --- Theme Preference ---
export function getStoredTheme(): "light" | "dark" {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function setStoredTheme(theme: "light" | "dark"): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// --- Export & Import Data ---
export function exportUserData(): string {
  const data = {
    history: getStoredTestHistory(),
    notes: getStoredStudyNotes(),
    savedQuestions: getStoredSavedQuestions(),
    stats: getStoredUserStats(),
    achievements: getStoredAchievements(),
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };
  return JSON.stringify(data, null, 2);
}

// --- Custom Subjects ---
export function getCustomSubjects(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_SUBJECTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomSubject(subject: any): void {
  try {
    const existing = getCustomSubjects();
    const updated = [subject, ...existing.filter((s) => s.id !== subject.id && s.name?.toLowerCase() !== subject.name?.toLowerCase())];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SUBJECTS, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save custom subject:", e);
  }
}

// --- Convenient Aliases ---
export const getTestHistory = getStoredTestHistory;
export const getStudyNotes = getStoredStudyNotes;
export const getUserStats = getStoredUserStats;
export const getAchievements = getStoredAchievements;
export const updateAchievements = checkAndUnlockAchievements;
export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (e) {}
}

// --- Payment & Access Control (Day 1 Free, Day 2 ₦500 Payment Gate) ---
export function getFirstExamDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.FIRST_EXAM_DATE);
  } catch (e) {
    return null;
  }
}

export function recordFirstExamDateIfNeeded(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.FIRST_EXAM_DATE);
    if (existing) return existing;
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.FIRST_EXAM_DATE, now);
    return now;
  } catch (e) {
    return new Date().toISOString();
  }
}

export function getPaymentRecord(): PaymentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENT_RECORD);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function savePaymentRecord(record: PaymentRecord): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_RECORD, JSON.stringify(record));
  } catch (e) {
    console.error("Failed to save payment record:", e);
  }
}

export function getAccessStatus(): AccessStatus {
  try {
    const payment = getPaymentRecord();
    const hasPaid = Boolean(payment && payment.hasPaid && payment.verified);

    // If paid, the app is 100% unblocked and full access is granted permanently
    if (hasPaid) {
      return {
        hasPaid: true,
        firstExamDate: getFirstExamDate(),
        isDay1: false,
        daysSinceFirstExam: 0,
        isPaymentRequired: false,
        isBlocked: false,
        paymentRecord: payment,
      };
    }

    // Check when user first started using the app
    let firstExamDate = getFirstExamDate();
    if (!firstExamDate) {
      firstExamDate = recordFirstExamDateIfNeeded();
    }

    const firstDate = new Date(firstExamDate);
    const now = new Date();
    const elapsedMs = now.getTime() - firstDate.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Calendar day difference
    const startOfFirstDate = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      firstDate.getDate()
    ).getTime();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const dayDifference = Math.max(
      0,
      Math.floor((startOfToday - startOfFirstDate) / oneDayMs)
    );

    // Day 1 is free within first 24 hours and calendar day 0.
    // If either 24 hours have elapsed OR calendar day >= 1, Day 1 is over!
    const isDay1 = dayDifference === 0 && elapsedMs < oneDayMs;
    const isPaymentRequired = !hasPaid && !isDay1;
    const isBlocked = isPaymentRequired;

    return {
      hasPaid: false,
      firstExamDate,
      isDay1,
      daysSinceFirstExam: Math.max(dayDifference, elapsedMs >= oneDayMs ? 1 : 0),
      isPaymentRequired,
      isBlocked,
      paymentRecord: null,
    };
  } catch (e) {
    return {
      hasPaid: false,
      firstExamDate: null,
      isDay1: true,
      daysSinceFirstExam: 0,
      isPaymentRequired: false,
      isBlocked: false,
      paymentRecord: null,
    };
  }
}

export function confirmStudentPayment(details: {
  senderName?: string;
  bankName?: string;
  reference?: string;
}): PaymentRecord {
  const record: PaymentRecord = {
    hasPaid: true,
    paidAt: new Date().toISOString(),
    amount: PAYMENT_DETAILS.amountNaira,
    accountNumber: PAYMENT_DETAILS.accountNumber,
    accountName: PAYMENT_DETAILS.accountName,
    senderName: details.senderName?.trim() || "Student",
    bankName: details.bankName?.trim() || "Bank Transfer",
    reference: details.reference?.trim() || `QM-NIG-${Date.now().toString(36).toUpperCase()}`,
    verified: true,
  };
  savePaymentRecord(record);
  return record;
}

// Development and test helpers for student / tester convenience
export function simulateNextDayForTesting(): AccessStatus {
  // Set first exam date to 26 hours ago (Day 2 unpaid)
  const yesterday = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString();
  localStorage.setItem(STORAGE_KEYS.FIRST_EXAM_DATE, yesterday);
  // Remove payment record to simulate Day 2 unpaid status
  localStorage.removeItem(STORAGE_KEYS.PAYMENT_RECORD);
  return getAccessStatus();
}

export function resetTrialForTesting(): AccessStatus {
  const now = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.FIRST_EXAM_DATE, now);
  localStorage.removeItem(STORAGE_KEYS.PAYMENT_RECORD);
  return getAccessStatus();
}

export function simulatePaidForTesting(): AccessStatus {
  confirmStudentPayment({
    senderName: "Demo Student",
    bankName: "OPAY",
    reference: `OPAY-DEMO-${Date.now().toString(36).toUpperCase()}`,
  });
  return getAccessStatus();
}

// ---------------------------------------------------------------------------
// Educational Games Storage & High Score Management
// ---------------------------------------------------------------------------

const DEFAULT_GAME_STATS: GameStats = {
  totalGamesPlayed: 0,
  totalStarsEarned: 0,
  bestScores: {
    "speed-match": 0,
    "speed-math": 0,
    "word-scramble": 0,
    "fact-sprint": 0,
  },
  longestStreak: 0,
};

export function getGameStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
    if (!raw) return { ...DEFAULT_GAME_STATS };
    const parsed = JSON.parse(raw);
    return {
      totalGamesPlayed: parsed.totalGamesPlayed || 0,
      totalStarsEarned: parsed.totalStarsEarned || 0,
      bestScores: {
        "speed-match": parsed.bestScores?.["speed-match"] || 0,
        "speed-math": parsed.bestScores?.["speed-math"] || 0,
        "word-scramble": parsed.bestScores?.["word-scramble"] || 0,
        "fact-sprint": parsed.bestScores?.["fact-sprint"] || 0,
      },
      longestStreak: parsed.longestStreak || 0,
    };
  } catch (e) {
    return { ...DEFAULT_GAME_STATS };
  }
}

export function saveGameScore(record: GameScoreRecord): {
  isNewHigh: boolean;
  stats: GameStats;
} {
  try {
    const stats = getGameStats();
    const currentHigh = stats.bestScores[record.gameId] || 0;
    const isNewHigh = record.score > currentHigh;

    if (isNewHigh) {
      stats.bestScores[record.gameId] = record.score;
    }

    stats.totalGamesPlayed += 1;
    stats.totalStarsEarned += record.stars || 0;

    if (record.streak && record.streak > stats.longestStreak) {
      stats.longestStreak = record.streak;
    }

    localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));

    // Also append to recent game scores log
    try {
      const historyRaw = localStorage.getItem(STORAGE_KEYS.GAME_SCORES);
      const historyList: GameScoreRecord[] = historyRaw ? JSON.parse(historyRaw) : [];
      historyList.unshift(record);
      // Keep last 30 plays
      localStorage.setItem(
        STORAGE_KEYS.GAME_SCORES,
        JSON.stringify(historyList.slice(0, 30))
      );
    } catch (e) {}

    return { isNewHigh, stats };
  } catch (e) {
    return { isNewHigh: false, stats: getGameStats() };
  }
}

export function getRecentGameHistory(): GameScoreRecord[] {
  try {
    const historyRaw = localStorage.getItem(STORAGE_KEYS.GAME_SCORES);
    return historyRaw ? JSON.parse(historyRaw) : [];
  } catch (e) {
    return [];
  }
}

export function resetGameScoresForTesting(): GameStats {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATS);
  localStorage.removeItem(STORAGE_KEYS.GAME_SCORES);
  return { ...DEFAULT_GAME_STATS };
}


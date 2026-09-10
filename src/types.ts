export type QuestionType = "multiple_choice" | "true_false" | "short_answer";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type QuestionTypeOption =
  | "Multiple choice"
  | "True/False"
  | "Short answer"
  | "Mixed"
  | "multiple_choice"
  | "true_false"
  | "short_answer";

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  borderLight: string;
  badgeColor: string;
  description: string;
  popularTopics: string[];
}

export type ExamBoard = "JAMB" | "WAEC" | "NECO" | "BECE" | "GENERAL";

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  examBoard?: ExamBoard;
  examYear?: string;
  isAiPractice?: boolean;
}

export interface TestConfig {
  subject: string;
  topic: string;
  count: number;
  questionCount?: number;
  difficulty: DifficultyLevel;
  questionType: QuestionTypeOption;
  timeLimitSeconds: number; // 0 for unlimited
  weakAreas?: string[];
  examBoard?: ExamBoard;
  examYear?: string;
  isExamPrep?: boolean;
}

export interface AIFeedback {
  strengths: string[];
  improvements: string[];
  recommendedTopics: string[];
  summary: string;
  masteryRating: "Mastery" | "Proficient" | "Developing" | "Needs Review";
}

export interface TestResult {
  id: string;
  date: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionType: QuestionTypeOption;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
  totalTimeAllowedSeconds?: number;
  questions: Question[];
  userAnswers: Record<string, string>;
  flags: Record<string, boolean>;
  feedback?: AIFeedback;
  examBoard?: ExamBoard;
  examYear?: string;
  isExamPrep?: boolean;
}

export interface StudyNote {
  id: string;
  subject: string;
  topic: string;
  title: string;
  overview?: string;
  keyConcepts: Array<{
    title: string;
    content: string;
    formulaOrFact?: string;
  }>;
  commonMistakes?: string[];
  summary?: string;
  createdAt: string;
  isStarred: boolean;
}

export interface SavedQuestion {
  id: string;
  question: Question;
  savedAt: string;
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "tests" | "score" | "streak" | "study";
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  totalTestsCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageScorePercentage: number;
  bestScorePercentage: number;
  strongestSubject?: string;
  weakestSubject?: string;
  currentStreakDays: number;
  lastTestDate: string | null;
  subjectScores: Record<string, { totalScore: number; totalPossible: number; count: number }>;
  examScores?: Record<string, { totalScore: number; totalPossible: number; count: number }>;
  weakTopics: string[];
}

export interface PaymentRecord {
  hasPaid: boolean;
  paidAt?: string;
  amount: number;
  accountNumber: string;
  accountName: string;
  senderName?: string;
  bankName?: string;
  reference?: string;
  verified: boolean;
}

export interface AccessStatus {
  hasPaid: boolean;
  firstExamDate: string | null;
  isDay1: boolean;
  daysSinceFirstExam: number;
  isPaymentRequired: boolean;
  paymentRecord?: PaymentRecord | null;
}

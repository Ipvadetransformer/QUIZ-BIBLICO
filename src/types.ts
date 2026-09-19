export type Difficulty = 'facil' | 'medio' | 'dificil';

export type ThemeId = 'paulinas' | 'catecumenos' | 'ebd2025' | 'ebdAdultos' | 'todas';

export type GameMode = 'classico' | 'estudo' | 'equipes';

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface Question {
  id: string;
  numberInSource?: number;
  text: string;
  options: QuestionOption[];
  correctKey: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  biblicalReference: string;
  difficulty: Difficulty;
  theme: ThemeId;
  themeName: string;
  sourceDocument: string;
  tags: string[];
}

export interface TeamConfig {
  id: string;
  name: string;
  color: 'blue' | 'rose' | 'emerald' | 'purple' | 'amber' | 'cyan';
}

export interface AnswerRecord {
  questionId: string;
  selectedKey: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect: boolean;
  timeSpentSeconds: number;
  teamId?: string;
  teamName?: string;
  team?: 'teamA' | 'teamB';
  pointsEarned?: number;
  questionDifficulty?: Difficulty;
}

export interface QuizConfig {
  theme: ThemeId;
  difficulty: Difficulty | 'todas';
  questionCount: number;
  mode: GameMode;
  timerLimitSeconds: number; // 0 = off, 30, 60
  shuffleQuestions: boolean;
  orderByDifficulty?: boolean; // Progressão Fácil -> Médio -> Difícil
  teams: TeamConfig[];
  questionsPerTeam?: number;
  equalQuestionsPerTeam?: boolean;
  teamAName?: string;
  teamBName?: string;
}


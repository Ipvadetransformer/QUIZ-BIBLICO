import { Question } from '../types';

const STORAGE_KEY = 'biblical_quiz_custom_questions_v1';

/**
 * Loads custom user questions from browser's localStorage
 */
export function loadCustomQuestions(): Question[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load custom questions from localStorage:', err);
    return [];
  }
}

/**
 * Saves custom user questions to browser's localStorage
 */
export function saveCustomQuestions(questions: Question[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    return true;
  } catch (err) {
    console.error('Failed to save custom questions to localStorage:', err);
    return false;
  }
}

/**
 * Clears all custom user questions from browser's localStorage
 */
export function clearCustomQuestions(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Failed to clear custom questions:', err);
    return false;
  }
}

/**
 * Exports questions as a formatted JSON string for easy download/copy
 */
export function exportQuestionsToJson(questions: Question[]): string {
  return JSON.stringify(questions, null, 2);
}

/**
 * Exports questions as ready-to-copy TypeScript code snippet
 */
export function exportQuestionsToTypeScript(questions: Question[]): string {
  return `import { Question } from './types';\n\nexport const CUSTOM_QUESTIONS: Question[] = ${JSON.stringify(
    questions,
    null,
    2
  )};\n`;
}

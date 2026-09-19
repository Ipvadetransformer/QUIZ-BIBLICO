import { Question, QuizConfig } from '../types';

/**
 * Shuffles an array in-place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Prepares the final question array based on quiz configuration,
 * handling theme filtering, difficulty ordering (Fácil -> Médio -> Difícil),
 * team equal division, and shuffling.
 */
export function prepareQuestions(config: QuizConfig, allQuestions: Question[]): Question[] {
  // 1. Filter by theme if specified
  let pool = allQuestions.filter((q) => {
    return config.theme === 'todas' || q.theme === config.theme;
  });

  if (pool.length === 0) {
    pool = [...allQuestions];
  }

  const teamCount = config.teams && config.teams.length > 0 ? config.teams.length : 2;

  // 2. If Progressive Difficulty is selected (Fácil -> Médio -> Difícil)
  if (config.orderByDifficulty) {
    let facil = pool.filter((q) => q.difficulty === 'facil');
    let medio = pool.filter((q) => q.difficulty === 'medio');
    let dificil = pool.filter((q) => q.difficulty === 'dificil');

    if (config.shuffleQuestions) {
      facil = shuffleArray(facil);
      medio = shuffleArray(medio);
      dificil = shuffleArray(dificil);
    }

    // If exact balanced division per difficulty is requested in team mode
    if (config.mode === 'equipes' && config.equalQuestionsPerTeam) {
      if (config.questionsPerTeam) {
        // Distribute proportionally across the 3 tiers
        const targetTotal = config.questionsPerTeam * teamCount;
        // If target matches full pool
        if (targetTotal >= pool.length) {
          // Keep all or balance per difficulty
          const targetPerDiff = Math.floor(config.questionsPerTeam / 3);
          const remainder = config.questionsPerTeam % 3;

          const facilPerTeam = targetPerDiff + (remainder > 0 ? 1 : 0);
          const medioPerTeam = targetPerDiff + (remainder > 1 ? 1 : 0);
          const dificilPerTeam = targetPerDiff;

          const fCount = Math.min(facil.length, facilPerTeam * teamCount);
          const mCount = Math.min(medio.length, medioPerTeam * teamCount);
          const dCount = Math.min(dificil.length, dificilPerTeam * teamCount);

          const ordered = [
            ...facil.slice(0, fCount),
            ...medio.slice(0, mCount),
            ...dificil.slice(0, dCount),
          ];

          // Ensure overall count is a multiple of teamCount
          const validTotal = Math.floor(ordered.length / teamCount) * teamCount;
          return ordered.slice(0, validTotal);
        } else {
          // Balance proportionally
          const ratioF = facil.length / pool.length;
          const ratioM = medio.length / pool.length;

          let fCount = Math.floor((targetTotal * ratioF) / teamCount) * teamCount;
          let mCount = Math.floor((targetTotal * ratioM) / teamCount) * teamCount;
          let dCount = targetTotal - fCount - mCount;

          if (dCount % teamCount !== 0) {
            dCount = Math.floor(dCount / teamCount) * teamCount;
          }

          const ordered = [
            ...facil.slice(0, Math.min(facil.length, fCount)),
            ...medio.slice(0, Math.min(medio.length, mCount)),
            ...dificil.slice(0, Math.min(dificil.length, dCount)),
          ];

          return ordered.slice(0, targetTotal);
        }
      } else {
        // Just order all: facil -> medio -> dificil
        const ordered = [...facil, ...medio, ...dificil];
        const trimmedCount = Math.min(config.questionCount, ordered.length);
        const validTotal = Math.floor(trimmedCount / teamCount) * teamCount;
        return ordered.slice(0, validTotal > 0 ? validTotal : trimmedCount);
      }
    }

    // Default progressive ordering: all easy, then medium, then hard
    const ordered = [...facil, ...medio, ...dificil];
    const targetCount = Math.min(config.questionCount, ordered.length);
    return ordered.slice(0, targetCount);
  }

  // 3. Standard Non-Progressive Mode
  // Filter by difficulty if specific difficulty chosen
  if (config.difficulty !== 'todas') {
    pool = pool.filter((q) => q.difficulty === config.difficulty);
  }

  if (config.shuffleQuestions) {
    pool = shuffleArray(pool);
  }

  let finalCount = Math.min(config.questionCount, pool.length);

  // Equal division constraint
  if (config.mode === 'equipes' && config.equalQuestionsPerTeam) {
    const validCount = Math.floor(finalCount / teamCount) * teamCount;
    if (validCount > 0) {
      finalCount = validCount;
    }
  }

  return pool.slice(0, finalCount);
}

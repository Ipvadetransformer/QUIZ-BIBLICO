/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizConfig, Question, AnswerRecord } from './types';
import { BIBLICAL_QUESTIONS } from './data/questions';
import { prepareQuestions } from './utils/quizBuilder';
import { Navbar } from './components/Navbar';
import { QuizSetup } from './components/QuizSetup';
import { QuizPlay } from './components/QuizPlay';
import { QuizSummary } from './components/QuizSummary';
import { QuestionBankModal } from './components/QuestionBankModal';

export default function App() {
  const [view, setView] = useState<'setup' | 'playing' | 'summary'>('setup');
  const [config, setConfig] = useState<QuizConfig>({
    theme: 'todas',
    difficulty: 'todas',
    questionCount: 45,
    mode: 'equipes',
    timerLimitSeconds: 0,
    shuffleQuestions: false,
    orderByDifficulty: true,
    teams: [
      { id: 'team-1', name: 'Equipe Davi', color: 'blue' },
      { id: 'team-2', name: 'Equipe Salomão', color: 'rose' },
      { id: 'team-3', name: 'Equipe Ester', color: 'emerald' },
    ],
    equalQuestionsPerTeam: true,
    questionsPerTeam: 15,
  });
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [fontScale, setFontScale] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState<boolean>(false);

  // Start a new Quiz session with configured parameters
  const handleStartQuiz = (newConfig: QuizConfig) => {
    setConfig(newConfig);

    // Use builder to handle theme filtering, difficulty ordering, and team question division
    const selected = prepareQuestions(newConfig, BIBLICAL_QUESTIONS);

    setActiveQuestions(selected);
    setRecords([]);
    setView('playing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When quiz finishes
  const handleFinishQuiz = (finalRecords: AnswerRecord[]) => {
    setRecords(finalRecords);
    setView('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to initial setup screen
  const handleReset = () => {
    setView('setup');
    setRecords([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retrain only mistakes
  const handleReviewMistakesOnly = (mistakeIds: string[]) => {
    const mistakeQuestions = BIBLICAL_QUESTIONS.filter((q) => mistakeIds.includes(q.id));
    if (mistakeQuestions.length > 0) {
      setActiveQuestions(mistakeQuestions);
      setRecords([]);
      setView('playing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onReset={handleReset}
        onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
        fontScale={fontScale}
        setFontScale={setFontScale}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {view === 'setup' && (
          <QuizSetup
            onStartQuiz={handleStartQuiz}
            totalQuestionsAvailable={BIBLICAL_QUESTIONS.length}
          />
        )}

        {view === 'playing' && (
          <QuizPlay
            questions={activeQuestions}
            config={config}
            onFinishQuiz={handleFinishQuiz}
            fontScale={fontScale}
          />
        )}

        {view === 'summary' && (
          <QuizSummary
            questions={activeQuestions}
            records={records}
            config={config}
            onRestart={handleReset}
            onReviewMistakesOnly={handleReviewMistakesOnly}
            fontScale={fontScale}
          />
        )}
      </main>

      {/* Question Bank Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        fontScale={fontScale}
      />

      {/* Footer */}
      <footer className="border-t border-amber-200/80 bg-white/70 py-6 text-center text-xs text-stone-700 print:hidden">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-stone-800">
            Quiz Bíblico Interativo — Escola Bíblica Dominical & Discipulado
          </p>
          <p>
            Conteúdo fiel baseado em: <em>Cartas Paulinas</em>, <em>Classe Catecúmenos</em>, <em>Quiz EBD 2025</em> e <em>Gincana de Adultos</em>.
          </p>
          <p className="text-[11px] text-stone-700 pt-1">
            "Examinais as Escrituras, porque julgais ter nelas a vida eterna, e são elas mesmas que testificam de mim." — João 5:39
          </p>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  Filter,
  Printer,
  Sparkles,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Medal
} from 'lucide-react';
import { Question, AnswerRecord, QuizConfig, TeamConfig } from '../types';
import { soundManager } from '../utils/audio';
import { getTeamStyle } from '../utils/teamColors';

interface QuizSummaryProps {
  questions: Question[];
  records: AnswerRecord[];
  config: QuizConfig;
  onRestart: () => void;
  onReviewMistakesOnly: (mistakeQuestionIds: string[]) => void;
  fontScale: number;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  questions,
  records,
  config,
  onRestart,
  onReviewMistakesOnly,
  fontScale,
}) => {
  const [reviewFilter, setReviewFilter] = useState<'todas' | 'erradas' | string>('todas');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const total = records.length;
  const correctCount = records.filter((r) => r.isCorrect).length;
  const incorrectCount = total - correctCount;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Point scoring: Fácil = 1, Médio = 2, Difícil = 3
  const getPointsForDiff = (diff?: 'facil' | 'medio' | 'dificil') => {
    if (diff === 'dificil') return 3;
    if (diff === 'medio') return 2;
    return 1;
  };

  // Total points earned across all questions answered correctly
  const totalPointsEarned = records.reduce((sum, r) => {
    if (!r.isCorrect) return sum;
    if (typeof r.pointsEarned === 'number') return sum + r.pointsEarned;
    return sum + getPointsForDiff(r.questionDifficulty);
  }, 0);

  // Maximum possible points for questions in this quiz
  const maxPossiblePoints = questions.reduce((sum, q) => sum + getPointsForDiff(q.difficulty), 0);

  // Trigger celebratory confetti
  useEffect(() => {
    if (percent >= 50) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [percent]);

  // Teams calculation
  const activeTeams: TeamConfig[] =
    config.teams && config.teams.length > 0
      ? config.teams
      : [
          { id: 'team-1', name: config.teamAName || 'Equipe Davi', color: 'blue' },
          { id: 'team-2', name: config.teamBName || 'Equipe Salomão', color: 'rose' },
        ];

  const teamResults = activeTeams.map((team, idx) => {
    const teamRecords = records.filter(
      (r) =>
        r.teamId === team.id ||
        (idx === 0 && r.team === 'teamA') ||
        (idx === 1 && r.team === 'teamB')
    );
    const correct = teamRecords.filter((r) => r.isCorrect).length;
    const answeredCount = teamRecords.length;
    const teamPercent = answeredCount > 0 ? Math.round((correct / answeredCount) * 100) : 0;

    // Sum points for this team (1 for fácil, 2 for médio, 3 for difícil)
    const points = teamRecords.reduce((sum, r) => {
      if (!r.isCorrect) return sum;
      if (typeof r.pointsEarned === 'number') return sum + r.pointsEarned;
      return sum + getPointsForDiff(r.questionDifficulty);
    }, 0);

    return {
      team,
      correct,
      total: answeredCount,
      percent: teamPercent,
      points,
    };
  });

  // Sort teams by points descending (using weighted points)
  const sortedTeams = [...teamResults].sort((a, b) => b.points - a.points || b.correct - a.correct);
  const highestScore = sortedTeams[0]?.points ?? 0;
  const winners = sortedTeams.filter((t) => t.points === highestScore && highestScore > 0);
  const isTie = winners.length > 1;

  const getBiblicalPraise = () => {
    if (percent === 100) {
      return {
        title: 'Gabarito Perfeito! Desempenho Excepcional!',
        verse:
          '"Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar, que maneja bem a palavra da verdade." — 2 Timóteo 2:15',
        badge: 'Mestre da Palavra',
      };
    }
    if (percent >= 80) {
      return {
        title: 'Excelente Conhecimento Bíblico!',
        verse: '"Guardei no coração a tua palavra para não pecar contra ti." — Salmos 119:11',
        badge: 'Discípulo Zeloso',
      };
    }
    if (percent >= 60) {
      return {
        title: 'Muito Bom! Crescendo na Graça e no Conhecimento!',
        verse:
          '"Lâmpada para os meus pés é tua palavra e luz, para o meu caminho." — Salmos 119:105',
        badge: 'Estudante da Verdade',
      };
    }
    return {
      title: 'Bom Começo! Continue Mergulhando nas Escrituras!',
      verse:
        '"Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução na justiça." — 2 Timóteo 3:16',
      badge: 'Caminhante da Fé',
    };
  };

  const praise = getBiblicalPraise();

  // Filtered review list
  const mistakeIds = records.filter((r) => !r.isCorrect).map((r) => r.questionId);
  const reviewQuestions = questions.filter((q) => {
    const rec = records.find((r) => r.questionId === q.id);
    if (!rec) return false;
    if (reviewFilter === 'erradas') return !rec.isCorrect;
    if (reviewFilter !== 'todas') {
      return rec.teamId === reviewFilter;
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 print:p-0 print:m-0"
      style={{ fontSize: `${fontScale}rem` }}
    >
      {/* Celebration Header Card */}
      <div className="bg-white rounded-2xl border border-amber-200/90 p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-100/50 pointer-events-none blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-emerald-100/50 pointer-events-none blur-2xl" />

        {/* Icon & Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-amber-500 to-amber-700 text-white shadow-md mx-auto mb-4">
          <Trophy className="w-10 h-10 text-amber-100" />
        </div>

        <div className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          {praise.badge}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-display">
          {config.mode === 'equipes' && !isTie && winners.length === 1
            ? `🏆 Parabéns, ${winners[0].team.name}! Campeã da Gincana!`
            : praise.title}
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-stone-700 italic max-w-xl mx-auto leading-relaxed border-t border-b border-amber-100 py-3">
          {praise.verse}
        </p>

        {/* Score Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mt-6 sm:mt-8 max-w-2xl mx-auto">
          <div className="p-3 sm:p-4 rounded-xl bg-stone-50 border border-stone-200 text-center">
            <span className="text-[10px] sm:text-xs text-stone-700 font-semibold block uppercase">
              Total Questões
            </span>
            <span className="text-xl sm:text-3xl font-extrabold text-stone-900 font-display">
              {total}
            </span>
            <span className="text-[10px] sm:text-[11px] text-stone-500 block mt-0.5">
              Máx: {maxPossiblePoints} pts
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] sm:text-xs text-emerald-800 font-semibold block uppercase">Acertos</span>
            <span className="text-xl sm:text-3xl font-extrabold text-emerald-700 font-display">
              {correctCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold block mt-0.5">
              +{totalPointsEarned} pts
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-[10px] sm:text-xs text-rose-800 font-semibold block uppercase">Erros</span>
            <span className="text-xl sm:text-3xl font-extrabold text-rose-700 font-display">
              {incorrectCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-rose-600 block mt-0.5">
              {total > 0 ? Math.round((incorrectCount / total) * 100) : 0}% erro
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] sm:text-xs text-amber-900 font-semibold block uppercase">
              Aproveitamento
            </span>
            <span className="text-xl sm:text-3xl font-extrabold text-amber-800 font-display">
              {percent}%
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-900 font-medium block mt-0.5">
              {totalPointsEarned}/{maxPossiblePoints} pts
            </span>
          </div>
        </div>

        {/* PODIUM & LEADERBOARD (Team Mode) */}
        {config.mode === 'equipes' && (
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-left max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-700" />
                Classificação Final das Equipes
              </h3>
              <span className="text-xs text-stone-700">
                {activeTeams.length} equipes participantes
              </span>
            </div>

            <div className="space-y-2.5">
              {sortedTeams.map((item, rank) => {
                const style = getTeamStyle(item.team.color);
                const isWinner = item.correct === highestScore && highestScore > 0;
                const medalEmojis = ['🥇 1º Lugar', '🥈 2º Lugar', '🥉 3º Lugar', '4º Lugar', '5º Lugar', '6º Lugar'];

                return (
                  <div
                    key={item.team.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isWinner
                        ? `${style.bgLight} ${style.border} ring-2 ${style.ring} shadow-xs`
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-stone-700 bg-stone-100 px-2 py-1 rounded-md">
                        {medalEmojis[rank] || `${rank + 1}º`}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${style.dot}`} />
                        <span className="font-bold text-sm text-stone-900">{item.team.name}</span>
                        {isWinner && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-2xs">
                            {isTie ? 'Empatada!' : 'Vencedora!'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-stone-900 font-display">
                        {item.points}{' '}
                        <span className="text-xs font-bold text-amber-700">
                          {item.points === 1 ? 'pt' : 'pts'}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-700">
                        {item.correct} acertos em {item.total} Qs ({item.percent}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {isTie && (
              <p className="text-center text-xs font-bold text-amber-900 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300">
                🤝 Empate abençoado entre as equipes vencedoras! Todas demonstraram grande dedicação
                às Escrituras!
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8 pt-4 border-t border-stone-200 print:hidden">
          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            Configurar Nova Rodada / Gincana
          </button>

          {mistakeIds.length > 0 && (
            <button
              onClick={() => {
                soundManager.playClick();
                onReviewMistakesOnly(mistakeIds);
              }}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-98"
            >
              <Award className="w-4 h-4" />
              Treinar as {mistakeIds.length} Questões Erradas
            </button>
          )}

          <button
            onClick={handlePrint}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            Imprimir Relatório
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              Revisão Bíblica Detalhada das Questões
            </h2>
            <p className="text-xs text-stone-700">
              Gabarito oficial com referências e comentários teológicos da EBD.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-stone-200/70 p-1 rounded-xl text-xs print:hidden flex-wrap">
            <button
              onClick={() => setReviewFilter('todas')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                reviewFilter === 'todas'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Todas ({records.length})
            </button>
            <button
              onClick={() => setReviewFilter('erradas')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                reviewFilter === 'erradas'
                  ? 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-stone-700 hover:text-rose-600'
              }`}
            >
              Erros ({incorrectCount})
            </button>
            {config.mode === 'equipes' &&
              activeTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setReviewFilter(team.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    reviewFilter === team.id
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  {team.name}
                </button>
              ))}
          </div>
        </div>

        {/* Question Cards Review */}
        <div className="space-y-3">
          {reviewQuestions.map((q, idx) => {
            const rec = records.find((r) => r.questionId === q.id);
            if (!rec) return null;
            const isExpanded = expandedId === q.id || reviewFilter === 'erradas';

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border bg-white transition-all ${
                  rec.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                        rec.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rec.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-stone-700">#{idx + 1}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.2 rounded-md bg-stone-100 text-stone-700">
                          {q.themeName}
                        </span>
                        {rec.teamName && (
                          <span className="text-[11px] font-bold px-2 py-0.2 rounded-md bg-amber-100 text-amber-900">
                            Equipe: {rec.teamName}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                            q.difficulty === 'facil'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.difficulty === 'medio'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {q.difficulty.toUpperCase()} ({getPointsForDiff(q.difficulty)}{' '}
                          {getPointsForDiff(q.difficulty) === 1 ? 'pt' : 'pts'})
                        </span>
                        {rec.isCorrect && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            +{getPointsForDiff(q.difficulty)} pts
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-stone-900">{q.text}</h3>
                    </div>
                  </div>

                  <button className="text-stone-400 hover:text-stone-600 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => {
                        const isSelected = rec.selectedKey === opt.key;
                        const isCorrect = q.correctKey === opt.key;
                        return (
                          <div
                            key={opt.key}
                            className={`p-2 rounded-lg border ${
                              isCorrect
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-950 font-semibold'
                                : isSelected && !isCorrect
                                ? 'border-rose-300 bg-rose-50 text-rose-900 font-semibold'
                                : 'border-stone-100 bg-stone-50 text-stone-700'
                            }`}
                          >
                            <span className="font-mono font-bold mr-1.5">{opt.key})</span>
                            {opt.text}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-1 text-stone-800">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Referência: {q.biblicalReference}</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed text-[11px]">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

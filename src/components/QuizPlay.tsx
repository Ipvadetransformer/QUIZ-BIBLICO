import React, { useState, useEffect, useCallback, useId } from 'react';
import {
  Sparkles,
  Volume2,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users,
  Trophy,
  Layers,
  Clock,
  Play,
  Pause,
  Zap
} from 'lucide-react';
import { Question, AnswerRecord, QuizConfig, TeamConfig } from '../types';
import { soundManager } from '../utils/audio';
import { getTeamStyle } from '../utils/teamColors';

interface QuizPlayProps {
  questions: Question[];
  config: QuizConfig;
  onFinishQuiz: (records: AnswerRecord[]) => void;
  fontScale: number;
}

export const QuizPlay: React.FC<QuizPlayProps> = ({
  questions,
  config,
  onFinishQuiz,
  fontScale,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedKey, setSelectedKey] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(config.timerLimitSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Mata-Mata elimination state
  const [mataMataWinner, setMataMataWinner] = useState<TeamConfig | null>(null);
  const [mataMataEliminatedTeam, setMataMataEliminatedTeam] = useState<TeamConfig | null>(null);

  // Teams configuration
  const activeTeams: TeamConfig[] =
    config.teams && config.teams.length > 0
      ? config.teams
      : [
          { id: 'team-1', name: config.teamAName || 'Equipe 1', color: 'blue' },
          { id: 'team-2', name: config.teamBName || 'Equipe 2', color: 'rose' },
        ];

  // Team scores keyed by teamId
  const [teamScores, setTeamScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    activeTeams.forEach((t) => {
      initial[t.id] = 0;
    });
    return initial;
  });

  // Determine current team by question index
  const currentTeamIndex = currentIndex % activeTeams.length;
  const currentTeam = activeTeams[currentTeamIndex];
  const nextTeam = activeTeams[(currentIndex + 1) % activeTeams.length];
  const currentTeamStyle = getTeamStyle(currentTeam.color);

  // Unique IDs for accessibility
  const questionHeadingId = useId();
  const explanationRegionId = useId();

  const currentQuestion = questions[currentIndex];

  // Points value by difficulty: Fácil = 1 pt, Médio = 2 pts, Difícil = 3 pts
  const getQuestionPoints = (diff: 'facil' | 'medio' | 'dificil') => {
    if (diff === 'dificil') return 3;
    if (diff === 'medio') return 2;
    return 1;
  };
  const questionPoints = currentQuestion ? getQuestionPoints(currentQuestion.difficulty) : 1;

  // Reset timer & state on question change
  useEffect(() => {
    if (config.timerLimitSeconds > 0) {
      setTimeLeft(config.timerLimitSeconds);
      setIsTimerPaused(false);
    }
    setSelectedKey(null);
    setHasAnswered(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex, config.timerLimitSeconds]);

  // Timer countdown with pause/resume support
  useEffect(() => {
    if (!config.timerLimitSeconds || hasAnswered || isTimerPaused) return;
    if (timeLeft <= 0) {
      // Time ran out -> auto mark as incorrect
      handleAnswer(null);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, hasAnswered, config.timerLimitSeconds, isTimerPaused]);

  // Toggle start / pause timer
  const handleToggleTimer = () => {
    if (hasAnswered || timeLeft <= 0) return;
    soundManager.playClick();
    setIsTimerPaused((prev) => !prev);
  };

  // Handle User Answer
  const handleAnswer = useCallback(
    (key: 'A' | 'B' | 'C' | 'D' | 'E' | null) => {
      if (hasAnswered || !currentQuestion) return;

      const isCorrect = key === currentQuestion.correctKey;
      setSelectedKey(key);
      setHasAnswered(true);

      const timeSpent = config.timerLimitSeconds
        ? config.timerLimitSeconds - timeLeft
        : 0;

      const pointsEarned = isCorrect ? getQuestionPoints(currentQuestion.difficulty) : 0;

      let mataMataKnockout = false;
      let mataMataWinnerName: string | undefined = undefined;
      let mataMataWinnerTeamId: string | undefined = undefined;

      // Sound & Feedback
      if (config.mode === 'matamata') {
        if (isCorrect) {
          soundManager.playCorrect();
          setTeamScores((prev) => ({
            ...prev,
            [currentTeam.id]: (prev[currentTeam.id] || 0) + 1,
          }));
        } else {
          // Errou ou tempo zerou no Mata-Mata: Vitória imediata do adversário!
          soundManager.playIncorrect();
          const opponent = activeTeams.find((t) => t.id !== currentTeam.id) || nextTeam;
          mataMataKnockout = true;
          mataMataWinnerName = opponent.name;
          mataMataWinnerTeamId = opponent.id;
          setMataMataEliminatedTeam(currentTeam);
          setMataMataWinner(opponent);
          setTimeout(() => {
            soundManager.playCelebration();
          }, 250);
        }
      } else if (isCorrect) {
        soundManager.playCorrect();
        setStreak((prev) => {
          const next = prev + 1;
          if (next > maxStreak) setMaxStreak(next);
          if (next % 3 === 0) {
            setTimeout(() => soundManager.playChime(), 200);
          }
          return next;
        });

        if (config.mode === 'equipes' || (config.mode === 'personalizado' && activeTeams.length > 1)) {
          setTeamScores((prev) => ({
            ...prev,
            [currentTeam.id]: (prev[currentTeam.id] || 0) + pointsEarned,
          }));
        }
      } else {
        soundManager.playIncorrect();
        setStreak(0);
      }

      // Record Answer
      const newRecord: AnswerRecord = {
        questionId: currentQuestion.id,
        selectedKey: key || ('A' as const),
        isCorrect,
        timeSpentSeconds: timeSpent,
        teamId: (config.mode === 'equipes' || config.mode === 'matamata' || (config.mode === 'personalizado' && activeTeams.length > 1)) ? currentTeam.id : undefined,
        teamName: (config.mode === 'equipes' || config.mode === 'matamata' || (config.mode === 'personalizado' && activeTeams.length > 1)) ? currentTeam.name : undefined,
        team: currentTeamIndex === 0 ? 'teamA' : 'teamB',
        pointsEarned,
        questionDifficulty: currentQuestion.difficulty,
        mataMataKnockout,
        mataMataWinnerName,
        mataMataWinnerTeamId,
      };

      setRecords((prev) => [...prev, newRecord]);
    },
    [
      hasAnswered,
      currentQuestion,
      config.timerLimitSeconds,
      timeLeft,
      maxStreak,
      config.mode,
      currentTeam,
      currentTeamIndex,
      activeTeams,
      nextTeam,
    ]
  );

  // Next Question or Finish
  const handleNext = () => {
    soundManager.playClick();
    if (config.mode === 'matamata' && mataMataWinner) {
      soundManager.playCelebration();
      onFinishQuiz(records);
      return;
    }
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      soundManager.playCelebration();
      onFinishQuiz(records);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!hasAnswered) {
        const k = e.key.toUpperCase();
        if (k === 'A' || k === '1') handleAnswer('A');
        else if (k === 'B' || k === '2') handleAnswer('B');
        else if (k === 'C' || k === '3') handleAnswer('C');
        else if (k === 'D' || k === '4') handleAnswer('D');
        else if (k === 'E' || k === '5') {
          if (currentQuestion.options.some((o) => o.key === 'E')) {
            handleAnswer('E');
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, currentQuestion, handleAnswer]);

  // Text-To-Speech function
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${currentQuestion.text}. As alternativas são: ${currentQuestion.options
      .map((o) => `Letra ${o.key}: ${o.text}`)
      .join('. ')}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const difficultyMeta = {
    facil: {
      label: 'Nível Fácil',
      icon: '🟢',
      pointsLabel: 'Vale 1 Ponto',
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      pillBg: 'bg-emerald-600 text-white',
    },
    medio: {
      label: 'Nível Médio',
      icon: '🟡',
      pointsLabel: 'Vale 2 Pontos',
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      pillBg: 'bg-amber-600 text-white',
    },
    dificil: {
      label: 'Nível Difícil',
      icon: '🔴',
      pointsLabel: 'Vale 3 Pontos',
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      pillBg: 'bg-rose-600 text-white',
    },
  }[currentQuestion.difficulty];

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  // Check if this question is a boundary/phase start in progressive mode
  const isFirstOfDifficulty =
    config.orderByDifficulty &&
    (currentIndex === 0 || questions[currentIndex - 1]?.difficulty !== currentQuestion.difficulty);

  return (
    <div className="w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 pb-16 sm:pb-8">
      {/* Progressive Difficulty Stage Announcement Bar */}
      {config.orderByDifficulty && (
        <div className="flex items-center justify-between p-2 sm:p-2.5 px-3 sm:px-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold shadow-2xs">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Layers className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="hidden xs:inline">Etapa:</span>
            <span className={`px-2 py-0.5 rounded-md border font-bold ${difficultyMeta.bg}`}>
              {difficultyMeta.icon} {difficultyMeta.label}
            </span>
          </div>

          <span className="text-[11px] text-stone-600 hidden sm:inline">
            Ordem: Fácil ➔ Médio ➔ Difícil
          </span>
        </div>
      )}

      {/* MATA-MATA DUEL SCOREBOARD & TURN BANNER */}
      {config.mode === 'matamata' && (
        <div className="bg-linear-to-r from-rose-950 via-stone-900 to-amber-950 rounded-2xl border-2 border-rose-500/80 p-3.5 sm:p-5 text-white shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-rose-500/30 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
                <Zap className="w-3.5 h-3.5" />
                MATA-MATA (MORTE SÚBITA)
              </span>
              <span className="text-xs text-rose-200 font-semibold">
                Perguntas Difíceis
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-amber-300 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              ⚡ Regra: Errou, o adversário vence! Acertou, passa a vez.
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3">
            {/* Active Turn Team */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-stone-300 font-semibold uppercase tracking-wider">
                Vez de responder:
              </span>
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-md ring-2 ring-amber-300">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <span>{currentTeam.name}</span>
              </div>
            </div>

            {/* Adversary waiting */}
            <div className="text-xs text-stone-300 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-stone-400">Adversário aguardando:</span>
              <strong className="text-amber-200 font-bold">{nextTeam.name}</strong>
            </div>
          </div>

          {/* Duelo Placar */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {activeTeams.slice(0, 2).map((team) => {
              const isTurn = team.id === currentTeam.id;
              const score = teamScores[team.id] || 0;
              return (
                <div
                  key={team.id}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isTurn
                      ? 'bg-rose-900/60 border-rose-400 ring-2 ring-rose-400/40 shadow-sm'
                      : 'bg-black/30 border-white/10 text-stone-300'
                  }`}
                >
                  <div className="text-xs font-bold truncate text-white">{team.name}</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-display">
                    {score} <span className="text-xs font-normal text-stone-300">acertos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TEAM MODE SCOREBOARD & CURRENT TURN BANNER */}
      {(config.mode === 'equipes' || (config.mode === 'personalizado' && activeTeams.length > 1)) && (
        <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3">
          {/* Active Turn Highlight */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 sm:gap-2 border-b border-stone-100 pb-2.5 sm:pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold text-stone-600 uppercase tracking-wider">
                Vez de Responder:
              </span>
              <div
                className={`px-2.5 py-1 rounded-lg border font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs ${currentTeamStyle.bgLight} ${currentTeamStyle.textDark} ${currentTeamStyle.border} ring-2 ${currentTeamStyle.ring}`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${currentTeamStyle.dot} animate-pulse`} />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{currentTeam.name}</span>
              </div>
            </div>

            {/* Next Team Teaser */}
            <div className="text-[11px] sm:text-xs text-stone-600 flex items-center gap-1">
              <span>A seguir:</span>
              <strong className="text-stone-800 truncate max-w-[100px] sm:max-w-[140px]">{nextTeam.name}</strong>
            </div>
          </div>

          {/* Live Placar across all teams with horizontal scroll safeguard on mobile and spacious cards on desktop */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 pt-0.5">
            {activeTeams.map((team) => {
              const isTurn = team.id === currentTeam.id;
              const style = getTeamStyle(team.color);
              const score = teamScores[team.id] || 0;

              return (
                <div
                  key={team.id}
                  className={`p-2 sm:p-3 rounded-xl border text-center transition-all ${
                    isTurn
                      ? `${style.bgLight} ${style.border} ring-2 ${style.ring} shadow-xs font-bold`
                      : 'bg-stone-50/70 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot}`} />
                    <span className="text-[11px] sm:text-xs font-semibold truncate max-w-[110px] sm:max-w-[140px]" title={team.name}>
                      {team.name}
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold font-display leading-tight text-stone-900">
                    {score}{' '}
                    <span className="text-[11px] sm:text-xs font-normal text-stone-600">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Header bar with question progress & accessibility */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 text-xs font-semibold text-stone-700">
        {/* Progress Text */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md bg-stone-200/80 text-stone-800 font-bold text-[11px] sm:text-xs">
            Pergunta {currentIndex + 1} de {questions.length}
          </span>
          {!config.orderByDifficulty && (
            <span className={`px-2 py-0.5 rounded-md border text-[10px] sm:text-[11px] font-bold ${difficultyMeta.bg}`}>
              {difficultyMeta.icon} {difficultyMeta.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak indicator if not in teams mode */}
          {config.mode !== 'equipes' && streak > 1 && (
            <div className="flex items-center gap-1 text-amber-800 bg-amber-100/90 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-300 font-bold text-[10px] sm:text-xs animate-bounce">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 shrink-0" />
              <span>{streak} seguidas!</span>
            </div>
          )}

          {/* Read aloud button - 44px touch target on mobile */}
          <button
            onClick={handleReadAloud}
            className={`min-h-[44px] min-w-[44px] p-2 rounded-xl border flex items-center justify-center text-stone-600 hover:text-amber-800 hover:bg-amber-100/50 active:bg-amber-200 transition-colors cursor-pointer ${
              isSpeaking ? 'bg-amber-200 text-amber-900 border-amber-400' : 'border-stone-200 bg-white/80'
            }`}
            title="Ouvir a pergunta em voz alta"
            aria-label="Ouvir pergunta em áudio"
          >
            <Volume2 className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
        <div
          className="h-full bg-amber-600 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Timer display if enabled with Start/Pause controls */}
      {config.timerLimitSeconds > 0 && (
        <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-stone-100/90 border border-stone-200 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-700 font-medium flex items-center gap-1.5 text-xs sm:text-sm">
              <Clock className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Tempo Restante:</span>
            </span>
            {isTimerPaused && !hasAnswered && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] sm:text-[11px] animate-pulse">
                Pausado
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Countdown Numbers */}
            <span
              className={`font-mono font-extrabold text-sm sm:text-lg tabular-nums ${
                timeLeft <= 10 && !isTimerPaused
                  ? 'text-rose-600 animate-pulse'
                  : isTimerPaused
                  ? 'text-amber-800'
                  : 'text-stone-900'
              }`}
            >
              {timeLeft >= 60
                ? `${Math.floor(timeLeft / 60)}m ${(timeLeft % 60).toString().padStart(2, '0')}s`
                : `${timeLeft}s`}
            </span>

            {/* Start / Pause Button right next to counter */}
            {!hasAnswered && (
              <button
                type="button"
                onClick={handleToggleTimer}
                className={`min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isTimerPaused
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-amber-50 active:bg-amber-100 text-stone-700 border-stone-300 hover:border-amber-400'
                }`}
                title={isTimerPaused ? 'Iniciar / Retomar contagem do tempo' : 'Pausar contagem do tempo'}
                aria-label={isTimerPaused ? 'Iniciar contagem' : 'Pausar contagem'}
              >
                {isTimerPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-white" />
                    <span>Iniciar</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-stone-600" />
                    <span>Pausar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Primary Question Card */}
      <div className="bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-7 md:p-8 shadow-xs space-y-4 sm:space-y-6">
        {/* Question Origin & Points Value Tag */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-b border-stone-100 pb-2.5 sm:pb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-bold text-amber-900 bg-amber-50 px-2 sm:px-2.5 py-0.5 rounded-md border border-amber-200 text-[11px] sm:text-xs">
              {currentQuestion.themeName}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border font-bold text-[10px] sm:text-[11px] shadow-2xs ${difficultyMeta.bg}`}
            >
              {difficultyMeta.icon} {difficultyMeta.label} ({questionPoints === 1 ? '1 ponto' : `${questionPoints} pontos`})
            </span>
          </div>
          <span className="text-stone-500 font-medium text-[10px] sm:text-[11px]">
            Origem: {currentQuestion.sourceDocument}
          </span>
        </div>

        {/* Question Text with active team callout in team mode */}
        <div className="space-y-2">
          {config.mode === 'equipes' && (
            <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5 flex-wrap">
              <span>Pergunta destinada para:</span>
              <span className={`px-2 py-0.5 rounded-md ${currentTeamStyle.badgeBg} ${currentTeamStyle.badgeText} font-bold`}>
                {currentTeam.name}
              </span>
            </div>
          )}

          <h2
            id={questionHeadingId}
            style={{
              fontSize: `${1.25 * fontScale}rem`,
              lineHeight: 1.35,
            }}
            className="font-bold text-stone-900 font-display tracking-tight transition-all duration-150"
          >
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options List with comfortable mobile touch target (min-h-[52px] and py-3.5) */}
        <div
          role="radiogroup"
          aria-labelledby={questionHeadingId}
          className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2"
        >
          {currentQuestion.options.map((option) => {
            const isSelected = selectedKey === option.key;
            const isCorrectAnswer = option.key === currentQuestion.correctKey;

            // Compute option visual style
            let cardStyle =
              'border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 active:bg-amber-100/50 bg-stone-50/40 text-stone-800';
            let badgeStyle = 'bg-stone-200 text-stone-700';

            if (hasAnswered) {
              if (isCorrectAnswer) {
                cardStyle =
                  'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 font-semibold';
                badgeStyle = 'bg-emerald-600 text-white';
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle =
                  'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-400/20 opacity-90';
                badgeStyle = 'bg-rose-500 text-white';
              } else {
                cardStyle = 'border-stone-200 bg-stone-50/60 text-stone-600 opacity-60';
                badgeStyle = 'bg-stone-200 text-stone-600';
              }
            } else if (isSelected) {
              cardStyle = 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/30';
              badgeStyle = 'bg-amber-600 text-white';
            }

            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={hasAnswered}
                onClick={() => handleAnswer(option.key)}
                className={`w-full min-h-[52px] p-3 sm:p-4 rounded-xl border text-left flex items-start sm:items-center gap-3 transition-all cursor-pointer disabled:cursor-default active:scale-[0.99] ${cardStyle}`}
              >
                {/* Letter Key Pill */}
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 mt-0.5 sm:mt-0 transition-colors ${badgeStyle}`}
                >
                  {option.key}
                </span>

                {/* Option Text */}
                <span
                  style={{
                    fontSize: `${1.0 * fontScale}rem`,
                    lineHeight: 1.4,
                  }}
                  className="leading-relaxed flex-1 pt-0.5 sm:pt-0 transition-all duration-150"
                >
                  {option.text}
                </span>

                {/* Icon indicator after answer */}
                {hasAnswered && (
                  <span className="shrink-0 mt-0.5 sm:mt-0">
                    {isCorrectAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    ) : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Biblical Feedback & Explanation Box */}
        {hasAnswered && (
          <div
            id={explanationRegionId}
            tabIndex={-1}
            role="region"
            aria-label="Explicação e Referência Bíblica"
            className={`mt-4 sm:mt-6 p-3.5 sm:p-5 rounded-xl border transition-all ${
              selectedKey === currentQuestion.correctKey
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-stone-900'
            }`}
          >
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedKey === currentQuestion.correctKey
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {selectedKey === currentQuestion.correctKey ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <span className="font-bold text-xs sm:text-sm">
                    {selectedKey === currentQuestion.correctKey
                      ? config.mode === 'equipes'
                        ? `+${questionPoints} ${questionPoints === 1 ? 'ponto' : 'pontos'} para ${currentTeam.name}! Correto!`
                        : `Resposta Correta! +${questionPoints} ${questionPoints === 1 ? 'ponto' : 'pontos'}!`
                      : `Resposta correta: Letra ${currentQuestion.correctKey}`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-stone-300 text-stone-800 shadow-2xs">
                    <BookOpen className="w-3 h-3 text-amber-700 shrink-0" />
                    Base: {currentQuestion.biblicalReference}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: `${0.9 * fontScale}rem`,
                    lineHeight: 1.5,
                  }}
                  className="text-stone-700 leading-relaxed transition-all duration-150"
                >
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>

            {/* Next Action Button / Mata-Mata Knockout Resolution */}
            {config.mode === 'matamata' && mataMataWinner ? (
              <div className="mt-4 sm:mt-5 pt-4 border-t-2 border-rose-300 space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-rose-950 via-rose-900 to-amber-950 text-white border-2 border-rose-400/80 shadow-lg text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 border border-rose-300 text-rose-200 text-xs font-black uppercase tracking-wider animate-pulse">
                    <Zap className="w-3.5 h-3.5 text-rose-300" />
                    Mata-Mata Encerrado • Morte Súbita!
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-rose-100">
                    ❌ {mataMataEliminatedTeam?.name} Errou!
                  </h3>
                  <p className="text-sm sm:text-base text-amber-300 font-bold">
                    Pela regra do Mata-Mata, a vitória é imediata do adversário:
                  </p>
                  <div className="text-2xl sm:text-3xl font-black text-white font-display py-1">
                    🏆 {mataMataWinner.name} É O GRANDE CAMPEÃO! 🏆
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <Trophy className="w-5 h-5 text-stone-950" />
                    <span>Ver Pódio & Placar Final</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : config.mode === 'matamata' ? (
              <div className="mt-4 sm:mt-5 pt-3 border-t border-emerald-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {currentTeam.name} acertou e sobreviveu! Passando a pergunta difícil para: <strong>{nextTeam.name}</strong>
                  </span>
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <span>Passar Vez para {nextTeam.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mt-4 sm:mt-5 pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {config.mode === 'equipes' || (config.mode === 'personalizado' && activeTeams.length > 1) ? (
                  <span className="text-xs text-stone-700 font-semibold text-center sm:text-left">
                    Próxima pergunta será para: <strong>{nextTeam.name}</strong>
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < questions.length
                      ? 'Próxima Pergunta'
                      : 'Ver Resultado Final'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-xs text-stone-600 hidden sm:block">
        💡 Dica: Você pode responder usando o teclado com as teclas{' '}
        <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-stone-300">
          A
        </span>
        ,{' '}
        <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-stone-300">
          B
        </span>
        ,{' '}
        <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-stone-300">
          C
        </span>
        ,{' '}
        <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-stone-300">
          D
        </span>
        ,{' '}
        <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-stone-300">
          E
        </span>{' '}
        e avançar com{' '}
        <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-md border border-stone-300">
          Enter
        </span>
        .
      </div>
    </div>
  );
};

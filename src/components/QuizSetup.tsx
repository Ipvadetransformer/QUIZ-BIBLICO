import React, { useState } from 'react';
import {
  Sparkles,
  Scroll,
  Flame,
  Compass,
  Users,
  Timer,
  Trophy,
  Sliders,
  CheckCircle2,
  Shuffle,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { QuizConfig, ThemeId, Difficulty, GameMode, TeamConfig } from '../types';
import { BIBLICAL_QUESTIONS } from '../data/questions';
import { soundManager } from '../utils/audio';
import {
  TEAM_COLOR_PALETTE,
  DEFAULT_TEAM_NAMES,
  getTeamStyle,
} from '../utils/teamColors';

interface QuizSetupProps {
  onStartQuiz: (config: QuizConfig) => void;
  totalQuestionsAvailable: number;
  onOpenQuestionManager?: () => void;
  customQuestionsCount?: number;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({
  onStartQuiz,
  totalQuestionsAvailable,
  onOpenQuestionManager,
  customQuestionsCount = 0,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'todas'>('todas');
  const [selectedMode, setSelectedMode] = useState<GameMode>('equipes');
  const [questionCount, setQuestionCount] = useState<number>(45);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [orderByDifficulty, setOrderByDifficulty] = useState<boolean>(true);
  const [equalQuestionsPerTeam, setEqualQuestionsPerTeam] = useState<boolean>(true);
  const [questionsPerTeam, setQuestionsPerTeam] = useState<number>(15);

  // Dynamic Teams List
  const [teams, setTeams] = useState<TeamConfig[]>([
    { id: 'team-1', name: 'Equipe Davi', color: 'blue' },
    { id: 'team-2', name: 'Equipe Salomão', color: 'rose' },
    { id: 'team-3', name: 'Equipe Ester', color: 'emerald' },
  ]);

  // Filtered pool count based on current selection
  const matchingQuestions = BIBLICAL_QUESTIONS.filter((q) => {
    const themeMatch = selectedTheme === 'todas' || q.theme === selectedTheme;
    const diffMatch = selectedDifficulty === 'todas' || q.difficulty === selectedDifficulty;
    return themeMatch && diffMatch;
  });

  const availableCount = matchingQuestions.length;

  // Add a new team
  const handleAddTeam = () => {
    soundManager.playClick();
    if (teams.length >= 6) return;
    const nextIdx = teams.length;
    const nextName = DEFAULT_TEAM_NAMES[nextIdx] || `Equipe ${nextIdx + 1}`;
    const nextColor = TEAM_COLOR_PALETTE[nextIdx % TEAM_COLOR_PALETTE.length];
    setTeams([...teams, { id: `team-${Date.now()}`, name: nextName, color: nextColor }]);
  };

  // Remove a team (keep min 2)
  const handleRemoveTeam = (id: string) => {
    soundManager.playClick();
    if (teams.length <= 2) return;
    setTeams(teams.filter((t) => t.id !== id));
  };

  // Update team name
  const handleUpdateTeamName = (id: string, newName: string) => {
    setTeams(teams.map((t) => (t.id === id ? { ...t, name: newName } : t)));
  };

  // Calculated questions count in team mode
  const effectiveQuestionCount =
    selectedMode === 'equipes' && equalQuestionsPerTeam
      ? Math.min(questionsPerTeam * teams.length, totalQuestionsAvailable)
      : Math.min(questionCount, availableCount || totalQuestionsAvailable);

  const handleLaunchCustom = () => {
    soundManager.playClick();
    const sanitizedTeams = teams.map((t, idx) => ({
      ...t,
      name: t.name.trim() || `Equipe ${idx + 1}`,
    }));

    onStartQuiz({
      theme: selectedTheme,
      difficulty: selectedDifficulty,
      questionCount: effectiveQuestionCount,
      mode: selectedMode,
      timerLimitSeconds: timerSeconds,
      shuffleQuestions: shuffle,
      orderByDifficulty: selectedMode === 'equipes' ? orderByDifficulty : false,
      teams: sanitizedTeams,
      questionsPerTeam: selectedMode === 'equipes' ? questionsPerTeam : undefined,
      equalQuestionsPerTeam: selectedMode === 'equipes' ? equalQuestionsPerTeam : false,
      teamAName: sanitizedTeams[0]?.name || 'Equipe A',
      teamBName: sanitizedTeams[1]?.name || 'Equipe B',
    });
  };

  // Launch Progressive 45-Questions General Quiz Preset
  const handleLaunchProgressive45 = (teamList: TeamConfig[] = teams) => {
    soundManager.playCelebration();
    const sanitizedTeams = teamList.map((t, idx) => ({
      ...t,
      name: t.name.trim() || `Equipe ${idx + 1}`,
    }));

    onStartQuiz({
      theme: 'todas',
      difficulty: 'todas',
      questionCount: 45,
      mode: 'equipes',
      timerLimitSeconds: 0,
      shuffleQuestions: false,
      orderByDifficulty: true,
      teams: sanitizedTeams,
      questionsPerTeam: Math.floor(45 / sanitizedTeams.length),
      equalQuestionsPerTeam: false,
      teamAName: sanitizedTeams[0]?.name || 'Equipe A',
      teamBName: sanitizedTeams[1]?.name || 'Equipe B',
    });
  };

  const handlePreset = (preset: Partial<QuizConfig>) => {
    soundManager.playClick();
    const sanitizedTeams = teams.map((t, idx) => ({
      ...t,
      name: t.name.trim() || `Equipe ${idx + 1}`,
    }));

    onStartQuiz({
      theme: preset.theme || 'todas',
      difficulty: preset.difficulty || 'todas',
      questionCount: preset.questionCount || 10,
      mode: preset.mode || 'classico',
      timerLimitSeconds: preset.timerLimitSeconds || 0,
      shuffleQuestions: preset.shuffleQuestions !== undefined ? preset.shuffleQuestions : true,
      orderByDifficulty: preset.orderByDifficulty || false,
      teams: sanitizedTeams,
      questionsPerTeam: preset.questionsPerTeam,
      equalQuestionsPerTeam: preset.equalQuestionsPerTeam || false,
      teamAName: sanitizedTeams[0]?.name || 'Equipe Davi',
      teamBName: sanitizedTeams[1]?.name || 'Equipe Salomão',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Hero Welcome */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-semibold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          Baseado nos Materiais e Estudos da EBD & Catecúmenos
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 font-display tracking-tight">
          Quiz Bíblico Interativo
        </h1>
        <p className="text-base sm:text-lg text-stone-700 max-w-2xl mx-auto leading-relaxed">
          Gincanas em equipes e estudos bíblicos com rodízio inteligente de perguntas,
          ordem de dificuldade progressiva e divisão equilibrada.
        </p>
      </div>

      {/* FEATURED: QUIZ GERAL PROGRESSIVO (45 PERGUNTAS) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-br from-amber-900 via-stone-900 to-amber-950 text-white shadow-xl relative overflow-hidden border border-amber-600/40">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Opção em Destaque • Modo Completo EBD
            </span>
            <span className="text-xs font-semibold text-amber-200/90 bg-white/10 px-2.5 py-1 rounded-md">
              45 Perguntas • 3 Etapas
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-100">
              Quiz Geral Progressivo: 45 Perguntas em Ordem de Dificuldade
            </h2>
            <p className="text-sm text-stone-300 mt-2 leading-relaxed max-w-3xl">
              As 45 perguntas completas organizadas estritamente em ordem crescente: primeiro todas as
              perguntas do <strong>Nível Fácil</strong> (21 questões), avançando para o{' '}
              <strong>Nível Médio</strong> (13 questões) e concluindo no{' '}
              <strong>Nível Difícil</strong> (11 questões). As equipes se alternam pergunta a pergunta.
            </p>
          </div>

          {/* Flow visual preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>🟢 Etapa 1: Fácil</span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-1.5 py-0.5 rounded font-bold">1 ponto</span>
              </div>
              <p className="text-stone-300 text-[11px] mt-1">
                21 questões. Equipe A responde ➔ Equipe B responde ➔ Equipe C... (1 pt cada)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/30">
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>🟡 Etapa 2: Médio</span>
                <span className="text-[10px] bg-amber-900/80 text-amber-300 px-1.5 py-0.5 rounded font-bold">2 pontos</span>
              </div>
              <p className="text-stone-300 text-[11px] mt-1">
                13 questões. O valor dobra: cada acerto rende 2 pontos na disputa!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30">
              <div className="font-bold text-rose-300 flex items-center justify-between">
                <span>🔴 Etapa 3: Difícil</span>
                <span className="text-[10px] bg-rose-900/80 text-rose-300 px-1.5 py-0.5 rounded font-bold">3 pontos</span>
              </div>
              <p className="text-stone-300 text-[11px] mt-1">
                11 questões. Grande reta final: cada acerto vale 3 pontos para virar o jogo!
              </p>
            </div>
          </div>

          {/* Quick Start Button for this General Quiz */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-500/20">
            <div className="text-xs text-stone-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>
                Equipes ativas: <strong>{teams.map((t) => t.name).join(', ')}</strong> ({teams.length} equipes)
              </span>
            </div>

            <button
              onClick={() => handleLaunchProgressive45()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              Jogar Quiz Geral de 45 Perguntas Agora
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload and Custom Questions Action Banner */}
      {onOpenQuestionManager && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Scroll className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  Adicionar Novas Perguntas (.txt ou .pdf)
                </h3>
                {customQuestionsCount > 0 ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {customQuestionsCount} perguntas salvas no navegador
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    Importação de Arquivos
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Envie documentos em texto ou PDF, revise no preview para validação e inclua no banco de dados local da gincana.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenQuestionManager();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <span>Fazer Upload / Gerenciar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Start Presets (Other options) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            Outros Modos Populares de Estudo
          </h2>
          <span className="text-xs text-stone-700 font-medium">
            {totalQuestionsAvailable} perguntas no banco
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Preset 1: Cartas Paulinas */}
          <button
            onClick={() =>
              handlePreset({
                theme: 'paulinas',
                difficulty: 'todas',
                questionCount: 6,
                mode: 'estudo',
                timerLimitSeconds: 0,
              })
            }
            className="p-4 rounded-xl border border-amber-200 bg-linear-to-br from-amber-50/70 to-white hover:border-amber-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 flex items-center gap-1">
                <Scroll className="w-3 h-3" /> Epístolas
              </span>
              <span className="text-xs text-amber-800 font-semibold">6 Qs</span>
            </div>
            <h3 className="mt-2.5 font-bold text-stone-900 group-hover:text-amber-900 text-sm">
              Cartas Paulinas
            </h3>
            <p className="text-[11px] text-stone-700 mt-1 leading-relaxed">
              Romanos, Coríntios, Filipenses, ressurreição e Febe.
            </p>
          </button>

          {/* Preset 2: Catecúmenos */}
          <button
            onClick={() =>
              handlePreset({
                theme: 'catecumenos',
                difficulty: 'todas',
                questionCount: 6,
                mode: 'estudo',
                timerLimitSeconds: 0,
              })
            }
            className="p-4 rounded-xl border border-rose-200 bg-linear-to-br from-rose-50/70 to-white hover:border-rose-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Doutrina
              </span>
              <span className="text-xs text-rose-700 font-semibold">6 Qs</span>
            </div>
            <h3 className="mt-2.5 font-bold text-stone-900 group-hover:text-rose-900 text-sm">
              Catecúmenos
            </h3>
            <p className="text-[11px] text-stone-700 mt-1 leading-relaxed">
              Inspiração bíblica, Ceia do Senhor e salvação.
            </p>
          </button>

          {/* Preset 3: Histórias Bíblicas EBD */}
          <button
            onClick={() =>
              handlePreset({
                theme: 'ebd2025',
                difficulty: 'todas',
                questionCount: 15,
                mode: 'classico',
                timerLimitSeconds: 0,
              })
            }
            className="p-4 rounded-xl border border-blue-200 bg-linear-to-br from-blue-50/70 to-white hover:border-blue-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center gap-1">
                <Compass className="w-3 h-3" /> EBD 2025
              </span>
              <span className="text-xs text-blue-700 font-semibold">15 Qs</span>
            </div>
            <h3 className="mt-2.5 font-bold text-stone-900 group-hover:text-blue-900 text-sm">
              Histórias & Personagens
            </h3>
            <p className="text-[11px] text-stone-700 mt-1 leading-relaxed">
              Gideão e 300, Pentecostes, Abraão e alianças.
            </p>
          </button>

          {/* Preset 4: Nível Fácil Família */}
          <button
            onClick={() =>
              handlePreset({
                theme: 'todas',
                difficulty: 'facil',
                questionCount: 10,
                mode: 'classico',
                timerLimitSeconds: 0,
              })
            }
            className="p-4 rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50/70 to-white hover:border-emerald-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                🟢 Fácil
              </span>
              <span className="text-xs text-emerald-700 font-semibold">10 Qs</span>
            </div>
            <h3 className="mt-2.5 font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
              Família & Iniciantes
            </h3>
            <p className="text-[11px] text-stone-700 mt-1 leading-relaxed">
              Perguntas acessíveis para crianças e novos convertidos.
            </p>
          </button>
        </div>
      </div>

      {/* CUSTOM QUIZ CONFIGURATION CARD */}
      <div className="bg-white rounded-2xl border border-amber-200/90 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex items-center gap-2 pb-4 border-b border-stone-200">
          <Sliders className="w-5 h-5 text-amber-700" />
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Configurar Gincana & Personalizar Equipes
            </h2>
            <p className="text-xs text-stone-700">
              Ajuste as equipes, a divisão igualitária de perguntas e a ordem de dificuldade.
            </p>
          </div>
        </div>

        {/* 1. Game Mode Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            1. Modo de Jogo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'equipes',
                title: 'Gincana em Equipes (Recomendado)',
                desc: 'Alterne a vez entre as equipes com divisão igualitária e placar.',
                badge: 'Ideal para EBD',
              },
              {
                id: 'classico',
                title: 'Individual / Clássico',
                desc: 'Pontos por acerto, combos e avaliação final para 1 jogador.',
                badge: 'Pontuação',
              },
              {
                id: 'estudo',
                title: 'Modo Estudo Livre',
                desc: 'Sem pressão de pontuação, com explicações bíblicas imediatas.',
                badge: 'Sem pressa',
              },
            ].map((m) => {
              const active = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedMode(m.id as GameMode);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-600/30'
                      : 'border-stone-200 hover:border-amber-300 bg-stone-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-sm">{m.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700 mt-1">{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. DYNAMIC TEAMS MANAGER (If in Equipes Mode) */}
        {selectedMode === 'equipes' && (
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-700" />
                  Gerenciar Equipes da Gincana ({teams.length} Equipes)
                </h3>
                <p className="text-xs text-stone-700">
                  Insira o nome de cada equipe e defina quantas equipes participarão (2 a 6).
                </p>
              </div>

              {teams.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddTeam}
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Outra Equipe
                </button>
              )}
            </div>

            {/* Teams Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {teams.map((team, idx) => {
                const style = getTeamStyle(team.color);
                return (
                  <div
                    key={team.id}
                    className={`p-3 rounded-xl border ${style.border} ${style.bgLight} space-y-1.5 transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${style.textDark}`}>
                          Equipe {idx + 1}
                        </span>
                      </div>
                      {teams.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTeam(team.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="Remover esta equipe"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={team.name}
                      onChange={(e) => handleUpdateTeamName(team.id, e.target.value)}
                      placeholder={`Nome da Equipe ${idx + 1}`}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
                    />
                  </div>
                );
              })}
            </div>

            {/* Equal Division Settings */}
            <div className="pt-3 border-t border-amber-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={equalQuestionsPerTeam}
                    onChange={(e) => setEqualQuestionsPerTeam(e.target.checked)}
                    className="rounded border-stone-300 text-amber-700 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-stone-900">
                    Dividir a mesma quantidade exata de perguntas para cada equipe
                  </span>
                </label>

                {equalQuestionsPerTeam && (
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md">
                    Total: {effectiveQuestionCount} perguntas ({questionsPerTeam} por equipe)
                  </span>
                )}
              </div>

              {equalQuestionsPerTeam && (
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-amber-200">
                  <span className="text-xs font-semibold text-stone-700 block">
                    Selecione quantas perguntas cada equipe irá responder:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { perTeam: 3, label: '3 por equipe' },
                      { perTeam: 5, label: '5 por equipe' },
                      { perTeam: 7, label: '7 por equipe' },
                      { perTeam: 10, label: '10 por equipe' },
                      {
                        perTeam: Math.floor(totalQuestionsAvailable / teams.length),
                        label: `Máximo (${Math.floor(totalQuestionsAvailable / teams.length)} por equipe)`,
                      },
                    ].map((item) => {
                      const total = item.perTeam * teams.length;
                      if (total > totalQuestionsAvailable) return null;
                      const active = questionsPerTeam === item.perTeam;
                      return (
                        <button
                          key={item.perTeam}
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setQuestionsPerTeam(item.perTeam);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            active
                              ? 'border-amber-700 bg-amber-700 text-white shadow-xs'
                              : 'border-stone-200 hover:border-amber-300 bg-stone-50 text-stone-800'
                          }`}
                        >
                          {item.label}
                          <span className="block text-[10px] opacity-80 font-normal">
                            (Total: {total} Qs)
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-stone-700 flex items-center gap-1 pt-1">
                    <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>
                      Com <strong>{teams.length} equipes</strong> respondendo{' '}
                      <strong>{questionsPerTeam} perguntas cada</strong>, o quiz terá{' '}
                      <strong>{effectiveQuestionCount} perguntas no total</strong> com divisão 100%
                      equitativa!
                    </span>
                  </p>
                </div>
              )}

              {/* Progressive Difficulty Order Toggle */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-700" />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">
                        Ordem de Dificuldade: Progressiva (Fácil ➔ Médio ➔ Difícil)
                      </span>
                      <p className="text-[11px] text-stone-700">
                        Equipe A responde fácil, Equipe B fácil, Equipe C fácil... depois nível médio e
                        difícil.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setOrderByDifficulty(!orderByDifficulty);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      orderByDifficulty ? 'bg-amber-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        orderByDifficulty ? 'transform translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Theme Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            2. Escolha o Tema das Perguntas
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {(
              [
                { id: 'todas', label: 'Todos os Temas (Completo)', sub: '45 perguntas dos 4 documentos' },
                { id: 'paulinas', label: 'Cartas Paulinas', sub: 'Romanos, Coríntios, Filipenses' },
                { id: 'catecumenos', label: 'Doutrina & Catecúmenos', sub: 'Bíblia, Deus, Salvação, Ceia' },
                { id: 'ebd2025', label: 'Histórias & Personagens', sub: 'Quiz EBD 2025' },
                { id: 'ebdAdultos', label: 'Vida Cristã & Discipulado', sub: 'Acolhimento, Mente, Tiago' },
              ] as const
            ).map((item) => {
              const active = selectedTheme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedTheme(item.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-600/30'
                      : 'border-stone-200 hover:border-amber-300 bg-stone-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-sm">{item.label}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-amber-700" />}
                  </div>
                  <p className="text-[11px] text-stone-700 mt-0.5">{item.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Single Difficulty Filter (if not using all/progressive) */}
        {!orderByDifficulty && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              3. Filtrar Nível de Dificuldade Específico
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'todas', label: 'Todos os Níveis', icon: '🌈', desc: '1, 2 e 3 Pontos' },
                { id: 'facil', label: 'Apenas Fácil', icon: '🟢', desc: '1 Ponto por acerto' },
                { id: 'medio', label: 'Apenas Médio', icon: '🟡', desc: '2 Pontos por acerto' },
                { id: 'dificil', label: 'Apenas Difícil', icon: '🔴', desc: '3 Pontos por acerto' },
              ].map((lvl) => {
                const active = selectedDifficulty === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedDifficulty(lvl.id as Difficulty | 'todas');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      active
                        ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-600/30 font-bold'
                        : 'border-stone-200 hover:border-amber-300 bg-stone-50/40'
                    }`}
                  >
                    <span className="text-base mr-1">{lvl.icon}</span>
                    <span className="text-stone-900 text-sm">{lvl.label}</span>
                    <span className="block text-[10px] text-stone-700 mt-0.5">{lvl.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Quantity (if not in equal team mode) and Timer Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Question Count (if not in equal team mode) */}
          {(!equalQuestionsPerTeam || selectedMode !== 'equipes') && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Quantidade Total de Perguntas
              </label>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 20, 30, availableCount].map((qty) => {
                  if (qty > availableCount && qty !== availableCount) return null;
                  const isAll = qty === availableCount;
                  const active = questionCount === qty;
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setQuestionCount(qty);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'border-amber-700 bg-amber-700 text-white shadow-xs'
                          : 'border-stone-200 hover:border-amber-300 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {isAll ? `Todas (${qty})` : `${qty} perguntas`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timer Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-amber-700" />
              Tempo Limite por Pergunta
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 0, label: 'Sem Pressa' },
                { val: 30, label: '30 segundos' },
                { val: 45, label: '45 segundos' },
                { val: 60, label: '60 segundos' },
                { val: 90, label: '1 min e 30 seg' },
                { val: 120, label: '2 minutos' },
              ].map((t) => {
                const active = timerSeconds === t.val;
                return (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setTimerSeconds(t.val);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'border-amber-700 bg-amber-700 text-white shadow-xs'
                        : 'border-stone-200 hover:border-amber-300 bg-stone-50 text-stone-700'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6. Shuffle Toggle (if not in strict progressive mode) */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-semibold text-stone-700">
              {orderByDifficulty
                ? 'Embaralhar as perguntas dentro de cada nível de dificuldade'
                : 'Embaralhar a ordem geral das perguntas'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setShuffle(!shuffle);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              shuffle ? 'bg-amber-600' : 'bg-stone-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                shuffle ? 'transform translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleLaunchCustom}
            disabled={effectiveQuestionCount === 0}
            className="w-full py-4 rounded-xl bg-linear-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-99 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-display cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            Iniciar Quiz Personalizado ({effectiveQuestionCount} Perguntas)
            {selectedMode === 'equipes' && (
              <span className="text-xs font-normal bg-amber-900/50 px-2 py-0.5 rounded-md">
                {teams.length} Equipes
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

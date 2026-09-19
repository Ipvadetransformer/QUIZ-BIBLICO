import React, { useState } from 'react';
import {
  X,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  Printer
} from 'lucide-react';
import { Question, ThemeId, Difficulty } from '../types';
import { BIBLICAL_QUESTIONS } from '../data/questions';
import { soundManager } from '../utils/audio';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontScale: number;
  allQuestions?: Question[];
  onOpenQuestionManager?: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  fontScale,
  allQuestions = BIBLICAL_QUESTIONS,
  onOpenQuestionManager,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | 'todas'>('todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'todas'>('todas');
  const [showAnswers, setShowAnswers] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = allQuestions.filter((q) => {
    const matchesTheme = selectedTheme === 'todas' || q.theme === selectedTheme;
    const matchesDiff = selectedDifficulty === 'todas' || q.difficulty === selectedDifficulty;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      q.text.toLowerCase().includes(term) ||
      q.explanation.toLowerCase().includes(term) ||
      q.biblicalReference.toLowerCase().includes(term) ||
      q.options.some((o) => o.text.toLowerCase().includes(term));

    return matchesTheme && matchesDiff && matchesSearch;
  });

  const handleCopyQuestion = (q: Question) => {
    soundManager.playClick();
    const text = `*Pergunta:* ${q.text}\n\n${q.options
      .map((o) => `${o.key}) ${o.text}`)
      .join('\n')}\n\n*Resposta Correta:* Letra ${q.correctKey}\n*Referência Bíblica:* ${
      q.biblicalReference
    }\n*Comentário:* ${q.explanation}`;

    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl border border-amber-200 shadow-xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ fontSize: `${fontScale}rem` }}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-amber-50/70">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              Banco de Questões Bíblicas Completo
            </h2>
            <p className="text-xs text-stone-700 mt-0.5">
              {allQuestions.length} perguntas disponíveis (incluindo questões originais e personalizadas).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenQuestionManager && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                  onOpenQuestionManager();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                + Adicionar / Upload
              </button>
            )}
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
              title="Fechar banco de questões"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and Search toolbar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por texto, termo ou versículo..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 text-stone-800"
              />
            </div>

            {/* Theme Filter */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as ThemeId | 'todas')}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-hidden"
            >
              <option value="todas">Todos os Temas (45)</option>
              <option value="paulinas">Cartas Paulinas (6)</option>
              <option value="catecumenos">Doutrina & Catecúmenos (6)</option>
              <option value="ebd2025">Histórias & Personagens EBD 2025 (27)</option>
              <option value="ebdAdultos">Vida Cristã & Discipulado (6)</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'todas')}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-hidden"
            >
              <option value="todas">Todas as Dificuldades</option>
              <option value="facil">🟢 Fácil (Iniciantes/Família)</option>
              <option value="medio">🟡 Médio</option>
              <option value="dificil">🔴 Difícil (Aprofundamento)</option>
            </select>
          </div>

          {/* Quick toggles */}
          <div className="flex items-center justify-between text-xs text-stone-700 flex-wrap gap-2">
            <span>
              Exibindo <strong className="text-stone-900">{filtered.length}</strong> de 45 questões
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showAnswers}
                  onChange={(e) => setShowAnswers(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Mostrar Gabarito e Explicações</span>
              </label>

              <button
                onClick={handlePrint}
                className="px-2.5 py-1 rounded-md border border-stone-300 bg-white hover:bg-stone-100 text-[11px] font-semibold flex items-center gap-1 text-stone-700 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                Imprimir
              </button>
            </div>
          </div>
        </div>

        {/* Question List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <p className="text-sm">Nenhuma pergunta encontrada com os filtros atuais.</p>
            </div>
          ) : (
            filtered.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-300 transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-stone-700">#{idx + 1}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        q.difficulty === 'facil'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.difficulty === 'medio'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {q.difficulty.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                      {q.themeName}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyQuestion(q)}
                    className="text-stone-600 hover:text-amber-800 p-1 text-xs flex items-center gap-1 cursor-pointer"
                    title="Copiar texto da pergunta para WhatsApp ou material impresso"
                  >
                    {copiedId === q.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] text-emerald-700 font-bold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px] text-stone-700 hidden sm:inline">Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm font-bold text-stone-900 leading-snug">{q.text}</p>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {q.options.map((opt) => {
                    const isCorrect = opt.key === q.correctKey && showAnswers;
                    return (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-lg border ${
                          isCorrect
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-950 font-semibold'
                            : 'border-stone-100 bg-stone-50/70 text-stone-700'
                        }`}
                      >
                        <span className="font-mono font-bold mr-1.5">{opt.key})</span>
                        {opt.text}
                      </div>
                    );
                  })}
                </div>

                {/* Answer and Reference */}
                {showAnswers && (
                  <div className="pt-2 border-t border-stone-100 text-xs text-stone-700 flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resposta Correta: Letra {q.correctKey}
                      </span>
                      <span className="text-stone-700">|</span>
                      <span className="font-semibold text-stone-800">
                        📖 {q.biblicalReference}
                      </span>
                    </div>
                    <p className="text-stone-700 text-[11px] leading-relaxed italic bg-amber-50/50 p-2 rounded-md border border-amber-100">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-700">
          <span>
            Quiz Bíblico EBD • Fontes: Cartas Paulinas, Catecúmenos, Quiz EBD 2025 e Gincana Adultos.
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

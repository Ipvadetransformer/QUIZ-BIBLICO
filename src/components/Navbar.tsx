import React from 'react';
import { BookOpen, Volume2, VolumeX, RotateCcw, BookMarked, Type, FileUp } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  onReset: () => void;
  onOpenQuestionBank: () => void;
  onOpenQuestionManager?: () => void;
  customQuestionsCount?: number;
  fontScale: number;
  setFontScale: React.Dispatch<React.SetStateAction<number>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  onOpenQuestionBank,
  onOpenQuestionManager,
  customQuestionsCount = 0,
  fontScale,
  setFontScale,
  isMuted,
  setIsMuted
}) => {
  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playClick();
    }
  };

  const handleFontToggle = () => {
    soundManager.playClick();
    setFontScale((prev) => (prev >= 1.25 ? 0.95 : prev === 0.95 ? 1.1 : 1.25));
  };

  return (
    <header className="sticky top-0 z-30 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <button
          onClick={() => {
            soundManager.playClick();
            onReset();
          }}
          className="flex items-center gap-2 sm:gap-3 text-left group transition-transform active:scale-95 cursor-pointer shrink-0 min-h-[44px]"
          title="Voltar ao início"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-amber-600 to-amber-800 text-amber-50 flex items-center justify-center shadow-xs group-hover:shadow-md transition-shadow">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-bold text-base sm:text-xl text-stone-900 tracking-wide">
                Quiz Bíblico
              </span>
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold uppercase tracking-wider">
                EBD
              </span>
            </div>
            <p className="text-xs text-stone-700 hidden md:block">
              Perguntas e Respostas da Palavra de Deus
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Font Scale Button */}
          <button
            onClick={handleFontToggle}
            className="min-h-[42px] min-w-[42px] p-2 sm:px-3 sm:py-1.5 rounded-xl border border-amber-200 bg-white/80 hover:bg-amber-100/60 active:bg-amber-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Ajustar tamanho da fonte para leitura"
          >
            <Type className="w-4 h-4 text-stone-600" />
            <span className="hidden md:inline">Texto:</span>
            <span className="text-[11px] font-bold text-amber-800 hidden sm:inline">
              {fontScale <= 0.95 ? 'Padrão' : fontScale <= 1.1 ? 'Médio' : 'Grande'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`min-h-[42px] min-w-[42px] p-2 rounded-xl border flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
              isMuted
                ? 'border-stone-300 bg-stone-100 text-stone-400'
                : 'border-amber-200 bg-white/80 hover:bg-amber-100/60 text-amber-800'
            }`}
            title={isMuted ? 'Ativar efeitos sonoros' : 'Silenciar sons'}
            aria-label="Som"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Banco de Questões */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenQuestionBank();
            }}
            className="min-h-[42px] p-2 sm:px-3 sm:py-1.5 rounded-xl border border-amber-200 bg-white/80 hover:bg-amber-100/60 active:bg-amber-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ver todas as perguntas e referências bíblicas"
          >
            <BookMarked className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Banco de Questões</span>
          </button>

          {/* Upload / Gerenciador de Perguntas */}
          {onOpenQuestionManager && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenQuestionManager();
              }}
              className="min-h-[42px] p-2 sm:px-3 sm:py-1.5 rounded-xl border border-amber-300 bg-amber-100/70 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Fazer upload de arquivos .txt/.pdf e gerenciar novas perguntas"
            >
              <FileUp className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Adicionar Perguntas</span>
              {customQuestionsCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-600 text-white">
                  {customQuestionsCount}
                </span>
              )}
            </button>
          )}

          {/* Início / Reiniciar */}
          <button
            onClick={() => {
              soundManager.playClick();
              onReset();
            }}
            className="min-h-[42px] p-2 sm:px-3 sm:py-1.5 rounded-xl border border-amber-300/80 bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
            title="Recomeçar o quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Novo Quiz</span>
          </button>
        </div>
      </div>
    </header>
  );
};

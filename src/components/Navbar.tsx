import React from 'react';
import { BookOpen, Volume2, VolumeX, RotateCcw, BookMarked, Type } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  onReset: () => void;
  onOpenQuestionBank: () => void;
  fontScale: number;
  setFontScale: React.Dispatch<React.SetStateAction<number>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  onOpenQuestionBank,
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <button
          onClick={() => {
            soundManager.playClick();
            onReset();
          }}
          className="flex items-center gap-3 text-left group transition-transform active:scale-98"
          title="Voltar ao início"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-600 to-amber-800 text-amber-50 flex items-center justify-center shadow-xs group-hover:shadow-md transition-shadow">
            <BookOpen className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl text-stone-900 tracking-wide">
                Quiz Bíblico
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-semibold uppercase tracking-wider">
                EBD
              </span>
            </div>
            <p className="text-xs text-stone-700 hidden sm:block">
              Perguntas e Respostas da Palavra de Deus
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Font Scale Button */}
          <button
            onClick={handleFontToggle}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-amber-200 bg-white/80 hover:bg-amber-100/60 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Ajustar tamanho da fonte para leitura"
          >
            <Type className="w-4 h-4 text-stone-600" />
            <span className="hidden md:inline">Texto:</span>
            <span className="text-[11px] font-bold text-amber-800">
              {fontScale <= 0.95 ? 'Padrão' : fontScale <= 1.1 ? 'Médio' : 'Grande'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-colors ${
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
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-amber-200 bg-white/80 hover:bg-amber-100/60 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Ver todas as perguntas e referências bíblicas"
          >
            <BookMarked className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Banco de Questões</span>
          </button>

          {/* Início / Reiniciar */}
          <button
            onClick={() => {
              soundManager.playClick();
              onReset();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-amber-300/80 bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
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

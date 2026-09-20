import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  Download,
  Copy,
  Check,
  Edit3,
  BookOpen,
  Sparkles,
  Info
} from 'lucide-react';
import { Question, QuestionOption, Difficulty, ThemeId } from '../types';
import { parseQuestionsText, extractTextFromPdf } from '../utils/fileQuestionParser';
import {
  exportQuestionsToJson,
  exportQuestionsToTypeScript,
  saveCustomQuestions,
} from '../utils/customQuestionsStorage';
import { soundManager } from '../utils/audio';

interface QuestionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customQuestions: Question[];
  onSaveQuestions: (updatedQuestions: Question[]) => void;
  fontScale: number;
}

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  isOpen,
  onClose,
  customQuestions,
  onSaveQuestions,
  fontScale,
}) => {
  // Tab: 'upload' (preview imported), 'manage' (view existing stored in browser), 'create' (manual entry)
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'create'>('upload');

  // Preview questions parsed from file before adding to storage
  const [previewList, setPreviewList] = useState<Question[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Defaults for newly imported questions
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>('facil');
  const [defaultTheme, setDefaultTheme] = useState<ThemeId>('todas');

  // Manual Creation Form State
  const [manualText, setManualText] = useState('');
  const [manualOptions, setManualOptions] = useState<string[]>(['', '', '', '']);
  const [manualCorrectKey, setManualCorrectKey] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [manualRef, setManualRef] = useState('');
  const [manualExplanation, setManualExplanation] = useState('');
  const [manualDifficulty, setManualDifficulty] = useState<Difficulty>('facil');
  const [manualTheme, setManualTheme] = useState<ThemeId>('todas');
  const [manualError, setManualError] = useState<string | null>(null);

  // Copy code feedback
  const [copiedType, setCopiedType] = useState<'json' | 'ts' | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // File Upload Handler (.txt or .pdf)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundManager.playClick();
    setIsProcessingFile(true);
    setParseErrors([]);
    setParseWarnings([]);
    setUploadedFileName(file.name);

    try {
      let rawText = '';
      const lowerName = file.name.toLowerCase();

      if (lowerName.endsWith('.pdf')) {
        rawText = await extractTextFromPdf(file);
      } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.text')) {
        rawText = await file.text();
      } else {
        setParseErrors([
          `Formato de arquivo não suportado: "${file.name}". Por favor envie um arquivo com extensão .txt ou .pdf.`,
        ]);
        setIsProcessingFile(false);
        return;
      }

      if (!rawText || rawText.trim().length === 0) {
        setParseErrors([
          'O arquivo foi lido, mas não contém texto extraível. Se for um PDF, certifique-se de que não é uma imagem digitalizada.',
        ]);
        setIsProcessingFile(false);
        return;
      }

      const result = parseQuestionsText(
        rawText,
        defaultTheme,
        'Personalizado',
        defaultDifficulty
      );

      setPreviewList(result.questions);
      setParseErrors(result.errors);
      setParseWarnings(result.warnings);

      if (result.questions.length > 0) {
        soundManager.playCorrect();
      } else {
        soundManager.playIncorrect();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha desconhecida ao ler arquivo.';
      setParseErrors([
        `Erro ao processar o arquivo "${file.name}": ${msg}. Certifique-se de que o arquivo está acessível e segue o padrão esperado.`,
      ]);
      soundManager.playIncorrect();
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove single question from the preview list
  const handleRemovePreviewItem = (id: string) => {
    soundManager.playClick();
    setPreviewList((prev) => prev.filter((q) => q.id !== id));
  };

  // Change correct answer in preview item
  const handleUpdatePreviewCorrectKey = (id: string, newKey: 'A' | 'B' | 'C' | 'D' | 'E') => {
    soundManager.playClick();
    setPreviewList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, correctKey: newKey } : q))
    );
  };

  // Change difficulty in preview item
  const handleUpdatePreviewDifficulty = (id: string, newDiff: Difficulty) => {
    soundManager.playClick();
    setPreviewList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, difficulty: newDiff } : q))
    );
  };

  // Approve and save all preview questions to localStorage
  const handleApprovePreview = () => {
    if (previewList.length === 0) return;
    soundManager.playCelebration();

    const updated = [...customQuestions, ...previewList];
    onSaveQuestions(updated);
    saveCustomQuestions(updated);

    setSaveSuccessMsg(`${previewList.length} perguntas importadas e salvas com sucesso!`);
    setPreviewList([]);
    setUploadedFileName(null);
    setActiveTab('manage');

    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Delete saved question from stored custom questions
  const handleDeleteCustomQuestion = (id: string) => {
    soundManager.playClick();
    const updated = customQuestions.filter((q) => q.id !== id);
    onSaveQuestions(updated);
    saveCustomQuestions(updated);
  };

  // Delete all custom questions
  const handleClearAllCustom = () => {
    if (!window.confirm('Tem certeza de que deseja remover todas as perguntas personalizadas?')) {
      return;
    }
    soundManager.playClick();
    onSaveQuestions([]);
    saveCustomQuestions([]);
  };

  // Add question manually
  const handleAddManualQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    if (!manualText.trim()) {
      setManualError('Por favor informe o enunciado da pergunta.');
      soundManager.playIncorrect();
      return;
    }

    const validOpts = manualOptions.filter((o) => o.trim().length > 0);
    if (validOpts.length < 2) {
      setManualError('A pergunta deve conter pelo menos 2 alternativas preenchidas.');
      soundManager.playIncorrect();
      return;
    }

    const keys: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
    const options: QuestionOption[] = validOpts.map((text, idx) => ({
      key: keys[idx],
      text: text.trim(),
    }));

    const newQ: Question = {
      id: `custom-manual-${Date.now()}`,
      numberInSource: customQuestions.length + 1,
      text: manualText.trim(),
      options,
      correctKey: manualCorrectKey,
      biblicalReference: manualRef.trim() || 'Bíblia Sagrada',
      explanation: manualExplanation.trim() || 'Questão adicionada manualmente.',
      difficulty: manualDifficulty,
      theme: manualTheme,
      themeName: manualTheme === 'todas' ? 'Personalizado' : manualTheme,
      sourceDocument: 'Adicionada Manualmente',
      tags: ['Personalizado', 'Manual'],
    };

    const updated = [...customQuestions, newQ];
    onSaveQuestions(updated);
    saveCustomQuestions(updated);

    soundManager.playCorrect();
    setSaveSuccessMsg('Pergunta criada e salva no navegador com sucesso!');
    setManualText('');
    setManualOptions(['', '', '', '']);
    setManualRef('');
    setManualExplanation('');
    setActiveTab('manage');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Export handlers
  const handleCopyCode = (type: 'json' | 'ts') => {
    soundManager.playClick();
    const allCustom = customQuestions;
    const text = type === 'json' ? exportQuestionsToJson(allCustom) : exportQuestionsToTypeScript(allCustom);
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadJson = () => {
    soundManager.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportQuestionsToJson(customQuestions));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `perguntas-biblicas-customizadas-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl lg:max-w-5xl 2xl:max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-amber-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                  Gerenciador de Perguntas
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                  {customQuestions.length} salvas no navegador
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Faça upload de arquivos (.txt ou .pdf), revise no preview e jogue no quiz.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg hover:bg-stone-200/70 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-3 sm:px-6 gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('upload');
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'upload'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Upload (.txt / .pdf)</span>
            {previewList.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-bold">
                {previewList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('manage');
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'manage'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Salvas ({customQuestions.length})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('create');
            }}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'create'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Criar Manual</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {saveSuccessMsg}
          </div>
        )}

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* ========================================================================= */}
          {/* TAB 1: UPLOAD & PREVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              {/* Instructions Box */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-stone-700 text-xs space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700" />
                  Formato aceito para o arquivo (.txt ou .pdf):
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  O arquivo deve conter as perguntas numeradas seguidas de suas alternativas no formato:
                </p>
                <div className="p-2 rounded-lg bg-white border border-amber-200 font-mono text-[11px] text-stone-800 leading-tight">
                  1. Qual é o primeiro livro da Bíblia?<br />
                  a) Gênesis<br />
                  B) Êxodo<br />
                  c) Levítico<br />
                  D) Deuteronômio<br />
                  <span className="text-stone-400">// Opcional no texto: "Resposta: A" ou "Referência: Gênesis 1:1"</span>
                </div>
              </div>

              {/* Upload Drop Area */}
              <div className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-6 sm:p-8 text-center bg-amber-50/30 transition-all">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,text/plain,application/pdf"
                  className="hidden"
                  id="question-file-input"
                />
                <label
                  htmlFor="question-file-input"
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 group-hover:bg-amber-200 text-amber-800 flex items-center justify-center mb-3 transition-colors shadow-xs">
                    {isProcessingFile ? (
                      <div className="w-6 h-6 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-7 h-7" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-stone-900 group-hover:text-amber-800">
                    {isProcessingFile ? 'Lendo e estruturando perguntas...' : 'Clique para selecionar arquivo .txt ou .pdf'}
                  </span>
                  <span className="text-xs text-stone-500 mt-1">
                    Arraste ou escolha um documento de perguntas do seu computador
                  </span>
                </label>
              </div>

              {/* Error Alerts */}
              {parseErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-2 animate-in fade-in">
                  <div className="font-bold flex items-center gap-2 text-rose-800 text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    Atenção: Houve problemas ao processar o arquivo
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-700">
                    {parseErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-rose-800 pt-1 border-t border-rose-200">
                    Dica: Verifique se cada pergunta tem o número seguido de ponto (ex: <code>1. Pergunta</code>) e as alternativas com letras (ex: <code>a)</code>, <code>b)</code>, <code>c)</code>, <code>d)</code>).
                  </p>
                </div>
              )}

              {/* Warnings Alert */}
              {parseWarnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <Info className="w-4 h-4 text-amber-600" />
                    Avisos de Ajuste Automático:
                  </div>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 text-amber-700 max-h-24 overflow-y-auto">
                    {parseWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* PREVIEW SECTION */}
              {previewList.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-300">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                        Pré-visualização para Validação Humana ({previewList.length} perguntas detectadas)
                      </span>
                      <p className="text-[11px] text-emerald-800">
                        {uploadedFileName && <span>Arquivo: <strong>{uploadedFileName}</strong> • </span>}
                        Exclua itens indesejados ou ajuste a resposta correta antes de aprovar.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setPreviewList([]);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
                      >
                        Descartar
                      </button>
                      <button
                        onClick={handleApprovePreview}
                        className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Aprovar e Salvar no Navegador
                      </button>
                    </div>
                  </div>

                  {/* Questions Preview List */}
                  <div className="space-y-3">
                    {previewList.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-300 transition-colors shadow-2xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-stone-500">
                              Dificuldade:
                            </span>
                            <select
                              value={q.difficulty}
                              onChange={(e) =>
                                handleUpdatePreviewDifficulty(q.id, e.target.value as Difficulty)
                              }
                              className="text-xs border border-stone-200 rounded-md px-2 py-0.5 bg-stone-50 font-semibold"
                            >
                              <option value="facil">🟢 Fácil (1 pt)</option>
                              <option value="medio">🟡 Médio (2 pts)</option>
                              <option value="dificil">🔴 Difícil (3 pts)</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleRemovePreviewItem(q.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                            title="Excluir esta pergunta do preview"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Prompt */}
                        <h4 className="text-sm font-bold text-stone-900 leading-snug">
                          {q.text}
                        </h4>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt) => {
                            const isSelectedCorrect = q.correctKey === opt.key;
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => handleUpdatePreviewCorrectKey(q.id, opt.key)}
                                className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between gap-2 transition-all ${
                                  isSelectedCorrect
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500 font-semibold'
                                    : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100'
                                }`}
                                title="Clique para definir como resposta correta"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                                      isSelectedCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-stone-200 text-stone-700'
                                    }`}
                                  >
                                    {opt.key}
                                  </span>
                                  <span>{opt.text}</span>
                                </div>
                                {isSelectedCorrect && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                    Correta
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-1">
                          <span>Clique em qualquer alternativa para alternar qual é a correta.</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MANAGE SAVED QUESTIONS */}
          {/* ========================================================================= */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Banco de Perguntas Personalizadas
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Estas perguntas ficam salvas no armazenamento local do navegador e entram automaticamente na gincana.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {customQuestions.length > 0 && (
                    <>
                      <button
                        onClick={() => handleCopyCode('json')}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Copiar perguntas em formato JSON"
                      >
                        {copiedType === 'json' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        JSON
                      </button>

                      <button
                        onClick={() => handleCopyCode('ts')}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Copiar código TypeScript"
                      >
                        {copiedType === 'ts' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        TypeScript
                      </button>

                      <button
                        onClick={handleDownloadJson}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Baixar arquivo JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar
                      </button>

                      <button
                        onClick={handleClearAllCustom}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Limpar todas as perguntas personalizadas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Limpar Todas
                      </button>
                    </>
                  )}
                </div>
              </div>

              {customQuestions.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-2xl">
                  <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-stone-700">Nenhuma pergunta personalizada ainda</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                    Faça upload de um arquivo .txt ou .pdf na aba "Upload" ou use a aba "Criar Manualmente".
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-amber-300 transition-colors shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                            #{idx + 1}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                              q.difficulty === 'facil'
                                ? 'bg-emerald-100 text-emerald-800'
                                : q.difficulty === 'medio'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[11px] text-stone-500 font-semibold">
                            Ref: {q.biblicalReference}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteCustomQuestion(q.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                          title="Remover esta pergunta salva"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-stone-900">{q.text}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-700">
                        {q.options.map((opt) => {
                          const isCorrect = q.correctKey === opt.key;
                          return (
                            <div
                              key={opt.key}
                              className={`p-1.5 px-2.5 rounded-lg border flex items-center justify-between ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                                  : 'bg-stone-50/50 border-stone-200 text-stone-600'
                              }`}
                            >
                              <span>
                                <strong>{opt.key})</strong> {opt.text}
                              </span>
                              {isCorrect && (
                                <span className="text-[10px] text-emerald-700">✓ Correta</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CREATE MANUALLY */}
          {/* ========================================================================= */}
          {activeTab === 'create' && (
            <form onSubmit={handleAddManualQuestion} className="space-y-4">
              {manualError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  {manualError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 block uppercase mb-1">
                  1. Enunciado da Pergunta *
                </label>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Ex: Em qual cidade Jesus nasceu?"
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block uppercase mb-1.5">
                  2. Alternativas (pelo menos 2) e marque a correta:
                </label>
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as const).map((key, idx) => (
                    <div key={key} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setManualCorrectKey(key);
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          manualCorrectKey === key
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                        title={`Marcar ${key} como resposta correta`}
                      >
                        {key}
                      </button>
                      <input
                        type="text"
                        value={manualOptions[idx] || ''}
                        onChange={(e) => {
                          const next = [...manualOptions];
                          next[idx] = e.target.value;
                          setManualOptions(next);
                        }}
                        placeholder={`Alternativa ${key}`}
                        className={`flex-1 p-2 text-xs rounded-lg border ${
                          manualCorrectKey === key
                            ? 'border-emerald-500 bg-emerald-50/30'
                            : 'border-stone-300'
                        }`}
                      />
                      {manualCorrectKey === key && (
                        <span className="text-[10px] font-bold text-emerald-700 px-2 py-1 bg-emerald-100 rounded-md">
                          Gabarito
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block uppercase mb-1">
                    Dificuldade
                  </label>
                  <select
                    value={manualDifficulty}
                    onChange={(e) => setManualDifficulty(e.target.value as Difficulty)}
                    className="w-full p-2 text-xs rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="facil">🟢 Fácil (1 ponto)</option>
                    <option value="medio">🟡 Médio (2 pontos)</option>
                    <option value="dificil">🔴 Difícil (3 pontos)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block uppercase mb-1">
                    Referência Bíblica
                  </label>
                  <input
                    type="text"
                    value={manualRef}
                    onChange={(e) => setManualRef(e.target.value)}
                    placeholder="Ex: Miqueias 5:2"
                    className="w-full p-2 text-xs rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block uppercase mb-1">
                    Tema / Categoria
                  </label>
                  <select
                    value={manualTheme}
                    onChange={(e) => setManualTheme(e.target.value as ThemeId)}
                    className="w-full p-2 text-xs rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="todas">Personalizado / Geral</option>
                    <option value="paulinas">Cartas Paulinas</option>
                    <option value="catecumenos">Doutrina & Catecúmenos</option>
                    <option value="ebd2025">Histórias & Personagens</option>
                    <option value="ebdAdultos">Vida Cristã & Discipulado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block uppercase mb-1">
                  Comentário / Explicação (Opcional)
                </label>
                <input
                  type="text"
                  value={manualExplanation}
                  onChange={(e) => setManualExplanation(e.target.value)}
                  placeholder="Ex: Jesus nasceu em Belém da Judeia conforme profetizado."
                  className="w-full p-2 text-xs rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Salvar Pergunta no Navegador
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>
            💾 Armazenamento no navegador via <code>localStorage</code> (sem envio para servidores externos).
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-200 text-stone-700 font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

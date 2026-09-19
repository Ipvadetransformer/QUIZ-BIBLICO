import { Question, QuestionOption, Difficulty, ThemeId } from '../types';

export interface ParseError {
  line?: number;
  message: string;
}

export interface ParseResult {
  questions: Question[];
  errors: string[];
  warnings: string[];
}

/**
 * Normalizes text lines, handling Windows CRLF and trailing spaces
 */
export function cleanText(raw: string): string[] {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim());
}

/**
 * Detects if a line starts a new question, e.g.:
 * "1. pergunta", "1 - pergunta", "1) pergunta", "Questão 1: pergunta", "Q1. pergunta"
 */
const QUESTION_START_REGEX = /^(?:(?:Quest[ãa]o|Pergunta|Q)?\s*(\d+)[\.\-\)\:]\s*|\b(\d+)[\.\-\)]\s+)(.*)$/i;

/**
 * Detects option line, e.g.:
 * "a) alternativa", "A - alternativa", "A. alternativa", "[a] alternativa", "(a) alternativa"
 */
const OPTION_REGEX = /^(?:[\(\[]?([A-Ea-e])[\)\]\.\-\:]\s*)(.+)$/;

/**
 * Detects answer indicators if present in text, e.g.:
 * "Resposta: A", "Gabarito: B", "Correta: C", "Resp: D", "Resposta correta: A"
 */
const ANSWER_REGEX = /^(?:Resposta(?:\s+correta)?|Gabarito|Resp|Alternativa\s+correta)\s*[:\-\=]\s*([A-Ea-e])/i;

/**
 * Detects biblical reference if present, e.g.:
 * "Referência: João 3:16", "Ref: Romanos 8:28", "Texto: Tiago 1:5"
 */
const REF_REGEX = /^(?:Refer[êe]ncia(?:\s+B[íi]blica)?|Ref|Texto\s+B[íi]blico|Passagem)\s*[:\-\=]\s*(.+)$/i;

/**
 * Detects difficulty if present, e.g.:
 * "Dificuldade: Fácil", "Nível: Médio", "Nivel: Dificil"
 */
const DIFF_REGEX = /^(?:Dificuldade|N[íi]vel)\s*[:\-\=]\s*(f[áa]cil|m[ée]dio|dif[íi]cil|facil|medio|dificil)/i;

/**
 * Detects theme if present, e.g.:
 * "Tema: Cartas Paulinas", "Assunto: Doutrina"
 */
const THEME_REGEX = /^(?:Tema|Assunto|Categoria)\s*[:\-\=]\s*(.+)$/i;

/**
 * Detects explanation/comment if present, e.g.:
 * "Explicação: ...", "Comentário: ..."
 */
const EXPLANATION_REGEX = /^(?:Explica[çc][ãa]o|Coment[áa]rio|Nota)\s*[:\-\=]\s*(.+)$/i;

/**
 * Parses raw text from .txt or extracted .pdf into structured Question objects.
 * Supports the user format:
 * 1. pergunta
 * a) alternativa
 * B) alternativa
 * c) alternativa
 * D) alternativa
 */
export function parseQuestionsText(
  rawText: string,
  defaultTheme: ThemeId = 'todas',
  defaultThemeName: string = 'Personalizado',
  defaultDifficulty: Difficulty = 'medio'
): ParseResult {
  const lines = cleanText(rawText);
  const questions: Question[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (lines.length === 0 || rawText.trim().length === 0) {
    return {
      questions: [],
      errors: ['O arquivo enviado está vazio.'],
      warnings: [],
    };
  }

  // Temporary container for parsing blocks
  interface RawBlock {
    questionNumber?: number;
    questionText: string;
    options: QuestionOption[];
    explicitCorrectKey?: 'A' | 'B' | 'C' | 'D' | 'E';
    reference?: string;
    explanation?: string;
    difficulty?: Difficulty;
    theme?: ThemeId;
    themeName?: string;
    lineStart: number;
  }

  const blocks: RawBlock[] = [];
  let currentBlock: RawBlock | null = null;
  let currentOption: QuestionOption | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Check for Question start
    const qMatch = line.match(QUESTION_START_REGEX);
    if (qMatch) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      const numStr = qMatch[1] || qMatch[2];
      const text = qMatch[3].trim();
      currentBlock = {
        questionNumber: numStr ? parseInt(numStr, 10) : undefined,
        questionText: text,
        options: [],
        lineStart: i + 1,
      };
      currentOption = null;
      continue;
    }

    // If we haven't found a question start yet, check if first line looks like a question
    if (!currentBlock) {
      // If line is not an option and seems like a question
      if (!OPTION_REGEX.test(line)) {
        currentBlock = {
          questionText: line,
          options: [],
          lineStart: i + 1,
        };
        currentOption = null;
        continue;
      } else {
        errors.push(`Linha ${i + 1}: Encontrada opção antes do enunciado da pergunta ("${line}").`);
        continue;
      }
    }

    // Check for explicit metadata lines
    const ansMatch = line.match(ANSWER_REGEX);
    if (ansMatch) {
      const key = ansMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E';
      currentBlock.explicitCorrectKey = key;
      continue;
    }

    const refMatch = line.match(REF_REGEX);
    if (refMatch) {
      currentBlock.reference = refMatch[1].trim();
      continue;
    }

    const diffMatch = line.match(DIFF_REGEX);
    if (diffMatch) {
      const d = diffMatch[1].toLowerCase();
      if (d.includes('facil') || d.includes('fácil')) currentBlock.difficulty = 'facil';
      else if (d.includes('dificil') || d.includes('difícil')) currentBlock.difficulty = 'dificil';
      else currentBlock.difficulty = 'medio';
      continue;
    }

    const themeMatch = line.match(THEME_REGEX);
    if (themeMatch) {
      currentBlock.themeName = themeMatch[1].trim();
      continue;
    }

    const expMatch = line.match(EXPLANATION_REGEX);
    if (expMatch) {
      currentBlock.explanation = expMatch[1].trim();
      continue;
    }

    // Check for Option line (a), b), c), d), e)
    const optMatch = line.match(OPTION_REGEX);
    if (optMatch) {
      const key = optMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E';
      let optText = optMatch[2].trim();

      // Check if option contains marked asterisk indicating correct answer, e.g. "a) *Jesus*" or "a) Jesus (correta)"
      let isMarkedCorrect = false;
      if (optText.startsWith('*') && optText.endsWith('*') && optText.length > 2) {
        optText = optText.slice(1, -1).trim();
        isMarkedCorrect = true;
      } else if (/\(correta\)/i.test(optText) || /\[correta\]/i.test(optText) || /\(gabarito\)/i.test(optText)) {
        optText = optText.replace(/\((?:correta|gabarito)\)/gi, '').replace(/\[(?:correta|gabarito)\]/gi, '').trim();
        isMarkedCorrect = true;
      }

      currentOption = {
        key,
        text: optText,
      };
      currentBlock.options.push(currentOption);

      if (isMarkedCorrect) {
        currentBlock.explicitCorrectKey = key;
      }
      continue;
    }

    // Otherwise, line is a continuation
    if (currentOption) {
      // Multi-line option
      currentOption.text += ' ' + line;
    } else if (currentBlock) {
      // Multi-line question prompt
      currentBlock.questionText += ' ' + line;
    }
  }

  // Push last block
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  if (blocks.length === 0) {
    errors.push(
      'Nenhuma pergunta válida foi detectada no arquivo. Verifique se o formato segue a estrutura numerada: "1. Pergunta" seguida pelas alternativas "a) ... b) ... c) ... d) ...".'
    );
    return { questions: [], errors, warnings };
  }

  // Convert raw blocks to valid Question items with robust validation
  const timestamp = Date.now();

  blocks.forEach((b, idx) => {
    const qNum = b.questionNumber || idx + 1;
    const prompt = b.questionText.trim();

    if (!prompt) {
      errors.push(`Pergunta #${qNum} (linha ${b.lineStart}): O enunciado da pergunta está vazio.`);
      return;
    }

    if (b.options.length < 2) {
      errors.push(
        `Pergunta #${qNum} ("${prompt.slice(0, 40)}..."): Deve ter pelo menos 2 alternativas (encontradas ${b.options.length}).`
      );
      return;
    }

    // Ensure options have valid keys A, B, C, D...
    const normalizedOptions: QuestionOption[] = b.options.map((opt, optIdx) => {
      const standardKeys: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
      const key = standardKeys[optIdx] || opt.key;
      return {
        key,
        text: opt.text.trim(),
      };
    });

    // Check if correct key is valid
    let correctKey: 'A' | 'B' | 'C' | 'D' | 'E' = b.explicitCorrectKey || 'A';

    // Verify option exists for correctKey
    const hasOption = normalizedOptions.some((o) => o.key === correctKey);
    if (!hasOption) {
      correctKey = normalizedOptions[0].key;
      warnings.push(
        `Pergunta #${qNum}: Resposta correta ajustada para a alternativa (${correctKey}) por padrão. Você pode alterá-la no preview.`
      );
    } else if (!b.explicitCorrectKey) {
      warnings.push(
        `Pergunta #${qNum}: Nenhuma resposta correta foi indicada no texto (assumida como alternativa ${correctKey}). Ajuste no preview se necessário.`
      );
    }

    const questionId = `custom-${timestamp}-${idx + 1}`;

    const questionItem: Question = {
      id: questionId,
      numberInSource: qNum,
      text: prompt,
      options: normalizedOptions,
      correctKey,
      explanation: b.explanation || 'Questão adicionada por upload de arquivo.',
      biblicalReference: b.reference || 'Bíblia Sagrada',
      difficulty: b.difficulty || defaultDifficulty,
      theme: b.theme || defaultTheme,
      themeName: b.themeName || defaultThemeName,
      sourceDocument: 'Importado pelo Usuário',
      tags: ['Personalizado', 'Upload'],
    };

    questions.push(questionItem);
  });

  return { questions, errors, warnings };
}

/**
 * Extracts plain text from a PDF file using pdfjs-dist in client-side browser
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // Dynamically import pdfjs-dist to avoid loading large bundle unless needed
  const pdfjsLib = await import('pdfjs-dist');

  // Configure worker
  try {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      // Use unpkg or cdnjs worker matching pdfjs version
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }
  } catch {
    // Worker fallback
  }

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item) => {
        if ('str' in item) {
          return item.str;
        }
        return '';
      })
      .filter((s) => s.length > 0);

    fullText += strings.join(' ') + '\n';
  }

  return fullText;
}

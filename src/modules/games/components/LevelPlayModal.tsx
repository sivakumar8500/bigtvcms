'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Close,
  PlayArrow,
  RestartAlt,
  CheckCircle,
  Cancel,
  Undo,
  Visibility,
  VisibilityOff,
  HelpOutline,
  Check,
  ErrorOutline,
  PriorityHigh,
} from '@mui/icons-material';
import { useLanguageStore, SupportedLanguage } from '@/core/storage/language-store';
import { LevelItem } from '../dto/games.dto';

interface LevelPlayModalProps {
  open: boolean;
  onClose: () => void;
  level: LevelItem | null;
  gameType: string;
  isDark: boolean;
}

// ─────────────────────────────────────────────
// TRANSLATIONS (en, te, hi, ml)
// ─────────────────────────────────────────────
const playTranslations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    startFromOne: 'Start by clicking Checkpoint 1 (①) to begin',
    nextTarget: 'Target: Reach Checkpoint {n}',
    allConnected: 'Puzzle Solved! All checkpoints connected in sequence! 🎉',
    wrongCheckpoint: 'Wrong Checkpoint! You must reach Checkpoint {expected} before {actual}',
    notAdjacent: 'Only adjacent moves (Up, Down, Left, Right) are allowed',
    alreadyVisited: 'This cell is already in the path',
    pathLength: 'Path: {len} cells',
    checkpointsVisited: 'Checkpoints: {visited}/{total}',
    undo: 'Undo',
    reset: 'Reset',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    solutionActive: 'Author Solution Path Shown',
    previewOnly: 'Preview only — progress is not saved',
    closePreview: 'Close Preview',
    levelSolved: 'Puzzle Solved! 🎉',
    boardComplete: 'Board Complete! 🎉',
    howToPlayZip: 'How to Play: Start at ①. Draw an unbroken path through ②, ③... to the final checkpoint without crossing yourself.',
    sudokuSolved: 'Sudoku Solved! 🎉',
    patchPreview: 'Patch puzzle preview — select a piece below, then click a cell to place it.',
    noPreview: 'No interactive preview available for game type: ',
    puzzle: 'Puzzle',
    patchDrag: 'Drag',
    patchToPlace: ' to place · ',
    patchTap: 'Tap',
    patchToRemove: ' patch to remove',
    patchSq: 'Sq',
    patchWide: 'Wide',
    patchTall: 'Tall',
    patchPoly: 'Poly',
    patchHelp: 'How to Play: Drag to form rectangular patches or tap pieces below to place them. Each patch must contain exactly 1 number matching its area. Tap any patch to remove it.',
  },
  te: {
    startFromOne: 'ప్రారంభించడానికి చెక్‌పాయింట్ 1 (①) క్లిక్ చేయండి',
    nextTarget: 'లక్ష్యం: చెక్‌పాయింట్ {n} కు చేరుకోండి',
    allConnected: 'పజిల్ పూర్తయింది! అన్ని చెక్‌పాయింట్లు సరైన క్రమంలో అనుసంధానించబడ్డాయి! 🎉',
    wrongCheckpoint: 'తప్పు చెక్‌పాయింట్! {actual} కంటే ముందు {expected} చేరుకోవాలి',
    notAdjacent: 'పక్కనే ఉన్న గడికి మాత్రమే వెళ్ళాలి (పైకి, కిందకి, ఎడమ, కుడి)',
    alreadyVisited: 'ఈ గడి ఇప్పటికే మార్గంలో ఉపయోగించబడింది',
    pathLength: 'మార్గం: {len} గడులు',
    checkpointsVisited: 'చెక్‌పాయింట్లు: {visited}/{total}',
    undo: 'వెనక్కి (Undo)',
    reset: 'రీసెట్',
    showSolution: 'పరిష్కారం చూపించు',
    hideSolution: 'పరిష్కారం దాచు',
    solutionActive: 'రచయిత పరిష్కార మార్గం చూపబడుతోంది',
    previewOnly: 'ప్రివ్యూ మాత్రమే — పురోగతి సేవ్ చేయబడదు',
    closePreview: 'ప్రివ్యూ మూసివేయి',
    levelSolved: 'స్థాయి పూర్తయింది! 🎉',
    boardComplete: 'బోర్డు పూర్తయింది! 🎉',
    howToPlayZip: 'ఎలా ఆడాలి: ① వద్ద ప్రారంభించండి. ②, ③... చివరి చెక్‌పాయింట్ వరకు ఒకదాని తర్వాత ఒకటి మార్గం గీయండి.',
    sudokuSolved: 'సుడోకు పూర్తయింది! 🎉',
    patchPreview: 'ప్యాచ్ పజిల్ ప్రివ్యూ — క్రింద ఒక ముక్కను ఎంచుకుని, బోర్డులో ఉంచడానికి క్లిక్ చేయండి.',
    noPreview: 'ఈ ఆట రకానికి ఇంటరాక్టివ్ ప్రివ్యూ లేదు: ',
    puzzle: 'పజిల్',
    patchDrag: 'లాగండి (Drag)',
    patchToPlace: ' ఉంచడానికి · ',
    patchTap: 'నొక్కండి (Tap)',
    patchToRemove: ' తీసివేయడానికి',
    patchSq: 'చతురస్రం (Sq)',
    patchWide: 'వెడల్పు (Wide)',
    patchTall: 'పొడవు (Tall)',
    patchPoly: 'పాలీ (Poly)',
    patchHelp: 'ఎలా ఆడాలి: ప్యాచ్‌లను ఉంచడానికి లాగండి లేదా క్రింద ఉన్న ముక్కలను ఎంచుకుని ఉంచండి. ప్రతి ప్యాచ్‌లో దాని వైశాల్యానికి సమానమైన ఒక సంఖ్య ఉండాలి.',
  },
  hi: {
    startFromOne: 'शुरू करने के लिए चेकपॉइंट 1 (①) पर क्लिक करें',
    nextTarget: 'लक्ष्य: चेकपॉइंट {n} पर पहुंचें',
    allConnected: 'पहेली हल हो गई! सभी चेकपॉइंट क्रम में जुड़ गए! 🎉',
    wrongCheckpoint: 'गलत चेकपॉइंट! {actual} से पहले चेकपॉइंट {expected} पर पहुंचना होगा',
    notAdjacent: 'केवल आसन्न सेल पर जा सकते हैं (ऊपर, नीचे, बाएँ, दाएँ)',
    alreadyVisited: 'यह सेल पहले से ही रास्ते में है',
    pathLength: 'रास्ता: {len} सेल',
    checkpointsVisited: 'चेकपॉइंट: {visited}/{total}',
    undo: 'पूर्ववत (Undo)',
    reset: 'रीसेट',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छिपाएं',
    solutionActive: 'समाधान मार्ग दिखाया गया है',
    previewOnly: 'केवल पूर्वावलोकन — प्रगति सहेजी नहीं जाती',
    closePreview: 'पूर्वावलोकन बंद करें',
    levelSolved: 'पहेली हल हुई! 🎉',
    boardComplete: 'बोर्ड पूरा हुआ! 🎉',
    howToPlayZip: 'कैसे खेलें: ① से शुरू करें। ②, ③... और आगे अंतिम चेकपॉइंट तक एक अटूट रेखा खींचें।',
    sudokuSolved: 'सुडोकू हल हुआ! 🎉',
    patchPreview: 'पैच पहेली पूर्वावलोकन — नीचे एक टुकड़ा चुनें, फिर उसे बोर्ड पर रखने के लिए क्लिक करें।',
    noPreview: 'इस गेम प्रकार के लिए कोई पूर्वावलोकन उपलब्ध नहीं है: ',
    puzzle: 'पहेली',
    patchDrag: 'ड्रैग करें',
    patchToPlace: ' रखने के लिए · ',
    patchTap: 'टैप करें',
    patchToRemove: ' हटाने के लिए',
    patchSq: 'वर्ग (Sq)',
    patchWide: 'चौड़ा (Wide)',
    patchTall: 'लंबा (Tall)',
    patchPoly: 'पॉली (Poly)',
    patchHelp: 'कैसे खेलें: पैच रखने के लिए ग्रिड पर ड्रैग करें या नीचे से पीस चुनकर रखें। प्रत्येक पैच में उसके क्षेत्रफल से मेल खाती ठीक 1 संख्या होनी चाहिए।',
  },
  ml: {
    startFromOne: 'ആരംഭിക്കാൻ ചെക്ക്പോയിന്റ് 1 (①) ക്ലിക്ക് ചെയ്യുക',
    nextTarget: 'ലക്ഷ്യം: ചെക്ക്പോയിന്റ് {n}-ൽ എത്തുക',
    allConnected: 'പസിൽ പൂർത്തിയായി! എല്ലാ ചെക്ക്പോയിന്റുകളും ക്രമത്തിൽ ബന്ധിപ്പിച്ചു! 🎉',
    wrongCheckpoint: 'തെറ്റായ ചെക്ക്പോയിന്റ്! {actual}-ന് മുൻപ് ചെക്ക്പോയിന്റ് {expected}-ൽ എത്തണം',
    notAdjacent: 'തൊട്ടടുത്ത സെല്ലിലേക്ക് മാത്രമേ പോകാവൂ (മുകളിലേക്ക്, താഴേക്ക്, ഇടത്, വലത്)',
    alreadyVisited: 'ഈ സെൽ ഇതിനകം പാതയിൽ ഉണ്ട്',
    pathLength: 'പാത: {len} സെല്ലുകൾ',
    checkpointsVisited: 'ചെക്ക്പോയിന്റുകൾ: {visited}/{total}',
    undo: 'പൂർവാവസ്ഥയിലാക്കുക',
    reset: 'പുനഃസജ്ജമാക്കുക',
    showSolution: 'ഉത്തരം കാണിക്കുക',
    hideSolution: 'ഉത്തരം മറയ്ക്കുക',
    solutionActive: 'പരിഹാര പാത കാണിക്കുന്നു',
    previewOnly: 'പ്രിവ്യൂ മാത്രം — പുരോഗതി സേവ് ചെയ്യില്ല',
    closePreview: 'പ്രിവ്യൂ അടയ്ക്കുക',
    levelSolved: 'ലെവൽ പൂർത്തിയായി! 🎉',
    boardComplete: 'ബോർഡ് പൂർത്തിയായി! 🎉',
    howToPlayZip: 'എങ്ങനെ കളിക്കാം: ①-ൽ നിന്ന് തുടങ്ങി ②, ③ വഴി അവസാന ചെക്ക്പോയിന്റ് വരെ പാത വരയ്ക്കുക.',
    sudokuSolved: 'സുഡോകു പൂർത്തിയായി! 🎉',
    patchPreview: 'പാച്ച് പസിൽ പ്രിവ്യൂ — ഒരു കഷണം തിരഞ്ഞെടുത്ത് സെല്ലിൽ ക്ലിക്ക് ചെയ്യുക.',
    noPreview: 'ഈ ഗെയിം തരത്തിന് ഇന്ററാക്ടീവ് പ്രിവ്യൂ ലഭ്യമല്ല: ',
    puzzle: 'പസിൽ',
    patchDrag: 'വലിച്ചിടുക',
    patchToPlace: ' സ്ഥാപിക്കാൻ · ',
    patchTap: 'ടാപ്പ് ചെയ്യുക',
    patchToRemove: ' നീക്കം ചെയ്യാൻ',
    patchSq: 'ചതുരം (Sq)',
    patchWide: 'വീതിയുള്ളത് (Wide)',
    patchTall: 'നീളമുള്ളത് (Tall)',
    patchPoly: 'പോളി (Poly)',
    patchHelp: 'എങ്ങനെ കളിക്കാം: പാച്ചുകൾ സ്ഥാപിക്കാൻ ഡ്രാഗ് ചെയ്യുക അല്ലെങ്കിൽ താഴെയുള്ള പീസുകൾ തിരഞ്ഞെടുക്കുക. ഓരോ പാച്ചിലും അതിന്റെ വിസ്തീർണ്ണവുമായി പൊരുത്തപ്പെടുന്ന കൃത്യം ഒരു സംఖ്യ ഉണ്ടായിരിക്കണം.',
  },
};

// ─────────────────────────────────────────────
// SUDOKU PLAYER (6×6 and 9×9)
// ─────────────────────────────────────────────
const SudokuPlayer: React.FC<{ content: any; isDark: boolean; t: Record<string, string> }> = ({
  content,
  isDark,
  t,
}) => {
  const rows: number = content?.grid?.rows || content?.rows || 9;
  const cols: number = content?.grid?.columns || content?.columns || rows;
  const initialGrid: number[][] = content?.initialGrid || [];
  const solution: number[][] = content?.solution || [];

  const buildEmpty = () =>
    Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => (initialGrid[r]?.[c] ?? 0))
    );

  const [grid, setGrid] = useState<number[][]>(buildEmpty);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(false);

  const reset = useCallback(() => {
    setGrid(buildEmpty());
    setSelected(null);
    setErrors(new Set());
    setSolved(false);
  }, [initialGrid, rows, cols]); // eslint-disable-line

  const isFixed = (r: number, c: number) => (initialGrid[r]?.[c] ?? 0) !== 0;

  const handleInput = (val: number) => {
    if (!selected || solved) return;
    const [r, c] = selected;
    if (isFixed(r, c)) return;
    const next = grid.map((row) => [...row]);
    next[r][c] = val === next[r][c] ? 0 : val;
    setGrid(next);

    const newErrors = new Set<string>();
    for (let ri = 0; ri < rows; ri++) {
      for (let ci = 0; ci < cols; ci++) {
        if (next[ri][ci] !== 0 && solution[ri]?.[ci] && next[ri][ci] !== solution[ri][ci]) {
          newErrors.add(`${ri}-${ci}`);
        }
      }
    }
    setErrors(newErrors);

    const complete = next.every((row, ri) =>
      row.every((v, ci) => v !== 0 && (solution.length === 0 || v === solution[ri]?.[ci]))
    );
    if (complete) setSolved(true);
  };

  const boxSize = rows === 6 ? [2, 3] : rows === 9 ? [3, 3] : [Math.sqrt(rows), Math.sqrt(cols)];
  const cellSize = rows <= 6 ? 56 : 44;
  const fontSize = rows <= 6 ? '1.3rem' : '1.1rem';

  const getBorderStyle = (r: number, c: number) => {
    const borderW = '2px solid';
    const thickColor = isDark ? 'rgba(166,226,245,0.6)' : '#1c1445';
    const thinColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)';
    return {
      borderRight: (c + 1) % boxSize[1] === 0 && c !== cols - 1 ? `${borderW} ${thickColor}` : `1px solid ${thinColor}`,
      borderBottom: (r + 1) % boxSize[0] === 0 && r !== rows - 1 ? `${borderW} ${thickColor}` : `1px solid ${thinColor}`,
    };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {solved && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4caf50' }}>
          <CheckCircle />
          <Typography fontWeight={700}>{t.sudokuSolved}</Typography>
        </Box>
      )}

      {/* Grid */}
      <Box
        sx={{
          border: isDark ? '2px solid rgba(166,226,245,0.6)' : '2px solid #1c1445',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        {Array.from({ length: rows }, (_, r) => (
          <Box key={r} sx={{ display: 'flex' }}>
            {Array.from({ length: cols }, (_, c) => {
              const val = grid[r]?.[c] ?? 0;
              const fixed = isFixed(r, c);
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const isError = errors.has(`${r}-${c}`);
              const sameRow = selected && selected[0] === r;
              const sameCol = selected && selected[1] === c;
              const highlight = !isSelected && (sameRow || sameCol);

              return (
                <Box
                  key={c}
                  onClick={() => !fixed && setSelected([r, c])}
                  sx={{
                    width: cellSize,
                    height: cellSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize,
                    fontWeight: fixed ? 700 : 500,
                    fontFamily: 'monospace',
                    cursor: fixed ? 'default' : 'pointer',
                    userSelect: 'none',
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(166,226,245,0.25)'
                        : 'rgba(37,99,235,0.15)'
                      : isError
                        ? isDark
                          ? 'rgba(244,67,54,0.25)'
                          : '#ffebee'
                        : highlight
                          ? isDark
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(37,99,235,0.05)'
                          : 'transparent',
                    color: isError
                      ? '#f44336'
                      : fixed
                        ? isDark
                          ? '#ffffff'
                          : '#1c1445'
                        : isDark
                          ? '#a6e2f5'
                          : '#2563eb',
                    transition: 'background 0.15s',
                    ...getBorderStyle(r, c),
                  }}
                >
                  {val !== 0 ? val : ''}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Number Pad */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Array.from({ length: cols }, (_, i) => i + 1).map((n) => (
          <Button
            key={n}
            variant="outlined"
            onClick={() => handleInput(n)}
            disabled={!selected || solved}
            sx={{
              minWidth: 44,
              height: 44,
              fontWeight: 700,
              fontSize: '1rem',
              fontFamily: 'monospace',
              borderRadius: '8px',
              borderColor: isDark ? 'rgba(166,226,245,0.4)' : 'rgba(37,99,235,0.4)',
              color: isDark ? '#a6e2f5' : '#2563eb',
            }}
          >
            {n}
          </Button>
        ))}
        <Button
          variant="outlined"
          onClick={() => handleInput(0)}
          disabled={!selected || solved}
          sx={{
            minWidth: 44,
            height: 44,
            fontWeight: 700,
            borderRadius: '8px',
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: isDark ? '#d0caeb' : '#5c548a',
          }}
        >
          ✕
        </Button>
      </Box>

      <Button
        startIcon={<RestartAlt />}
        onClick={reset}
        size="small"
        sx={{ textTransform: 'none', color: isDark ? '#d0caeb' : '#5c548a' }}
      >
        {t.reset}
      </Button>
    </Box>
  );
};

// ─────────────────────────────────────────────
// PATCH PLAYER (Interactive Rectangle/Patch Shikaku matching user screenshot)
// ─────────────────────────────────────────────
// PATCH PLAYER (Interactive Rectangle & Polyomino Shikaku)
// ─────────────────────────────────────────────
interface PatchClue {
  r: number;
  c: number;
  value: number;
  shape: 'sq' | 'wide' | 'tall' | 'poly';
}

interface PlacedPatch {
  id: string;
  cells: [number, number][];
  rMin: number;
  rMax: number;
  cMin: number;
  cMax: number;
  color: string;
  pieceId?: string;
}

const ClueIcon: React.FC<{ shape: 'sq' | 'wide' | 'tall' | 'poly'; isDark: boolean }> = ({ shape, isDark }) => {
  const color = isDark ? '#94a3b8' : '#78716c';
  if (shape === 'sq') {
    return <Box sx={{ width: 8, height: 8, bgcolor: color, borderRadius: '1.5px', mb: 0.3 }} />;
  }
  if (shape === 'wide') {
    return <Box sx={{ width: 14, height: 5, bgcolor: color, borderRadius: '1.5px', mb: 0.3 }} />;
  }
  if (shape === 'tall') {
    return <Box sx={{ width: 5, height: 14, bgcolor: color, borderRadius: '1.5px', mb: 0.3 }} />;
  }
  return <Box sx={{ width: 10, height: 10, border: `2px dashed ${color}`, borderRadius: '2px', mb: 0.3 }} />;
};

// Normalize any piece format to array of [row, col] coordinates
const normalizePieceCells = (piece: any): [number, number][] => {
  if (!piece) return [];
  const rawCells = Array.isArray(piece)
    ? piece
    : piece.cells || piece.shape || piece.coordinates || piece.coords || [];

  if (!Array.isArray(rawCells)) return [];

  if (
    rawCells.length > 0 &&
    Array.isArray(rawCells[0]) &&
    typeof rawCells[0][0] === 'number' &&
    rawCells[0].length > 2
  ) {
    const coords: [number, number][] = [];
    for (let r = 0; r < rawCells.length; r++) {
      for (let c = 0; c < rawCells[r].length; c++) {
        if (rawCells[r][c] > 0) coords.push([r, c]);
      }
    }
    return coords;
  }

  return rawCells
    .map((cell: any) => {
      if (Array.isArray(cell)) {
        return [Number(cell[0]) || 0, Number(cell[1]) || 0] as [number, number];
      }
      if (typeof cell === 'object' && cell !== null) {
        const r = cell.row ?? cell.r ?? cell.y ?? 0;
        const c = cell.col ?? cell.c ?? cell.x ?? 0;
        return [Number(r) || 0, Number(c) || 0] as [number, number];
      }
      return [0, 0] as [number, number];
    })
    .filter(([r, c]) => !isNaN(r) && !isNaN(c));
};

// Exact vibrant colors matching the user screenshot
const PATCH_COLORS = [
  '#489d6a', // Green (3×3)
  '#d65b3c', // Red-orange (3×3)
  '#3373dc', // Blue (1×2)
  '#9353b3', // Purple (2×2)
  '#e07a22', // Orange (3×1)
  '#12bda0', // Teal (2×2)
  '#bf9334', // Gold (3×1)
  '#db3888', // Pink (1×2)
  '#6366f1', // Indigo
  '#0ea5e9', // Sky Blue
];

const PatchPlayer: React.FC<{
  content: any;
  isDark: boolean;
  t: Record<string, string>;
  level?: LevelItem | null;
}> = ({ content, isDark, t, level }) => {
  const rows: number = content?.grid?.rows || content?.rows || 6;
  const cols: number = content?.grid?.columns || content?.columns || 6;

  // Extract clues from clues array or solution
  const clues: PatchClue[] = useMemo(() => {
    if (Array.isArray(content?.clues) && content.clues.length > 0) {
      return content.clues.map((clue: any) => ({
        r: clue.row ?? clue.r ?? 0,
        c: clue.col ?? clue.c ?? 0,
        value: clue.value ?? clue.area ?? clue.size ?? 1,
        shape: (clue.shape ?? 'sq').toLowerCase() as 'sq' | 'wide' | 'tall' | 'poly',
      }));
    }

    if (Array.isArray(content?.solution) && content.solution.length > 0) {
      const list: PatchClue[] = [];
      content.solution.forEach((sol: any) => {
        const rawCells = sol.cells || [];
        const cells = normalizePieceCells(rawCells);
        if (cells.length === 0) return;
        const rValues = cells.map(([r]) => r);
        const cValues = cells.map(([, c]) => c);
        const minR = Math.min(...rValues);
        const maxR = Math.max(...rValues);
        const minC = Math.min(...cValues);
        const maxC = Math.max(...cValues);
        const w = maxC - minC + 1;
        const h = maxR - minR + 1;
        const isRect = cells.length === w * h;
        const shape: 'sq' | 'wide' | 'tall' | 'poly' = !isRect
          ? 'poly'
          : w === h
            ? 'sq'
            : w > h
              ? 'wide'
              : 'tall';

        const anchorR = sol.anchor ? (sol.anchor.row ?? sol.anchor.r ?? cells[0][0]) : cells[0][0];
        const anchorC = sol.anchor ? (sol.anchor.col ?? sol.anchor.c ?? cells[0][1]) : cells[0][1];

        list.push({
          r: anchorR,
          c: anchorC,
          value: cells.length,
          shape,
        });
      });
      return list;
    }

    // Default sample clues matching the 5x5 Level 1 specification
    if (rows === 5 && cols === 5) {
      return [
        { r: 0, c: 0, value: 2, shape: 'wide' },
        { r: 0, c: 2, value: 3, shape: 'wide' },
        { r: 1, c: 0, value: 2, shape: 'wide' },
        { r: 1, c: 2, value: 3, shape: 'wide' },
        { r: 2, c: 0, value: 3, shape: 'wide' },
        { r: 3, c: 0, value: 2, shape: 'tall' },
        { r: 3, c: 1, value: 2, shape: 'tall' },
        { r: 3, c: 2, value: 2, shape: 'tall' },
        { r: 2, c: 3, value: 3, shape: 'tall' },
        { r: 2, c: 4, value: 3, shape: 'tall' },
      ];
    }

    // Default sample clues matching the user screenshot (6x6)
    if (rows === 6 && cols === 6) {
      return [
        { r: 0, c: 4, value: 9, shape: 'sq' },
        { r: 1, c: 2, value: 9, shape: 'sq' },
        { r: 3, c: 0, value: 2, shape: 'tall' },
        { r: 3, c: 4, value: 3, shape: 'wide' },
        { r: 4, c: 2, value: 4, shape: 'sq' },
        { r: 4, c: 4, value: 4, shape: 'sq' },
        { r: 4, c: 5, value: 2, shape: 'tall' },
        { r: 5, c: 1, value: 3, shape: 'wide' },
      ];
    }
    return [];
  }, [content, rows, cols]);

  // Solution patches matching the user screenshot
  const solutionPatches: PlacedPatch[] = useMemo(() => {
    if (Array.isArray(content?.solution) && content.solution.length > 0) {
      return content.solution.map((sol: any, idx: number) => {
        const cells = normalizePieceCells(sol.cells || []);
        const rValues = cells.map(([r]) => r);
        const cValues = cells.map(([, c]) => c);
        const piece = Array.isArray(content?.pieces)
          ? content.pieces.find((p: any) => p.id === sol.pieceId)
          : null;
        return {
          id: `sol-${idx}`,
          cells,
          rMin: rValues.length > 0 ? Math.min(...rValues) : 0,
          rMax: rValues.length > 0 ? Math.max(...rValues) : 0,
          cMin: cValues.length > 0 ? Math.min(...cValues) : 0,
          cMax: cValues.length > 0 ? Math.max(...cValues) : 0,
          color: piece?.color || PATCH_COLORS[idx % PATCH_COLORS.length],
          pieceId: sol.pieceId,
        };
      });
    }

    // Default 5x5 Level 1 solution matching Section 8
    if (rows === 5 && cols === 5) {
      return [
        {
          id: 'sol-5x5-0',
          rMin: 0, rMax: 0, cMin: 0, cMax: 1,
          cells: [[0, 0], [0, 1]],
          color: '#489d6a',
          pieceId: 'p_1',
        },
        {
          id: 'sol-5x5-1',
          rMin: 0, rMax: 0, cMin: 2, cMax: 4,
          cells: [[0, 2], [0, 3], [0, 4]],
          color: '#d65b3c',
          pieceId: 'p_2',
        },
        {
          id: 'sol-5x5-2',
          rMin: 1, rMax: 1, cMin: 0, cMax: 1,
          cells: [[1, 0], [1, 1]],
          color: '#3373dc',
          pieceId: 'p_3',
        },
        {
          id: 'sol-5x5-3',
          rMin: 1, rMax: 1, cMin: 2, cMax: 4,
          cells: [[1, 2], [1, 3], [1, 4]],
          color: '#9353b3',
          pieceId: 'p_4',
        },
        {
          id: 'sol-5x5-4',
          rMin: 2, rMax: 2, cMin: 0, cMax: 2,
          cells: [[2, 0], [2, 1], [2, 2]],
          color: '#e07a22',
          pieceId: 'p_5',
        },
        {
          id: 'sol-5x5-5',
          rMin: 3, rMax: 4, cMin: 0, cMax: 0,
          cells: [[3, 0], [4, 0]],
          color: '#12bda0',
          pieceId: 'p_6',
        },
        {
          id: 'sol-5x5-6',
          rMin: 3, rMax: 4, cMin: 1, cMax: 1,
          cells: [[3, 1], [4, 1]],
          color: '#bf9334',
          pieceId: 'p_7',
        },
        {
          id: 'sol-5x5-7',
          rMin: 3, rMax: 4, cMin: 2, cMax: 2,
          cells: [[3, 2], [4, 2]],
          color: '#db3888',
          pieceId: 'p_8',
        },
        {
          id: 'sol-5x5-8',
          rMin: 2, rMax: 4, cMin: 3, cMax: 3,
          cells: [[2, 3], [3, 3], [4, 3]],
          color: '#6366f1',
          pieceId: 'p_9',
        },
        {
          id: 'sol-5x5-9',
          rMin: 2, rMax: 4, cMin: 4, cMax: 4,
          cells: [[2, 4], [3, 4], [4, 4]],
          color: '#0ea5e9',
          pieceId: 'p_10',
        },
      ];
    }

    // Exact 8-patch solution layout from the user screenshot (6x6)
    if (rows === 6 && cols === 6) {
      return [
        {
          id: 'sol-0',
          rMin: 0,
          rMax: 2,
          cMin: 0,
          cMax: 2,
          cells: [
            [0, 0], [0, 1], [0, 2],
            [1, 0], [1, 1], [1, 2],
            [2, 0], [2, 1], [2, 2],
          ],
          color: '#489d6a', // Green 3×3
        },
        {
          id: 'sol-1',
          rMin: 0,
          rMax: 2,
          cMin: 3,
          cMax: 5,
          cells: [
            [0, 3], [0, 4], [0, 5],
            [1, 3], [1, 4], [1, 5],
            [2, 3], [2, 4], [2, 5],
          ],
          color: '#d65b3c', // Red-orange 3×3
        },
        {
          id: 'sol-2',
          rMin: 3,
          rMax: 4,
          cMin: 0,
          cMax: 0,
          cells: [[3, 0], [4, 0]],
          color: '#3373dc', // Blue 1×2
        },
        {
          id: 'sol-3',
          rMin: 3,
          rMax: 4,
          cMin: 1,
          cMax: 2,
          cells: [
            [3, 1], [3, 2],
            [4, 1], [4, 2],
          ],
          color: '#9353b3', // Purple 2×2
        },
        {
          id: 'sol-4',
          rMin: 3,
          rMax: 3,
          cMin: 3,
          cMax: 5,
          cells: [[3, 3], [3, 4], [3, 5]],
          color: '#e07a22', // Orange 3×1
        },
        {
          id: 'sol-5',
          rMin: 5,
          rMax: 5,
          cMin: 0,
          cMax: 2,
          cells: [[5, 0], [5, 1], [5, 2]],
          color: '#bf9334', // Gold 3×1
        },
        {
          id: 'sol-6',
          rMin: 4,
          rMax: 5,
          cMin: 3,
          cMax: 4,
          cells: [
            [4, 3], [4, 4],
            [5, 3], [5, 4],
          ],
          color: '#12bda0', // Teal 2×2
        },
        {
          id: 'sol-7',
          rMin: 4,
          rMax: 5,
          cMin: 5,
          cMax: 5,
          cells: [[4, 5], [5, 5]],
          color: '#db3888', // Pink 1×2
        },
      ];
    }
    return [];
  }, [content, rows, cols]);

  const [placedPatches, setPlacedPatches] = useState<PlacedPatch[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  const [dragCurrent, setDragCurrent] = useState<[number, number] | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [solved, setSolved] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Timer
  useEffect(() => {
    if (solved) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [solved]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPatchAt = (r: number, c: number) =>
    placedPatches.find((p) => p.cells.some(([pr, pc]) => pr === r && pc === c));

  const handleRemovePatch = (id: string) => {
    setPlacedPatches((prev) => prev.filter((p) => p.id !== id));
    setSolved(false);
  };

  const handleCellMouseDown = (r: number, c: number) => {
    if (solved) return;

    // If a piece from the pieces tray is selected, place it anchored at (r, c)
    if (selectedPieceId && Array.isArray(content?.pieces)) {
      const piece = content.pieces.find((p: any) => p.id === selectedPieceId);
      if (piece) {
        const rawCells = normalizePieceCells(piece.cells || []);
        if (rawCells.length > 0) {
          const minR = Math.min(...rawCells.map(([pr]) => pr));
          const minC = Math.min(...rawCells.map(([, pc]) => pc));
          const placedCells = rawCells.map(
            ([pr, pc]) => [r + (pr - minR), c + (pc - minC)] as [number, number]
          );
          const inBounds = placedCells.every(
            ([pr, pc]) => pr >= 0 && pr < rows && pc >= 0 && pc < cols
          );
          if (inBounds) {
            const placedSet = new Set(placedCells.map(([pr, pc]) => `${pr}-${pc}`));
            const kept = placedPatches.filter(
              (p) => !p.cells.some(([pr, pc]) => placedSet.has(`${pr}-${pc}`))
            );
            const rVals = placedCells.map(([pr]) => pr);
            const cVals = placedCells.map(([, pc]) => pc);
            const newPatch: PlacedPatch = {
              id: `piece-${Date.now()}`,
              cells: placedCells,
              rMin: Math.min(...rVals),
              rMax: Math.max(...rVals),
              cMin: Math.min(...cVals),
              cMax: Math.max(...cVals),
              color: piece.color || PATCH_COLORS[kept.length % PATCH_COLORS.length],
              pieceId: piece.id,
            };
            const nextPatches = [...kept, newPatch];
            setPlacedPatches(nextPatches);
            setSelectedPieceId(null);
            const covered = new Set<string>();
            nextPatches.forEach((p) => p.cells.forEach(([pr, pc]) => covered.add(`${pr}-${pc}`)));
            if (covered.size === rows * cols) {
              setSolved(true);
            }
            return;
          }
        }
      }
    }

    const existing = getPatchAt(r, c);
    if (existing) {
      // Tap patch to remove
      handleRemovePatch(existing.id);
      return;
    }
    // Start drag
    setDragStart([r, c]);
    setDragCurrent([r, c]);
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (!dragStart) return;
    setDragCurrent([r, c]);
  };

  const handleMouseUp = () => {
    if (!dragStart || !dragCurrent) {
      setDragStart(null);
      setDragCurrent(null);
      return;
    }

    const rMin = Math.min(dragStart[0], dragCurrent[0]);
    const rMax = Math.max(dragStart[0], dragCurrent[0]);
    const cMin = Math.min(dragStart[1], dragCurrent[1]);
    const cMax = Math.max(dragStart[1], dragCurrent[1]);

    const cells: [number, number][] = [];
    for (let r = rMin; r <= rMax; r++) {
      for (let c = cMin; c <= cMax; c++) {
        cells.push([r, c]);
      }
    }

    const newCellsSet = new Set(cells.map(([r, c]) => `${r}-${c}`));
    const kept = placedPatches.filter(
      (p) => !p.cells.some(([r, c]) => newCellsSet.has(`${r}-${c}`))
    );

    const newPatch: PlacedPatch = {
      id: String(Date.now()),
      cells,
      rMin,
      rMax,
      cMin,
      cMax,
      color: PATCH_COLORS[kept.length % PATCH_COLORS.length],
    };

    const nextPatches = [...kept, newPatch];
    setPlacedPatches(nextPatches);
    setDragStart(null);
    setDragCurrent(null);

    // Check if solved
    const coveredCells = new Set<string>();
    nextPatches.forEach((p) => {
      p.cells.forEach(([r, c]) => coveredCells.add(`${r}-${c}`));
    });

    if (coveredCells.size === rows * cols) {
      setSolved(true);
    }
  };

  const handleUndo = () => {
    setPlacedPatches((prev) => prev.slice(0, -1));
    setSolved(false);
  };

  const handleReset = () => {
    setPlacedPatches([]);
    setSelectedPieceId(null);
    setDragStart(null);
    setDragCurrent(null);
    setSeconds(0);
    setSolved(false);
  };

  const handleHint = () => {
    if (solutionPatches.length > 0) {
      setPlacedPatches(solutionPatches);
      setSolved(true);
    }
  };

  const cellSize = Math.min(64, Math.floor(340 / Math.max(rows, cols)));
  const boardWidth = cols * cellSize;
  const boardHeight = rows * cellSize;
  const outerWidth = boardWidth + 6; // Accounts for 3px board borders

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 1.5 }}
      onMouseUp={handleMouseUp}
    >
      {/* Title & Difficulty Pill Badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: isDark ? '#ffffff' : '#292524' }}>
          {t.puzzle} #{level?.levelNumber || 1}
        </Typography>
        <Chip
          label={(level?.difficulty || 'easy').toUpperCase()}
          size="small"
          sx={{
            bgcolor: '#15803d',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.7rem',
            height: 22,
            borderRadius: '6px',
          }}
        />
      </Box>

      {/* Header Action Controls & Legend Bar - Aligned to exact board outer width */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: outerWidth,
          gap: 1,
        }}
      >
        {/* Buttons on Left: Undo, Hint, Reset, Help */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Tooltip title={t.undo}>
            <span>
              <IconButton
                size="small"
                onClick={handleUndo}
                disabled={placedPatches.length === 0}
                sx={{
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #d6cfc5',
                  borderRadius: '8px',
                  p: 0.7,
                  color: isDark ? '#fff' : '#44403c',
                }}
              >
                <Undo sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Hint / Solution">
            <IconButton
              size="small"
              onClick={handleHint}
              sx={{
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #d6cfc5',
                borderRadius: '8px',
                p: 0.7,
                color: isDark ? '#fff' : '#44403c',
              }}
            >
              <PriorityHigh sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t.reset}>
            <IconButton
              size="small"
              onClick={handleReset}
              sx={{
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #d6cfc5',
                borderRadius: '8px',
                p: 0.7,
                color: isDark ? '#fff' : '#44403c',
              }}
            >
              <RestartAlt sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help">
            <IconButton
              size="small"
              onClick={() => setShowHelp((prev) => !prev)}
              sx={{
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #d6cfc5',
                borderRadius: '8px',
                p: 0.7,
                color: isDark ? '#fff' : '#44403c',
              }}
            >
              <HelpOutline sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Legend & Timer on Right */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: '0.82rem',
            color: isDark ? '#cbd5e1' : '#57534e',
            fontWeight: 600,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, bgcolor: isDark ? '#94a3b8' : '#78716c', borderRadius: '1.5px' }} />
            <span>{t.patchSq}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 14, height: 5, bgcolor: isDark ? '#94a3b8' : '#78716c', borderRadius: '1.5px' }} />
            <span>{t.patchWide}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 5, height: 14, bgcolor: isDark ? '#94a3b8' : '#78716c', borderRadius: '1.5px' }} />
            <span>{t.patchTall}</span>
          </Box>
          <Box
            sx={{
              bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#ede7dc',
              px: 1.2,
              py: 0.3,
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isDark ? '#fff' : '#292524',
              ml: 0.5,
            }}
          >
            {formatTime(seconds)}
          </Box>
        </Box>
      </Box>

      {/* Help Banner if toggled */}
      {showHelp && (
        <Alert
          severity="info"
          onClose={() => setShowHelp(false)}
          sx={{ width: '100%', maxWidth: outerWidth, borderRadius: '10px', fontSize: '0.85rem' }}
        >
          {t.patchHelp}
        </Alert>
      )}

      {/* Drag Instruction Banner - Aligned to exact board outer width */}
      <Box
        sx={{
          bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#ede7dc',
          py: 0.8,
          px: 2,
          borderRadius: '10px',
          width: '100%',
          maxWidth: outerWidth,
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#d0caeb' : '#6b5e52' }}>
          <span style={{ color: '#c2410c', fontWeight: 700 }}>{t.patchDrag}</span>
          {t.patchToPlace}
          <span style={{ color: '#c2410c', fontWeight: 700 }}>{t.patchTap}</span>
          {t.patchToRemove}
        </Typography>
      </Box>

      {/* Solved celebration - Aligned to board outer width */}
      {solved && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: '#16a34a',
            width: '100%',
            maxWidth: outerWidth,
          }}
        >
          <CheckCircle sx={{ fontSize: '1.3rem' }} />
          <Typography fontWeight={700} sx={{ fontSize: '1rem' }}>
            {t.boardComplete}
          </Typography>
        </Box>
      )}

      {/* Shikaku / Patch Board Grid Container */}
      <Box
        onMouseLeave={handleMouseUp}
        sx={{
          position: 'relative',
          width: boardWidth,
          height: boardHeight,
          boxSizing: 'content-box',
          border: isDark ? '3px solid #5a4e40' : '3px solid #332d29',
          borderRadius: '16px',
          bgcolor: isDark ? '#140f2b' : '#221c19',
          overflow: 'hidden',
          userSelect: 'none',
          boxShadow: isDark
            ? '0 10px 30px rgba(0,0,0,0.5)'
            : '0 8px 24px rgba(51,45,41,0.14)',
        }}
      >
        {/* Underlay Grid Cells & Clues */}
        {Array.from({ length: rows }, (_, r) => (
          <Box key={r} sx={{ display: 'flex', width: boardWidth, height: cellSize }}>
            {Array.from({ length: cols }, (_, c) => {
              const clue = clues.find((item) => item.r === r && item.c === c);

              return (
                <Box
                  key={c}
                  onMouseDown={() => handleCellMouseDown(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  sx={{
                    width: cellSize,
                    height: cellSize,
                    borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.12)',
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'crosshair',
                    boxSizing: 'border-box',
                    position: 'relative',
                  }}
                >
                  {clue && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <ClueIcon shape={clue.shape} isDark={isDark} />
                      <Typography
                        sx={{
                          fontSize: cellSize > 48 ? '1.05rem' : '0.85rem',
                          fontWeight: 800,
                          lineHeight: 1,
                          color: '#ffffff',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      >
                        {clue.value}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}

        {/* Overlaid Placed Patches with Centered Dimension Label (w×h) */}
        {placedPatches.map((patch) => {
          const w = patch.cMax - patch.cMin + 1;
          const h = patch.rMax - patch.rMin + 1;
          const gap = 3;
          const left = patch.cMin * cellSize + gap / 2;
          const top = patch.rMin * cellSize + gap / 2;
          const width = w * cellSize - gap;
          const height = h * cellSize - gap;

          return (
            <Box
              key={patch.id}
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePatch(patch.id);
              }}
              sx={{
                position: 'absolute',
                top,
                left,
                width,
                height,
                boxSizing: 'border-box',
                bgcolor: patch.color,
                borderRadius: '8px',
                border: '1.5px solid rgba(255,255,255,0.42)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'transform 0.08s ease',
                '&:hover': {
                  filter: 'brightness(1.06)',
                },
              }}
            >
              <Typography
                sx={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: Math.min(24, Math.max(14, cellSize * 0.38)),
                  userSelect: 'none',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.35)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {w}×{h}
              </Typography>
            </Box>
          );
        })}

        {/* Live Dragging Rectangle Preview with Dimension Label */}
        {dragStart && dragCurrent && (() => {
          const rMin = Math.min(dragStart[0], dragCurrent[0]);
          const rMax = Math.max(dragStart[0], dragCurrent[0]);
          const cMin = Math.min(dragStart[1], dragCurrent[1]);
          const cMax = Math.max(dragStart[1], dragCurrent[1]);
          const gap = 3;
          const dragW = cMax - cMin + 1;
          const dragH = rMax - rMin + 1;
          return (
            <Box
              sx={{
                position: 'absolute',
                top: rMin * cellSize + gap / 2,
                left: cMin * cellSize + gap / 2,
                width: dragW * cellSize - gap,
                height: dragH * cellSize - gap,
                boxSizing: 'border-box',
                bgcolor: 'rgba(214, 91, 60, 0.72)',
                borderRadius: '8px',
                border: '2px dashed #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            >
              <Typography
                sx={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: Math.min(24, Math.max(14, cellSize * 0.38)),
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.35)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {dragW}×{dragH}
              </Typography>
            </Box>
          );
        })()}
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────
// ZIP PLAYER (Interactive with Real-time Validation, SVG pipes & Solution Preview)
// ─────────────────────────────────────────────
const ZipPlayer: React.FC<{ content: any; isDark: boolean; t: Record<string, string> }> = ({
  content,
  isDark,
  t,
}) => {
  const rows: number = content?.grid?.rows || content?.rows || 5;
  const cols: number = content?.grid?.columns || content?.columns || 5;

  // Parse checkpoints
  const parsedCheckpoints: { order: number; r: number; c: number }[] = useMemo(() => {
    const raw = content?.checkpoints || content?.dots || [];
    if (!Array.isArray(raw)) return [];
    return raw
      .map((cp: any, idx: number) => {
        const r = cp.row ?? cp.r ?? (Array.isArray(cp) ? cp[0] : cp.y ?? 0);
        const c = cp.col ?? cp.c ?? (Array.isArray(cp) ? cp[1] : cp.x ?? 0);
        const order = cp.order ?? cp.index ?? cp.number ?? cp.value ?? idx + 1;
        return { order, r, c };
      })
      .sort((a, b) => a.order - b.order);
  }, [content]);

  // Checkpoint coordinate lookup
  const checkpointMap = useMemo(() => {
    const map = new Map<string, number>();
    parsedCheckpoints.forEach((cp) => {
      map.set(`${cp.r}-${cp.c}`, cp.order);
    });
    return map;
  }, [parsedCheckpoints]);

  // Parse solution path if available
  const solutionPath: [number, number][] = useMemo(() => {
    const raw = content?.solution || content?.solutionPath || content?.path;
    if (!raw || !Array.isArray(raw) || raw.length === 0) return [];
    if (Array.isArray(raw[0]) && typeof raw[0][0] === 'number') {
      if (raw.length === rows && Array.isArray(raw[0]) && raw[0].length === cols) {
        const flat: { r: number; c: number; order: number }[] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const v = raw[r][c];
            if (typeof v === 'number' && v > 0) flat.push({ r, c, order: v });
          }
        }
        flat.sort((a, b) => a.order - b.order);
        return flat.map((item) => [item.r, item.c]);
      }
      return raw as [number, number][];
    }
    if (typeof raw[0] === 'object' && raw[0] !== null) {
      return raw.map((pt: any) => [
        pt.row ?? pt.r ?? pt.y ?? 0,
        pt.col ?? pt.c ?? pt.x ?? 0,
      ]);
    }
    return [];
  }, [content, rows, cols]);

  const [path, setPath] = useState<[number, number][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const cellSize = Math.min(60, Math.floor(360 / Math.max(rows, cols)));

  // List of checkpoints visited in the current path in chronological order
  const visitedCheckpointOrders = useMemo(() => {
    const list: number[] = [];
    path.forEach(([r, c]) => {
      const order = checkpointMap.get(`${r}-${c}`);
      if (order !== undefined) list.push(order);
    });
    return list;
  }, [path, checkpointMap]);

  // Next expected checkpoint to reach
  const nextExpectedCheckpoint = useMemo(() => {
    if (parsedCheckpoints.length === 0) return null;
    return visitedCheckpointOrders.length + 1;
  }, [visitedCheckpointOrders, parsedCheckpoints]);

  const reset = () => {
    setPath([]);
    setDrawing(false);
    setSolved(false);
    setWarningMessage(null);
  };

  const handleUndo = () => {
    if (path.length <= 1) {
      reset();
      return;
    }
    const newPath = path.slice(0, -1);
    setPath(newPath);
    setSolved(false);
    setWarningMessage(null);
  };

  const isInPath = (r: number, c: number) =>
    path.some(([pr, pc]) => pr === r && pc === c);

  // Extend or backtrack path
  const tryExtendPath = (r: number, c: number) => {
    if (solved) return;

    // Check if empty path -> MUST start at Checkpoint 1 (or any cell if no checkpoints)
    if (path.length === 0) {
      const cpOrder = checkpointMap.get(`${r}-${c}`);
      if (parsedCheckpoints.length > 0 && cpOrder !== 1) {
        setWarningMessage(t.startFromOne);
        return;
      }
      setPath([[r, c]]);
      setWarningMessage(null);
      return;
    }

    const [lastR, lastC] = path[path.length - 1];

    // Backtrack if clicking/dragging into immediate predecessor
    if (path.length > 1) {
      const [prevR, prevC] = path[path.length - 2];
      if (r === prevR && c === prevC) {
        setPath(path.slice(0, -1));
        setSolved(false);
        setWarningMessage(null);
        return;
      }
    }

    // Prevent visiting cells already in path
    if (isInPath(r, c)) {
      setWarningMessage(t.alreadyVisited);
      return;
    }

    // Must be adjacent
    const isAdjacent = Math.abs(lastR - r) + Math.abs(lastC - c) === 1;
    if (!isAdjacent) {
      setWarningMessage(t.notAdjacent);
      return;
    }

    // Validate checkpoint order
    const cpOrder = checkpointMap.get(`${r}-${c}`);
    if (cpOrder !== undefined) {
      const expected = (nextExpectedCheckpoint ?? 1);
      if (cpOrder !== expected) {
        setWarningMessage(
          t.wrongCheckpoint
            .replace('{expected}', String(expected))
            .replace('{actual}', String(cpOrder))
        );
        return;
      }
    }

    const nextPath: [number, number][] = [...path, [r, c]];
    setPath(nextPath);
    setWarningMessage(null);

    // Check if complete
    if (parsedCheckpoints.length > 0) {
      const totalCp = parsedCheckpoints.length;
      const cpCountAfter = cpOrder !== undefined
        ? visitedCheckpointOrders.length + 1
        : visitedCheckpointOrders.length;
      if (cpCountAfter === totalCp) {
        setSolved(true);
      }
    }
  };

  const handleCellMouseDown = (r: number, c: number) => {
    setDrawing(true);
    tryExtendPath(r, c);
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (!drawing) return;
    tryExtendPath(r, c);
  };

  const handleMouseUp = () => setDrawing(false);

  // SVG polyline coordinates calculation
  const pathPoints = useMemo(() => {
    return path
      .map((pt) => {
        const r = Array.isArray(pt) ? pt[0] : (pt as any)?.r ?? (pt as any)?.row ?? 0;
        const c = Array.isArray(pt) ? pt[1] : (pt as any)?.c ?? (pt as any)?.col ?? 0;
        return `${c * cellSize + cellSize / 2},${r * cellSize + cellSize / 2}`;
      })
      .join(' ');
  }, [path, cellSize]);

  const solutionPoints = useMemo(() => {
    return solutionPath
      .map((pt) => {
        const r = Array.isArray(pt) ? pt[0] : (pt as any)?.r ?? (pt as any)?.row ?? 0;
        const c = Array.isArray(pt) ? pt[1] : (pt as any)?.c ?? (pt as any)?.col ?? 0;
        return `${c * cellSize + cellSize / 2},${r * cellSize + cellSize / 2}`;
      })
      .join(' ');
  }, [solutionPath, cellSize]);

  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}
      onMouseUp={handleMouseUp}
    >
      {/* Rules banner */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.8,
          borderRadius: '10px',
          backgroundColor: isDark ? 'rgba(166,226,245,0.08)' : 'rgba(37,99,235,0.06)',
          border: isDark ? '1px solid rgba(166,226,245,0.2)' : '1px solid rgba(37,99,235,0.15)',
          maxWidth: 480,
          textAlign: 'center',
        }}
      >
        <HelpOutline sx={{ fontSize: '1.1rem', color: isDark ? '#a6e2f5' : '#2563eb' }} />
        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#334155' }}>
          {t.howToPlayZip}
        </Typography>
      </Box>

      {/* Checkpoints Progress Strip */}
      {parsedCheckpoints.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {parsedCheckpoints.map((cp) => {
            const isVisited = visitedCheckpointOrders.includes(cp.order);
            const isCurrentTarget = nextExpectedCheckpoint === cp.order && !solved;
            return (
              <Chip
                key={cp.order}
                icon={isVisited ? <Check sx={{ fontSize: '0.9rem !important' }} /> : undefined}
                label={`#${cp.order}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  backgroundColor: isVisited
                    ? '#10b981'
                    : isCurrentTarget
                      ? isDark
                        ? '#0284c7'
                        : '#2563eb'
                      : isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.06)',
                  color: isVisited || isCurrentTarget ? '#ffffff' : isDark ? '#94a3b8' : '#64748b',
                  border: isCurrentTarget ? '2px solid #38bdf8' : '1px solid transparent',
                  boxShadow: isCurrentTarget ? '0 0 10px rgba(56,189,248,0.5)' : 'none',
                  transition: 'all 0.2s',
                }}
              />
            );
          })}
        </Box>
      )}

      {/* Status or Warning Alerts */}
      {solved ? (
        <Alert
          severity="success"
          icon={<CheckCircle />}
          sx={{
            py: 0.5,
            px: 2,
            borderRadius: '10px',
            fontWeight: 700,
            backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : '#ecfdf5',
            color: isDark ? '#6ee7b7' : '#065f46',
          }}
        >
          {t.allConnected}
        </Alert>
      ) : warningMessage ? (
        <Alert
          severity="warning"
          icon={<ErrorOutline />}
          onClose={() => setWarningMessage(null)}
          sx={{
            py: 0.5,
            px: 2,
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.85rem',
            backgroundColor: isDark ? 'rgba(245,158,11,0.2)' : '#fffbeb',
            color: isDark ? '#fcd34d' : '#92400e',
          }}
        >
          {warningMessage}
        </Alert>
      ) : (
        <Box
          sx={{
            py: 0.4,
            px: 1.5,
            borderRadius: '8px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            color: isDark ? '#94a3b8' : '#475569',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          {path.length === 0
            ? t.startFromOne
            : t.nextTarget.replace('{n}', String(nextExpectedCheckpoint ?? parsedCheckpoints.length))}
        </Box>
      )}

      {/* Grid with SVG Polyline Overlay */}
      <Box
        sx={{
          position: 'relative',
          width: gridWidth,
          height: gridHeight,
          border: isDark ? '2px solid rgba(255,255,255,0.2)' : '2px solid #1c1445',
          borderRadius: '12px',
          overflow: 'hidden',
          userSelect: 'none',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 24px rgba(28,20,69,0.08)',
        }}
      >
        {/* Cells */}
        {Array.from({ length: rows }, (_, r) => (
          <Box key={r} sx={{ display: 'flex' }}>
            {Array.from({ length: cols }, (_, c) => {
              const key = `${r}-${c}`;
              const cpNum = checkpointMap.get(key);
              const inPath = isInPath(r, c);
              const isTarget = cpNum === nextExpectedCheckpoint && !solved;

              return (
                <Box
                  key={c}
                  onMouseDown={() => handleCellMouseDown(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  sx={{
                    width: cellSize,
                    height: cellSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    backgroundColor: isDark
                      ? inPath
                        ? 'rgba(56,189,248,0.12)'
                        : 'rgba(255,255,255,0.02)'
                      : inPath
                        ? 'rgba(37,99,235,0.08)'
                        : '#ffffff',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(56,189,248,0.2)' : 'rgba(37,99,235,0.15)',
                    },
                  }}
                >
                  {cpNum && (
                    <Box
                      sx={{
                        width: cellSize * 0.7,
                        height: cellSize * 0.7,
                        borderRadius: '50%',
                        backgroundColor: inPath
                          ? '#10b981'
                          : isTarget
                            ? isDark
                              ? '#38bdf8'
                              : '#2563eb'
                            : isDark
                              ? 'rgba(255,255,255,0.15)'
                              : '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: inPath || isTarget ? '#ffffff' : isDark ? '#ffffff' : '#1e293b',
                        fontWeight: 800,
                        fontSize: cellSize > 48 ? '1.1rem' : '0.85rem',
                        boxShadow: isTarget
                          ? '0 0 12px rgba(56,189,248,0.8)'
                          : inPath
                            ? '0 2px 8px rgba(16,185,129,0.4)'
                            : 'none',
                        zIndex: 2,
                        transition: 'all 0.2s',
                      }}
                    >
                      {cpNum}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}

        {/* SVG Path Layer */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: gridWidth,
            height: gridHeight,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* Solution Path if toggled */}
          {showSolution && solutionPoints && (
            <polyline
              points={solutionPoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={Math.max(4, cellSize * 0.16)}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 6"
              opacity={0.8}
            />
          )}

          {/* User's Current Path */}
          {pathPoints && (
            <polyline
              points={pathPoints}
              fill="none"
              stroke={isDark ? '#38bdf8' : '#2563eb'}
              strokeWidth={Math.max(5, cellSize * 0.2)}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9}
            />
          )}

          {/* Center dots on path */}
          {path.map((pt, i) => {
            const r = Array.isArray(pt) ? pt[0] : (pt as any)?.r ?? (pt as any)?.row ?? 0;
            const c = Array.isArray(pt) ? pt[1] : (pt as any)?.c ?? (pt as any)?.col ?? 0;
            return (
              <circle
                key={i}
                cx={c * cellSize + cellSize / 2}
                cy={r * cellSize + cellSize / 2}
                r={Math.max(3, cellSize * 0.1)}
                fill={isDark ? '#bae6fd' : '#1d4ed8'}
              />
            );
          })}
        </svg>
      </Box>

      {/* Control Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', mr: 1 }}>
          {t.pathLength.replace('{len}', String(path.length))}
        </Typography>

        <Button
          startIcon={<Undo />}
          onClick={handleUndo}
          disabled={path.length === 0}
          size="small"
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: isDark ? '#d0caeb' : '#475569',
          }}
        >
          {t.undo}
        </Button>

        <Button
          startIcon={<RestartAlt />}
          onClick={reset}
          disabled={path.length === 0}
          size="small"
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: isDark ? '#d0caeb' : '#475569',
          }}
        >
          {t.reset}
        </Button>

        {solutionPath.length > 0 && (
          <Button
            startIcon={showSolution ? <VisibilityOff /> : <Visibility />}
            onClick={() => setShowSolution((prev) => !prev)}
            size="small"
            variant="text"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              color: showSolution ? '#f59e0b' : isDark ? '#a6e2f5' : '#2563eb',
              fontWeight: 600,
            }}
          >
            {showSolution ? t.hideSolution : t.showSolution}
          </Button>
        )}
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────
// MAIN MODAL
// ─────────────────────────────────────────────
export const LevelPlayModal: React.FC<LevelPlayModalProps> = ({
  open,
  onClose,
  level,
  gameType,
  isDark,
}) => {
  const { language } = useLanguageStore();
  const currentLang = (['en', 'te', 'hi', 'ml'].includes(language) ? language : 'en') as SupportedLanguage;
  const t = playTranslations[currentLang];

  if (!level) return null;

  const bgModal = isDark ? '#1a1140' : '#ffffff';
  const colorText = isDark ? '#ffffff' : '#1c1445';
  const gType = (gameType || level.gameType || '').toLowerCase();

  const diffColors: Record<string, string> = {
    easy: '#4caf50',
    medium: '#2196f3',
    hard: '#ff9800',
    expert: '#f44336',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: bgModal,
          borderRadius: '20px',
          backgroundImage: isDark
            ? 'linear-gradient(135deg, #1a1140 0%, #0d0a20 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 100%)',
          border: isDark ? '1px solid rgba(166,226,245,0.15)' : '1px solid rgba(28,20,69,0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: colorText,
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          pb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PlayArrow sx={{ color: isDark ? '#a6e2f5' : '#2563eb', fontSize: '1.5rem' }} />
          <Box>
            <Typography variant="h6" component="span" fontWeight={700} sx={{ color: colorText }}>
              {level.title || `Level ${level.levelNumber}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.3 }}>
              <Chip
                label={gType.toUpperCase()}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(37,99,235,0.1)',
                  color: isDark ? '#a6e2f5' : '#2563eb',
                }}
              />
              <Chip
                label={level.difficulty?.toUpperCase()}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: diffColors[level.difficulty?.toLowerCase()] || '#888',
                  backgroundColor: (diffColors[level.difficulty?.toLowerCase()] || '#888') + '22',
                }}
              />
              <Chip
                label={level.status?.toUpperCase()}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: level.status === 'published' ? '#4caf50' : '#ff9800',
                  backgroundColor:
                    level.status === 'published'
                      ? 'rgba(76,175,80,0.15)'
                      : 'rgba(255,152,0,0.15)',
                }}
              />
            </Box>
          </Box>
        </Box>
        <Tooltip title={t.closePreview}>
          <IconButton onClick={onClose} sx={{ color: colorText }}>
            <Close />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        {gType === 'sudoku' && <SudokuPlayer content={level.content} isDark={isDark} t={t} />}
        {gType === 'patch' && <PatchPlayer content={level.content} isDark={isDark} t={t} level={level} />}
        {gType === 'zip' && <ZipPlayer content={level.content} isDark={isDark} t={t} />}
        {!['sudoku', 'patch', 'zip'].includes(gType) && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Cancel sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#5c548a', mb: 1 }} />
            <Typography sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {t.noPreview} <strong>{gType || 'unknown'}</strong>
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Typography variant="caption" sx={{ flex: 1, color: isDark ? '#d0caeb' : '#5c548a' }}>
          {t.previewOnly}
        </Typography>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
          }}
        >
          {t.closePreview}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

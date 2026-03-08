/**
 * Simple formula parser for spreadsheet cells.
 * Supports: =A1+B1, =A1*2, =A1-B1, =SUM(A1:A5)
 */

type CellData = Record<string, string>;

function colLetterToIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 65;
}

function parseCellRef(ref: string): { col: string; row: number } | null {
  const match = ref.match(/^([A-Ja-j])(\d+)$/);
  if (!match) return null;
  return { col: match[1].toUpperCase(), row: parseInt(match[2], 10) };
}

function getCellValue(ref: string, cells: CellData): number {
  const raw = cells[ref.toUpperCase()] || "";
  if (raw.startsWith("=")) {
    const result = evaluateFormula(raw, cells);
    return typeof result === "number" ? result : 0;
  }
  const num = parseFloat(raw);
  return isNaN(num) ? 0 : num;
}

function expandRange(range: string): string[] {
  const [start, end] = range.split(":");
  if (!start || !end) return [];

  const startRef = parseCellRef(start.trim());
  const endRef = parseCellRef(end.trim());
  if (!startRef || !endRef) return [];

  const refs: string[] = [];
  const startCol = colLetterToIndex(startRef.col);
  const endCol = colLetterToIndex(endRef.col);
  const startRow = Math.min(startRef.row, endRef.row);
  const endRow = Math.max(startRef.row, endRef.row);

  for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
    for (let r = startRow; r <= endRow; r++) {
      refs.push(`${String.fromCharCode(65 + c)}${r}`);
    }
  }
  return refs;
}

export function evaluateFormula(
  formula: string,
  cells: CellData,
  _depth = 0
): number | string {
  if (_depth > 10) return "#CIRCULAR";
  if (!formula.startsWith("=")) return formula;

  const expr = formula.slice(1).trim();

  // SUM function
  const sumMatch = expr.match(/^SUM\(([^)]+)\)$/i);
  if (sumMatch) {
    const arg = sumMatch[1].trim();
    if (arg.includes(":")) {
      const refs = expandRange(arg);
      return refs.reduce((sum, ref) => sum + getCellValue(ref, cells), 0);
    }
    // comma-separated
    const parts = arg.split(",");
    return parts.reduce((sum, p) => {
      const trimmed = p.trim();
      if (parseCellRef(trimmed)) return sum + getCellValue(trimmed, cells);
      const num = parseFloat(trimmed);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }

  // Simple arithmetic: replace cell refs with values, then evaluate
  try {
    const evaluated = expr.replace(/([A-Ja-j]\d+)/gi, (match) => {
      return String(getCellValue(match, cells));
    });

    // Only allow safe characters
    if (!/^[\d\s+\-*/().]+$/.test(evaluated)) return "#ERROR";

    // Use Function constructor for safe math evaluation
    const result = new Function(`return (${evaluated})`)();
    if (typeof result === "number" && isFinite(result)) {
      return Math.round(result * 1e10) / 1e10;
    }
    return "#ERROR";
  } catch {
    return "#ERROR";
  }
}

export function getDisplayValue(cellId: string, cells: CellData): string {
  const raw = cells[cellId] || "";
  if (!raw.startsWith("=")) return raw;
  const result = evaluateFormula(raw, cells);
  return String(result);
}

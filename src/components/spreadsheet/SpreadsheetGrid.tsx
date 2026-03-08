import React, { useState, useCallback, useEffect, useRef } from "react";
import Cell from "./Cell";

const ROWS = 20;
const COLS = 10;
const COL_LETTERS = Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i));

interface SpreadsheetGridProps {
  cells: Record<string, string>;
  onCellChange: (cellId: string, value: string) => void;
}

function cellIdFromPos(col: number, row: number): string {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

function posFromCellId(id: string): { col: number; row: number } | null {
  const m = id.match(/^([A-J])(\d+)$/);
  if (!m) return null;
  return { col: m[1].charCodeAt(0) - 65, row: parseInt(m[2], 10) - 1 };
}

const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({ cells, onCellChange }) => {
  const [selectedCell, setSelectedCell] = useState("A1");
  const gridRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (direction: "up" | "down" | "left" | "right" | "tab" | "enter") => {
      const pos = posFromCellId(selectedCell);
      if (!pos) return;

      let { col, row } = pos;
      switch (direction) {
        case "up": row = Math.max(0, row - 1); break;
        case "down":
        case "enter": row = Math.min(ROWS - 1, row + 1); break;
        case "left": col = Math.max(0, col - 1); break;
        case "right": col = Math.min(COLS - 1, col + 1); break;
        case "tab":
          col++;
          if (col >= COLS) { col = 0; row = Math.min(ROWS - 1, row + 1); }
          break;
      }
      setSelectedCell(cellIdFromPos(col, row));
    },
    [selectedCell]
  );

  useEffect(() => {
    // Focus the selected cell
    const el = gridRef.current?.querySelector(`[data-cell="${selectedCell}"]`) as HTMLElement;
    el?.focus();
  }, [selectedCell]);

  return (
    <div className="overflow-auto border border-border rounded-lg bg-card shadow-sm">
      <div ref={gridRef} className="inline-block min-w-full">
        {/* Header row */}
        <div className="flex sticky top-0 z-10">
          <div className="header-cell h-8 min-w-[50px] w-[50px] border-r border-b border-border flex items-center justify-center sticky left-0 z-20 bg-muted">
            &nbsp;
          </div>
          {COL_LETTERS.map((letter) => (
            <div
              key={letter}
              className="header-cell h-8 min-w-[100px] border-r border-b border-border flex items-center justify-center"
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {Array.from({ length: ROWS }, (_, rowIdx) => (
          <div key={rowIdx} className="flex">
            <div className="header-cell h-8 min-w-[50px] w-[50px] border-r border-b border-border flex items-center justify-center sticky left-0 z-10 bg-muted">
              {rowIdx + 1}
            </div>
            {Array.from({ length: COLS }, (_, colIdx) => {
              const id = cellIdFromPos(colIdx, rowIdx);
              return (
                <div key={id} data-cell={id}>
                  <Cell
                    cellId={id}
                    rawValue={cells[id] || ""}
                    allCells={cells}
                    isSelected={selectedCell === id}
                    onSelect={setSelectedCell}
                    onChange={onCellChange}
                    onNavigate={navigate}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpreadsheetGrid;

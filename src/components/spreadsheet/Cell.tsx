import React, { useState, useRef, useEffect, useCallback } from "react";
import { getDisplayValue } from "@/lib/formulaEngine";

interface CellProps {
  cellId: string;
  rawValue: string;
  allCells: Record<string, string>;
  isSelected: boolean;
  onSelect: (cellId: string) => void;
  onChange: (cellId: string, value: string) => void;
  onNavigate: (direction: "up" | "down" | "left" | "right" | "tab" | "enter") => void;
}

const Cell: React.FC<CellProps> = ({
  cellId,
  rawValue,
  allCells,
  isSelected,
  onSelect,
  onChange,
  onNavigate,
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(rawValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setEditValue(rawValue);
  }, [rawValue]);

  const startEditing = useCallback(() => {
    setEditing(true);
    setEditValue(rawValue);
  }, [rawValue]);

  const commitEdit = useCallback(() => {
    setEditing(false);
    if (editValue !== rawValue) {
      onChange(cellId, editValue);
    }
  }, [editValue, rawValue, onChange, cellId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editing) {
      if (e.key === "Enter") {
        e.preventDefault();
        commitEdit();
        onNavigate("enter");
      } else if (e.key === "Tab") {
        e.preventDefault();
        commitEdit();
        onNavigate("tab");
      } else if (e.key === "Escape") {
        setEditing(false);
        setEditValue(rawValue);
      }
      return;
    }

    // Not editing
    switch (e.key) {
      case "ArrowUp": e.preventDefault(); onNavigate("up"); break;
      case "ArrowDown": e.preventDefault(); onNavigate("down"); break;
      case "ArrowLeft": e.preventDefault(); onNavigate("left"); break;
      case "ArrowRight": e.preventDefault(); onNavigate("right"); break;
      case "Enter": e.preventDefault(); startEditing(); break;
      case "Tab": e.preventDefault(); onNavigate("tab"); break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          setEditValue(e.key);
          setEditing(true);
        }
    }
  };

  const displayValue = getDisplayValue(cellId, allCells);
  const isError = displayValue.startsWith("#");

  return (
    <div
      className={`cell-base h-8 min-w-[100px] px-1.5 flex items-center cursor-cell select-none outline-none ${
        isSelected ? (editing ? "cell-editing" : "cell-selected") : ""
      }`}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onSelect(cellId)}
      onDoubleClick={startEditing}
      onKeyDown={handleKeyDown}
    >
      {editing ? (
        <input
          ref={inputRef}
          className="w-full h-full bg-transparent outline-none font-mono text-[0.8125rem] text-foreground"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
        />
      ) : (
        <span className={`truncate ${isError ? "text-destructive font-medium" : ""}`}>
          {displayValue}
        </span>
      )}
    </div>
  );
};

export default React.memo(Cell);

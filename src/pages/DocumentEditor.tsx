import React, { useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SpreadsheetGrid from "@/components/spreadsheet/SpreadsheetGrid";
import PresenceBar, { PresenceUser } from "@/components/spreadsheet/PresenceBar";
import SaveStatus from "@/components/spreadsheet/SaveStatus";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";

const HARDCODED_CELLS: Record<string, Record<string, string>> = {
  "demo-1": {
    A1: "Item", B1: "Jan", C1: "Feb", D1: "Mar", E1: "Total",
    A2: "Salaries", B2: "50000", C2: "50000", D2: "52000", E2: "=SUM(B2:D2)",
    A3: "Marketing", B3: "12000", C3: "15000", D3: "13000", E3: "=SUM(B3:D3)",
    A4: "Infra", B4: "8000", C4: "8500", D4: "9000", E4: "=SUM(B4:D4)",
    A5: "Total", B5: "=B2+B3+B4", C5: "=C2+C3+C4", D5: "=D2+D3+D4", E5: "=SUM(B5:D5)",
  },
  "demo-2": {
    A1: "Name", B1: "Role", C1: "Team", D1: "Start Date",
    A2: "Alice", B2: "Engineer", C2: "Platform", D2: "2024-01",
    A3: "Bob", B3: "Designer", C3: "Product", D3: "2024-03",
    A4: "Carol", B4: "PM", C4: "Product", D4: "2023-11",
    A5: "Dan", B5: "Engineer", C5: "Platform", D5: "2024-06",
  },
  "demo-3": {
    A1: "Task", B1: "Owner", C1: "Status", D1: "Hours", E1: "Est. Cost",
    A2: "Design", B2: "Alice", C2: "Done", D2: "40", E2: "=D2*150",
    A3: "Frontend", B3: "Bob", C3: "In Progress", D3: "80", E3: "=D3*150",
    A4: "Backend", B4: "Carol", C4: "Todo", D4: "60", E4: "=D4*150",
    A5: "Total", D5: "=SUM(D2:D4)", E5: "=SUM(E2:E4)",
  },
};

const DOC_TITLES: Record<string, string> = {
  "demo-1": "Q1 Budget",
  "demo-2": "Team Roster",
  "demo-3": "Project Tracker",
};

const DocumentEditor: React.FC = () => {
  const { id: docId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cells, setCells] = useState<Record<string, string>>(
    () => (docId && HARDCODED_CELLS[docId]) ? { ...HARDCODED_CELLS[docId] } : {}
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const title = (docId && DOC_TITLES[docId]) || "Untitled Spreadsheet";

  const presenceUsers: PresenceUser[] = [
    { uid: user?.uid || "me", displayName: user?.displayName || "You", color: "#2dd4bf" },
    { uid: "bot-1", displayName: "Alice", color: "#f472b6" },
  ];

  const handleCellChange = useCallback((cellId: string, value: string) => {
    setCells((prev) => {
      const next = { ...prev };
      if (value) next[cellId] = value;
      else delete next[cellId];
      return next;
    });
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            <span className="font-semibold font-display text-sm">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SaveStatus status={saveStatus} />
          <PresenceBar users={presenceUsers} />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <SpreadsheetGrid cells={cells} onCellChange={handleCellChange} />
      </main>
    </div>
  );
};

export default DocumentEditor;

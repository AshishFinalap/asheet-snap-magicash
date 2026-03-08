import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import SpreadsheetGrid from "@/components/spreadsheet/SpreadsheetGrid";
import PresenceBar, { PresenceUser } from "@/components/spreadsheet/PresenceBar";
import SaveStatus from "@/components/spreadsheet/SaveStatus";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";

const PRESENCE_COLORS = [
  "#2dd4bf", "#f472b6", "#fb923c", "#a78bfa",
  "#38bdf8", "#facc15", "#34d399", "#f87171",
];

function pickColor(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = (hash * 31 + uid.charCodeAt(i)) | 0;
  return PRESENCE_COLORS[Math.abs(hash) % PRESENCE_COLORS.length];
}

const DocumentEditor: React.FC = () => {
  const { id: docId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cells, setCells] = useState<Record<string, string>>({});
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [title, setTitle] = useState("Untitled Spreadsheet");
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Subscribe to cells
  useEffect(() => {
    if (!docId) return;
    const unsub = onSnapshot(collection(db, "documents", docId, "cells"), (snap) => {
      const data: Record<string, string> = {};
      snap.docs.forEach((d) => {
        data[d.id] = d.data().value || "";
      });
      setCells(data);
    });
    return unsub;
  }, [docId]);

  // Subscribe to document metadata
  useEffect(() => {
    if (!docId) return;
    const unsub = onSnapshot(doc(db, "documents", docId), (snap) => {
      if (snap.exists()) {
        setTitle(snap.data().title || "Untitled Spreadsheet");
      }
    });
    return unsub;
  }, [docId]);

  // Presence
  useEffect(() => {
    if (!docId || !user) return;

    const presenceRef = doc(db, "documents", docId, "presence", user.uid);
    setDoc(presenceRef, {
      displayName: user.displayName || "Anonymous",
      color: pickColor(user.uid),
      lastSeen: serverTimestamp(),
    });

    const unsub = onSnapshot(collection(db, "documents", docId, "presence"), (snap) => {
      const users: PresenceUser[] = [];
      snap.docs.forEach((d) => {
        const data = d.data();
        users.push({
          uid: d.id,
          displayName: data.displayName || "Anonymous",
          color: data.color || "#888",
        });
      });
      setPresenceUsers(users);
    });

    // Cleanup presence on unmount
    return () => {
      deleteDoc(presenceRef);
      unsub();
    };
  }, [docId, user]);

  const handleCellChange = useCallback(
    (cellId: string, value: string) => {
      if (!docId) return;

      setSaveStatus("saving");
      clearTimeout(saveTimer.current);

      const cellRef = doc(db, "documents", docId, "cells", cellId);
      const docRef = doc(db, "documents", docId);

      Promise.all([
        value
          ? setDoc(cellRef, { value })
          : deleteDoc(cellRef),
        updateDoc(docRef, { updatedAt: serverTimestamp() }),
      ])
        .then(() => {
          setSaveStatus("saved");
          saveTimer.current = setTimeout(() => setSaveStatus("idle"), 2000);
        })
        .catch(() => setSaveStatus("error"));
    },
    [docId]
  );

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

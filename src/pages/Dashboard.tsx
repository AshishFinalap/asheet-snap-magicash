import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet, LogOut } from "lucide-react";

interface DocEntry {
  id: string;
  title: string;
  updatedAt: Date | null;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState<DocEntry[]>([]);

  useEffect(() => {
    const q = query(collection(db, "documents"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setDocs(
        snap.docs.map((d) => ({
          id: d.id,
          title: d.data().title || "Untitled",
          updatedAt: d.data().updatedAt?.toDate() ?? null,
        }))
      );
    });
    return unsubscribe;
  }, []);

  const createDoc = async () => {
    const docRef = await addDoc(collection(db, "documents"), {
      title: "Untitled Spreadsheet",
      createdBy: user?.uid,
      updatedAt: serverTimestamp(),
    });
    navigate(`/document/${docRef.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold font-display text-foreground">Sheets</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {user?.displayName || "Anonymous"}
          </span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold font-display">Documents</h2>
          <Button onClick={createDoc}>
            <Plus className="w-4 h-4 mr-2" />
            New Spreadsheet
          </Button>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="mb-2">No documents yet.</p>
            <p className="text-sm">Create your first spreadsheet to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => navigate(`/document/${doc.id}`)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  <span className="font-medium text-card-foreground">{doc.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {doc.updatedAt
                    ? doc.updatedAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

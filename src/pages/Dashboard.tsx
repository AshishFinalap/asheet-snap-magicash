import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet, LogOut } from "lucide-react";

const SAMPLE_DOCS = [
  { id: "demo-1", title: "Q1 Budget", updatedAt: "Mar 5, 2:30 PM" },
  { id: "demo-2", title: "Team Roster", updatedAt: "Mar 3, 10:15 AM" },
  { id: "demo-3", title: "Project Tracker", updatedAt: "Feb 28, 4:00 PM" },
];

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
          <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate("/login"); }}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold font-display">Documents</h2>
          <Button onClick={() => navigate("/document/new-" + Date.now())}>
            <Plus className="w-4 h-4 mr-2" />
            New Spreadsheet
          </Button>
        </div>

        <div className="space-y-2">
          {SAMPLE_DOCS.map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate(`/document/${doc.id}`)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                <span className="font-medium text-card-foreground">{doc.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{doc.updatedAt}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet } from "lucide-react";

const Login: React.FC = () => {
  const { signInWithGoogle, signInAsGuest } = useAuth();
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try { await signInWithGoogle(); } catch { /* user cancelled */ }
    setLoading(false);
  };

  const handleGuest = async () => {
    if (!guestName.trim()) return;
    setLoading(true);
    try { await signInAsGuest(guestName.trim()); } catch { /* error */ }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
            <FileSpreadsheet className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Sheets</h1>
          <p className="text-sm text-muted-foreground text-center">
            Collaborative spreadsheets, realtime.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={handleGoogle}
            disabled={loading}
          >
            Sign in with Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue as guest</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuest()}
            />
            <Button
              variant="secondary"
              onClick={handleGuest}
              disabled={loading || !guestName.trim()}
            >
              Go
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

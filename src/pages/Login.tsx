import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet } from "lucide-react";

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSignIn = () => {
    const displayName = name.trim() || "Guest";
    signIn(displayName);
    navigate("/");
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
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
          />
          <Button className="w-full" onClick={handleSignIn}>
            Enter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;

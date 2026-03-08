import React, { createContext, useContext, useState } from "react";

interface AppUser {
  uid: string;
  displayName: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (displayName: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  const signIn = (displayName: string) => {
    setUser({
      uid: crypto.randomUUID(),
      displayName: displayName || "Anonymous",
    });
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading: false, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import React from "react";

interface SaveStatusProps {
  status: "idle" | "saving" | "saved" | "error";
}

const SaveStatus: React.FC<SaveStatusProps> = ({ status }) => {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-display font-medium">
      {status === "saving" && (
        <>
          <span className="w-2 h-2 rounded-full bg-saving animate-pulse-dot" />
          <span className="status-saving">Saving…</span>
        </>
      )}
      {status === "saved" && (
        <>
          <span className="w-2 h-2 rounded-full bg-saved" />
          <span className="status-saved">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <span className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-destructive">Error saving</span>
        </>
      )}
    </div>
  );
};

export default SaveStatus;

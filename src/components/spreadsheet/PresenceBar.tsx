import React from "react";

export interface PresenceUser {
  uid: string;
  displayName: string;
  color: string;
}

interface PresenceBarProps {
  users: PresenceUser[];
}

const PresenceBar: React.FC<PresenceBarProps> = ({ users }) => {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <span className="text-xs text-muted-foreground font-display font-medium">Active:</span>
      <div className="flex -space-x-1.5">
        {users.map((u) => (
          <div
            key={u.uid}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[0.65rem] font-bold ring-2 ring-card"
            style={{ backgroundColor: u.color, color: "#fff" }}
            title={u.displayName}
          >
            {u.displayName?.[0]?.toUpperCase() || "?"}
          </div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {users.length} user{users.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
};

export default PresenceBar;

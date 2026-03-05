"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Shield, Crown, Users } from "lucide-react";

interface Member {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  timeCreated: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    owner: "bg-accent/10 text-foreground",
    admin: "bg-accent/10 text-foreground",
    member: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[role] || styles.member}`}
    >
      {role === "owner" && <Crown className="h-3 w-3" />}
      {role === "admin" && <Shield className="h-3 w-3" />}
      {role}
    </span>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMembers()
      .then(setMembers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your workspace members
        </p>
      </div>

      {/* Members */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">
            Members{" "}
            <span className="text-muted-foreground">({members.length})</span>
          </h2>
        </div>
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No team members yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={member.avatarUrl}
                      alt=""
                      className="h-9 w-9 rounded-full"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {initials(member.name || member.email)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {member.name || member.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    Joined{" "}
                    {new Date(member.timeCreated).toLocaleDateString()}
                  </span>
                  <RoleBadge role={member.role} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

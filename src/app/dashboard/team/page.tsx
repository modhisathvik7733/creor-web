import { Mail, Shield, Crown, UserPlus } from "lucide-react";

const members = [
  {
    name: "Sathvik Modhi",
    email: "sathvik@creor.ai",
    role: "Owner",
    avatar: "SM",
    status: "online",
  },
  {
    name: "Alex Chen",
    email: "alex@creor.ai",
    role: "Admin",
    avatar: "AC",
    status: "online",
  },
  {
    name: "Maya Patel",
    email: "maya@creor.ai",
    role: "Developer",
    avatar: "MP",
    status: "offline",
  },
  {
    name: "Jordan Lee",
    email: "jordan@creor.ai",
    role: "Developer",
    avatar: "JL",
    status: "online",
  },
  {
    name: "Sam Rivera",
    email: "sam@creor.ai",
    role: "Developer",
    avatar: "SR",
    status: "offline",
  },
];

const pending = [
  { email: "taylor@example.com", role: "Developer", sent: "2 days ago" },
  { email: "chris@example.com", role: "Developer", sent: "5 days ago" },
];

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    Owner: "bg-accent/10 text-foreground",
    Admin: "bg-accent/10 text-foreground",
    Developer: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[role] || styles.Developer}`}
    >
      {role === "Owner" && <Crown className="h-3 w-3" />}
      {role === "Admin" && <Shield className="h-3 w-3" />}
      {role}
    </span>
  );
}

export default function TeamPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your workspace members
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90">
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
      </div>

      {/* Members */}
      <div className="mb-8 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">
            Members{" "}
            <span className="text-muted-foreground">({members.length})</span>
          </h2>
        </div>
        <div className="divide-y divide-border">
          {members.map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                    {member.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
                      member.status === "online"
                        ? "bg-foreground"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>
              <RoleBadge role={member.role} />
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invites */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">
            Pending Invites{" "}
            <span className="text-muted-foreground">({pending.length})</span>
          </h2>
        </div>
        <div className="divide-y divide-border">
          {pending.map((invite) => (
            <div
              key={invite.email}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{invite.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Sent {invite.sent}
                  </p>
                </div>
              </div>
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
                Resend
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

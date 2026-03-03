import { Activity, GitCommit, GitPullRequest, Cpu, Rocket } from "lucide-react";

const activities = [
  {
    type: "deploy",
    icon: Rocket,
    title: "Deployed creor-web to production",
    detail: "v0.1.0 — 3 files changed",
    time: "2 min ago",
  },
  {
    type: "ai",
    icon: Cpu,
    title: "AI session completed on auth-service",
    detail: "Generated JWT middleware — 4 files created",
    time: "15 min ago",
  },
  {
    type: "commit",
    icon: GitCommit,
    title: "Pushed 3 commits to creor-desktop",
    detail: "feature/ai-panel — Fix inline completions",
    time: "1 hour ago",
  },
  {
    type: "pr",
    icon: GitPullRequest,
    title: "PR #42 merged in opencode-engine",
    detail: "Add Google Vertex AI provider support",
    time: "3 hours ago",
  },
  {
    type: "ai",
    icon: Cpu,
    title: "AI code review on api-gateway",
    detail: "Reviewed 12 files — 3 suggestions",
    time: "5 hours ago",
  },
  {
    type: "deploy",
    icon: Rocket,
    title: "Deployed creor-docs to preview",
    detail: "Added quickstart guide",
    time: "8 hours ago",
  },
  {
    type: "commit",
    icon: GitCommit,
    title: "Pushed 7 commits to opencode-engine",
    detail: "main — RAG pipeline improvements",
    time: "1 day ago",
  },
  {
    type: "pr",
    icon: GitPullRequest,
    title: "PR #38 opened in creor-desktop",
    detail: "Implement multi-tab terminal support",
    time: "1 day ago",
  },
];

export default function ActivityPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
        <p className="mt-1 text-muted-foreground">
          Recent activity across your workspace
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Timeline</h2>
        </div>
        <div className="divide-y divide-border">
          {activities.map((item, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4">
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground"
              >
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

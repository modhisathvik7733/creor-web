import {
  Activity,
  FolderOpen,
  Users,
  Cpu,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Active Projects",
    value: "12",
    change: "+2 this week",
    icon: FolderOpen,
  },
  {
    label: "AI Sessions",
    value: "1,284",
    change: "+18% vs last month",
    icon: Cpu,
  },
  {
    label: "Team Members",
    value: "8",
    change: "2 pending invites",
    icon: Users,
  },
  {
    label: "Uptime",
    value: "99.9%",
    change: "Last 30 days",
    icon: TrendingUp,
  },
];

const recentActivity = [
  {
    action: "Deployed",
    project: "creor-web",
    time: "2 min ago",
    status: "success",
  },
  {
    action: "AI Session",
    project: "auth-service",
    time: "15 min ago",
    status: "success",
  },
  {
    action: "Build Failed",
    project: "api-gateway",
    time: "1 hour ago",
    status: "error",
  },
  {
    action: "PR Merged",
    project: "creor-desktop",
    time: "3 hours ago",
    status: "success",
  },
  {
    action: "AI Review",
    project: "opencode-engine",
    time: "5 hours ago",
    status: "success",
  },
];

export default function DashboardOverview() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Stop writing code. Start creating it.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Recent Activity</h2>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.status === "success"
                        ? "bg-foreground"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.project}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-2 p-4">
            {[
              { label: "New AI Session", desc: "Start coding with an AI agent" },
              { label: "Create Project", desc: "Set up a new project workspace" },
              { label: "Invite Member", desc: "Add teammates to your workspace" },
              { label: "View Docs", desc: "Read the Creor documentation" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted"
              >
                <div>
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.desc}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

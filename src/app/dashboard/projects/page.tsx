import { FolderOpen, GitBranch, Clock, MoreHorizontal } from "lucide-react";

const projects = [
  {
    name: "creor-web",
    description: "Landing page, docs, and dashboard",
    language: "TypeScript",
    branch: "main",
    lastActive: "2 min ago",
    status: "active",
  },
  {
    name: "opencode-engine",
    description: "AI engine server with Bun/Hono",
    language: "TypeScript",
    branch: "develop",
    lastActive: "1 hour ago",
    status: "active",
  },
  {
    name: "creor-desktop",
    description: "VS Code fork with native AI integration",
    language: "TypeScript",
    branch: "feature/ai-panel",
    lastActive: "3 hours ago",
    status: "active",
  },
  {
    name: "creor-docs",
    description: "Documentation site built with Astro",
    language: "MDX",
    branch: "main",
    lastActive: "1 day ago",
    status: "idle",
  },
  {
    name: "auth-service",
    description: "Authentication and identity service",
    language: "TypeScript",
    branch: "main",
    lastActive: "2 days ago",
    status: "idle",
  },
  {
    name: "plugin-marketplace",
    description: "Plugin discovery and distribution",
    language: "TypeScript",
    branch: "main",
    lastActive: "5 days ago",
    status: "idle",
  },
];

export default function ProjectsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your Creor projects
          </p>
        </div>
        <button className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90">
          New Project
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.name}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/50"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-accent" />
                <h3 className="font-semibold">{project.name}</h3>
              </div>
              <button className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {project.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {project.branch}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {project.lastActive}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  project.status === "active"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

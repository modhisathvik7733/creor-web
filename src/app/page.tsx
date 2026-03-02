import Link from "next/link";
import {
  Code2,
  Cpu,
  Globe,
  Terminal,
  Zap,
  Shield,
  ArrowRight,
  Github,
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Multi-Provider AI",
    description:
      "19+ LLM providers — Anthropic, OpenAI, Google, Mistral, and more. Never locked to a single vendor.",
  },
  {
    icon: Terminal,
    title: "Terminal-First",
    description:
      "Built for developers who live in the terminal. Full TUI with agent capabilities and PTY support.",
  },
  {
    icon: Code2,
    title: "VS Code Fork",
    description:
      "Native AI integration built directly into the editor — not a plugin. Full VS Code compatibility.",
  },
  {
    icon: Globe,
    title: "Open Source",
    description:
      "100% MIT licensed. Inspect, modify, and self-host. Your code stays on your machine.",
  },
  {
    icon: Zap,
    title: "25+ Built-in Tools",
    description:
      "File ops, code search, bash execution, LSP, web search, RAG — all available to the AI agent.",
  },
  {
    icon: Shield,
    title: "Fine-Grained Permissions",
    description:
      "Control exactly what the AI can access. Per-tool permissions with ask, allow, or deny modes.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Code2 className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Creor</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <a
              href="https://github.com/modhisathvik7733/creor-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
            <Link
              href="/dashboard"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Open Source &amp; Provider Agnostic
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
            The AI-Native
            <br />
            <span className="text-accent">Code Editor</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A VS Code fork with deep AI integration, 19+ LLM providers,
            built-in coding agents, and a powerful terminal-first workflow.
            Fully open source.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-medium text-accent-foreground transition-all hover:opacity-90"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/modhisathvik7733/creor-web"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-medium transition-colors hover:bg-muted"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Terminal Preview */}
        <div className="mx-auto mt-20 w-full max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                creor — zsh
              </span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <p className="text-muted-foreground">$ creor init my-project</p>
              <p className="text-green-400">
                &#10003; Project initialized with AI context
              </p>
              <p className="mt-2 text-muted-foreground">
                $ creor agent build
              </p>
              <p className="text-accent">
                &#10070; Agent active — 19 providers, 25 tools ready
              </p>
              <p className="text-muted-foreground">
                &gt; Add authentication with JWT and refresh tokens
              </p>
              <p className="mt-1 text-foreground">
                Creating auth module with bcrypt hashing...
              </p>
              <p className="text-green-400">
                &#10003; Created src/auth/jwt.service.ts
              </p>
              <p className="text-green-400">
                &#10003; Created src/auth/auth.controller.ts
              </p>
              <p className="text-green-400">
                &#10003; Created src/auth/auth.guard.ts
              </p>
              <p className="text-green-400">
                &#10003; Tests passing (12/12)
              </p>
              <span className="inline-block h-4 w-2 animate-pulse bg-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the modern developer
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to write, review, and ship code —
              supercharged with AI that understands your entire codebase.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Ready to code with AI?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Get started with Creor in seconds. Open source, free forever.
          </p>
          <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-3 font-mono text-sm">
            <span className="text-muted-foreground">$</span>
            <span>npx creor@latest</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 className="h-4 w-4" />
            <span>Creor</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/modhisathvik7733/creor-web"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
